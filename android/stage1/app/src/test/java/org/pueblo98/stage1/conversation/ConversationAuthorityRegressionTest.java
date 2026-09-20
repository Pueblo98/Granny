package org.pueblo98.stage1.conversation;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleStore;

/** Adversarial, port-injected authority regressions: no Android runtime or UI involved. */
public final class ConversationAuthorityRegressionTest {
    @Test public void candidateBuildNeverDispatches() {
        Fake fake = new Fake(); ConversationSessionCoordinator c = coordinator(fake, ConversationSessionCoordinator.BuildMode.CANDIDATE);
        c.chooseTextScale(TextScale.LARGE);
        assertEquals(ConversationSessionCoordinator.Result.DENIED, c.approve()); assertEquals(0, fake.calls);
    }
    @Test public void changedPriorBeforeDispatchProducesNoEffect() {
        Fake fake = new Fake(); ConversationSessionCoordinator c = coordinator(fake); prepare(c); fake.observed = changed();
        assertEquals(ConversationSessionCoordinator.Result.DENIED, c.dispatchApproved()); assertEquals(0, fake.calls);
    }
    @Test public void mismatchedObservedValueOrVersionIsUnknown() {
        Fake fake = new Fake(); ConversationSessionCoordinator c = coordinator(fake); prepare(c); fake.afterDispatch = changed();
        assertEquals(ConversationSessionCoordinator.Result.UNKNOWN, c.dispatchApproved()); assertEquals(1, fake.calls);
    }
    @Test public void adapterExceptionIsUnknown() {
        Fake fake = new Fake(); fake.throwOnDispatch = true; ConversationSessionCoordinator c = coordinator(fake); prepare(c);
        assertEquals(ConversationSessionCoordinator.Result.UNKNOWN, c.dispatchApproved());
    }
    @Test public void noOpAbsentPreferenceWritesNothingAndIsKnown() {
        Fake fake = new Fake(); fake.prepared = new CapabilityPorts.Prepared(null, null, false);
        ConversationSessionCoordinator c = coordinator(fake); c.chooseTextScale(TextScale.DEFAULT); c.approve();
        assertEquals(ConversationSessionCoordinator.Result.KNOWN, c.dispatchApproved()); assertEquals(1, fake.calls);
    }
    @Test public void restoreFreezesExactPriorAndVersion() {
        Fake fake = new Fake(); TextScaleStore.StoredValue prior = new TextScaleStore.StoredValue(5, TextScale.LARGE, TextScale.COMFORTABLE);
        fake.observed = prior; fake.prepared = new CapabilityPorts.Prepared(prior, new TextScaleStore.StoredValue(6, TextScale.COMFORTABLE, null), true);
        ConversationSessionCoordinator c = coordinator(fake); c.typed("make text larger"); c.submit(); c.chooseRestore(); c.approve();
        assertEquals(ConversationSessionCoordinator.Result.KNOWN, c.dispatchApproved()); assertEquals(6, fake.afterDispatch.version);
    }
    @Test public void lateAndDuplicateProposalCannotReviveState() {
        Fake fake = new Fake(); ConversationSessionCoordinator c = coordinator(fake); c.typed("make text larger"); long g=c.snapshot().generation,r=c.snapshot().revision;
        c.edit("make this bigger"); assertEquals(ConversationSessionCoordinator.Result.STALE,c.deliverProposal(g,r,new ConversationSessionCoordinator.Proposal(ConversationSessionCoordinator.Capability.TEXT_SCALE)));
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.deliverProposal(g,r,new ConversationSessionCoordinator.Proposal(ConversationSessionCoordinator.Capability.TEXT_SCALE)));
    }
    @Test public void c2ProposalIsDeniedWithoutAdapterCall() {
        Fake fake=new Fake(); ConversationSessionCoordinator c=coordinator(fake); c.typed("x"); long g=c.snapshot().generation,r=c.snapshot().revision; c.submit();
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.deliverProposal(g,r,new ConversationSessionCoordinator.Proposal(ConversationSessionCoordinator.Capability.SCREEN_EXPLANATION))); assertEquals(0,fake.calls);
    }
    @Test public void oversizedEditInvalidatesQueuedPermit() {
        Fake fake=new Fake(); ConversationSessionCoordinator c=coordinator(fake); prepare(c); c.edit("x".repeat(4097));
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved()); assertEquals(0,fake.calls);
    }
    @Test public void stopReentrantDuringDispatchLeavesUnknown() {
        Fake fake=new Fake(); final ConversationSessionCoordinator[] holder=new ConversationSessionCoordinator[1];
        fake.onDispatch=()->holder[0].stop(); ConversationSessionCoordinator c=coordinator(fake); holder[0]=c; prepare(c);
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved()); assertEquals(ConversationSessionCoordinator.Surface.UNKNOWN,c.snapshot().surface);
    }
    @Test public void backgroundUnknownCannotDispatch() {
        Fake fake=new Fake(); ConversationSessionCoordinator c=coordinator(fake); prepare(c); c.clearForBackground(null);
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved()); assertFalse(c.snapshot().permitQueued);
    }
    @Test public void roomAnchorSurvivesTemporaryAuthoritySurfaces() {
        Fake fake=new Fake(); ConversationSessionCoordinator c=coordinator(fake); c.setPlace("Kitchen",new ConversationSessionCoordinator.ReturnAnchor("Kitchen","recipe",9)); prepare(c);
        assertEquals("Kitchen",c.snapshot().place); assertEquals("recipe",c.snapshot().returnAnchor.focusId);
    }
    private static void prepare(ConversationSessionCoordinator c) { c.typed("make text larger"); c.submit(); c.chooseTextScale(TextScale.LARGE); assertEquals(ConversationSessionCoordinator.Result.QUEUED,c.approve()); }
    private static ConversationSessionCoordinator coordinator(Fake fake) { return coordinator(fake,ConversationSessionCoordinator.BuildMode.SYNTHETIC_LAB); }
    private static ConversationSessionCoordinator coordinator(Fake fake, ConversationSessionCoordinator.BuildMode mode) { return new ConversationSessionCoordinator(null,fake,fake,null,()->{},mode); }
    private static TextScaleStore.StoredValue changed() { return new TextScaleStore.StoredValue(8,TextScale.COMFORTABLE,TextScale.DEFAULT); }
    private static final class Fake implements CapabilityPorts.CapabilityAdapter, CapabilityPorts.OutcomeObserver {
        TextScaleStore.StoredValue observed; TextScaleStore.StoredValue afterDispatch; CapabilityPorts.Prepared prepared; int calls; boolean throwOnDispatch; Runnable onDispatch;
        public CapabilityPorts.Prepared prepare(TextScale scale, boolean restore) { if(prepared!=null)return prepared; TextScaleStore.StoredValue prior=observed; TextScale before=prior==null?TextScale.DEFAULT:prior.current; TextScale after=scale==null?before:scale; return new CapabilityPorts.Prepared(prior,new TextScaleStore.StoredValue(prior==null?1:prior.version+1,after,before),restore); }
        public boolean dispatch(CapabilityPorts.Prepared p) { calls++; if(onDispatch!=null)onDispatch.run(); if(throwOnDispatch)throw new IllegalStateException(); afterDispatch=afterDispatch==null?p.target:afterDispatch; observed=afterDispatch; return true; }
        public void cancel() {}
        public TextScaleStore.ReadResult observe() { return observed==null?TextScaleStore.ReadResult.absent():TextScaleStore.ReadResult.present(observed); }
    }
}
