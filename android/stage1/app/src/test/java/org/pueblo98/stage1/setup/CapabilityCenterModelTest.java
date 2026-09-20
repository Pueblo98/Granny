package org.pueblo98.stage1.setup;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class CapabilityCenterModelTest {
    @Test public void readyStateUsesObservedClosedValues() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, true, "Larger", "Normal"));

        assertEquals("Ready", row(model, "Type").status);
        assertEquals("Ready", row(model, "Talk").status);
        assertEquals("Ready", row(model, "Spoken answers").status);
        assertEquals("Larger", row(model, "Granny text size").status);
        assertEquals("Normal", row(model, "Speech speed").status);
        assertTrue(model.canTryVoice);
        assertTrue(model.canTrySpokenAnswer);
    }

    @Test public void missingPermissionDoesNotCallTypeUnavailable() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                false, true, true, true, "Standard", "Slower"));

        assertEquals("Ready", row(model, "Type").status);
        assertEquals("Microphone not allowed", row(model, "Talk").status);
        assertEquals(CapabilityCenterModel.Tone.NEEDS_ATTENTION, row(model, "Talk").tone);
        assertTrue(model.canTryVoice);
    }

    @Test public void missingRecognizerAndVoiceFailClosed() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, false, false, true, "Largest", "Fastest"));

        assertEquals("Unavailable", row(model, "Talk").status);
        assertEquals("Unavailable", row(model, "Spoken answers").status);
        assertFalse(model.canTryVoice);
        assertFalse(model.canTrySpokenAnswer);
    }

    @Test public void soundOffKeepsInstalledVoiceDistinctFromUnavailable() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, false, "Standard", "Normal"));

        assertEquals("Sound off", row(model, "Spoken answers").status);
        assertEquals(CapabilityCenterModel.Tone.NEEDS_ATTENTION, row(model, "Spoken answers").tone);
        assertFalse(model.canTrySpokenAnswer);
    }

    @Test public void externalRoutesNeverAppearReady() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, true, "Standard", "Normal"));

        CapabilityCenterModel.Row external = row(model, "Messages, media and screen help");
        assertEquals("Not available in this build", external.status);
        assertEquals(CapabilityCenterModel.Tone.UNAVAILABLE, external.tone);
    }

    private static CapabilityCenterModel.Row row(CapabilityCenterModel model, String label) {
        return model.rows.stream().filter(item -> item.label.equals(label)).findFirst().orElseThrow();
    }
}
