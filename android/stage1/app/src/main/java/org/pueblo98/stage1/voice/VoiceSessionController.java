package org.pueblo98.stage1.voice;

/** Process-local transcript state with generation-based stale callback rejection. */
public final class VoiceSessionController {
    public enum Phase {
        IDLE,
        REQUESTING_PERMISSION,
        STARTING,
        LISTENING,
        STOPPING,
        FINAL,
        UNAVAILABLE,
        ERROR
    }

    public static final class Snapshot {
        public final long generation;
        public final Phase phase;
        public final String provisionalText;
        public final String verbatimFinal;
        public final String displayText;
        public final String submittedText;
        public final long revision;
        public final String message;

        private Snapshot(
                long generation,
                Phase phase,
                String provisionalText,
                String verbatimFinal,
                String displayText,
                String submittedText,
                long revision,
                String message) {
            this.generation = generation;
            this.phase = phase;
            this.provisionalText = provisionalText;
            this.verbatimFinal = verbatimFinal;
            this.displayText = displayText;
            this.submittedText = submittedText;
            this.revision = revision;
            this.message = message;
        }
    }

    private long generation;
    private Phase phase = Phase.IDLE;
    private String provisionalText = "";
    private String verbatimFinal = "";
    private String displayText = "";
    private String submittedText = "";
    private long revision;
    private String message = "Tap Talk or type a request.";

    public synchronized long beginVoice(boolean hasPermission) {
        generation += 1;
        clearTranscript();
        phase = hasPermission ? Phase.STARTING : Phase.REQUESTING_PERMISSION;
        message = hasPermission
                ? "Starting on-device recognition…"
                : "Microphone permission is needed only for this Talk request.";
        return generation;
    }

    public synchronized boolean permissionGranted(long candidateGeneration) {
        if (!matches(candidateGeneration, Phase.REQUESTING_PERMISSION)) {
            return false;
        }
        phase = Phase.STARTING;
        message = "Starting on-device recognition…";
        return true;
    }

    public synchronized boolean permissionDenied(long candidateGeneration) {
        if (!matches(candidateGeneration, Phase.REQUESTING_PERMISSION)) {
            return false;
        }
        phase = Phase.ERROR;
        message = "Microphone permission was not granted. You can type instead.";
        return true;
    }

    public synchronized void recognizerUnavailable() {
        generation += 1;
        clearTranscript();
        phase = Phase.UNAVAILABLE;
        message = "On-device speech recognition is unavailable. You can type instead.";
    }

    public synchronized boolean ready(long candidateGeneration) {
        if (!matches(candidateGeneration, Phase.STARTING)) {
            return false;
        }
        phase = Phase.LISTENING;
        message = "Listening. Tap Done listening when you finish.";
        return true;
    }

    public synchronized boolean partial(long candidateGeneration, String text) {
        if (!matches(candidateGeneration, Phase.LISTENING)) {
            return false;
        }
        provisionalText = text == null ? "" : text;
        return true;
    }

    public synchronized boolean noSpeechPrompt(long candidateGeneration) {
        if (!matches(candidateGeneration, Phase.LISTENING) || !provisionalText.isBlank()) {
            return false;
        }
        message = "I haven't heard speech yet. Try again or type your request.";
        return true;
    }

    public synchronized boolean requestDone(long candidateGeneration) {
        if (!matches(candidateGeneration, Phase.LISTENING)) {
            return false;
        }
        phase = Phase.STOPPING;
        message = "Finishing the transcript…";
        return true;
    }

    public synchronized boolean finalResult(
            long candidateGeneration, String raw, String cleaned) {
        if (candidateGeneration != generation
                || (phase != Phase.LISTENING
                        && phase != Phase.STOPPING
                        && phase != Phase.STARTING)) {
            return false;
        }
        provisionalText = "";
        verbatimFinal = raw == null ? "" : raw;
        displayText = cleaned == null ? "" : cleaned;
        revision += 1;
        if (displayText.isBlank()) {
            phase = Phase.ERROR;
            message = "I didn't catch a request. Try again or type instead.";
        } else {
            phase = Phase.FINAL;
            message = "Review or edit the transcript before using it.";
        }
        return true;
    }

    public synchronized boolean error(long candidateGeneration, String recoveryMessage) {
        if (candidateGeneration != generation || !isCapturePhase(phase)) {
            return false;
        }
        provisionalText = "";
        phase = Phase.ERROR;
        message = recoveryMessage == null || recoveryMessage.isBlank()
                ? "Speech recognition stopped. Try again or type instead."
                : recoveryMessage;
        return true;
    }

    public synchronized void stop(String reason) {
        generation += 1;
        provisionalText = "";
        phase = Phase.IDLE;
        message = reason == null || reason.isBlank()
                ? "Stopped. You can talk again or type."
                : reason;
    }

    public synchronized long beginTyping(String currentText) {
        generation += 1;
        provisionalText = "";
        verbatimFinal = "";
        displayText = currentText == null ? "" : currentText;
        submittedText = "";
        revision += 1;
        phase = Phase.FINAL;
        message = "Type your request, then choose Use this request.";
        return generation;
    }

    public synchronized boolean edit(String value) {
        if (phase != Phase.FINAL && phase != Phase.ERROR && phase != Phase.UNAVAILABLE) {
            return false;
        }
        String next = value == null ? "" : value;
        if (!next.equals(displayText)) {
            displayText = next;
            submittedText = "";
            revision += 1;
        }
        phase = Phase.FINAL;
        message = "Review or edit the transcript before using it.";
        return true;
    }

    public synchronized boolean submit() {
        String exact = displayText.trim();
        if (phase != Phase.FINAL || exact.isEmpty()) {
            return false;
        }
        displayText = exact;
        submittedText = exact;
        message = "Request ready locally. No planner or external action is connected in this slice.";
        return true;
    }

    public synchronized Snapshot snapshot() {
        return new Snapshot(
                generation,
                phase,
                provisionalText,
                verbatimFinal,
                displayText,
                submittedText,
                revision,
                message);
    }

    private boolean matches(long candidateGeneration, Phase expected) {
        return candidateGeneration == generation && phase == expected;
    }

    private boolean isCapturePhase(Phase value) {
        return value == Phase.STARTING || value == Phase.LISTENING || value == Phase.STOPPING;
    }

    private void clearTranscript() {
        provisionalText = "";
        verbatimFinal = "";
        displayText = "";
        submittedText = "";
    }
}
