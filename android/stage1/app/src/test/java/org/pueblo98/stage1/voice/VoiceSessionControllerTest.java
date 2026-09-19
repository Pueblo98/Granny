package org.pueblo98.stage1.voice;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class VoiceSessionControllerTest {
    @Test
    public void completesVoiceReviewEditAndSubmitFlow() {
        VoiceSessionController controller = new VoiceSessionController();
        long generation = controller.beginVoice(true);

        assertTrue(controller.ready(generation));
        assertTrue(controller.partial(generation, "call ana"));
        assertTrue(controller.requestDone(generation));
        assertTrue(controller.finalResult(generation, "call ana tomorrow", "Call Ana tomorrow."));
        assertEquals(VoiceSessionController.Phase.FINAL, controller.snapshot().phase);
        assertEquals("call ana tomorrow", controller.snapshot().verbatimFinal);

        assertTrue(controller.edit("Call Ana on Tuesday."));
        assertTrue(controller.submit());
        assertEquals("Call Ana on Tuesday.", controller.snapshot().submittedText);
    }

    @Test
    public void stopInvalidatesLateCallbacks() {
        VoiceSessionController controller = new VoiceSessionController();
        long generation = controller.beginVoice(true);
        assertTrue(controller.ready(generation));
        controller.stop("Stopped.");

        assertFalse(controller.partial(generation, "late words"));
        assertFalse(controller.finalResult(generation, "late", "Late."));
        assertEquals(VoiceSessionController.Phase.IDLE, controller.snapshot().phase);
        assertEquals("", controller.snapshot().displayText);
    }

    @Test
    public void permissionDenialOffersEditableTypedRecovery() {
        VoiceSessionController controller = new VoiceSessionController();
        long generation = controller.beginVoice(false);

        assertTrue(controller.permissionDenied(generation));
        assertEquals(VoiceSessionController.Phase.ERROR, controller.snapshot().phase);
        assertTrue(controller.edit("Typed request"));
        assertTrue(controller.submit());
        assertEquals("Typed request", controller.snapshot().submittedText);
    }

    @Test
    public void unavailableRecognizerCanMoveDirectlyToTyping() {
        VoiceSessionController controller = new VoiceSessionController();
        controller.recognizerUnavailable();
        assertEquals(VoiceSessionController.Phase.UNAVAILABLE, controller.snapshot().phase);

        controller.beginTyping("hello");
        assertEquals(VoiceSessionController.Phase.FINAL, controller.snapshot().phase);
        assertEquals("hello", controller.snapshot().displayText);
    }

    @Test
    public void editingClearsPreviouslySubmittedRevision() {
        VoiceSessionController controller = new VoiceSessionController();
        controller.beginTyping("first");
        assertTrue(controller.submit());
        assertEquals("first", controller.snapshot().submittedText);

        assertTrue(controller.edit("second"));
        assertEquals("", controller.snapshot().submittedText);
        assertEquals("second", controller.snapshot().displayText);
    }

    @Test
    public void noSpeechPromptOnlyChangesAnEmptyActiveSession() {
        VoiceSessionController controller = new VoiceSessionController();
        long generation = controller.beginVoice(true);
        assertTrue(controller.ready(generation));
        assertTrue(controller.noSpeechPrompt(generation));
        assertTrue(controller.snapshot().message.contains("haven't heard"));

        assertTrue(controller.partial(generation, "hello"));
        assertFalse(controller.noSpeechPrompt(generation));
    }

    @Test
    public void replacementGenerationRejectsPreviousSession() {
        VoiceSessionController controller = new VoiceSessionController();
        long first = controller.beginVoice(true);
        long second = controller.beginVoice(true);

        assertFalse(controller.ready(first));
        assertTrue(controller.ready(second));
        assertFalse(controller.error(first, "late error"));
        assertEquals(VoiceSessionController.Phase.LISTENING, controller.snapshot().phase);
    }

    @Test
    public void emptyFinalMovesToRecoverableError() {
        VoiceSessionController controller = new VoiceSessionController();
        long generation = controller.beginVoice(true);
        assertTrue(controller.ready(generation));
        assertTrue(controller.finalResult(generation, "", ""));
        assertEquals(VoiceSessionController.Phase.ERROR, controller.snapshot().phase);
        assertTrue(controller.snapshot().message.contains("didn't catch"));
    }
}
