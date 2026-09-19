package org.pueblo98.granny.c2observer;

/** Pure admission boundary before a service allocates a MediaProjection. */
final class CaptureStartAdmission {
    private final LabSessionLedger ledger;

    CaptureStartAdmission(LabSessionLedger ledger) {
        this.ledger = ledger;
    }

    boolean admitProjection(long generation, String trial) {
        return ledger.active(generation, trial);
    }

    boolean requestStop(long generation) {
        if (ledger.requestStop(generation)) {
            return true;
        }
        LabSessionLedger.Snapshot snapshot = ledger.snapshot();
        return snapshot.generation == generation && snapshot.phase == LabSessionLedger.Phase.STOPPING;
    }

    boolean canCapture(long generation) {
        LabSessionLedger.Snapshot snapshot = ledger.snapshot();
        return snapshot.generation == generation && snapshot.phase == LabSessionLedger.Phase.ACTIVE;
    }

    boolean runIfCaptureAllowed(long generation, Runnable effect) {
        if (!canCapture(generation)) {
            return false;
        }
        effect.run();
        return true;
    }
}
