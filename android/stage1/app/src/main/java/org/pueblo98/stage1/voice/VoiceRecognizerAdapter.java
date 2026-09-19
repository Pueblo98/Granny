package org.pueblo98.stage1.voice;

/** Narrow boundary around Android's on-device recognizer. */
public interface VoiceRecognizerAdapter {
    interface Listener {
        void onReady(long generation);

        void onPartial(long generation, String text);

        void onFinal(long generation, TranscriptHypotheses hypotheses);

        void onError(long generation, String recoveryMessage);
    }

    boolean isAvailable();

    void start(long generation, Listener listener);

    void done();

    void cancel();

    void destroy();
}
