package org.pueblo98.granny.perceptionlab;

import org.junit.Test;
import java.util.List;
import static org.junit.Assert.*;

public class PerceptionTest {
    private ScreenMap.Element element(boolean enabled) {
        return new ScreenMap.Element("Text size", "button", new ScreenMap.Box(10, 20, 100, 60), enabled, true);
    }
    @Test public void stoppedCallbackCannotReturn() {
        CaptureFence fence = new CaptureFence(); long old = fence.begin(100, 4); fence.stop();
        long fresh = fence.begin(101, 4);
        assertFalse(fence.accepts(old, 102, 4)); assertTrue(fence.accepts(fresh, 102, 4));
    }
    @Test public void captureIsOneShotAndWindowBound() {
        CaptureFence fence = new CaptureFence(); long token = fence.begin(100, 4);
        assertEquals(-1, fence.begin(101, 4)); assertFalse(fence.accepts(token, 102, 5));
        assertFalse(fence.accepts(token, 99, 4)); assertFalse(fence.accepts(token, 2101, 4));
        assertTrue(fence.finish(token, 102, 4)); assertFalse(fence.accepts(token, 103, 4));
    }
    @Test public void geometryHandlesWindowOffsetAndScaling() {
        ScreenMap.Box b = ScreenMap.toImage(new ScreenMap.Box(120, 240, 200, 280), new ScreenMap.Box(100, 200, 500, 600), 800, 800);
        assertEquals(40, b.left); assertEquals(80, b.top); assertEquals(200, b.right); assertEquals(160, b.bottom);
    }
    @Test(expected = IllegalArgumentException.class) public void outsideGeometryRejected() {
        ScreenMap.toImage(new ScreenMap.Box(0, 0, 100, 100), new ScreenMap.Box(10, 10, 200, 200), 200, 200);
    }
    @Test public void lookupDoesNotInventOrAuthorize() {
        ScreenMap map = new ScreenMap("fixture", 100, 4, List.of(element(true)));
        assertEquals("observed-only", map.lookup(" TEXT size ", 101, 4));
        assertEquals("not-found", map.lookup("Send", 101, 4));
        assertEquals("stale", map.lookup("Text size", 2101, 4));
        assertEquals("stale", map.lookup("Text size", 101, 5));
    }
    @Test public void duplicateAndDisabledAreNotTargets() {
        assertEquals("ambiguous", new ScreenMap("fixture", 100, 4, List.of(element(true), element(true))).lookup("Text size", 101, 4));
        assertEquals("unavailable", new ScreenMap("fixture", 100, 4, List.of(element(false))).lookup("Text size", 101, 4));
        assertFalse(element(false).clickable);
    }
}
