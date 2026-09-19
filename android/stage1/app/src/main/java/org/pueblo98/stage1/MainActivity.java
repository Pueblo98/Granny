package org.pueblo98.stage1;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Insets;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
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
        conversation = new ConversationSessionCoordinator(textScale, store);
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
                    conversation.edit(s.toString());
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
        scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        escape = button("Cancel", () -> stopEverything("Cancelled."));
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
        String keep = conversation.snapshot().editableRequest;
        replaceInput(keep, false);
        render();
        editor.requestFocus();
        InputMethodManager keyboard = getSystemService(InputMethodManager.class);
        if (keyboard != null) keyboard.showSoftInput(editor, InputMethodManager.SHOW_IMPLICIT);
    }

    private void startTalk() {
        rememberOrigin("composer");
        conversationVoiceGeneration = conversation.beginListening();
        // Invalidate before adapter cleanup so synchronous/late callbacks cannot revive capture.
        voice.stop("New Talk request.");
        pendingPermission = -1;
        handler.removeCallbacksAndMessages(null);
        recognizer.cancel();
        stopSpokenOutput();
        if (!recognizer.isAvailable()) {
            voice.recognizerUnavailable();
            conversation.voiceUnavailable("On-device recognition is unavailable. You can type instead.");
            render();
            return;
        }
        boolean granted = checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
        long generation = voice.beginVoice(granted);
        render();
        if (granted) {
            recognizer.start(generation, this);
            scheduleStartTimeout(generation);
        } else if (deniedThisProcess) {
            voice.permissionDenied(generation);
            conversation.voiceUnavailable("Microphone access is unavailable. You can type instead.");
            render();
        } else {
            pendingPermission = generation;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_REQUEST);
        }
    }

    @Override public void onRequestPermissionsResult(int request, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(request, permissions, results);
        if (request != MIC_REQUEST || pendingPermission < 0 || !foreground) return;
        long generation = pendingPermission;
        pendingPermission = -1;
        boolean granted = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
        if (granted && voice.permissionGranted(generation)
                && conversation.snapshot().generation == conversationVoiceGeneration) {
            recognizer.start(generation, this);
            scheduleStartTimeout(generation);
        } else {
            deniedThisProcess = !granted;
            if (voice.permissionDenied(generation)) {
                conversation.voiceUnavailable("Microphone permission was not granted. You can type instead.");
            }
        }
        render();
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
            if (voice.noSpeechPrompt(generation)) render();
        }, 10_000);
        handler.postDelayed(() -> {
            if (voice.snapshot().generation == generation) finishListening();
        }, 30_000);
        render();
    }

    @Override public void onPartial(long generation, String text) {
        if (foreground && voice.partial(generation, text)) {
            conversation.partial(conversationVoiceGeneration, text);
            render();
        }
    }

    @Override public void onFinal(long generation, TranscriptHypotheses hypotheses) {
        if (!foreground || !voice.finalResult(generation, hypotheses.raw, hypotheses.display)) return;
        handler.removeCallbacksAndMessages(null);
        if (hypotheses.display.isBlank()) conversation.voiceUnavailable("I didn’t catch a request. You can type instead.");
        else conversation.finalVoice(conversationVoiceGeneration, hypotheses.display);
        render();
    }

    @Override public void onError(long generation, String reason) {
        if (!foreground || !voice.error(generation, reason)) return;
        handler.removeCallbacksAndMessages(null);
        conversation.voiceUnavailable(reason);
        render();
    }

    private void finishListening() {
        long generation = voice.snapshot().generation;
        if (!voice.requestDone(generation)) return;
        handler.removeCallbacksAndMessages(null);
        recognizer.done();
        handler.postDelayed(() -> {
            if (voice.snapshot().generation == generation && voice.snapshot().phase == VoiceSessionController.Phase.STOPPING) {
                onError(generation, "The final words did not arrive. You can type instead.");
                recognizer.cancel();
            }
        }, 10_000);
        render();
    }

    private void cancelAudioForRevision() {
        voice.stop("Request changed.");
        pendingPermission = -1;
        handler.removeCallbacksAndMessages(null);
        recognizer.cancel();
        stopSpokenOutput();
    }

    private void stopEverything(String reason) {
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
                conversation.approve(displayed.generation, displayed.revision, displayed.consequence);
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
            } else if (capture.phase == VoiceSessionController.Phase.STOPPING) {
                heading.setText("Finishing the transcript");
                explanation.setText("Waiting for final words. You can cancel or type instead.");
            }
        }
        String detail = state.message + (state.consequence.isEmpty() ? "" : "\nGoal: " + state.consequence);
        if (!outcome.getText().toString().equals(detail)) outcome.setText(detail);
        provisional.setVisibility(model.provisional ? View.VISIBLE : View.GONE);
        provisional.setText("Heard so far\n" + state.heardSoFar + " ▏");
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
        talk.setVisibility(busy ? View.GONE : View.VISIBLE);
        type.setVisibility(state.surface == Surface.ACTIVE ? View.GONE : View.VISIBLE);
        use.setVisibility(state.surface == Surface.TRANSCRIPT ? View.VISIBLE : View.GONE);
        use.setEnabled(!state.editableRequest.isBlank());
        home.setEnabled(!busy); kitchen.setEnabled(!busy); textSettings.setEnabled(!busy);
        escape.setVisibility(state.surface == Surface.IDLE ? View.GONE : View.VISIBLE);
        escape.setText(state.surface == Surface.ACTIVE ? "■ Stop" : "Cancel");
        escape.setTextColor(state.surface == Surface.ACTIVE ? 0xff962f43 : BLUE);
        // Buttons are projected from one state; no parallel task cards or inferred authority.
        for (int i = 0; i < actions.getChildCount(); i++) textSizes.remove(actions.getChildAt(i));
        actions.removeAllViews();
        if (model.choices) {
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
            if (action == Action.REPEAT) control.setEnabled(spokenOutputAvailable());
            if (action == Action.DONE_LISTENING) control.setEnabled(voice.snapshot().phase == VoiceSessionController.Phase.LISTENING);
            actions.addView(control, wrap());
        }
        rendering = false;
        if (state.surface != renderedSurface) {
            renderedSurface = state.surface;
            if (state.surface == Surface.TRANSCRIPT) editor.requestFocus();
            else if (state.surface != Surface.IDLE) heading.requestFocus();
        }
    }

    // Bound to the reviewed TTS checkpoint during integration; unavailable until then.
    private void stopSpokenOutput() {}
    private void repeatVisibleStatus() {}
    private boolean spokenOutputAvailable() { return false; }

    @Override protected void onResume() {
        super.onResume(); foreground = true;
        if (conversation != null) { textScale.reload(); render(); }
    }
    @Override protected void onStop() {
        foreground = false;
        conversation.clearForBackground(() -> cancelAudioForRevision());
        voice.beginTyping(""); voice.stop("App left the foreground.");
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
        recognizer.destroy(); stopSpokenOutput();
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
