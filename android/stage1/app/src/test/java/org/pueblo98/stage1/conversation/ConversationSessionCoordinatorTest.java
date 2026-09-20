package org.pueblo98.stage1.conversation;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import java.util.List;
import org.pueblo98.stage1.media.MediaPlayFromSearchPort;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

public final class ConversationSessionCoordinatorTest {
    @Test public void talkPreservesExistingDraftUntilCombinedFinalArrives() {
        ConversationSessionCoordinator c=coordinator(); c.typed("  My exact edited request.  ");
        long g=c.beginListening(); assertEquals("  My exact edited request.  ",c.snapshot().editableRequest);
        c.partial(g,"  My exact edited request.  New words");
        assertEquals("  My exact edited request.  ",c.snapshot().editableRequest);
        c.finalVoice(g,"  My exact edited request.  New words.");
        assertEquals("  My exact edited request.  New words.",c.snapshot().editableRequest);
        assertFalse(c.snapshot().permitQueued);
    }
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
    @Test public void emptyRequestKeepsTypingPathUsable() {
        ConversationSessionCoordinator c=coordinator(); c.typed("   ");
        assertEquals(ConversationSessionCoordinator.Result.DENIED,c.submit());
        assertEquals(ConversationSessionCoordinator.Surface.CLARIFICATION,c.snapshot().surface);
    }
    @Test public void directHomeSizeChoiceCreatesPreviewWithoutExternalRoute() {
        ConversationSessionCoordinator c=coordinator();
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED,c.chooseTextScale(TextScale.COMFORTABLE));
        assertEquals(ConversationSessionCoordinator.Surface.PREVIEW,c.snapshot().surface);
        assertTrue(c.metadata(ConversationSessionCoordinator.Capability.TEXT_SCALE).enabled);
    }
    @Test public void localDraftClarifiesTwoFictionalDavidsAndPreservesExactBody() {
        ConversationSessionCoordinator c=coordinator();
        c.typed("Tell David I’ll call after dinner.");
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED,c.submit());
        assertEquals(ConversationSessionCoordinator.Surface.DRAFT_RECIPIENT,c.snapshot().surface);
        assertEquals(2,c.snapshot().draftRecipients.size());
        assertEquals("person-a",c.snapshot().draftRecipients.get(0).endpointId);
        assertEquals("person-b",c.snapshot().draftRecipients.get(1).endpointId);
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED,c.chooseDraftRecipient("person-b"));
        assertEquals("David — neighbour",c.snapshot().draftRecipientLabel);
        assertEquals("Fixture messages",c.snapshot().draftChannel);
        assertEquals("I’ll call after dinner.",c.snapshot().draftBody);
        assertTrue(c.snapshot().consequence.contains("not sent"));
        assertTrue(c.snapshot().consequence.contains("person-b"));
        assertFalse(c.snapshot().permitQueued);
    }
    @Test public void typedAndFinalVoiceUseSameLocalDraftFixture() {
        ConversationSessionCoordinator typed=coordinator(); typed.typed("Tell David I'll call after dinner."); typed.submit();
        ConversationSessionCoordinator voice=coordinator(); long g=voice.beginListening();
        voice.finalVoice(g,"Tell David I’ll call after dinner."); voice.submit();
        assertEquals(ConversationSessionCoordinator.Surface.DRAFT_RECIPIENT,typed.snapshot().surface);
        assertEquals(typed.snapshot().draftRecipients.get(0).label,voice.snapshot().draftRecipients.get(0).label);
    }
    @Test public void localDraftReadyIsProcessOnlyAndNeverCreatesDispatchAuthority() {
        ConversationSessionCoordinator c=coordinator(); c.typed("Tell David I’ll call after dinner."); c.submit();
        c.chooseDraftRecipient("person-a");
        assertEquals(ConversationSessionCoordinator.Result.KNOWN,c.keepLocalDraft());
        assertEquals(ConversationSessionCoordinator.Surface.DRAFT_READY,c.snapshot().surface);
        assertFalse(c.snapshot().permitQueued);
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved());
        c.clearForBackground(null);
        assertEquals("",c.snapshot().draftBody);
        assertEquals("",c.snapshot().draftRecipientId);
        assertEquals("",c.snapshot().editableRequest);
    }
    @Test public void editingOrStopInvalidatesRecipientBinding() {
        ConversationSessionCoordinator c=coordinator(); c.typed("Tell David I’ll call after dinner."); c.submit();
        c.chooseDraftRecipient("person-a"); c.edit("Tell David I’ll call tomorrow.");
        assertEquals(ConversationSessionCoordinator.Surface.TRANSCRIPT,c.snapshot().surface);
        assertEquals("",c.snapshot().draftRecipientId);
        assertEquals(ConversationSessionCoordinator.Result.DENIED,c.keepLocalDraft());
        c.typed("Tell David I’ll call after dinner."); c.submit(); c.stop();
        assertEquals("",c.snapshot().draftBody);
    }
    @Test public void candidateModeDeniesFictionalDraftCapability() {
        FakeStore store=new FakeStore();
        ConversationSessionCoordinator c=new ConversationSessionCoordinator(
                new TextScaleController(store),store,ConversationSessionCoordinator.BuildMode.CANDIDATE);
        c.typed("Tell David I’ll call after dinner.");
        assertEquals(ConversationSessionCoordinator.Result.DENIED,c.submit());
        assertEquals(ConversationSessionCoordinator.Surface.CLARIFICATION,c.snapshot().surface);
        assertFalse(c.metadata(ConversationSessionCoordinator.Capability.LOCAL_DRAFT).enabled);
        assertEquals(ConversationSessionCoordinator.Result.DENIED,c.chooseDraftRecipient("person-a"));
    }
    @Test public void oneMediaHandlerProducesExactPreviewAndAcceptedHandoffIsNotPlayback() {
        FakeMedia media = new FakeMedia(handler("music/.Play", "music", "Fixture Music"));
        ConversationSessionCoordinator c = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        c.typed("play Elton John");
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED, c.submit());
        assertEquals(ConversationSessionCoordinator.Surface.MEDIA_PREVIEW, c.snapshot().surface);
        assertEquals("Elton John", c.snapshot().mediaArtist);
        assertEquals("Fixture Music", c.snapshot().mediaHandlerLabel);
        assertTrue(c.snapshot().consequence.contains("cannot yet verify playback or pause"));
        ConversationSessionCoordinator.Snapshot preview = c.snapshot();
        assertEquals(ConversationSessionCoordinator.Result.QUEUED,
                c.approveMedia(preview.generation, preview.revision, preview.consequence));
        assertTrue(c.snapshot().permitQueued);
        assertEquals(ConversationSessionCoordinator.Result.DISPATCHED, c.dispatchMedia(c.snapshot().generation));
        assertEquals(1, media.launches);
        assertEquals("Elton John", media.lastArtist);
        assertEquals(ConversationSessionCoordinator.Surface.MEDIA_REQUESTED, c.snapshot().surface);
        assertTrue(c.snapshot().message.contains("has not verified what is playing"));
    }
    @Test public void finalVoiceAndTypedMediaUseTheSameReviewedPath() {
        FakeMedia media = new FakeMedia(handler("music/.Play", "music", "Fixture Music"));
        ConversationSessionCoordinator typed = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        typed.typed("play Elton John"); typed.submit();
        ConversationSessionCoordinator voice = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        long generation = voice.beginListening();
        voice.finalVoice(generation, "play Elton John"); voice.submit();
        assertEquals(ConversationSessionCoordinator.Surface.MEDIA_PREVIEW, voice.snapshot().surface);
        assertEquals(typed.snapshot().consequence, voice.snapshot().consequence);
        assertEquals(ConversationSessionCoordinator.Provenance.FINAL_VOICE, voice.snapshot().provenance);
    }
    @Test public void multipleMediaHandlersRequireExactChoiceAndStaleChoiceCannotDispatch() {
        FakeMedia media = new FakeMedia(handler("a/.Play", "a", "Alpha"), handler("b/.Play", "b", "Beta"));
        ConversationSessionCoordinator c = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        c.typed("play some Elton John."); c.submit();
        assertEquals(ConversationSessionCoordinator.Surface.MEDIA_SERVICE, c.snapshot().surface);
        assertEquals(2, c.snapshot().mediaHandlers.size());
        assertEquals(ConversationSessionCoordinator.Result.DENIED, c.chooseMediaHandler("model.supplied/.Fake"));
        assertEquals(ConversationSessionCoordinator.Result.ACCEPTED, c.chooseMediaHandler("b/.Play"));
        ConversationSessionCoordinator.Snapshot preview = c.snapshot();
        c.approveMedia(preview.generation, preview.revision, preview.consequence);
        long old = c.snapshot().generation;
        c.edit("play something else");
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchMedia(old));
        assertEquals(0, media.launches);
    }
    @Test public void stopBeforeMediaDispatchRevokesPermit() {
        FakeMedia media = new FakeMedia(handler("music/.Play", "music", "Fixture Music"));
        ConversationSessionCoordinator c = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        c.typed("play Elton John"); c.submit();
        ConversationSessionCoordinator.Snapshot preview = c.snapshot();
        c.approveMedia(preview.generation, preview.revision, preview.consequence);
        long old = c.snapshot().generation; c.stop();
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchMedia(old));
        assertEquals(0, media.launches);
    }
    @Test public void noHandlerAndChangedHandlerFailWithoutPlaybackClaimOrRetry() {
        FakeMedia none = new FakeMedia();
        ConversationSessionCoordinator c = mediaCoordinator(none, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        c.typed("play Elton John");
        assertEquals(ConversationSessionCoordinator.Result.DENIED, c.submit());
        assertEquals(ConversationSessionCoordinator.Surface.MEDIA_SERVICE, c.snapshot().surface);
        assertTrue(c.snapshot().message.contains("Nothing was opened"));

        FakeMedia changed = new FakeMedia(handler("music/.Play", "music", "Fixture Music"));
        ConversationSessionCoordinator d = mediaCoordinator(changed, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        d.typed("play Elton John"); d.submit();
        ConversationSessionCoordinator.Snapshot preview = d.snapshot();
        d.approveMedia(preview.generation, preview.revision, preview.consequence);
        changed.result = MediaPlayFromSearchPort.LaunchResult.NO_HANDLER;
        assertEquals(ConversationSessionCoordinator.Result.DENIED, d.dispatchMedia(d.snapshot().generation));
        assertEquals(1, changed.launches);
        assertFalse(d.snapshot().message.contains("playing"));
        assertEquals(ConversationSessionCoordinator.Result.STALE, d.dispatchMedia(d.snapshot().generation));
    }
    @Test public void unknownMediaHandoffNeverRetriesAndCandidateModeDeniesRoute() {
        FakeMedia media = new FakeMedia(handler("music/.Play", "music", "Fixture Music"));
        media.result = MediaPlayFromSearchPort.LaunchResult.UNKNOWN;
        ConversationSessionCoordinator c = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB);
        c.typed("play Elton John"); c.submit();
        ConversationSessionCoordinator.Snapshot preview = c.snapshot();
        c.approveMedia(preview.generation, preview.revision, preview.consequence);
        assertEquals(ConversationSessionCoordinator.Result.UNKNOWN, c.dispatchMedia(c.snapshot().generation));
        assertEquals(ConversationSessionCoordinator.Surface.MEDIA_UNKNOWN, c.snapshot().surface);
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.dispatchMedia(c.snapshot().generation));
        assertEquals(1, media.launches);

        ConversationSessionCoordinator candidate = mediaCoordinator(media, ConversationSessionCoordinator.BuildMode.CANDIDATE);
        candidate.typed("play Elton John");
        assertEquals(ConversationSessionCoordinator.Result.DENIED, candidate.submit());
        assertFalse(candidate.metadata(ConversationSessionCoordinator.Capability.MEDIA_PLAY_FROM_SEARCH).enabled);
    }
    private static ConversationSessionCoordinator coordinator() { FakeStore store = new FakeStore(); return new ConversationSessionCoordinator(new TextScaleController(store), store); }
    private static MediaPlayFromSearchPort.Handler handler(String id, String pkg, String label) {
        return new MediaPlayFromSearchPort.Handler(id, pkg, label);
    }
    private static ConversationSessionCoordinator mediaCoordinator(FakeMedia media,
            ConversationSessionCoordinator.BuildMode mode) {
        FakeStore store = new FakeStore();
        return new ConversationSessionCoordinator(new TextScaleController(store), store, media, mode);
    }
    private static final class FakeMedia implements MediaPlayFromSearchPort {
        List<Handler> handlers;
        LaunchResult result = LaunchResult.HANDOFF_ACCEPTED;
        int launches;
        String lastArtist = "";
        FakeMedia(Handler... handlers) { this.handlers = List.of(handlers); }
        public List<Handler> compatibleHandlers() { return handlers; }
        public LaunchResult requestArtist(Handler handler, String exactArtist) {
            launches++; lastArtist = exactArtist; return result;
        }
    }
    private static final class FakeStore implements TextScaleStore {
        StoredValue value; int writes; boolean readbackMismatch;
        public ReadResult read() { if (readbackMismatch && writes > 0) return ReadResult.present(new StoredValue(1, TextScale.COMFORTABLE, TextScale.DEFAULT)); return value == null ? ReadResult.absent() : ReadResult.present(value); }
        public WriteResult compareAndSet(StoredValue expected, StoredValue update) { writes++; if (expected == null ? value != null : !expected.equals(value)) return WriteResult.CONFLICT; value = update; return WriteResult.WRITTEN; }
    }
}
