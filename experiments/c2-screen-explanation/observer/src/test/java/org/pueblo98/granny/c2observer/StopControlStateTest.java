package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public final class StopControlStateTest {
    @Test
    public void activeCaptureExposesEnabledStop() {
        StopControlState state = StopControlState.from(LabSessionLedger.Phase.ACTIVE);

        assertTrue(state.enabled);
        assertEquals("Stop capture", state.label);
    }

    @Test
    public void everyNonActivePhaseDisablesStopAndSaysWhy() {
        for (LabSessionLedger.Phase phase : LabSessionLedger.Phase.values()) {
            if (phase == LabSessionLedger.Phase.ACTIVE) {
                continue;
            }
            StopControlState state = StopControlState.from(phase);
            assertFalse(phase.name(), state.enabled);
            assertEquals(phase.name(), "No capture to stop", state.label);
        }
    }

    @Test
    public void requestedStopDisablesControlDuringServiceShutdown() {
        StopControlState state = StopControlState.stopping();

        assertFalse(state.enabled);
        assertEquals("Stop requested", state.label);
    }
}
