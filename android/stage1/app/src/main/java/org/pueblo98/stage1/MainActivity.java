package org.pueblo98.stage1;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
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

/** Bounded tap-to-talk shell for T-120; it does not connect to a planner or external action. */
public final class MainActivity extends Activity implements VoiceRecognizerAdapter.Listener {
    private static final int MICROPHONE_PERMISSION_REQUEST = 120;
    private static final long NO_SPEECH_PROMPT_MS = 10_000L;
    private static final long MAX_LISTENING_MS = 30_000L;

    private final VoiceSessionController controller = new VoiceSessionController();
    private final Handler handler = new Handler(Looper.getMainLooper());

    private VoiceRecognizerAdapter recognizer;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        recognizer = new AndroidOnDeviceVoiceRecognizer(this);
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
        title.setTextSize(30);
        title.setTextColor(Color.rgb(30, 30, 30));
        content.addView(title, matchWrap());

        TextView explanation = new TextView(this);
        explanation.setText(R.string.privacy_explanation);
        explanation.setTextSize(18);
        explanation.setTextColor(Color.rgb(55, 55, 55));
        content.addView(explanation, spaced(matchWrap(), gap));

        statusView = new TextView(this);
        statusView.setTextSize(20);
        statusView.setTextColor(Color.rgb(20, 70, 60));
        statusView.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(statusView, spaced(matchWrap(), gap * 2));

        provisionalView = new TextView(this);
        provisionalView.setTextSize(24);
        provisionalView.setTextColor(Color.rgb(80, 80, 80));
        provisionalView.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(provisionalView, spaced(matchWrap(), gap));

        transcriptEditor = new EditText(this);
        transcriptEditor.setHint(R.string.transcript_hint);
        transcriptEditor.setTextSize(24);
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
                view -> stopEverything("Stopped. You can talk again or type."));
        typeButton = button(R.string.type_instead, view -> startTyping());
        useButton = button(R.string.use_request, view -> {
            controller.submit();
            render();
        });

        content.addView(talkButton, spaced(matchWrap(), gap));
        content.addView(doneButton, spaced(matchWrap(), gap));
        content.addView(stopButton, spaced(matchWrap(), gap));
        content.addView(typeButton, spaced(matchWrap(), gap));
        content.addView(useButton, spaced(matchWrap(), gap));

        TextView boundary = new TextView(this);
        boundary.setText(R.string.test_boundary);
        boundary.setTextSize(16);
        boundary.setTextColor(Color.rgb(85, 85, 85));
        content.addView(boundary, spaced(matchWrap(), gap * 2));

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.addView(content);
        return scroll;
    }

    private void startTalk() {
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
        VoiceSessionController.Snapshot snapshot = controller.snapshot();
        cancelTimers();
        recognizer.cancel();
        controller.beginTyping(snapshot.displayText.isBlank()
                ? snapshot.provisionalText
                : snapshot.displayText);
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
        controller.stop(reason);
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
        stopButton.setVisibility(capture ? View.VISIBLE : View.GONE);
        typeButton.setVisibility(capture || snapshot.phase == VoiceSessionController.Phase.ERROR
                || snapshot.phase == VoiceSessionController.Phase.UNAVAILABLE
                || snapshot.phase == VoiceSessionController.Phase.REQUESTING_PERMISSION
                ? View.VISIBLE
                : View.GONE);
        useButton.setVisibility(snapshot.phase == VoiceSessionController.Phase.FINAL
                ? View.VISIBLE
                : View.GONE);
        useButton.setEnabled(!snapshot.displayText.trim().isEmpty());
    }

    @Override
    protected void onStop() {
        super.onStop();
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
        super.onDestroy();
    }

    private Button button(int label, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextSize(20);
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
