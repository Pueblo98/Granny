package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

public final class CaptureTrialPlanTest {
    @Test
    public void standardHasNoArtificialHold() {
        CaptureTrialPlan plan = CaptureTrialPlan.from(null);

        assertEquals(CaptureTrialPlan.STANDARD, plan.id);
        assertEquals(0L, plan.holdOpenMillis);
        assertFalse(plan.requireResize);
    }

    @Test
    public void lifecycleTrialsHaveBoundedTenSecondWindow() {
        CaptureTrialPlan stop = CaptureTrialPlan.from(CaptureTrialPlan.STOP);
        CaptureTrialPlan revoke = CaptureTrialPlan.from(CaptureTrialPlan.REVOKE);
        CaptureTrialPlan processLoss = CaptureTrialPlan.from(CaptureTrialPlan.PROCESS_LOSS);

        assertEquals(10_000L, stop.holdOpenMillis);
        assertEquals(10_000L, revoke.holdOpenMillis);
        assertEquals(10_000L, processLoss.holdOpenMillis);
        assertFalse(stop.requireResize);
    }

    @Test
    public void resizeRequiresObservedGeometryChange() {
        CaptureTrialPlan plan = CaptureTrialPlan.from(CaptureTrialPlan.RESIZE);

        assertEquals(10_000L, plan.holdOpenMillis);
        assertTrue(plan.requireResize);
    }

    @Test
    public void unknownTrialFailsClosed() {
        assertThrows(IllegalArgumentException.class, () -> CaptureTrialPlan.from("other"));
    }
}
