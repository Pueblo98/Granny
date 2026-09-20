package org.pueblo98.stage1.speech;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/** Bridge regressions use injected platform/focus/input fakes only. */
public final class ConversationSpeechBridgeTest {
    @Test public void readsAndRepeatsExactVisibleText() { Fixture f=fixture(); f.bridge.visibleText("  Exact words.  "); assertTrue(f.bridge.read()); assertEquals("  Exact words.  ",f.adapter.text); f.adapter.complete(); assertTrue(f.bridge.repeat()); assertEquals("  Exact words.  ",f.adapter.text); }
    @Test public void changedVisibleTextInvalidatesRepeatEvenForSameRequest() { Fixture f=fixture(); f.bridge.visibleText("Old"); f.bridge.read(); f.adapter.complete(); f.bridge.visibleText("New"); assertFalse(f.bridge.repeat()); }
    @Test public void deniedFocusDoesNotSpeakAndStopsInput() { Fixture f=fixture(); f.focus.allow=false; f.bridge.visibleText("Words"); assertFalse(f.bridge.read()); assertEquals(0,f.adapter.calls); assertEquals(1,f.inputStops); }
    @Test public void screenReaderAndSoundOffBlockOutput() { Fixture f=fixture(); f.bridge.visibleText("Words"); f.bridge.environment(true,true); assertFalse(f.bridge.read()); f.bridge.environment(true,false); f.bridge.sound(false); assertFalse(f.bridge.read()); }
    @Test public void backgroundClearsReadbackAndLateCompletion() { Fixture f=fixture(); f.bridge.visibleText("Private"); f.bridge.read(); long g=f.adapter.generation; f.bridge.environment(false,false); f.adapter.complete(g); assertFalse(f.bridge.canRepeat()); }
    @Test public void rateApplyNeedsMatchingCompletedPreview() { Fixture f=fixture(); assertTrue(f.bridge.preview(SpeechRate.FASTER)); long g=f.adapter.generation; f.bridge.onCompleted(g); assertEquals(SpeechSettingsController.OperationResult.APPLIED,f.settings.applyRate()); }
    @Test public void stalePreviewCompletionCannotAuthorizeNewRate() { Fixture f=fixture(); f.bridge.preview(SpeechRate.FASTER); long old=f.adapter.generation; f.bridge.preview(SpeechRate.SLOWER); f.bridge.onCompleted(old); assertEquals(SpeechSettingsController.OperationResult.PREVIEW_REQUIRED,f.settings.applyRate()); }
    @Test public void adapterFailureReleasesFocusAndKeepsWrittenFallback() { Fixture f=fixture(); f.adapter.accept=false; f.bridge.visibleText("Words"); assertFalse(f.bridge.read()); assertTrue(f.focus.releases>0); assertTrue(f.adapter.stops>0); }
    @Test public void stopInvalidatesLateCompletionAndCancelsPreview() { Fixture f=fixture(); f.bridge.preview(SpeechRate.FASTER); long g=f.adapter.generation; f.bridge.stop(); f.bridge.onCompleted(g); assertFalse(f.settings.snapshot().previewHeard); }
    @Test public void availabilityLossCancelsPendingRateAndLateCompletion() {
        Fixture f=fixture(); f.bridge.preview(SpeechRate.FASTER); long old=f.adapter.generation;
        f.bridge.onAvailabilityChanged(SpeechOutputAdapter.Availability.UNAVAILABLE,"Unavailable");
        f.bridge.onCompleted(old); assertFalse(f.settings.snapshot().previewHeard);
        assertEquals(SpeechSettingsController.OperationResult.PREVIEW_REQUIRED,f.settings.applyRate());
    }
    @Test public void backgroundAndScreenReaderRefuseRatePreview() {
        Fixture f=fixture(); f.bridge.environment(false,false); assertFalse(f.bridge.preview(SpeechRate.FASTER));
        f.bridge.environment(true,true); assertFalse(f.bridge.preview(SpeechRate.FASTER)); assertEquals(0,f.adapter.calls);
    }
    @Test public void interruptionInvalidatesBeforeSynchronousAdapterCompletion() {
        Fixture f=fixture(); f.bridge.preview(SpeechRate.FASTER); f.adapter.completeOnStop=true;
        f.bridge.stop(); assertFalse(f.settings.snapshot().previewHeard);
        assertEquals(SpeechSettingsController.OperationResult.PREVIEW_REQUIRED,f.settings.applyRate());
    }
    @Test public void inputStopsBeforeSpeakAndFocusLossRejectsLateStart() {
        Fixture f=fixture(); f.adapter.beforeSpeak=()->assertEquals(1,f.inputStops);
        f.bridge.visibleText("Words"); f.bridge.read(); long old=f.adapter.generation;
        f.bridge.stop(); f.bridge.onStarted(old); assertFalse(f.output.isActive());
    }
    @Test public void changedSurfaceStopsRatePreviewAndCannotApplyIt() {
        Fixture f=fixture(); f.bridge.visibleText("Preview"); f.bridge.preview(SpeechRate.FASTER);
        long old=f.adapter.generation; f.bridge.visibleText("Result"); f.bridge.onCompleted(old);
        assertFalse(f.settings.snapshot().previewHeard);
    }
    @Test public void capabilitySampleUsesFixedSyntheticTextAndDoesNotAuthorizeRateApplyOrRepeat() {
        Fixture f=fixture(); assertTrue(f.bridge.sample());
        assertEquals("Hello. This is a spoken answer from Granny. Nothing will be sent or changed.",f.adapter.text);
        long g=f.adapter.generation; f.bridge.onCompleted(g);
        assertFalse(f.bridge.canRepeat());
        assertEquals(SpeechSettingsController.OperationResult.PREVIEW_REQUIRED,f.settings.applyRate());
    }
    @Test public void stoppedCapabilitySampleRejectsLateCompletion() {
        Fixture f=fixture(); assertTrue(f.bridge.sample()); long old=f.adapter.generation;
        f.bridge.stop(); f.bridge.onCompleted(old); assertFalse(f.output.isActive());
    }
    private static Fixture fixture(){ Fixture f=new Fixture(); f.output.availabilityChanged(true,"ready"); f.bridge.environment(true,false); return f; }
    private static final class Fixture { final SpeechOutputController output=new SpeechOutputController(); final Store store=new Store(); final SpeechSettingsController settings=new SpeechSettingsController(store); final Adapter adapter=new Adapter(); final Focus focus=new Focus(); int inputStops; final ConversationSpeechBridge bridge=new ConversationSpeechBridge(output,settings,adapter,null,focus,()->inputStops++); }
    private static final class Focus implements ConversationSpeechBridge.Focus { boolean allow=true; int releases; public boolean acquire(){return allow;} public void release(){releases++;} }
    private static final class Adapter implements SpeechOutputAdapter { Availability state=Availability.AVAILABLE; boolean accept=true,completeOnStop; Runnable beforeSpeak; int calls,stops; String text; long generation; Listener listener; public Availability availability(){return state;} public boolean speak(long g,String t,float r,Listener l){if(beforeSpeak!=null)beforeSpeak.run();calls++;generation=g;text=t;listener=l;return accept;} public void stop(){stops++;if(completeOnStop&&listener!=null)listener.onCompleted(generation);} public void destroy(){} void complete(){complete(generation);} void complete(long g){listener.onCompleted(g);} }
    private static final class Store implements SpeechSettingsStore { StoredValue value; public ReadResult read(){return value==null?ReadResult.absent():ReadResult.present(value);} public WriteResult compareAndSet(StoredValue expected,StoredValue update){if(expected==null?value!=null:!expected.equals(value))return WriteResult.CONFLICT;value=update;return WriteResult.WRITTEN;} }
}
