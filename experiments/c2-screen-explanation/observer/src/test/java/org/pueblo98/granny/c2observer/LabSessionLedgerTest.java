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
}
