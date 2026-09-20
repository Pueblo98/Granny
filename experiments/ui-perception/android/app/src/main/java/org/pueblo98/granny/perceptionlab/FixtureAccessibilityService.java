package org.pueblo98.granny.perceptionlab;

import android.accessibilityservice.AccessibilityService;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.hardware.HardwareBuffer;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.view.accessibility.AccessibilityWindowInfo;

/** Explicit one-shot fixture-only observation. No event-driven collection or executor. */
public final class FixtureAccessibilityService extends AccessibilityService {
    public static final String PACKAGE = "org.pueblo98.granny.perceptionlab";
    private static FixtureAccessibilityService instance;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final CaptureFence fence = new CaptureFence();
    private Callback callback;

    public interface Callback {
        void complete(ScreenMap map, Bitmap image, ScreenMap.Box windowBounds);
        void unavailable(String reason);
    }
    public static FixtureAccessibilityService current() { return instance; }
    @Override protected void onServiceConnected() { instance = this; }

    public void inspect(Rect fixture, Callback sink) {
        if (fence.pending()) { sink.unavailable("An observation is already pending."); return; }
        AccessibilityNodeInfo root = getRootInActiveWindow();
        if (root == null || !PACKAGE.contentEquals(root.getPackageName() == null ? "" : root.getPackageName())) {
            sink.unavailable("Only this lab's active fixture can be inspected."); return;
        }
        if (getMagnificationController().getScale() != 1f) {
            sink.unavailable("Magnified coordinate mapping has not been validated."); return;
        }
        AccessibilityWindowInfo window = root.getWindow();
        if (window == null || !window.isActive()) { sink.unavailable("Active window unavailable."); return; }
        Rect windowRect = new Rect(); window.getBoundsInScreen(windowRect);
        if (fixture.isEmpty() || !windowRect.contains(fixture)) { sink.unavailable("Fixture geometry unavailable."); return; }
        final ScreenMap map;
        try { map = new NativeSnapshotReader().read(root, fixture, SystemClock.elapsedRealtime()); }
        catch (IllegalArgumentException error) { sink.unavailable("Sensitive, incomplete or unsupported semantics; capture withheld."); return; }
        final ScreenMap.Box windowBox = new ScreenMap.Box(windowRect.left, windowRect.top, windowRect.right, windowRect.bottom);
        final long token = fence.begin(map.capturedAt, map.windowId);
        callback = sink;
        main.postDelayed(() -> {
            if (callback == sink && fence.pending()) fail("Observation timed out; try a fresh explicit request.");
        }, 2000);
        try {
            takeScreenshotOfWindow(map.windowId, getMainExecutor(), new TakeScreenshotCallback() {
                @Override public void onSuccess(ScreenshotResult result) {
                    HardwareBuffer buffer = result.getHardwareBuffer();
                    Bitmap image = null;
                    try {
                        AccessibilityNodeInfo current = getRootInActiveWindow();
                        if (current == null || !PACKAGE.contentEquals(current.getPackageName() == null ? "" : current.getPackageName())
                                || !fence.accepts(token, SystemClock.elapsedRealtime(), current.getWindowId())) return;
                        AccessibilityWindowInfo currentWindow = current.getWindow();
                        Rect currentRect = new Rect();
                        if (currentWindow == null || !currentWindow.isActive()) return;
                        currentWindow.getBoundsInScreen(currentRect);
                        if (!windowRect.equals(currentRect)) { fail("Window changed; result withheld."); return; }
                        if (buffer.getWidth() > 4096 || buffer.getHeight() > 4096
                                || (long) buffer.getWidth() * buffer.getHeight() > 8_000_000) {
                            fail("Capture exceeds the lab image budget."); return;
                        }
                        Bitmap wrapped = Bitmap.wrapHardwareBuffer(buffer, result.getColorSpace());
                        if (wrapped == null) { fail("Capture unavailable."); return; }
                        try { image = wrapped.copy(Bitmap.Config.ARGB_8888, true); }
                        finally { wrapped.recycle(); }
                        if (image == null || !fence.finish(token, SystemClock.elapsedRealtime(), current.getWindowId())) return;
                        Callback target = callback; callback = null; main.removeCallbacksAndMessages(null);
                        if (target != null) { target.complete(map, image, windowBox); image = null; }
                    } finally {
                        buffer.close();
                        if (image != null) image.recycle();
                    }
                }
                @Override public void onFailure(int errorCode) {
                    if (fence.accepts(token, SystemClock.elapsedRealtime(), map.windowId)) fail("Capture unavailable or protected. No image retained.");
                }
            });
        } catch (RuntimeException error) { fail("Capture could not start."); }
    }

    public void stop() { fence.stop(); callback = null; main.removeCallbacksAndMessages(null); }
    private void fail(String reason) { Callback target = callback; stop(); if (target != null) target.unavailable(reason); }
    @Override public void onAccessibilityEvent(AccessibilityEvent event) {
        // Events only invalidate pending observations. Their payload is never collected.
        if (fence.pending()) fail("UI changed during observation; request a fresh map.");
    }
    @Override public void onInterrupt() { fail("Accessibility observation interrupted."); }
    @Override public void onDestroy() { fail("Accessibility observation ended."); instance = null; super.onDestroy(); }
}
