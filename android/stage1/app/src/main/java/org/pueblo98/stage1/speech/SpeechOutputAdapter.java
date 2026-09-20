package org.pueblo98.stage1.speech;

/** Narrow platform boundary for explicit spoken output. */
public interface SpeechOutputAdapter {
    enum Availability { INITIALIZING, AVAILABLE, UNAVAILABLE }

    interface Listener {
        void onAvailabilityChanged(Availability availability, String explanation);

        void onStarted(long generation);

        void onCompleted(long generation);

        void onStopped(long generation);

        void onError(long generation, String recoveryMessage);
    }

    Availability availability();

    /** Returns false when the request was refused before entering the platform engine. */
    boolean speak(long generation, String exactText, float rate, Listener listener);

    void stop();

    void destroy();
}
