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
        if (candidateGeneration < generation) {
            return false;
        }
        generation = candidateGeneration;
        phase = Phase.REQUESTING;
        displayText = instruction;
        return true;
    }

    synchronized boolean active(long candidateGeneration, String trial) {
        if (candidateGeneration < generation) {
            return false;
        }
        generation = candidateGeneration;
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
        if (candidateGeneration < generation) {
            return false;
        }
        generation = candidateGeneration;
        phase = Phase.RESULT;
        displayText = safe(status) + "\n" + safe(message)
                + "\n\nLimit: " + safe(uncertainty);
        return true;
    }

    synchronized Snapshot snapshot() {
        return new Snapshot(generation, phase, displayText);
    }

    private static String safe(String value) {
        return value == null ? "No result." : value;
    }
}
