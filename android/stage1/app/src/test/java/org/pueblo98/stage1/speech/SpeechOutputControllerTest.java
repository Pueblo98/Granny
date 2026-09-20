package org.pueblo98.stage1.speech;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class SpeechOutputControllerTest {
    @Test
    public void unavailableOutputRefusesReadbackAndKeepsWrittenFallbackMessage() {
        SpeechOutputController controller = new SpeechOutputController();
        controller.availabilityChanged(false, "No installed offline voice.");

        assertNull(controller.beginReadback("Visible words", 1, 1f));
        assertEquals(SpeechOutputController.Phase.UNAVAILABLE, controller.snapshot().phase);
        assertEquals("No installed offline voice.", controller.snapshot().message);
    }

    @Test
    public void explicitReadbackMovesThroughStartAndCompletion() {
        SpeechOutputController controller = availableController();

        SpeechOutputController.Request request = controller.beginReadback(
                "  Exact visible words.  ", 4, 1.25f);

        assertEquals("  Exact visible words.  ", request.exactText);
        assertEquals(4, request.revision);
        assertEquals(SpeechOutputController.Purpose.READBACK, request.purpose);
        assertEquals(SpeechOutputController.Phase.STARTING, controller.snapshot().phase);
        assertTrue(controller.started(request.generation));
        assertEquals(SpeechOutputController.Phase.SPEAKING, controller.snapshot().phase);
        assertTrue(controller.completed(request.generation));
        assertEquals(SpeechOutputController.Phase.COMPLETED, controller.snapshot().phase);
        assertTrue(controller.snapshot().canRepeat);
    }

    @Test
    public void stopInvalidatesLateCompletionAndPreservesRepeat() {
        SpeechOutputController controller = availableController();
        SpeechOutputController.Request request = controller.beginReadback("Keep this text", 2, 1f);
        controller.started(request.generation);

        assertTrue(controller.stop("Stopped by touch."));
        assertEquals(SpeechOutputController.Phase.STOPPED, controller.snapshot().phase);
        assertFalse(controller.completed(request.generation));
        assertTrue(controller.snapshot().canRepeat);
        SpeechOutputController.Request repeat = controller.repeat(2, 1f);
        assertEquals("Keep this text", repeat.exactText);
        assertTrue(repeat.generation > request.generation);
    }

    @Test
    public void changedRevisionStopsActiveOutputAndInvalidatesRepeat() {
        SpeechOutputController controller = availableController();
        SpeechOutputController.Request request = controller.beginReadback("Old text", 7, 1f);
        controller.started(request.generation);

        assertTrue(controller.contentChanged(8));
        assertEquals(SpeechOutputController.Phase.IDLE, controller.snapshot().phase);
        assertFalse(controller.snapshot().canRepeat);
        assertNull(controller.repeat(8, 1f));
        assertFalse(controller.completed(request.generation));
    }

    @Test
    public void sameRevisionDoesNotStopOrInvalidateReadback() {
        SpeechOutputController controller = availableController();
        SpeechOutputController.Request request = controller.beginReadback("Same text", 9, 1f);
        controller.started(request.generation);

        assertFalse(controller.contentChanged(9));
        assertEquals(SpeechOutputController.Phase.SPEAKING, controller.snapshot().phase);
        assertTrue(controller.snapshot().canRepeat);
    }

    @Test
    public void ratePreviewNeverBecomesRepeatableRequestText() {
        SpeechOutputController controller = availableController();

        SpeechOutputController.Request preview = controller.beginRatePreview(
                "This is a speech-rate preview.", 0.75f);

        assertEquals(SpeechOutputController.Purpose.RATE_PREVIEW, preview.purpose);
        controller.started(preview.generation);
        controller.completed(preview.generation);
        assertFalse(controller.snapshot().canRepeat);
        assertNull(controller.repeat(1, 1f));
    }

    @Test
    public void replacementGenerationRejectsOldCallbacks() {
        SpeechOutputController controller = availableController();
        SpeechOutputController.Request first = controller.beginReadback("First", 1, 1f);
        SpeechOutputController.Request second = controller.beginReadback("Second", 2, 1f);

        assertFalse(controller.started(first.generation));
        assertTrue(controller.started(second.generation));
        assertFalse(controller.error(first.generation, "old"));
        assertTrue(controller.error(second.generation, "current"));
        assertEquals("current", controller.snapshot().message);
    }

    @Test
    public void clearDropsRepeatTextAndRejectsLateCallbacks() {
        SpeechOutputController controller = availableController();
        SpeechOutputController.Request request = controller.beginReadback("Private session text", 3, 1f);

        assertTrue(controller.clear());
        assertFalse(controller.snapshot().canRepeat);
        assertFalse(controller.started(request.generation));
        assertNull(controller.repeat(3, 1f));
    }

    @Test
    public void invalidTextRevisionAndRateAreRefused() {
        SpeechOutputController controller = availableController();

        assertNull(controller.beginReadback("", 1, 1f));
        assertNull(controller.beginReadback("text", -1, 1f));
        assertNull(controller.beginReadback("text", 1, 0f));
        assertNull(controller.beginReadback("text", 1, Float.NaN));
    }

    @Test
    public void becomingUnavailableClearsRepeatText() {
        SpeechOutputController controller = availableController();
        SpeechOutputController.Request request = controller.beginReadback("Private text", 4, 1f);
        assertTrue(request != null);
        assertTrue(controller.completed(request.generation));
        assertTrue(controller.snapshot().canRepeat);

        controller.availabilityChanged(false, "Voice unavailable");
        controller.availabilityChanged(true, null);

        assertFalse(controller.snapshot().canRepeat);
        assertNull(controller.repeat(4, 1f));
    }

    private static SpeechOutputController availableController() {
        SpeechOutputController controller = new SpeechOutputController();
        controller.availabilityChanged(true, "ready");
        return controller;
    }
}
