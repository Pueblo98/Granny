package org.pueblo98.granny.c2observer;

/**
 * Process-local, content-free recovery for the current lab session.
 *
 * <p>The ledger never stores frames, marker samples, package identities, user
 * content, projection grants, or intents. It only retains fixed lab status
 * strings long enough for a recreated activity to recover the service result.
 */
final class LabSessionLedger {
    enum Phase {
        IDLE,
        REQUESTING,
        ACTIVE,
        STOPPING,
        RESULT
    }

    static final class Snapshot {
        final long generation;
        final Phase phase;
        final String displayText;

        Snapshot(long generation, Phase phase, String displayText) {
            this.generation = generation;
            this.phase = phase;
            this.displayText = displayText;
        }
    }

    private static final LabSessionLedger PROCESS = new LabSessionLedger();

    private long generation;
    private Phase phase = Phase.IDLE;
    private String displayText;

    static LabSessionLedger process() {
        return PROCESS;
    }

    synchronized boolean requesting(long candidateGeneration, String instruction) {
        if (candidateGeneration <= generation
                || phase == Phase.REQUESTING
                || phase == Phase.ACTIVE
                || phase == Phase.STOPPING) {
            return false;
        }
        generation = candidateGeneration;
        phase = Phase.REQUESTING;
        displayText = instruction;
        return true;
    }

    synchronized boolean active(long candidateGeneration, String trial) {
        // A service start is admitted once, and only for the still-open chooser
        // request. In particular, a late START intent must not reopen a result
        // that a Stop intent already made terminal for the same generation.
        if (candidateGeneration != generation || phase != Phase.REQUESTING) {
            return false;
        }
        phase = Phase.ACTIVE;
        displayText = "Capture active for " + trial
                + ". Use the red Stop button or notification Stop action.";
        return true;
    }

    synchronized boolean result(
            long candidateGeneration,
            String status,
            String message,
            String uncertainty) {
        // Preserve the first terminal fact for a generation. A delayed callback
        // must not replace a truthful stopped/unknown result with success.
        if (candidateGeneration != generation || phase == Phase.RESULT) {
            return false;
        }
        generation = candidateGeneration;
        phase = Phase.RESULT;
        displayText = safe(status) + "\n" + safe(message)
                + "\n\nLimit: " + safe(uncertainty);
        return true;
    }

    synchronized boolean requestStop(long candidateGeneration) {
        if (candidateGeneration != generation
                || (phase != Phase.REQUESTING && phase != Phase.ACTIVE)) {
            return false;
        }
        phase = Phase.STOPPING;
        displayText = "Stop requested. Capture cleanup is still in progress.";
        return true;
    }

    synchronized Snapshot snapshot() {
        return new Snapshot(generation, phase, displayText);
    }

    private static String safe(String value) {
        return value == null ? "No result." : value;
    }
}
