package org.pueblo98.stage1.voice;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/** Uses only Android's explicit on-device recognizer; it never falls back to a generic service. */
public final class AndroidOnDeviceVoiceRecognizer implements VoiceRecognizerAdapter {
    private final Context context;
    private SpeechRecognizer recognizer;
    private long activeGeneration = -1;
    private Listener listener;
    private boolean formattedPairRequested;

    public AndroidOnDeviceVoiceRecognizer(Context context) {
        this.context = context.getApplicationContext();
    }

    @Override
    public boolean isAvailable() {
        return SpeechRecognizer.isOnDeviceRecognitionAvailable(context);
    }

    @Override
    public void start(long generation, Listener nextListener) {
        cancelAndDestroyRecognizer();
        activeGeneration = generation;
        listener = nextListener;
        formattedPairRequested = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU;

        if (!isAvailable()) {
            emitError("On-device speech recognition is unavailable. You can type instead.");
            return;
        }

        try {
            recognizer = SpeechRecognizer.createOnDeviceSpeechRecognizer(context);
            recognizer.setRecognitionListener(new PlatformListener(generation));
            recognizer.startListening(createIntent());
        } catch (RuntimeException failure) {
            emitError("On-device speech recognition could not start. You can type instead.");
        }
    }

    @Override
    public void done() {
        if (recognizer != null) {
            recognizer.stopListening();
        }
    }

    @Override
    public void cancel() {
        activeGeneration = -1;
        listener = null;
        cancelAndDestroyRecognizer();
    }

    @Override
    public void destroy() {
        cancel();
    }

    @SuppressLint("InlinedApi") // Both API 33 string constants are guarded before this path is added.
    private Intent createIntent() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault().toLanguageTag());
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 2);
        if (formattedPairRequested) {
            intent.putExtra(
                    RecognizerIntent.EXTRA_ENABLE_FORMATTING,
                    RecognizerIntent.FORMATTING_OPTIMIZE_QUALITY);
        }
        return intent;
    }

    private List<String> results(Bundle bundle) {
        if (bundle == null) {
            return Collections.emptyList();
        }
        ArrayList<String> values = bundle.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        return values == null ? Collections.emptyList() : values;
    }

    private void emitError(String message) {
        long generation = activeGeneration;
        Listener current = listener;
        cancelAndDestroyRecognizer();
        activeGeneration = -1;
        listener = null;
        if (current != null && generation >= 0) {
            current.onError(generation, message);
        }
    }

    private void cancelAndDestroyRecognizer() {
        if (recognizer == null) {
            return;
        }
        try {
            recognizer.cancel();
        } catch (RuntimeException ignored) {
            // The state machine still invalidates this recognizer generation.
        }
        recognizer.destroy();
        recognizer = null;
    }

    private final class PlatformListener implements RecognitionListener {
        private final long generation;

        private PlatformListener(long generation) {
            this.generation = generation;
        }

        private boolean isCurrent() {
            return generation == activeGeneration && listener != null;
        }

        @Override
        public void onReadyForSpeech(Bundle params) {
            if (isCurrent()) {
                listener.onReady(generation);
            }
        }

        @Override
        public void onBeginningOfSpeech() {}

        @Override
        public void onRmsChanged(float rmsdB) {}

        @Override
        public void onBufferReceived(byte[] buffer) {}

        @Override
        public void onEndOfSpeech() {}

        @Override
        public void onError(int error) {
            if (!isCurrent()) {
                return;
            }
            emitError(recoveryFor(error));
        }

        @Override
        public void onResults(Bundle resultBundle) {
            if (!isCurrent()) {
                return;
            }
            TranscriptHypotheses selected =
                    TranscriptHypotheses.select(results(resultBundle), formattedPairRequested);
            Listener current = listener;
            activeGeneration = -1;
            listener = null;
            cancelAndDestroyRecognizer();
            current.onFinal(generation, selected);
        }

        @Override
        public void onPartialResults(Bundle partialResults) {
            if (!isCurrent()) {
                return;
            }
            List<String> values = results(partialResults);
            listener.onPartial(generation, values.isEmpty() ? "" : values.get(0));
        }

        @Override
        public void onEvent(int eventType, Bundle params) {}
    }

    private static String recoveryFor(int code) {
        return switch (code) {
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT, SpeechRecognizer.ERROR_NO_MATCH ->
                    "I didn't catch a request. Try again or type instead.";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS ->
                    "Microphone permission is unavailable. You can type instead.";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY ->
                    "Speech recognition is busy. Wait a moment, then try again or type instead.";
            case SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED,
                    SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE ->
                    "On-device recognition is unavailable for this language. You can type instead.";
            default -> "Speech recognition stopped. Try again or type instead.";
        };
    }
}
