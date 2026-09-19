package org.pueblo98.stage1;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Insets;
import android.view.WindowInsets;
import android.util.TypedValue;
import java.util.LinkedHashMap;
import java.util.Map;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.SharedPreferencesTextScaleStore;
import org.pueblo98.stage1.speech.AndroidTextToSpeechOutput;
import org.pueblo98.stage1.speech.SharedPreferencesSpeechSettingsStore;
import org.pueblo98.stage1.speech.SpeechOutputAdapter;
import org.pueblo98.stage1.speech.SpeechOutputController;
import org.pueblo98.stage1.speech.SpeechRate;
import org.pueblo98.stage1.speech.SpeechSettingsController;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import org.pueblo98.stage1.voice.AndroidOnDeviceVoiceRecognizer;
import org.pueblo98.stage1.voice.TranscriptHypotheses;
import org.pueblo98.stage1.voice.VoiceRecognizerAdapter;
import org.pueblo98.stage1.voice.VoiceSessionController;

/** Bounded T-120/T-121 voice and readback shell; no planner or external action is connected. */
public final class MainActivity extends Activity implements VoiceRecognizerAdapter.Listener {
    private static final int MICROPHONE_PERMISSION_REQUEST = 120;
    private static final long NO_SPEECH_PROMPT_MS = 10_000L;
    private static final long MAX_LISTENING_MS = 30_000L;

    private final VoiceSessionController controller = new VoiceSessionController();
    private final SpeechOutputController speechController = new SpeechOutputController();
    private final Handler handler = new Handler(Looper.getMainLooper());

    private final Map<TextView, Float> baseTextSizes = new LinkedHashMap<>();
    private TextScaleController textScale;
    private TextView sizeStatus;
    private TextView sizePreview;
    private Button applySizeButton;
    private Button restoreSizeButton;
    private final Map<Button, TextScale> sizeChoices = new LinkedHashMap<>();
    private boolean retainedTextScale;
    private VoiceRecognizerAdapter recognizer;
    private SpeechOutputAdapter speechOutput;
    private SpeechSettingsController speechSettings;
    private TextView speechStatus;
    private TextView speechSettingsStatus;
    private Button readAloudButton;
    private Button stopSpeakingButton;
    private Button repeatButton;
    private Button soundButton;
    private Button previewRateButton;
    private Button applyRateButton;
    private Button restoreRateButton;
    private final Map<Button, SpeechRate> rateChoices = new LinkedHashMap<>();
    private TextView statusView;
    private TextView provisionalView;
    private EditText transcriptEditor;
    private Button talkButton;
    private Button doneButton;
    private Button stopButton;
    private Button typeButton;
    private Button useButton;
    private long pendingPermissionGeneration = -1;
    private boolean permissionDeniedThisProcess;
    private boolean rendering;

    private final SpeechOutputAdapter.Listener speechListener = new SpeechOutputAdapter.Listener() {
        @Override
        public void onAvailabilityChanged(
                SpeechOutputAdapter.Availability availability, String explanation) {
            runOnUiThread(() -> {
                speechController.availabilityChanged(
                        availability == SpeechOutputAdapter.Availability.AVAILABLE, explanation);
                renderSpeech();
                renderButtonsOnly();
            });
        }

        @Override
        public void onStarted(long generation) {
            runOnUiThread(() -> {
                if (speechController.started(generation)) {
                    renderSpeech();
                    renderButtonsOnly();
                }
            });
        }

        @Override
        public void onCompleted(long generation) {
            runOnUiThread(() -> {
                SpeechOutputController.Snapshot before = speechController.snapshot();
                if (speechController.completed(generation)) {
                    if (before.purpose == SpeechOutputController.Purpose.RATE_PREVIEW) {
                        SpeechRate preview = speechSettings.snapshot().previewRate;
                        if (preview != null) {
                            speechSettings.markPreviewHeard(preview);
                        }
                    }
                    renderSpeech();
                    renderButtonsOnly();
                }
            });
        }

        @Override
        public void onStopped(long generation) {
            runOnUiThread(() -> {
                if (speechController.stopped(generation)) {
                    renderSpeech();
                    renderButtonsOnly();
                }
            });
        }

        @Override
        public void onError(long generation, String recoveryMessage) {
            runOnUiThread(() -> {
                if (speechController.error(generation, recoveryMessage)) {
                    renderSpeech();
                    renderButtonsOnly();
                }
            });
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Object retained = getLastNonConfigurationInstance();
        retainedTextScale = retained instanceof TextScaleController;
        textScale = retainedTextScale ? (TextScaleController) retained
                : new TextScaleController(new SharedPreferencesTextScaleStore(
                        getSharedPreferences("granny_text_scale", MODE_PRIVATE)));
        speechSettings = new SpeechSettingsController(new SharedPreferencesSpeechSettingsStore(
                getSharedPreferences("granny_speech_settings", MODE_PRIVATE)));
        recognizer = new AndroidOnDeviceVoiceRecognizer(this);
        speechOutput = new AndroidTextToSpeechOutput(this, speechListener);
        getWindow().setDecorFitsSystemWindows(false);
        setContentView(buildContent());
        render();
    }

    private View buildContent() {
        int outer = dp(24);
        int gap = dp(12);

        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(outer, outer, outer, outer);

        TextView title = new TextView(this);
        title.setText(R.string.title);
        registerTextSize(title, 30);
        title.setTextColor(Color.rgb(30, 30, 30));
        content.addView(title, matchWrap());

        TextView explanation = new TextView(this);
        explanation.setText(R.string.privacy_explanation);
        registerTextSize(explanation, 18);
        explanation.setTextColor(Color.rgb(55, 55, 55));
        content.addView(explanation, spaced(matchWrap(), gap));

        statusView = new TextView(this);
        registerTextSize(statusView, 20);
        statusView.setTextColor(Color.rgb(20, 70, 60));
        statusView.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(statusView, spaced(matchWrap(), gap * 2));

        provisionalView = new TextView(this);
        registerTextSize(provisionalView, 24);
        provisionalView.setTextColor(Color.rgb(80, 80, 80));
        provisionalView.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(provisionalView, spaced(matchWrap(), gap));

        transcriptEditor = new EditText(this);
        transcriptEditor.setHint(R.string.transcript_hint);
        registerTextSize(transcriptEditor, 24);
        transcriptEditor.setMinHeight(dp(128));
        transcriptEditor.setGravity(android.view.Gravity.TOP | android.view.Gravity.START);
        transcriptEditor.setPadding(dp(16), dp(16), dp(16), dp(16));
        transcriptEditor.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!rendering && transcriptEditor.isEnabled()) {
                    controller.edit(s.toString());
                    if (speechController.contentChanged(controller.snapshot().revision)) {
                        speechOutput.stop();
                    }
                    renderSpeech();
                    renderButtonsOnly();
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {}
        });
        content.addView(transcriptEditor, spaced(matchWrap(), gap));

        talkButton = button(R.string.talk, view -> startTalk());
        doneButton = button(R.string.done_listening, view -> finishListening());
        stopButton = button(
                R.string.stop,
                view -> {
                    if (textScale.snapshot().preview != null) {
                        textScale.cancelPreview();
                        renderTextSize();
                        renderButtonsOnly();
                    } else if (speechController.isActive()) {
                        stopSpeaking("Speech stopped. The text remains on screen.");
                    } else if (speechSettings.snapshot().previewRate != null) {
                        speechSettings.cancelPreview();
                        renderSpeech();
                        renderButtonsOnly();
                    } else {
                        stopEverything("Stopped. You can talk again or type.");
                    }
                });
        typeButton = button(R.string.type_instead, view -> startTyping());
        useButton = button(R.string.use_request, view -> {
            controller.submit();
            render();
        });

        content.addView(talkButton, spaced(matchWrap(), gap));
        content.addView(doneButton, spaced(matchWrap(), gap));

        content.addView(typeButton, spaced(matchWrap(), gap));
        content.addView(useButton, spaced(matchWrap(), gap));

        addSpeechControls(content, gap);
        addTextSizeControls(content, gap);

        TextView boundary = new TextView(this);
        boundary.setText(R.string.test_boundary);
        registerTextSize(boundary, 16);
        boundary.setTextColor(Color.rgb(85, 85, 85));
        content.addView(boundary, spaced(matchWrap(), gap * 2));

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.addView(content);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.addView(scroll, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 0, 1));
        root.addView(stopButton, matchWrap());
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            Insets safe = insets.getInsets(WindowInsets.Type.systemBars()
                    | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
            view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            return WindowInsets.CONSUMED;
        });
        return root;
    }

    private void registerTextSize(TextView view, float baseSp) {
        baseTextSizes.put(view, baseSp);
        view.setTextSize(TypedValue.COMPLEX_UNIT_SP, baseSp);
    }

    private void addSpeechControls(LinearLayout content, int gap) {
        TextView heading = new TextView(this);
        heading.setText(R.string.spoken_readback_heading);
        heading.setAccessibilityHeading(true);
        registerTextSize(heading, 28);
        content.addView(heading, spaced(matchWrap(), gap * 2));

        TextView scope = new TextView(this);
        scope.setText(R.string.spoken_readback_scope);
        registerTextSize(scope, 18);
        content.addView(scope, spaced(matchWrap(), gap));

        speechStatus = new TextView(this);
        registerTextSize(speechStatus, 20);
        speechStatus.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(speechStatus, spaced(matchWrap(), gap));

        readAloudButton = button(R.string.read_request_aloud, view -> startReadback(false));
        stopSpeakingButton = button(
                R.string.stop_speaking,
                view -> stopSpeaking("Speech stopped. The text remains on screen."));
        repeatButton = button(R.string.repeat_readback, view -> startReadback(true));
        content.addView(readAloudButton, spaced(matchWrap(), gap));
        content.addView(stopSpeakingButton, spaced(matchWrap(), gap));
        content.addView(repeatButton, spaced(matchWrap(), gap));

        speechSettingsStatus = new TextView(this);
        registerTextSize(speechSettingsStatus, 20);
        speechSettingsStatus.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(speechSettingsStatus, spaced(matchWrap(), gap));

        soundButton = button(R.string.sound_off, view -> toggleSound());
        content.addView(soundButton, spaced(matchWrap(), gap));

        for (SpeechRate choice : SpeechRate.values()) {
            Button select = button(R.string.speech_rate_heading, view -> {
                stopSpeaking(null);
                speechSettings.preview(choice);
                renderSpeech();
                renderButtonsOnly();
            });
            select.setText(getString(R.string.preview_speech_rate, choice.label()));
            rateChoices.put(select, choice);
            content.addView(select, spaced(matchWrap(), gap));
        }

        previewRateButton = button(R.string.preview_selected_rate, view -> previewSpeechRate());
        applyRateButton = button(R.string.apply_speech_rate, view -> {
            speechSettings.applyRate();
            renderSpeech();
            renderButtonsOnly();
        });
        restoreRateButton = button(R.string.restore_speech_rate, view -> {
            stopSpeaking(null);
            speechSettings.restoreRate();
            renderSpeech();
            renderButtonsOnly();
        });
        content.addView(previewRateButton, spaced(matchWrap(), gap));
        content.addView(applyRateButton, spaced(matchWrap(), gap));
        content.addView(restoreRateButton, spaced(matchWrap(), gap));
    }

    private void startReadback(boolean repeat) {
        SpeechSettingsController.Snapshot settings = speechSettings.snapshot();
        VoiceSessionController.Snapshot voice = controller.snapshot();
        if (!settings.soundEnabled) {
            renderSpeech();
            return;
        }
        SpeechOutputController.Request request = repeat
                ? speechController.repeat(voice.revision, settings.currentRate.multiplier())
                : speechController.beginReadback(
                        voice.displayText, voice.revision, settings.currentRate.multiplier());
        startSpeechRequest(request);
    }

    private void previewSpeechRate() {
        SpeechSettingsController.Snapshot settings = speechSettings.snapshot();
        SpeechRate rate = settings.previewRate;
        if (rate == null || !settings.soundEnabled) {
            renderSpeech();
            return;
        }
        SpeechOutputController.Request request = speechController.beginRatePreview(
                getString(R.string.speech_rate_sample), rate.multiplier());
        startSpeechRequest(request);
    }

    private void startSpeechRequest(SpeechOutputController.Request request) {
        if (request == null) {
            renderSpeech();
            renderButtonsOnly();
            return;
        }
        if (!speechOutput.speak(
                request.generation, request.exactText, request.rate, speechListener)) {
            speechController.error(
                    request.generation,
                    "Spoken readback could not start. Continue with the written text.");
        }
        renderSpeech();
        renderButtonsOnly();
    }

    private void stopSpeaking(String reason) {
        boolean active = speechController.stop(reason);
        if (active) {
            speechOutput.stop();
        }
        renderSpeech();
        renderButtonsOnly();
    }

    private void toggleSound() {
        boolean enable = !speechSettings.snapshot().soundEnabled;
        if (!enable) {
            stopSpeaking("Speech stopped because Sound off was selected. Written text remains available.");
        }
        speechSettings.setSoundEnabled(enable);
        renderSpeech();
        renderButtonsOnly();
    }

    private void renderSpeech() {
        if (speechStatus == null) {
            return;
        }
        SpeechOutputController.Snapshot output = speechController.snapshot();
        SpeechSettingsController.Snapshot settings = speechSettings.snapshot();
        VoiceSessionController.Snapshot voice = controller.snapshot();
        boolean outputAvailable = output.phase != SpeechOutputController.Phase.INITIALIZING
                && output.phase != SpeechOutputController.Phase.UNAVAILABLE;
        boolean outputActive = speechController.isActive();
        boolean captureActive = voice.phase == VoiceSessionController.Phase.STARTING
                || voice.phase == VoiceSessionController.Phase.LISTENING
                || voice.phase == VoiceSessionController.Phase.STOPPING
                || voice.phase == VoiceSessionController.Phase.REQUESTING_PERMISSION;
        boolean writable = settings.persistenceState
                == SpeechSettingsController.PersistenceState.HEALTHY
                || settings.persistenceState == SpeechSettingsController.PersistenceState.ABSENT;

        speechStatus.setText(output.message);
        speechSettingsStatus.setText(settings.message);
        readAloudButton.setEnabled(outputAvailable && settings.soundEnabled && !outputActive
                && !captureActive && !voice.displayText.isBlank());
        stopSpeakingButton.setVisibility(outputActive ? View.VISIBLE : View.GONE);
        repeatButton.setEnabled(outputAvailable && settings.soundEnabled && !outputActive
                && !captureActive && output.canRepeat);
        soundButton.setEnabled(writable);
        soundButton.setText(settings.soundEnabled ? R.string.sound_off : R.string.sound_on);
        soundButton.setStateDescription(getString(
                settings.soundEnabled ? R.string.sound_state_on : R.string.sound_state_off));

        for (Map.Entry<Button, SpeechRate> entry : rateChoices.entrySet()) {
            Button choice = entry.getKey();
            boolean selected = entry.getValue() == settings.previewRate;
            choice.setEnabled(outputAvailable && settings.soundEnabled && !outputActive
                    && !captureActive && writable);
            choice.setSelected(selected);
            choice.setText(getString(
                    selected ? R.string.preview_speech_rate_selected : R.string.preview_speech_rate,
                    entry.getValue().label()));
            choice.setStateDescription(selected
                    ? getString(R.string.speech_rate_selected)
                    : entry.getValue() == settings.currentRate
                            ? getString(R.string.speech_rate_current)
                            : getString(R.string.speech_rate_not_selected));
        }
        previewRateButton.setEnabled(outputAvailable && settings.soundEnabled && !outputActive
                && !captureActive && settings.previewRate != null && writable);
        applyRateButton.setEnabled(!outputActive && settings.previewRate != null
                && settings.previewHeard && writable);
        restoreRateButton.setEnabled(!outputActive && !captureActive
                && settings.restoreAvailable && writable);
    }

    private void addTextSizeControls(LinearLayout content, int gap) {
        TextView heading = new TextView(this);
        heading.setText(R.string.text_size_heading);
        heading.setAccessibilityHeading(true);
        registerTextSize(heading, 28);
        content.addView(heading, spaced(matchWrap(), gap * 2));
        TextView scope = new TextView(this);
        scope.setText(R.string.text_size_scope);
        registerTextSize(scope, 18);
        content.addView(scope, spaced(matchWrap(), gap));
        sizeStatus = new TextView(this);
        registerTextSize(sizeStatus, 20);
        sizeStatus.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(sizeStatus, spaced(matchWrap(), gap));
        for (TextScale choice : TextScale.values()) {
            Button select = button(R.string.text_size_heading, view -> {
                textScale.preview(choice);
                renderTextSize();
                renderButtonsOnly();
            });
            select.setText(getString(R.string.preview_size, choice.label()));
            sizeChoices.put(select, choice);
            content.addView(select, spaced(matchWrap(), gap));
        }
        sizePreview = new TextView(this);
        sizePreview.setText(R.string.text_size_sample);
        content.addView(sizePreview, spaced(matchWrap(), gap));
        applySizeButton = button(R.string.apply_size, view -> {
            textScale.apply();
            renderTextSize();
            renderButtonsOnly();
        });
        restoreSizeButton = button(R.string.restore_size, view -> {
            textScale.restore();
            renderTextSize();
            renderButtonsOnly();
        });
        content.addView(applySizeButton, spaced(matchWrap(), gap));
        content.addView(restoreSizeButton, spaced(matchWrap(), gap));
    }

    private void renderTextSize() {
        TextScaleController.Snapshot snapshot = textScale.snapshot();
        for (Map.Entry<TextView, Float> item : baseTextSizes.entrySet()) {
            item.getKey().setTextSize(TypedValue.COMPLEX_UNIT_SP,
                    item.getValue() * snapshot.current.multiplier());
        }
        TextScale sample = snapshot.preview == null ? snapshot.current : snapshot.preview;
        sizePreview.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20 * sample.multiplier());
        sizeStatus.setText(snapshot.message);
        boolean voiceBusy = controller.snapshot().phase == VoiceSessionController.Phase.STARTING
                || controller.snapshot().phase == VoiceSessionController.Phase.LISTENING
                || controller.snapshot().phase == VoiceSessionController.Phase.STOPPING
                || controller.snapshot().phase == VoiceSessionController.Phase.REQUESTING_PERMISSION
                || speechController.isActive();
        boolean writable = snapshot.persistenceState == TextScaleController.PersistenceState.HEALTHY
                || snapshot.persistenceState == TextScaleController.PersistenceState.ABSENT;
        for (Map.Entry<Button, TextScale> entry : sizeChoices.entrySet()) {
            Button choice = entry.getKey();
            choice.setEnabled(!voiceBusy && writable);
            boolean selected = entry.getValue() == snapshot.preview;
            choice.setSelected(selected);
            choice.setText(getString(selected ? R.string.preview_size_selected : R.string.preview_size,
                    entry.getValue().label()));
            choice.setStateDescription(selected ? getString(R.string.size_preview_selected)
                    : entry.getValue() == snapshot.current ? getString(R.string.size_current)
                    : getString(R.string.size_not_selected));
        }
        applySizeButton.setEnabled(snapshot.preview != null && !voiceBusy && writable);
        restoreSizeButton.setEnabled(snapshot.restoreAvailable && !voiceBusy && writable);
    }

    private void startTalk() {
        textScale.cancelPreview();
        speechSettings.cancelPreview();
        stopSpeaking("Speech stopped because listening started.");
        cancelTimers();
        recognizer.cancel();

        if (!recognizer.isAvailable()) {
            controller.recognizerUnavailable();
            render();
            return;
        }

        boolean granted = checkSelfPermission(Manifest.permission.RECORD_AUDIO)
                == PackageManager.PERMISSION_GRANTED;
        long generation = controller.beginVoice(granted);
        render();

        if (granted) {
            recognizer.start(generation, this);
            return;
        }

        pendingPermissionGeneration = generation;
        if (permissionDeniedThisProcess) {
            controller.permissionDenied(generation);
            render();
        } else {
            requestPermissions(
                    new String[] {Manifest.permission.RECORD_AUDIO},
                    MICROPHONE_PERMISSION_REQUEST);
        }
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != MICROPHONE_PERMISSION_REQUEST || pendingPermissionGeneration < 0) {
            return;
        }

        long generation = pendingPermissionGeneration;
        pendingPermissionGeneration = -1;
        boolean granted = grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (granted && controller.permissionGranted(generation)) {
            render();
            recognizer.start(generation, this);
        } else {
            permissionDeniedThisProcess = true;
            controller.permissionDenied(generation);
            render();
        }
    }

    private void finishListening() {
        VoiceSessionController.Snapshot snapshot = controller.snapshot();
        if (controller.requestDone(snapshot.generation)) {
            cancelTimers();
            recognizer.done();
            render();
        }
    }

    private void startTyping() {
        textScale.cancelPreview();
        speechSettings.cancelPreview();
        stopSpeaking("Speech stopped because the request is being edited.");
        VoiceSessionController.Snapshot snapshot = controller.snapshot();
        cancelTimers();
        recognizer.cancel();
        controller.beginTyping(snapshot.displayText.isBlank()
                ? snapshot.provisionalText
                : snapshot.displayText);
        speechController.contentChanged(controller.snapshot().revision);
        render();
        transcriptEditor.requestFocus();
        InputMethodManager input = getSystemService(InputMethodManager.class);
        if (input != null) {
            input.showSoftInput(transcriptEditor, InputMethodManager.SHOW_IMPLICIT);
        }
    }

    private void stopEverything(String reason) {
        cancelTimers();
        recognizer.cancel();
        if (speechController.stop("Speech stopped. The text remains on screen.")) {
            speechOutput.stop();
        }
        controller.stop(reason);
        textScale.cancelPreview();
        speechSettings.cancelPreview();
        pendingPermissionGeneration = -1;
        render();
    }

    @Override
    public void onReady(long generation) {
        if (controller.ready(generation)) {
            scheduleListeningTimers(generation);
            render();
        }
    }

    @Override
    public void onPartial(long generation, String text) {
        if (controller.partial(generation, text)) {
            render();
        }
    }

    @Override
    public void onFinal(long generation, TranscriptHypotheses hypotheses) {
        cancelTimers();
        if (controller.finalResult(generation, hypotheses.raw, hypotheses.display)) {
            render();
        }
    }

    @Override
    public void onError(long generation, String recoveryMessage) {
        cancelTimers();
        if (controller.error(generation, recoveryMessage)) {
            render();
        }
    }

    private void scheduleListeningTimers(long generation) {
        cancelTimers();
        handler.postDelayed(() -> {
            if (controller.noSpeechPrompt(generation)) {
                render();
            }
        }, NO_SPEECH_PROMPT_MS);
        handler.postDelayed(() -> {
            VoiceSessionController.Snapshot snapshot = controller.snapshot();
            if (snapshot.generation == generation
                    && snapshot.phase == VoiceSessionController.Phase.LISTENING) {
                finishListening();
            }
        }, MAX_LISTENING_MS);
    }

    private void cancelTimers() {
        handler.removeCallbacksAndMessages(null);
    }

    private void render() {
        VoiceSessionController.Snapshot snapshot = controller.snapshot();
        statusView.setText(snapshot.message);
        provisionalView.setText(snapshot.provisionalText.isBlank()
                ? ""
                : getString(R.string.hearing_format, snapshot.provisionalText));

        boolean canEdit = snapshot.phase == VoiceSessionController.Phase.FINAL
                || snapshot.phase == VoiceSessionController.Phase.ERROR
                || snapshot.phase == VoiceSessionController.Phase.UNAVAILABLE;
        transcriptEditor.setEnabled(canEdit);
        rendering = true;
        if (!transcriptEditor.getText().toString().equals(snapshot.displayText)) {
            transcriptEditor.setText(snapshot.displayText);
            transcriptEditor.setSelection(transcriptEditor.length());
        }
        rendering = false;
        renderTextSize();
        renderSpeech();
        renderButtonsOnly();
    }

    private void renderButtonsOnly() {
        VoiceSessionController.Snapshot snapshot = controller.snapshot();
        boolean capture = snapshot.phase == VoiceSessionController.Phase.STARTING
                || snapshot.phase == VoiceSessionController.Phase.LISTENING
                || snapshot.phase == VoiceSessionController.Phase.STOPPING;
        talkButton.setVisibility(capture ? View.GONE : View.VISIBLE);
        doneButton.setVisibility(
                snapshot.phase == VoiceSessionController.Phase.LISTENING ? View.VISIBLE : View.GONE);
        boolean sizePending = textScale.snapshot().preview != null;
        boolean speechActive = speechController.isActive();
        boolean ratePending = speechSettings.snapshot().previewRate != null;
        stopButton.setText(sizePending && !capture && !speechActive
                ? R.string.cancel_size_preview
                : ratePending && !capture && !speechActive
                        ? R.string.cancel_speech_rate_preview
                        : R.string.stop);
        stopButton.setVisibility(capture || sizePending || speechActive || ratePending
                || snapshot.phase == VoiceSessionController.Phase.REQUESTING_PERMISSION
                ? View.VISIBLE : View.GONE);
        typeButton.setVisibility(snapshot.phase == VoiceSessionController.Phase.FINAL
                ? View.GONE : View.VISIBLE);
        useButton.setVisibility(snapshot.phase == VoiceSessionController.Phase.FINAL
                ? View.VISIBLE
                : View.GONE);
        useButton.setEnabled(!snapshot.displayText.trim().isEmpty());
    }

    @Override
    public Object onRetainNonConfigurationInstance() {
        // Only preference state survives rotation; no Activity, View or transcript is retained.
        return textScale;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (retainedTextScale) {
            retainedTextScale = false;
        } else {
            textScale.reload();
        }
        speechSettings.reload();
        renderTextSize();
        renderSpeech();
        renderButtonsOnly();
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (!isChangingConfigurations()) textScale.cancelPreview();
        speechSettings.cancelPreview();
        if (speechController.clear()) {
            speechOutput.stop();
        }
        renderTextSize();
        renderSpeech();
        renderButtonsOnly();
        VoiceSessionController.Phase phase = controller.snapshot().phase;
        if (phase == VoiceSessionController.Phase.STARTING
                || phase == VoiceSessionController.Phase.LISTENING
                || phase == VoiceSessionController.Phase.STOPPING) {
            stopEverything("Stopped because the app left the foreground.");
        }
    }

    @Override
    protected void onDestroy() {
        cancelTimers();
        recognizer.destroy();
        speechOutput.destroy();
        super.onDestroy();
    }

    private Button button(int label, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(label);
        registerTextSize(button, 20);
        button.setMinHeight(dp(64));
        button.setAllCaps(false);
        button.setOnClickListener(listener);
        return button;
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
    }

    private LinearLayout.LayoutParams spaced(LinearLayout.LayoutParams params, int top) {
        params.topMargin = top;
        return params;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
