package org.pueblo98.stage1.setup;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class CapabilityCenterModelTest {
    @Test public void readyStateUsesObservedClosedValues() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, true, true, 1, "Larger", "Normal"));

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
                false, true, true, true, true, 1, "Standard", "Slower"));

        assertEquals("Ready", row(model, "Type").status);
        assertEquals("Microphone not allowed", row(model, "Talk").status);
        assertEquals(CapabilityCenterModel.Tone.NEEDS_ATTENTION, row(model, "Talk").tone);
        assertTrue(model.canTryVoice);
    }

    @Test public void missingRecognizerAndVoiceFailClosed() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, false, false, true, true, 0, "Largest", "Fastest"));

        assertEquals("Unavailable", row(model, "Talk").status);
        assertEquals("Unavailable", row(model, "Spoken answers").status);
        assertFalse(model.canTryVoice);
        assertFalse(model.canTrySpokenAnswer);
    }

    @Test public void soundOffKeepsInstalledVoiceDistinctFromUnavailable() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, false, true, 1, "Standard", "Normal"));

        assertEquals("Sound off", row(model, "Spoken answers").status);
        assertEquals(CapabilityCenterModel.Tone.NEEDS_ATTENTION, row(model, "Spoken answers").tone);
        assertFalse(model.canTrySpokenAnswer);
    }

    @Test public void mediaLabStaysDistinctFromAdmissionAndOtherExternalRoutes() {
        CapabilityCenterModel model = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, true, true, 2, "Standard", "Normal"));

        CapabilityCenterModel.Row media = row(model, "Music handoff");
        assertEquals("Evidence lab only", media.status);
        assertEquals(CapabilityCenterModel.Tone.NEEDS_ATTENTION, media.tone);
        assertTrue(media.detail.contains("cannot verify or pause"));
        CapabilityCenterModel.Row external = row(model, "Messages and screen help");
        assertEquals("Not available in this build", external.status);
        assertEquals(CapabilityCenterModel.Tone.UNAVAILABLE, external.tone);
    }

    @Test public void candidateAndMissingHandlerFailClosed() {
        CapabilityCenterModel candidate = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, true, false, 3, "Standard", "Normal"));
        assertEquals("Not available in this build", row(candidate, "Music handoff").status);
        CapabilityCenterModel none = CapabilityCenterModel.from(new CapabilityCenterModel.Input(
                true, true, true, true, true, 0, "Standard", "Normal"));
        assertEquals("No compatible app found", row(none, "Music handoff").status);
    }

    private static CapabilityCenterModel.Row row(CapabilityCenterModel model, String label) {
        return model.rows.stream().filter(item -> item.label.equals(label)).findFirst().orElseThrow();
    }
}
