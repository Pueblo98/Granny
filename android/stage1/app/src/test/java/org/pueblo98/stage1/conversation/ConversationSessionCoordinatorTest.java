package org.pueblo98.stage1.conversation;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

public final class ConversationSessionCoordinatorTest {
    @Test public void typedAndFinalVoiceShareRevisionPreviewPath() {
        ConversationSessionCoordinator typed = coordinator();
        typed.typed("make text larger"); assertEquals(ConversationSessionCoordinator.Result.ACCEPTED, typed.submit()); typed.chooseTextScale(TextScale.LARGE);
        ConversationSessionCoordinator voice = coordinator(); long generation = voice.beginListening();
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED, voice.finalVoice(generation, "make text larger"));
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED, voice.submit()); voice.chooseTextScale(TextScale.LARGE);
        assertEquals(ConversationSessionCoordinator.Surface.PREVIEW, typed.snapshot().surface);
        assertEquals(typed.snapshot().consequence, voice.snapshot().consequence);
    }
    @Test public void partialNeverOpensPreviewAndLateVoiceIsRejected() {
        ConversationSessionCoordinator c = coordinator(); long old = c.beginListening(); c.partial(old, "make text");
        assertEquals(ConversationSessionCoordinator.Surface.LISTENING, c.snapshot().surface);
        c.stop(); assertEquals(ConversationSessionCoordinator.Result.STALE, c.finalVoice(old, "make text larger"));
    }
    @Test public void editInvalidatesQueuedPermitAndPreservesRoomAnchor() {
        ConversationSessionCoordinator c = coordinator(); c.setPlace("Kitchen", new ConversationSessionCoordinator.ReturnAnchor("recipe", 42));
        c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); c.approve();
        c.edit("another request");
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchApproved());
        assertEquals("Kitchen", c.snapshot().place); assertEquals(42, c.snapshot().returnAnchor.scrollY);
    }
    @Test public void stopWinsQueuedDispatchBeforeAdapterAndRunsCleanupAfterInvalidation() {
        FakeStore store = new FakeStore(); int[] cleanup = {0};
        ConversationSessionCoordinator c = new ConversationSessionCoordinator(new TextScaleController(store), store, () -> cleanup[0]++);
        c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); c.approve(); c.stop();
        assertEquals(1, cleanup[0]); assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchApproved());
        assertEquals(0, store.writes);
    }
    @Test public void approvalIsOneUseAndKnownOnlyAfterC5Readback() {
        FakeStore store = new FakeStore(); ConversationSessionCoordinator c = new ConversationSessionCoordinator(new TextScaleController(store), store);
        c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); c.approve();
        assertEquals(ConversationSessionCoordinator.Result.KNOWN, c.dispatchApproved());
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchApproved()); assertEquals(1, store.writes);
    }
    @Test public void unknownC5OutcomeNeverClaimsKnownAndExternalCapabilityIsDisabled() {
        FakeStore store = new FakeStore(); store.readbackMismatch = true;
        ConversationSessionCoordinator c = new ConversationSessionCoordinator(new TextScaleController(store), store);
        c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); c.approve();
        assertEquals(ConversationSessionCoordinator.Result.UNKNOWN, c.dispatchApproved());
        assertEquals(ConversationSessionCoordinator.Surface.UNKNOWN, c.snapshot().surface);
        assertFalse(c.isEnabled(ConversationSessionCoordinator.Capability.SCREEN_EXPLANATION));
    }
    @Test public void backgroundDropsPrivateRequestAndQueuedAuthorityButKeepsPlace() {
        ConversationSessionCoordinator c = coordinator(); c.setPlace("Kitchen", new ConversationSessionCoordinator.ReturnAnchor("Kitchen", "recipe", 7));
        c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); c.approve(); c.clearForBackground(null);
        assertEquals("Kitchen", c.snapshot().place); assertEquals("", c.snapshot().editableRequest);
        assertFalse(c.snapshot().permitQueued); assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchApproved());
    }
    @Test public void displayedApprovalTokenRejectsAStaleRenderedPreview() {
        ConversationSessionCoordinator c = coordinator(); c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE);
        long oldRevision=c.snapshot().revision; String old=c.snapshot().consequence; c.edit("make this bigger"); c.submit(); c.chooseTextScale(TextScale.EXTRA_LARGE);
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.approve(c.snapshot().generation, oldRevision, old));
    }
    @Test public void restoredUnknownHasNoRequestOrPermitAndCannotDispatch() {
        ConversationSessionCoordinator c=coordinator(); c.restoreUnknownOutcome();
        assertEquals(ConversationSessionCoordinator.Surface.UNKNOWN,c.snapshot().surface); assertEquals("",c.snapshot().editableRequest);
        assertFalse(c.snapshot().permitQueued); assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved());
    }
    @Test public void lateProposalAfterStopCannotReviveConversation() {
        ConversationSessionCoordinator c=coordinator(); c.typed("make text larger"); long g=c.snapshot().generation; long r=c.snapshot().revision; c.stop();
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.deliverProposal(g,r,new ConversationSessionCoordinator.Proposal("Choose a size.")));
    }
    @Test public void oldQueuedDispatchCannotUseNewPermit() {
        ConversationSessionCoordinator c=coordinator(); c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); c.approve(); long old=c.snapshot().generation;
        c.edit("make this bigger"); c.submit(); c.chooseTextScale(TextScale.EXTRA_LARGE); c.approve();
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved(old));
    }
    @Test public void registryMetadataFailsClosedForScreenExplanation() {
        ConversationSessionCoordinator c=coordinator();
        assertTrue(c.metadata(ConversationSessionCoordinator.Capability.TEXT_SCALE).enabled);
        assertFalse(c.metadata(ConversationSessionCoordinator.Capability.SCREEN_EXPLANATION).enabled);
        assertEquals("unadmitted",c.metadata(ConversationSessionCoordinator.Capability.SCREEN_EXPLANATION).outcomeOracle);
    }
    private static ConversationSessionCoordinator coordinator() { FakeStore store = new FakeStore(); return new ConversationSessionCoordinator(new TextScaleController(store), store); }
    private static final class FakeStore implements TextScaleStore {
        StoredValue value; int writes; boolean readbackMismatch;
        public ReadResult read() { if (readbackMismatch && writes > 0) return ReadResult.present(new StoredValue(1, TextScale.COMFORTABLE, TextScale.DEFAULT)); return value == null ? ReadResult.absent() : ReadResult.present(value); }
        public WriteResult compareAndSet(StoredValue expected, StoredValue update) { writes++; if (expected == null ? value != null : !expected.equals(value)) return WriteResult.CONFLICT; value = update; return WriteResult.WRITTEN; }
    }
}
