package org.pueblo98.granny.c2observer;

/** Pure presentation rule for the visible Stop control. */
final class StopControlState {
    final boolean enabled;
    final String label;

    private StopControlState(boolean enabled, String label) {
        this.enabled = enabled;
        this.label = label;
    }

    static StopControlState from(LabSessionLedger.Phase phase) {
        if (phase == LabSessionLedger.Phase.ACTIVE) {
            return new StopControlState(true, "Stop capture");
        }
        return new StopControlState(false, "No capture to stop");
    }

    static StopControlState stopping() {
        return new StopControlState(false, "Stop requested");
    }
}
