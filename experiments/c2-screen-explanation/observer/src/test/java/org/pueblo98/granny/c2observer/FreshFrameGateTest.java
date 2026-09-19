package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public final class FreshFrameGateTest {
    private final FixtureMarkerInterpreter interpreter = new FixtureMarkerInterpreter();

    @Test
    public void staticCachedFrameNeverPasses() {
        FreshFrameGate gate = new FreshFrameGate();
        FixtureMarkerInterpreter.Interpretation phaseZero =
                interpreter.interpret(solid("#0B6E4F"));

        assertEquals(FreshFrameGate.Decision.WAITING, gate.observe(phaseZero, 100L));
        assertEquals(FreshFrameGate.Decision.WAITING, gate.observe(phaseZero, 900L));
    }

    @Test
    public void sameSceneTransitionMustBeSeparatedInTime() {
        FreshFrameGate gate = new FreshFrameGate();
        FixtureMarkerInterpreter.Interpretation phaseZero =
                interpreter.interpret(solid("#0B6E4F"));
        FixtureMarkerInterpreter.Interpretation phaseOne =
                interpreter.interpret(solid("#16A34A"));

        assertEquals(FreshFrameGate.Decision.WAITING, gate.observe(phaseZero, 100L));
        assertEquals(FreshFrameGate.Decision.WAITING, gate.observe(phaseOne, 400L));
        assertEquals(FreshFrameGate.Decision.ACCEPT, gate.observe(phaseOne, 700L));
    }

    @Test
    public void sceneChangeFailsClosed() {
        FreshFrameGate gate = new FreshFrameGate();

        assertEquals(FreshFrameGate.Decision.WAITING,
                gate.observe(interpreter.interpret(solid("#0B6E4F")), 100L));
        assertEquals(FreshFrameGate.Decision.REJECT,
                gate.observe(interpreter.interpret(solid("#DC2626")), 900L));
    }

    @Test
    public void unknownFramesCannotSupplyFreshness() {
        FreshFrameGate gate = new FreshFrameGate();

        assertEquals(FreshFrameGate.Decision.WAITING,
                gate.observe(interpreter.interpret(solid("#000000")), 100L));
        assertEquals(FreshFrameGate.Decision.WAITING,
                gate.observe(interpreter.interpret(solid("#DDDDDD")), 900L));
    }

    @Test
    public void acceptedGateCannotBeReused() {
        FreshFrameGate gate = new FreshFrameGate();
        FixtureMarkerInterpreter.Interpretation phaseZero =
                interpreter.interpret(solid("#0B6E4F"));
        FixtureMarkerInterpreter.Interpretation phaseOne =
                interpreter.interpret(solid("#16A34A"));

        gate.observe(phaseZero, 100L);
        assertEquals(FreshFrameGate.Decision.ACCEPT, gate.observe(phaseOne, 700L));
        assertEquals(FreshFrameGate.Decision.REJECT, gate.observe(phaseZero, 1_300L));
    }

    private FrameSample solid(String hex) {
        return FrameSample.fromSolidArgb(
                (int) (0xff000000L | Long.parseLong(hex.substring(1), 16)),
                256);
    }
}
