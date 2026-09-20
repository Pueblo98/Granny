package org.pueblo98.stage1.speech;

/** Process-local spoken-output state with stale callback and revision rejection. */
public final class SpeechOutputController {
    public enum Phase {
        INITIALIZING,
        IDLE,
        STARTING,
        SPEAKING,
        STOPPED,
        COMPLETED,
        UNAVAILABLE,
        ERROR
    }

    public enum Purpose { READBACK, RATE_PREVIEW }

    public static final class Request {
        public final long generation;
        public final String exactText;
        public final float rate;
        public final long revision;
        public final Purpose purpose;

        private Request(
                long generation,
                String exactText,
                float rate,
                long revision,
                Purpose purpose) {
            this.generation = generation;
            this.exactText = exactText;
            this.rate = rate;
            this.revision = revision;
            this.purpose = purpose;
        }
    }

    public static final class Snapshot {
        public final long generation;
        public final Phase phase;
        public final Purpose purpose;
        public final long activeRevision;
        public final boolean canRepeat;
        public final String message;

        private Snapshot(
                long generation,
                Phase phase,
                Purpose purpose,
                long activeRevision,
                boolean canRepeat,
                String message) {
            this.generation = generation;
            this.phase = phase;
            this.purpose = purpose;
            this.activeRevision = activeRevision;
            this.canRepeat = canRepeat;
            this.message = message;
        }
    }

    private long generation;
    private Phase phase = Phase.INITIALIZING;
    private Purpose purpose;
    private long activeRevision = -1;
    private String lastReadbackText = "";
    private long lastReadbackRevision = -1;
    private boolean available;
    private String message = "Checking spoken readback on this tablet…";

    public synchronized void availabilityChanged(boolean isAvailable, String explanation) {
        if (!isAvailable) {
            generation += 1;
            available = false;
            phase = Phase.UNAVAILABLE;
            purpose = null;
            activeRevision = -1;
            lastReadbackText = "";
            lastReadbackRevision = -1;
            message = explanation == null || explanation.isBlank()
                    ? "Spoken readback is unavailable. The written text remains available."
                    : explanation;
            return;
        }
        available = true;
        if (!isActive()) {
            phase = Phase.IDLE;
            purpose = null;
            activeRevision = -1;
            message = "Spoken readback is ready. Nothing is read automatically.";
        }
    }

    public synchronized Request beginReadback(String exactText, long revision, float rate) {
        if (!available || exactText == null || exactText.isBlank() || revision < 0
                || !validRate(rate)) {
            return null;
        }
        generation += 1;
        phase = Phase.STARTING;
        purpose = Purpose.READBACK;
        activeRevision = revision;
        lastReadbackText = exactText;
        lastReadbackRevision = revision;
        message = "Starting spoken readback…";
        return new Request(generation, exactText, rate, revision, purpose);
    }

    public synchronized Request beginRatePreview(String sample, float rate) {
        if (!available || sample == null || sample.isBlank() || !validRate(rate)) {
            return null;
        }
        generation += 1;
        phase = Phase.STARTING;
        purpose = Purpose.RATE_PREVIEW;
        activeRevision = -1;
        message = "Starting the speech-rate preview…";
        return new Request(generation, sample, rate, -1, purpose);
    }

    public synchronized Request repeat(String visibleText, long visibleRevision, float rate) {
        if (lastReadbackText.isBlank() || !lastReadbackText.equals(visibleText) || lastReadbackRevision != visibleRevision) {
            return null;
        }
        return beginReadback(lastReadbackText, lastReadbackRevision, rate);
    }

    public synchronized boolean started(long candidateGeneration) {
        if (!matches(candidateGeneration, Phase.STARTING)) {
            return false;
        }
        phase = Phase.SPEAKING;
        message = purpose == Purpose.RATE_PREVIEW
                ? "Previewing the selected speech rate."
                : "Reading aloud. Choose Stop speaking to keep the text on screen.";
        return true;
    }

    public synchronized boolean completed(long candidateGeneration) {
        if (candidateGeneration != generation
                || (phase != Phase.STARTING && phase != Phase.SPEAKING)) {
            return false;
        }
        phase = Phase.COMPLETED;
        message = purpose == Purpose.RATE_PREVIEW
                ? "Speech-rate preview finished. You can now apply it."
                : "Readback finished. You can repeat it or continue reading on screen.";
        return true;
    }

    public synchronized boolean stopped(long candidateGeneration) {
        if (candidateGeneration != generation
                || (phase != Phase.STARTING && phase != Phase.SPEAKING)) {
            return false;
        }
        phase = Phase.STOPPED;
        message = "Speech stopped. The text remains on screen.";
        return true;
    }

    public synchronized boolean error(long candidateGeneration, String recoveryMessage) {
        if (candidateGeneration != generation
                || (phase != Phase.STARTING && phase != Phase.SPEAKING)) {
            return false;
        }
        phase = Phase.ERROR;
        message = recoveryMessage == null || recoveryMessage.isBlank()
                ? "Spoken readback stopped. Continue with the written text."
                : recoveryMessage;
        return true;
    }

    /** Invalidates output immediately; the adapter is stopped by the caller afterward. */
    public synchronized boolean stop(String reason) {
        if (!isActive()) {
            return false;
        }
        generation += 1;
        phase = Phase.STOPPED;
        purpose = null;
        activeRevision = -1;
        message = reason == null || reason.isBlank()
                ? "Speech stopped. The text remains on screen."
                : reason;
        return true;
    }

    /** Returns true when an active utterance must be stopped at the adapter. */
    public synchronized boolean contentChanged(long newRevision) {
        boolean stopRequired = isActive() && activeRevision >= 0 && activeRevision != newRevision;
        if (lastReadbackRevision != newRevision) {
            lastReadbackText = "";
            lastReadbackRevision = -1;
        }
        if (stopRequired) {
            generation += 1;
            phase = available ? Phase.IDLE : Phase.UNAVAILABLE;
            purpose = null;
            activeRevision = -1;
            message = "The text changed, so the old readback was stopped.";
        }
        return stopRequired;
    }

    /** Drops task text when the app leaves the foreground. */
    public synchronized boolean clear() {
        boolean stopRequired = isActive();
        generation += 1;
        lastReadbackText = "";
        lastReadbackRevision = -1;
        purpose = null;
        activeRevision = -1;
        phase = available ? Phase.IDLE : Phase.UNAVAILABLE;
        message = available
                ? "Spoken readback is ready. Nothing is read automatically."
                : "Spoken readback is unavailable. The written text remains available.";
        return stopRequired;
    }

    public synchronized Snapshot snapshot() {
        return new Snapshot(
                generation,
                phase,
                purpose,
                activeRevision,
                available && !lastReadbackText.isBlank(),
                message);
    }

    public synchronized boolean isActive() {
        return phase == Phase.STARTING || phase == Phase.SPEAKING;
    }

    private boolean matches(long candidateGeneration, Phase requiredPhase) {
        return candidateGeneration == generation && phase == requiredPhase;
    }

    private static boolean validRate(float rate) {
        return !Float.isNaN(rate) && !Float.isInfinite(rate) && rate > 0f;
    }
}
