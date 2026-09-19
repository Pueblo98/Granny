package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public final class LabSessionLedgerTest {
    @Test
    public void recreatedSurfaceCanRecoverActiveAndResultStates() {
        LabSessionLedger ledger = new LabSessionLedger();

        assertTrue(ledger.requesting(1L, "Choose one app."));
        assertTrue(ledger.active(1L, "resize"));
        LabSessionLedger.Snapshot active = ledger.snapshot();
        assertEquals(LabSessionLedger.Phase.ACTIVE, active.phase);
        assertTrue(active.displayText.contains("resize"));

        assertTrue(ledger.result(1L, "STOPPED", "Capture stopped.", "No restart."));
        LabSessionLedger.Snapshot result = ledger.snapshot();
        assertEquals(LabSessionLedger.Phase.RESULT, result.phase);
        assertTrue(result.displayText.contains("STOPPED"));
        assertTrue(result.displayText.contains("No restart."));
    }

    @Test
    public void staleGenerationCannotReplaceNewerSession() {
        LabSessionLedger ledger = new LabSessionLedger();

        assertTrue(ledger.requesting(2L, "New request."));
        assertFalse(ledger.result(1L, "EXPLAINED", "Old result.", "Stale."));

        LabSessionLedger.Snapshot snapshot = ledger.snapshot();
        assertEquals(2L, snapshot.generation);
        assertEquals(LabSessionLedger.Phase.REQUESTING, snapshot.phase);
        assertEquals("New request.", snapshot.displayText);
    }

    @Test
    public void newerResultCanCloseSessionAfterActivityIsGone() {
        LabSessionLedger ledger = new LabSessionLedger();

        assertTrue(ledger.requesting(3L, "Choose one app."));
        assertTrue(ledger.active(3L, "process-loss"));
        assertTrue(ledger.result(
                3L,
                "STOPPED",
                "Capture stopped when the observer task was removed.",
                "No capture continues without the lab task."));

        LabSessionLedger.Snapshot snapshot = ledger.snapshot();
        assertEquals(LabSessionLedger.Phase.RESULT, snapshot.phase);
        assertTrue(snapshot.displayText.contains("task was removed"));
    }

    @Test
    public void stopBeforeDelayedStartIsAnIndependentNoCaptureOracle() {
        LabSessionLedger ledger = new LabSessionLedger();

        assertTrue(ledger.requesting(4L, "Choose one app."));
        assertTrue(ledger.result(
                4L,
                "STOPPED",
                "Capture stopped before projection started.",
                "No projection was admitted."));

        assertFalse("late START must not reopen a stopped generation",
                ledger.active(4L, "standard"));
        LabSessionLedger.Snapshot snapshot = ledger.snapshot();
        assertEquals(LabSessionLedger.Phase.RESULT, snapshot.phase);
        assertTrue(snapshot.displayText.contains("before projection started"));
    }

    @Test
    public void firstTerminalResultCannotBeRewrittenByLateSuccess() {
        LabSessionLedger ledger = new LabSessionLedger();

        assertTrue(ledger.requesting(5L, "Choose one app."));
        assertTrue(ledger.result(5L, "STOPPED", "Stopped.", "No capture."));
        assertFalse(ledger.result(5L, "EXPLAINED", "Late success.", "Incorrect."));

        assertTrue(ledger.snapshot().displayText.contains("Stopped."));
    }

    @Test
    public void staleStopCannotCloseTheNewerCapture() {
        LabSessionLedger ledger = new LabSessionLedger();

        assertTrue(ledger.requesting(6L, "Choose one app."));
        assertTrue(ledger.active(6L, "standard"));
        assertFalse(ledger.requestStop(5L));

        assertEquals(LabSessionLedger.Phase.ACTIVE, ledger.snapshot().phase);
        assertTrue(ledger.requestStop(6L));
        assertEquals(LabSessionLedger.Phase.STOPPING, ledger.snapshot().phase);
        assertTrue(ledger.result(6L, "STOPPED", "Cleanup acknowledged.", "No projection started."));
        assertEquals(LabSessionLedger.Phase.RESULT, ledger.snapshot().phase);
    }
}
