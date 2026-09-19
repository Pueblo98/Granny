package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/** Deterministic queue-order test with a test-owned projection-attempt spy. */
public final class CaptureStartAdmissionTest {
    @Test
    public void admittedThenStoppedQueuedStartHasNoProjectionAttemptUntilCleanupAcknowledges() {
        LabSessionLedger ledger = new LabSessionLedger();
        CaptureStartAdmission admission = new CaptureStartAdmission(ledger);
        ProjectionAttemptSpy spy = new ProjectionAttemptSpy();

        assertTrue(ledger.requesting(1L, "Choose one app."));
        assertTrue(admission.admitProjection(1L, "standard"));
        assertTrue(admission.requestStop(1L));
        admission.runIfCaptureAllowed(1L, spy::attempt);

        assertEquals(0, spy.attempts);
        assertEquals(LabSessionLedger.Phase.STOPPING, ledger.snapshot().phase);
        assertFalse(ledger.requesting(2L, "Replacement request."));
        assertTrue(ledger.result(1L, "STOPPED", "Cleanup acknowledged.", "No projection started."));
    }

    @Test
    public void oneOpenRequestRunsExactlyOneProjectionAttempt() {
        LabSessionLedger ledger = new LabSessionLedger();
        CaptureStartAdmission admission = new CaptureStartAdmission(ledger);
        ProjectionAttemptSpy spy = new ProjectionAttemptSpy();

        assertTrue(ledger.requesting(2L, "Choose one app."));
        assertTrue(admission.admitProjection(2L, "standard"));
        admission.runIfCaptureAllowed(2L, spy::attempt);

        assertEquals(1, spy.attempts);
        assertFalse(admission.admitProjection(2L, "standard"));
        assertFalse(ledger.requesting(3L, "Replacement request."));
    }

    private static final class ProjectionAttemptSpy {
        int attempts;

        void attempt() {
            attempts += 1;
        }
    }
}
