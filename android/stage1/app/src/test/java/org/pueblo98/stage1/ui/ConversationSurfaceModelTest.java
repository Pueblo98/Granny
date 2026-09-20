package org.pueblo98.stage1.ui;

import static org.junit.Assert.*;
import org.junit.Test;
import org.pueblo98.stage1.conversation.ConversationSessionCoordinator.Surface;
import org.pueblo98.stage1.ui.ConversationSurfaceModel.Action;

public final class ConversationSurfaceModelTest {
    @Test public void composerDoesNotDuplicateListeningOrTranscriptControls() {
        assertFalse(ConversationSurfaceModel.showsTalk(Surface.LISTENING));
        assertFalse(ConversationSurfaceModel.showsType(Surface.LISTENING));
        assertFalse(ConversationSurfaceModel.showsTalk(Surface.TRANSCRIPT));
        assertFalse(ConversationSurfaceModel.showsType(Surface.TRANSCRIPT));
        assertTrue(ConversationSurfaceModel.showsTalk(Surface.IDLE));
        assertTrue(ConversationSurfaceModel.showsType(Surface.IDLE));
    }
    @Test public void provisionalListeningHasNoSubmitOrConsequenceApproval() {
        ConversationSurfaceModel model = ConversationSurfaceModel.forSurface(Surface.LISTENING);
        assertTrue(model.provisional);
        assertTrue(model.actions.contains(Action.DONE_LISTENING));
        assertTrue(model.actions.contains(Action.CANCEL));
        assertTrue(model.actions.contains(Action.TYPE));
        assertFalse(model.actions.contains(Action.STOP));
        assertFalse(model.actions.contains(Action.USE_REQUEST));
        assertFalse(model.actions.contains(Action.APPLY));
    }
    @Test public void onlyReviewedPreviewOffersApplyAndActiveOffersStop() {
        for (Surface state : Surface.values()) {
            ConversationSurfaceModel model = ConversationSurfaceModel.forSurface(state);
            assertEquals(state == Surface.PREVIEW, model.actions.contains(Action.APPLY));
            assertEquals(state == Surface.ACTIVE, model.actions.contains(Action.STOP));
        }
    }
    @Test public void transcriptSubmitsMeaningNotAnAction() {
        ConversationSurfaceModel model = ConversationSurfaceModel.forSurface(Surface.TRANSCRIPT);
        assertTrue(model.explanation.contains("does not send anything"));
        assertTrue(model.actions.contains(Action.USE_REQUEST));
        assertFalse(model.actions.contains(Action.APPLY));
    }
    @Test public void uncertainOutcomeHasNoRetryApplyOrSuccessClaim() {
        ConversationSurfaceModel model = ConversationSurfaceModel.forSurface(Surface.UNKNOWN);
        assertTrue(model.explanation.contains("Unknown outcome"));
        assertTrue(model.explanation.contains("will not retry automatically"));
        assertTrue(model.actions.contains(Action.REVIEW));
        assertFalse(model.actions.contains(Action.APPLY));
        assertFalse(model.actions.contains(Action.RESTORE));
    }
    @Test public void preferenceResultDoesNotClaimSendOrLayoutVerification() {
        ConversationSurfaceModel model = ConversationSurfaceModel.forSurface(Surface.KNOWN);
        assertTrue(model.explanation.contains("local preference state"));
        assertFalse(model.explanation.contains("sent"));
        assertTrue(model.actions.contains(Action.RESTORE));
    }
    @Test public void draftClarificationAndPreviewStayExplicitlyLocal() {
        ConversationSurfaceModel choice=ConversationSurfaceModel.forSurface(Surface.DRAFT_RECIPIENT);
        assertTrue(choice.choices);
        assertTrue(choice.explanation.contains("fictional"));
        assertTrue(choice.explanation.contains("nothing is sent"));
        ConversationSurfaceModel preview=ConversationSurfaceModel.forSurface(Surface.DRAFT_PREVIEW);
        assertTrue(preview.explanation.contains("not sent"));
        assertTrue(preview.explanation.contains("no messaging app"));
        assertTrue(preview.actions.contains(Action.KEEP_DRAFT));
        assertFalse(preview.actions.contains(Action.APPLY));
    }
    @Test public void readyDraftClaimsNeitherSendNorHandoff() {
        ConversationSurfaceModel model=ConversationSurfaceModel.forSurface(Surface.DRAFT_READY);
        assertTrue(model.explanation.contains("Not sent"));
        assertTrue(model.explanation.contains("not handed off"));
        assertFalse(model.actions.contains(Action.KEEP_DRAFT));
        assertFalse(model.actions.contains(Action.STOP));
    }
}
