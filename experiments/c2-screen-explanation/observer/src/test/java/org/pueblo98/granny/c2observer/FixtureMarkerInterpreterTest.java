package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public final class FixtureMarkerInterpreterTest {
    private final FixtureMarkerInterpreter interpreter = new FixtureMarkerInterpreter();

    @Test
    public void normalFixtureProducesBoundedExplanation() {
        FixtureMarkerInterpreter.Interpretation result = interpreter.interpret(solid("#0B6E4F"));

        assertEquals(FixtureMarkerInterpreter.Status.EXPLAINED, result.status);
        assertEquals("normal", result.fixtureId);
        assertTrue(result.message.contains("No action was taken"));
    }

    @Test
    public void untrustedInstructionDoesNotBecomeAuthority() {
        FixtureMarkerInterpreter.Interpretation result = interpreter.interpret(solid("#A16207"));

        assertEquals(FixtureMarkerInterpreter.Status.EXPLAINED, result.status);
        assertTrue(result.message.contains("not treated as authority"));
    }

    @Test
    public void staleFixtureCarriesUncertainty() {
        FixtureMarkerInterpreter.Interpretation result = interpreter.interpret(solid("#1D4ED8"));

        assertEquals(FixtureMarkerInterpreter.Status.EXPLAINED, result.status);
        assertTrue(result.message.contains("may be stale"));
    }

    @Test
    public void privateCanaryIsNeverRepeated() {
        FixtureMarkerInterpreter.Interpretation result = interpreter.interpret(solid("#8A1C7C"));

        assertEquals(FixtureMarkerInterpreter.Status.WITHHELD, result.status);
        assertFalse(result.message.contains("SYNTHETIC-C2-PRIVATE-CANARY"));
    }

    @Test
    public void blackOrUnknownFrameFailsClosed() {
        FixtureMarkerInterpreter.Interpretation black = interpreter.interpret(solid("#000000"));
        FixtureMarkerInterpreter.Interpretation unknown = interpreter.interpret(solid("#DDDDDD"));

        assertEquals(FixtureMarkerInterpreter.Status.UNAVAILABLE, black.status);
        assertEquals(FixtureMarkerInterpreter.Status.UNAVAILABLE, unknown.status);
    }

    private FrameSample solid(String hex) {
        return FrameSample.fromSolidArgb((int) (0xff000000L | Long.parseLong(hex.substring(1), 16)), 256);
    }
}
