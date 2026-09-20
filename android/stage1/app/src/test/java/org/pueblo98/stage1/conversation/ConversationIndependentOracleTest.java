package org.pueblo98.stage1.conversation;

import org.junit.Test;
import static org.junit.Assert.*;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import org.pueblo98.stage1.readability.*;

/** Expected observations are fixed by each scenario, never obtained from dispatch arguments. */
public final class ConversationIndependentOracleTest {
    @Test public void acknowledgementWithoutEffectIsUnknown() {
        Store store = new Store(); store.dropWrites = true;
        ConversationSessionCoordinator c = create(store); queue(c, TextScale.LARGE);
        assertEquals(ConversationSessionCoordinator.Result.UNKNOWN, c.dispatchApproved());
        assertNull(store.value); assertEquals(1, store.writes);
        c.clearForBackground(null);
        assertEquals(ConversationSessionCoordinator.Surface.UNKNOWN, c.snapshot().surface);
        assertEquals(1, store.writes);
    }
    @Test public void absentDefaultIsKnownWithoutWriting() {
        Store store = new Store(); ConversationSessionCoordinator c = create(store); queue(c, TextScale.DEFAULT);
        assertEquals(ConversationSessionCoordinator.Result.KNOWN, c.dispatchApproved());
        assertEquals(0, store.writes); assertNull(store.value);
    }
    @Test public void restoreObservesExactStoredVersionAndClearsRestore() {
        Store store = new Store(); store.value = new TextScaleStore.StoredValue(7, TextScale.LARGE, TextScale.COMFORTABLE);
        ConversationSessionCoordinator c = create(store); c.chooseRestore(); c.approve();
        assertEquals(ConversationSessionCoordinator.Result.KNOWN, c.dispatchApproved());
        assertEquals(new TextScaleStore.StoredValue(8, TextScale.COMFORTABLE, null), store.value);
        assertEquals(1, store.writes);
    }
    @Test public void mutablePreviewCannotChangeApprovedTarget() {
        Store store = new Store(); TextScaleController controller = new TextScaleController(store);
        ConversationSessionCoordinator c = new ConversationSessionCoordinator(controller, store);
        queue(c, TextScale.LARGE); controller.preview(TextScale.EXTRA_LARGE);
        assertEquals(ConversationSessionCoordinator.Result.UNKNOWN, c.dispatchApproved());
        assertEquals(0, store.writes); assertNull(store.value);
    }
    @Test public void pendingProposalRequiresCurrentTokenAndIsConsumedOnce() {
        Store store = new Store(); ConversationSessionCoordinator c = new ConversationSessionCoordinator(new TextScaleController(store), store, (text,g,r)->null, ()->{});
        c.typed("make text larger"); long g=c.snapshot().generation, r=c.snapshot().revision;
        assertEquals(ConversationSessionCoordinator.Result.QUEUED, c.submit());
        assertEquals(ConversationSessionCoordinator.Result.DENIED, c.deliverProposal(g,r,new ConversationSessionCoordinator.Proposal(ConversationSessionCoordinator.Capability.SCREEN_EXPLANATION)));
        assertEquals(ConversationSessionCoordinator.Result.STALE, c.deliverProposal(g,r,new ConversationSessionCoordinator.Proposal(ConversationSessionCoordinator.Capability.TEXT_SCALE)));
        assertFalse(c.snapshot().choicesAvailable); assertEquals(0,store.writes);
    }
    @Test public void cleanupFailureStillDropsPrivateTextAndAuthority() {
        Store store = new Store(); ConversationSessionCoordinator c=create(store); queue(c,TextScale.LARGE);
        try { c.clearForBackground(()->{throw new IllegalStateException("fixture");}); fail(); }
        catch (IllegalStateException expected) { assertEquals("fixture",expected.getMessage()); }
        assertEquals("",c.snapshot().editableRequest); assertFalse(c.snapshot().permitQueued);
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved()); assertEquals(0,store.writes);
    }
    @Test public void otherThreadCannotMutateOrReadCoordinator() throws Exception {
        Store store=new Store(); ConversationSessionCoordinator c=create(store); AtomicReference<Throwable> error=new AtomicReference<>();
        Thread thread=new Thread(()->{try{c.typed("another request");}catch(Throwable failure){error.set(failure);}});
        thread.start(); thread.join(); assertTrue(error.get() instanceof IllegalStateException);
        assertEquals("",c.snapshot().editableRequest);
    }
    @Test public void stopInsidePostObservationCannotOverwriteUnknown() {
        Store store=new Store(); TextScaleController controller=new TextScaleController(store);
        final ConversationSessionCoordinator[] owner=new ConversationSessionCoordinator[1]; int[] reads={0};
        CapabilityPorts.OutcomeObserver observer=()->{if(++reads[0]==2)owner[0].stop();return store.read();};
        ConversationSessionCoordinator c=new ConversationSessionCoordinator(controller,new CapabilityPorts.C5Adapter(controller,store),observer,null,()->{}); owner[0]=c;
        queue(c,TextScale.LARGE);
        assertEquals(ConversationSessionCoordinator.Result.STALE,c.dispatchApproved());
        assertEquals(ConversationSessionCoordinator.Surface.UNKNOWN,c.snapshot().surface);
        assertEquals(new TextScaleStore.StoredValue(1,TextScale.LARGE,TextScale.DEFAULT),store.value);
        c.reviewStatus(); assertEquals(1,store.writes);
    }
    private static ConversationSessionCoordinator create(Store store){return new ConversationSessionCoordinator(new TextScaleController(store),store);}
    private static void queue(ConversationSessionCoordinator c,TextScale scale){c.chooseTextScale(scale);assertEquals(ConversationSessionCoordinator.Result.QUEUED,c.approve());}
    private static final class Store implements TextScaleStore {
        StoredValue value; int writes; boolean dropWrites;
        public ReadResult read(){return value==null?ReadResult.absent():ReadResult.present(value);}
        public WriteResult compareAndSet(StoredValue expected,StoredValue update){
            if(!Objects.equals(value,expected))return WriteResult.CONFLICT;
            writes++;if(!dropWrites)value=update;return WriteResult.WRITTEN;
        }
    }
}
