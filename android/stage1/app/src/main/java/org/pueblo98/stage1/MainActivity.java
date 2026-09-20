package org.pueblo98.stage1;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.view.accessibility.AccessibilityManager;
import android.view.inputmethod.EditorInfo;
import org.pueblo98.stage1.speech.*;
import android.graphics.Color;
import android.graphics.Insets;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import org.pueblo98.stage1.voice.DictationSession;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.LinkedHashMap;
import java.util.Map;
import org.pueblo98.stage1.conversation.ConversationSessionCoordinator;
import org.pueblo98.stage1.conversation.ConversationSessionCoordinator.Surface;
import org.pueblo98.stage1.readability.SharedPreferencesTextScaleStore;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.ui.ConversationSurfaceModel;
import org.pueblo98.stage1.ui.ConversationSurfaceModel.Action;
import org.pueblo98.stage1.voice.AndroidOnDeviceVoiceRecognizer;
import org.pueblo98.stage1.voice.TranscriptHypotheses;
import org.pueblo98.stage1.voice.VoiceRecognizerAdapter;
import org.pueblo98.stage1.voice.VoiceSessionController;

/** Native shared conversation surfaces. Interpretation is a finite local fixture, not a model. */
public final class MainActivity extends Activity implements VoiceRecognizerAdapter.Listener {
    private static final int MIC_REQUEST = 120;
    private static final int INK = 0xff2e2d32, BLUE = 0xff2c5981, LINEN = 0xfffbf6ee;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final DictationSession dictation = new DictationSession();
    private final VoiceSessionController voice = new VoiceSessionController();
    private final Map<TextView, Float> textSizes = new LinkedHashMap<>();
    private final Map<String, Integer> placeScroll = new LinkedHashMap<>();
    private ConversationSessionCoordinator conversation;
    private TextScaleController textScale;
    private VoiceRecognizerAdapter recognizer;
    private long conversationVoiceGeneration = -1;
    private long pendingPermission = -1;
    private boolean deniedThisProcess, foreground, rendering;
    private Surface renderedSurface;
    private final SpeechOutputController speech = new SpeechOutputController();
    private SpeechSettingsController speechSettings;
    private SpeechOutputAdapter speechAdapter;
    private ConversationSpeechBridge speechBridge;
    private AudioManager audioManager;
    private AudioFocusRequest audioFocus;
    private AccessibilityManager accessibility;
    private AccessibilityManager.TouchExplorationStateChangeListener explorationListener;
    private LinearLayout speechPanel;
    private final java.util.List<Button> rateButtons = new java.util.ArrayList<>();
    private TextView speechStatus;
    private Button readAloud, stopSpeaking, repeatSpeech, sound, applyRate, restoreRate;
    private boolean speechSettingsOpen;
    private TextView placeTitle, placeDescription, heading, explanation, outcome, provisional;
    private TextView requestLabel, sizeSample;
    private LinearLayout taskSurface, actions, composer;
    private ScrollView scroll;
    private EditText editor;
    private Button talk, type, use, escape, textSettings, home, kitchen;

    @Override protected void onCreate(Bundle savedState) {
        super.onCreate(savedState);
        SharedPreferencesTextScaleStore store = new SharedPreferencesTextScaleStore(
                getSharedPreferences("granny_text_scale", MODE_PRIVATE));
        textScale = new TextScaleController(store);
        conversation = new ConversationSessionCoordinator(textScale, store,
                (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0
                ? ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB
                : ConversationSessionCoordinator.BuildMode.CANDIDATE);
        initializeSpeech();
        recognizer = new AndroidOnDeviceVoiceRecognizer(this);
        getWindow().setDecorFitsSystemWindows(false);
        setContentView(buildContent());
        if (savedState != null) {
            String place = "Kitchen".equals(savedState.getString("place")) ? "Kitchen" : "Home";
            int position = Math.max(0, savedState.getInt("scroll", 0));
            conversation.setPlace(place, new ConversationSessionCoordinator.ReturnAnchor(place, "composer", position));
            if (savedState.getBoolean("uncertainOperation", false)) conversation.restoreUnknownOutcome();
            scroll.post(() -> scroll.scrollTo(0, position));
        }
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0, this::back);
        }
        render();
    }

    private View buildContent() {
        LinearLayout root = column();
        root.setBackgroundColor(LINEN);
        placeTitle = text("Home", 28);
        placeTitle.setAccessibilityHeading(true);
        root.addView(placeTitle, wrap());
        LinearLayout content = column();
        content.setPadding(dp(16), dp(12), dp(16), dp(16));
        placeDescription = text("", 20);
        content.addView(placeDescription, wrap());
        home = button("Home", () -> switchPlace("Home"));
        kitchen = button("Kitchen — fictional room", () -> switchPlace("Kitchen"));
        content.addView(home, wrap());
        content.addView(kitchen, wrap());
        textSettings = button("Granny text size", () -> {
            rememberOrigin("text-size");
            replaceInput("make text larger", false);
            conversation.submit();
            render();
        });
        content.addView(textSettings, wrap());
        TextView boundary = text("Native integration fixture: no external app control or message sending. Screen explanation is unavailable.", 18);
        content.addView(boundary, spaced());
        View space = new View(this);
        content.addView(space, new LinearLayout.LayoutParams(-1, 0, 1));

        taskSurface = column();
        taskSurface.setPadding(dp(16), dp(16), dp(16), dp(16));
        taskSurface.setBackground(surfaceBackground(16));
        heading = text("", 24);
        heading.setAccessibilityHeading(true);
        heading.setFocusable(true);
        heading.setFocusableInTouchMode(true);
        explanation = text("", 20);
        outcome = text("", 20);
        outcome.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        provisional = text("", 22);
        // Partial words are visible but deliberately not an accessibility live region.
        sizeSample = text("Preview: Granny’s text stays readable.", 20);
        actions = column();
        taskSurface.addView(heading, wrap());
        taskSurface.addView(explanation, spaced());
        taskSurface.addView(outcome, spaced());
        taskSurface.addView(provisional, spaced());
        taskSurface.addView(sizeSample, spaced());
        taskSurface.addView(actions, spaced());
        content.addView(taskSurface, spaced());

        composer = column();
        composer.setPadding(dp(16), dp(12), dp(16), dp(12));
        composer.setBackground(surfaceBackground(28));
        requestLabel = text("Request", 18);
        editor = new EditText(this);
        editor.setId(View.generateViewId());
        editor.setSaveEnabled(false);
        editor.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);
        editor.setImeOptions(EditorInfo.IME_FLAG_NO_PERSONALIZED_LEARNING);
        editor.setHint("Type a request");
        editor.setMinHeight(dp(96));
        editor.setGravity(Gravity.TOP | Gravity.START);
        editor.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        register(editor, 22);
        requestLabel.setLabelFor(editor.getId());
        editor.addTextChangedListener(new TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void afterTextChanged(Editable s) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!rendering && editor.isEnabled()) {
                    ConversationSessionCoordinator.Provenance source = conversation.snapshot().provenance;
                    if (source == ConversationSessionCoordinator.Provenance.FINAL_VOICE
                            || source == ConversationSessionCoordinator.Provenance.EDITED_TRANSCRIPT) conversation.edit(s.toString());
                    else conversation.typed(s.toString());
                    cancelAudioForRevision();
                    render();
                }
            }
        });
        composer.addView(requestLabel, wrap());
        composer.addView(editor, wrap());
        talk = button("Talk", this::startTalk);
        type = button("Type", this::startTyping);
        use = button("Use this request", () -> { conversation.submit(); render(); });
        composer.addView(talk, wrap());
        composer.addView(type, wrap());
        composer.addView(use, wrap());
        content.addView(composer, spaced());
        content.addView(buildSpeechControls(), spaced());
        scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        escape = button("Cancel", () -> stopEverything(conversation.snapshot().surface == Surface.LISTENING ? "Stopped." : "Cancelled."));
        root.addView(escape, wrap());
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            Insets safe = insets.getInsets(WindowInsets.Type.systemBars()
                    | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
            view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            return WindowInsets.CONSUMED;
        });
        return root;
    }

    private void rememberOrigin(String focus) {
        ConversationSessionCoordinator.Snapshot s = conversation.snapshot();
        placeScroll.put(s.place, scroll.getScrollY());
        // setPlace is an explicit interruption boundary, never a hidden navigation.
        conversation.setPlace(s.place,
                new ConversationSessionCoordinator.ReturnAnchor(s.place, focus, scroll.getScrollY()));
    }

    private void switchPlace(String place) {
        placeScroll.put(conversation.snapshot().place, scroll.getScrollY());
        stopEverything("Changed place.");
        int position = placeScroll.getOrDefault(place, 0);
        conversation.setPlace(place, new ConversationSessionCoordinator.ReturnAnchor(place, "composer", position));
        render();
        scroll.post(() -> scroll.scrollTo(0, position));
    }

    private void replaceInput(String text, boolean edited) {
        if (edited) conversation.edit(text); else conversation.typed(text);
        cancelAudioForRevision();
    }

    private void startTyping() {
        String keep = dictation.active() ? dictation.finish() : conversation.snapshot().editableRequest;
        replaceInput(keep, false);
        render();
        editor.requestFocus();
        InputMethodManager keyboard = getSystemService(InputMethodManager.class);
        if (keyboard != null) keyboard.showSoftInput(editor, InputMethodManager.SHOW_IMPLICIT);
    }

    private void startTalk() {
        rememberOrigin("composer");
        dictation.begin(conversation.snapshot().editableRequest, SystemClock.elapsedRealtime());
        conversationVoiceGeneration = conversation.beginListening();
        // Invalidate before adapter cleanup so synchronous/late callbacks cannot revive capture.
        voice.stop("New Talk request.");
        pendingPermission = -1;
        handler.removeCallbacksAndMessages(null);
        speech.stop("Input changed.");
        stopSpokenOutput();
        recognizer.cancel();
        if (!recognizer.isAvailable()) {
            voice.recognizerUnavailable();
            finishDictation("On-device recognition is unavailable. Your draft is kept; you can type instead.");
            return;
        }
        boolean granted = checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
        long generation = voice.beginVoice(granted);
        conversation.partial(conversationVoiceGeneration, dictation.visibleText());
        render();
        if (granted) {
            startSegment(generation);
        } else if (deniedThisProcess) {
            voice.permissionDenied(generation);
            finishDictation("Microphone access is unavailable. Your draft is kept; you can type instead.");
        } else {
            pendingPermission = generation;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_REQUEST);
        }
    }

    @Override public void onRequestPermissionsResult(int request, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(request, permissions, results);
        if (request != MIC_REQUEST) return;
        long generation = pendingPermission;
        pendingPermission = -1;
        if (generation < 0 || !foreground) return;
        boolean granted = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
        if (granted && voice.permissionGranted(generation)
                && conversation.snapshot().generation == conversationVoiceGeneration) {
            startSegment(generation);
        } else {
            deniedThisProcess = !granted;
            if (voice.permissionDenied(generation)) {
                finishDictation("Microphone permission was not granted. Your draft is kept; you can type instead.");
            }
        }
        render();
    }

    private void startSegment(long generation) {
        if (!foreground || checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED
                || conversation.snapshot().generation != conversationVoiceGeneration
                || !dictation.beginSegment(dictation.turn(), generation, SystemClock.elapsedRealtime())) {
            finishDictation("Listening ended. Your words are kept for review."); return;
        }
        recognizer.start(generation, this);
        scheduleStartTimeout(generation);
        long turn = dictation.turn();
        handler.postDelayed(() -> {
            if (dictation.active() && dictation.turn() == turn) {
                finishDictation("The 30-second listening limit was reached. Your words are kept; choose Add more to continue.");
            }
        }, dictation.remaining(SystemClock.elapsedRealtime()));
    }

    private void scheduleStartTimeout(long generation) {
        handler.postDelayed(() -> {
            if (voice.snapshot().generation == generation && voice.snapshot().phase == VoiceSessionController.Phase.STARTING) {
                onError(generation, "Listening did not start. You can try again or type.");
                recognizer.cancel();
            }
        }, 10_000);
    }

    @Override public void onReady(long generation) {
        if (!foreground || !voice.ready(generation)) return;
        handler.removeCallbacksAndMessages(null);
        handler.postDelayed(() -> {
            if (dictation.shouldPrompt() && voice.noSpeechPrompt(generation)) render();
        }, dictation.promptRemaining(SystemClock.elapsedRealtime()));
        long turn = dictation.turn();
        handler.postDelayed(() -> {
            if (dictation.active() && dictation.turn() == turn) finishDictation(
                    "The 30-second listening limit was reached. Your words are kept; choose Add more to continue.");
        }, dictation.remaining(SystemClock.elapsedRealtime()));
        render();
    }

    @Override public void onPartial(long generation, String text) {
        if (foreground && voice.partial(generation, text)) {
            if (dictation.partial(generation, text)) {
                if (dictation.visibleText().codePointCount(0, dictation.visibleText().length()) > 4096) {
                    finishDictation("The draft is long. Your completed words are kept; please shorten it before using it."); return;
                }
                conversation.partial(conversationVoiceGeneration, dictation.visibleText());
            }
            render();
        }
    }

    @Override public void onFinal(long generation, TranscriptHypotheses hypotheses) {
        if (!foreground || !voice.finalResult(generation, hypotheses.raw, hypotheses.display)) return;
        handler.removeCallbacksAndMessages(null);
        DictationSession.Result result = dictation.finalSegment(generation, hypotheses.display, SystemClock.elapsedRealtime());
        if (result == DictationSession.Result.STALE) return;
        if (result == DictationSession.Result.CONTINUE) {
            conversation.partial(conversationVoiceGeneration, dictation.visibleText());
            long turn = dictation.turn();
            render();
            // Only a successful segment continues this same explicit, bounded Talk turn.
            handler.postDelayed(() -> {
                if (!foreground || !dictation.active() || dictation.turn() != turn
                        || conversation.snapshot().generation != conversationVoiceGeneration) return;
                startSegment(voice.beginVoice(checkSelfPermission(Manifest.permission.RECORD_AUDIO)
                        == PackageManager.PERMISSION_GRANTED));
                render();
            }, 150);
        } else finishDictation("Review your words before using this request. Choose Add more to continue.");
    }

    @Override public void onError(long generation, String reason) {
        if (!foreground || !voice.error(generation, reason)) return;
        finishDictation(reason + " Your earlier completed words are kept. Unfinished words were not added.");
    }

    private void finishDictation(String message) {
        String draft = dictation.finish();
        // Invalidate capture before cleanup; no final/timeout can reopen this turn.
        voice.stop("Finished listening."); pendingPermission = -1;
        handler.removeCallbacksAndMessages(null); recognizer.cancel();
        conversation.finalVoice(conversationVoiceGeneration, draft);
        conversation.voiceUnavailable(message);
        dictation.clear(); render();
    }

    private void finishListening() {
        if (!dictation.requestDone()) {
            finishDictation("Your words are kept. Review them before using this request."); return;
        }
        long generation = voice.snapshot().generation;
        if (!voice.requestDone(generation)) {
            finishDictation("Your words are kept. Review them before using this request."); return;
        }
        handler.removeCallbacksAndMessages(null);
        recognizer.done();
        handler.postDelayed(() -> {
            if (dictation.active() && voice.snapshot().generation == generation) finishDictation(
                    "The final words did not arrive. Your earlier completed words are kept; please add or type the unfinished sentence.");
        }, Math.min(10_000, dictation.remaining(SystemClock.elapsedRealtime())));
        render();
    }

    private void cancelAudioForRevision() {
        dictation.clear();
        voice.stop("Request changed.");
        pendingPermission = -1;
        handler.removeCallbacksAndMessages(null);
        speech.stop("Input changed.");
        stopSpokenOutput();
        recognizer.cancel();
    }

    private void stopEverything(String reason) {
        if (dictation.active()) {
            String draft = "Cancelled.".equals(reason) ? dictation.originalDraft() : dictation.finish();
            conversation.finalVoice(conversationVoiceGeneration, draft);
        }
        voice.stop(reason); speech.stop(reason);
        conversation.stop(() -> cancelAudioForRevision());
        render();
        restoreOrigin();
    }

    private void restoreOrigin() {
        ConversationSessionCoordinator.ReturnAnchor anchor = conversation.snapshot().returnAnchor;
        scroll.post(() -> {
            scroll.scrollTo(0, anchor.scrollY);
            if ("text-size".equals(anchor.focusId)) textSettings.requestFocus();
            else type.requestFocus();
        });
    }

    private void action(Action action, ConversationSessionCoordinator.Snapshot displayed) {
        ConversationSessionCoordinator.Snapshot current = conversation.snapshot();
        if (displayed.generation != current.generation || displayed.revision != current.revision
                || displayed.surface != current.surface) { render(); return; }
        switch (action) {
            case USE_REQUEST: conversation.submit(); break;
            case LISTEN_AGAIN: startTalk(); return;
            case DONE_LISTENING: finishListening(); return;
            case TYPE: startTyping(); return;
            case CANCEL: stopEverything("Cancelled."); return;
            case STOP: stopEverything("Stopped."); return;
            case NONE: case EDIT: case CHANGE:
                replaceInput(displayed.editableRequest, true); break;
            case APPLY:
                if (conversation.approve(displayed.generation, displayed.revision, displayed.consequence)
                        != ConversationSessionCoordinator.Result.QUEUED) { render(); return; }
                stopSpokenOutput();
                long admittedGeneration = conversation.snapshot().generation;
                render();
                handler.post(() -> {
                    if (!foreground) return;
                    conversation.dispatchApproved(admittedGeneration);
                    render();
                });
                return;
            case RESTORE:
                conversation.dismissResult();
                conversation.chooseRestore(); break;
            case REVIEW:
                // Read-only preference refresh; no approval, write or automatic retry.
                conversation.reviewStatus(); break;
            case REPEAT: repeatVisibleStatus(); return;
            case DONE:
                conversation.dismissResult(); render(); restoreOrigin(); return;
        }
        render();
    }

    private void render() {
        if (heading == null) return;
        ConversationSessionCoordinator.Snapshot state = conversation.snapshot();
        ConversationSurfaceModel model = ConversationSurfaceModel.forSurface(state.surface);
        rendering = true;
        placeTitle.setText(state.place);
        placeDescription.setText("Kitchen".equals(state.place)
                ? "Kitchen\nA fictional room for this integration. Granny remains the same assistant."
                : "Home\nYour conversation starts here. Rooms are optional.");
        heading.setText(model.heading);
        explanation.setText(model.explanation);
        if (state.surface == Surface.LISTENING) {
            VoiceSessionController.Snapshot capture = voice.snapshot();
            if (capture.phase == VoiceSessionController.Phase.REQUESTING_PERMISSION) {
                heading.setText("Microphone permission");
                explanation.setText("Listening starts only after this Talk request is allowed. You can cancel or type instead.");
            } else if (capture.phase == VoiceSessionController.Phase.STARTING) {
                heading.setText("Starting listening");
                explanation.setText("Waiting for the on-device recognizer. You can cancel or type instead.");
            } else if (capture.phase == VoiceSessionController.Phase.FINAL) {
                heading.setText("Continuing listening");
                explanation.setText("Your earlier words are kept. Continue when Listening appears, or choose Done listening.");
            } else if (capture.phase == VoiceSessionController.Phase.STOPPING) {
                heading.setText("Finishing the transcript");
                explanation.setText("Waiting for final words. You can cancel or type instead.");
            }
        }
        if (state.surface == Surface.CLARIFICATION && !state.choicesAvailable) {
            heading.setText("Check your request");
            explanation.setText("Nothing has changed. Edit the request or cancel.");
        }
        String detail = state.message + (state.consequence.isEmpty() ? "" : "\nGoal: " + state.consequence);
        if (!outcome.getText().toString().equals(detail)) outcome.setText(detail);
        provisional.setVisibility(model.provisional ? View.VISIBLE : View.GONE);
        provisional.setText("Draft and words heard so far (review before use)\n" + state.heardSoFar + " ▏");
        TextScaleController.Snapshot size = textScale.snapshot();
        sizeSample.setVisibility(state.surface == Surface.PREVIEW ? View.VISIBLE : View.GONE);
        sizeSample.setTextSize(TypedValue.COMPLEX_UNIT_SP,
                20 * (size.preview == null ? size.current : size.preview).multiplier());
        for (Map.Entry<TextView, Float> item : textSizes.entrySet()) {
            if (item.getKey() != sizeSample) item.getKey().setTextSize(TypedValue.COMPLEX_UNIT_SP, item.getValue() * size.current.multiplier());
        }
        if (!editor.getText().toString().equals(state.editableRequest)) {
            editor.setText(state.editableRequest);
            editor.setSelection(editor.length());
        }
        boolean busy = state.surface == Surface.LISTENING || state.surface == Surface.ACTIVE;
        editor.setEnabled(!busy);
        editor.setVisibility(state.surface == Surface.LISTENING ? View.GONE : View.VISIBLE);
        requestLabel.setVisibility(editor.getVisibility());
        talk.setVisibility(ConversationSurfaceModel.showsTalk(state.surface) ? View.VISIBLE : View.GONE);
        type.setVisibility(ConversationSurfaceModel.showsType(state.surface) ? View.VISIBLE : View.GONE);
        use.setVisibility(state.surface == Surface.TRANSCRIPT ? View.VISIBLE : View.GONE);
        use.setEnabled(!state.editableRequest.isBlank());
        home.setEnabled(!busy); kitchen.setEnabled(!busy); textSettings.setEnabled(!busy);
        escape.setVisibility(state.surface == Surface.IDLE ? View.GONE : View.VISIBLE);
        escape.setText(state.surface == Surface.ACTIVE || state.surface == Surface.LISTENING ? "■ Stop" : "Cancel");
        escape.setTextColor(state.surface == Surface.ACTIVE || state.surface == Surface.LISTENING ? 0xff962f43 : BLUE);
        // Buttons are projected from one state; no parallel task cards or inferred authority.
        for (int i = 0; i < actions.getChildCount(); i++) textSizes.remove(actions.getChildAt(i));
        actions.removeAllViews();
        if (model.choices && state.choicesAvailable) {
            for (TextScale choice : TextScale.values()) {
                Button pick = button(choice.label(), () -> {
                    if (conversation.snapshot().generation != state.generation
                            || conversation.snapshot().revision != state.revision) return;
                    conversation.chooseTextScale(choice); render();
                });
                pick.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20 * size.current.multiplier());
                actions.addView(pick, wrap());
            }
        }
        for (Action action : model.actions) {
            if (action == Action.CANCEL || action == Action.STOP || action == Action.USE_REQUEST) continue;
            Button control = button(action.label, () -> action(action, state));
            control.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20 * size.current.multiplier());
            if (action == Action.RESTORE) control.setEnabled(size.restoreAvailable);
            if (action == Action.REPEAT) control.setEnabled(speechBridge.canRepeat());
            if (action == Action.DONE_LISTENING) control.setEnabled(dictation.active() && voice.snapshot().phase != VoiceSessionController.Phase.STOPPING);
            actions.addView(control, wrap());
        }
        renderSpeech(state);
        rendering = false;
        if (state.surface != renderedSurface) {
            renderedSurface = state.surface;
            if (state.surface == Surface.TRANSCRIPT) editor.requestFocus();
            else if (state.surface != Surface.IDLE) heading.requestFocus();
        }
    }

    private void stopSpokenOutput() { if (speechBridge != null) speechBridge.stop(); }
    private void repeatVisibleStatus() { speechBridge.repeat(); render(); }
    private boolean spokenOutputAvailable() { return speechBridge != null && speechBridge.available(); }

    private void initializeSpeech() {
        speechSettings = new SpeechSettingsController(new SharedPreferencesSpeechSettingsStore(
                getSharedPreferences("granny_speech_settings", MODE_PRIVATE)));
        audioManager = getSystemService(AudioManager.class);
        accessibility = getSystemService(AccessibilityManager.class);
        audioFocus = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANCE_ACCESSIBILITY)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
                .setWillPauseWhenDucked(true)
                .setOnAudioFocusChangeListener(change -> {
                    if (change < 0) { stopSpokenOutput(); render(); }
                }, handler).build();
        SpeechOutputAdapter.Listener listener = new SpeechOutputAdapter.Listener() {
            public void onAvailabilityChanged(SpeechOutputAdapter.Availability a, String why) {
                runOnUiThread(() -> { if (speechBridge != null) { speechBridge.onAvailabilityChanged(a, why); render(); } });
            }
            public void onStarted(long g) { runOnUiThread(() -> { speechBridge.onStarted(g); render(); }); }
            public void onCompleted(long g) { runOnUiThread(() -> { speechBridge.onCompleted(g); render(); }); }
            public void onStopped(long g) { runOnUiThread(() -> { speechBridge.onStopped(g); render(); }); }
            public void onError(long g, String why) { runOnUiThread(() -> { speechBridge.onError(g, why); render(); }); }
        };
        speechAdapter = new AndroidTextToSpeechOutput(this, listener);
        speechBridge = new ConversationSpeechBridge(speech, speechSettings, speechAdapter, listener,
                new ConversationSpeechBridge.Focus() {
                    public boolean acquire() { return audioManager != null && audioManager.requestAudioFocus(audioFocus) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED; }
                    public void release() { if (audioManager != null) audioManager.abandonAudioFocusRequest(audioFocus); }
                }, () -> {
                    dictation.clear(); voice.stop("Reading aloud."); pendingPermission = -1;
                    handler.removeCallbacksAndMessages(null); recognizer.cancel();
                });
        explorationListener = enabled -> { speechBridge.environment(foreground, enabled); render(); };
        if (accessibility != null) accessibility.addTouchExplorationStateChangeListener(explorationListener);
    }

    private View buildSpeechControls() {
        LinearLayout controls = column();
        speechStatus = text("", 18); controls.addView(speechStatus, wrap());
        readAloud = button("Read aloud", () -> { speechBridge.read(); render(); });
        stopSpeaking = button("Stop speaking", () -> { stopSpokenOutput(); render(); });
        repeatSpeech = button("Repeat", this::repeatVisibleStatus);
        sound = button("Sound off", () -> { speechBridge.sound(!speechSettings.snapshot().soundEnabled); render(); });
        controls.addView(readAloud, wrap()); controls.addView(stopSpeaking, wrap());
        controls.addView(repeatSpeech, wrap()); controls.addView(sound, wrap());
        controls.addView(button("Speech speed", () -> { speechSettingsOpen = !speechSettingsOpen; render(); }), wrap());
        speechPanel = column();
        for (SpeechRate rate : SpeechRate.values()) {
            Button preview = button("Preview " + rate.label(), () -> {
            if (conversation.snapshot().surface == Surface.LISTENING || conversation.snapshot().surface == Surface.ACTIVE) return;
            speechBridge.preview(rate); render();
            });
            rateButtons.add(preview); speechPanel.addView(preview, wrap());
        }
        applyRate = button("Apply previewed speed", () -> { speechSettings.applyRate(); render(); });
        restoreRate = button("Restore previous speed", () -> { stopSpokenOutput(); speechSettings.restoreRate(); render(); });
        speechPanel.addView(applyRate, wrap()); speechPanel.addView(restoreRate, wrap());
        controls.addView(speechPanel, wrap()); return controls;
    }

    private void renderSpeech(ConversationSessionCoordinator.Snapshot state) {
        if (speechStatus == null) return;
        boolean busy = state.surface == Surface.LISTENING || state.surface == Surface.ACTIVE;
        // Include exact request and surface text so a new outcome cannot Repeat an old preview.
        speechBridge.visibleText(heading.getText() + ". " + explanation.getText() + " " + outcome.getText()
                + (state.editableRequest.isEmpty() ? "" : " Request: " + state.editableRequest));
        speechStatus.setText((accessibility != null && accessibility.isTouchExplorationEnabled()
                ? "Screen-reader touch exploration is on. Use its spoken feedback. " : speech.snapshot().message + " ")
                + speechSettings.snapshot().message);
        readAloud.setEnabled(!busy && spokenOutputAvailable());
        stopSpeaking.setVisibility(speech.isActive() ? View.VISIBLE : View.GONE);
        repeatSpeech.setEnabled(!busy && speechBridge.canRepeat());
        sound.setText(speechSettings.snapshot().soundEnabled ? "Sound off" : "Sound on");
        speechPanel.setVisibility(speechSettingsOpen && !busy ? View.VISIBLE : View.GONE);
        for (Button preview : rateButtons) preview.setEnabled(!busy && spokenOutputAvailable());
        applyRate.setEnabled(speechSettings.snapshot().previewHeard && !speech.isActive());
        restoreRate.setEnabled(speechSettings.snapshot().restoreAvailable);
        if (speech.isActive()) { escape.setVisibility(View.VISIBLE); escape.setText("■ Stop"); }
    }

    @Override protected void onResume() {
        super.onResume(); foreground = true;
        speechBridge.environment(true, accessibility != null && accessibility.isTouchExplorationEnabled());
        if (conversation != null) { textScale.reload(); render(); }
    }
    @Override protected void onStop() {
        foreground = false; dictation.clear();
        speechBridge.environment(false, accessibility != null && accessibility.isTouchExplorationEnabled());
        conversation.clearForBackground(() -> cancelAudioForRevision());
        voice.beginTyping(""); voice.stop("App left the foreground.");
        rendering = true; editor.setText(""); provisional.setText(""); rendering = false;
        super.onStop();
    }
    @Override protected void onSaveInstanceState(Bundle out) {
        out.putString("place", conversation.snapshot().place);
        out.putInt("scroll", scroll.getScrollY());
        Surface current = conversation.snapshot().surface;
        out.putBoolean("uncertainOperation", current == Surface.ACTIVE || current == Surface.UNKNOWN);
        // No request, hypothesis, approval, pending operation or spoken text enters saved state.
        super.onSaveInstanceState(out);
    }
    @Override protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        recognizer.destroy(); stopSpokenOutput(); speechAdapter.destroy();
        if (accessibility != null) accessibility.removeTouchExplorationStateChangeListener(explorationListener);
        super.onDestroy();
    }
    private void back() {
        if (conversation.snapshot().surface == Surface.IDLE) finish();
        else if (conversation.snapshot().surface == Surface.KNOWN || conversation.snapshot().surface == Surface.UNKNOWN) {
            conversation.dismissResult(); render(); restoreOrigin();
        } else stopEverything("Cancelled.");
    }

    private LinearLayout column() { LinearLayout view = new LinearLayout(this); view.setOrientation(LinearLayout.VERTICAL); return view; }
    private TextView text(String value, float sp) {
        TextView view = new TextView(this); view.setText(value); view.setTextColor(INK); register(view, sp); return view;
    }
    private void register(TextView view, float sp) { textSizes.put(view, sp); view.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp); }
    private Button button(String label, Runnable action) {
        Button view = new Button(this); view.setText(label); view.setAllCaps(false); view.setMinHeight(dp(64));
        view.setTextColor(BLUE); register(view, 20); view.setOnClickListener(ignored -> action.run()); return view;
    }
    private GradientDrawable surfaceBackground(int radius) {
        GradientDrawable result = new GradientDrawable(); result.setColor(Color.WHITE);
        result.setCornerRadius(dp(radius)); result.setStroke(dp(2), 0xff597da0); return result;
    }
    private LinearLayout.LayoutParams wrap() { return new LinearLayout.LayoutParams(-1, -2); }
    private LinearLayout.LayoutParams spaced() { LinearLayout.LayoutParams params = wrap(); params.topMargin = dp(12); return params; }
    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
}
