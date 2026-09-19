package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public final class LifecycleEvidenceGateTest {
    @Test
    public void standardCannotFinishBeforeFreshness() {
        LifecycleEvidenceGate gate = new LifecycleEvidenceGate();

        assertFalse(gate.canFinish(false));
        gate.onFreshnessAccepted();
        assertTrue(gate.canFinish(false));
    }

    @Test
    public void initialResizeBeforeFreshnessCannotSatisfyResizeTrial() {
        LifecycleEvidenceGate gate = new LifecycleEvidenceGate();

        gate.onResizeObserved();
        gate.onFreshnessAccepted();

        assertFalse(gate.canFinish(true));
    }

    @Test
    public void resizeAfterFreshnessSatisfiesResizeTrial() {
        LifecycleEvidenceGate gate = new LifecycleEvidenceGate();

        gate.onFreshnessAccepted();
        gate.onResizeObserved();

        assertTrue(gate.canFinish(true));
    }
}
