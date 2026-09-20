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
    @Test public void unlabeledControlCannotBecomeNamedReference() {
        ScreenMap.Element unlabeled = new ScreenMap.Element("", "button", new ScreenMap.Box(1, 1, 20, 20), true, true);
        ScreenMap map = new ScreenMap("fixture", 100, 4, List.of(unlabeled));
        assertEquals(1, map.unlabeledControls());
        assertEquals("unavailable", map.lookup("  ", 101, 4));
        assertEquals("unavailable", map.lookup(null, 101, 4));
        assertEquals("not-found", map.lookup("Add", 101, 4));
    }
    @Test public void absentCanvasSemanticsRemainAbsent() {
        ScreenMap map = new ScreenMap("fixture", 100, 4, List.of());
        assertEquals("not-found", map.lookup("Text size", 101, 4));
        assertEquals("not-found", map.lookup("Canvas note: larger words", 101, 4));
        assertEquals(0, map.unlabeledControls());
    }
    @Test public void emptyThenPopulatedCaptureIsRejected() {
        ScreenMap empty = new ScreenMap("before", 100, 4, List.of());
        ScreenMap filled = new ScreenMap("after", 101, 4, List.of(element(false)));
        assertFalse(empty.sameSemantics(filled));
        assertFalse(filled.sameSemantics(empty));
    }
    @Test public void stableContentIgnoresTransientObservationIdentity() {
        ScreenMap before = new ScreenMap("before", 100, 4, List.of(element(false)));
        assertTrue(before.sameSemantics(new ScreenMap("after", 101, 4, List.of(element(false)))));
        assertTrue(new ScreenMap("a", 100, 4, List.of()).sameSemantics(new ScreenMap("b", 101, 4, List.of())));
    }
    @Test public void changedEnabledStateWindowOrLabelRejectsCapture() {
        ScreenMap before = new ScreenMap("before", 100, 4, List.of(element(true)));
        assertFalse(before.sameSemantics(new ScreenMap("after", 101, 4, List.of(element(false)))));
        assertFalse(before.sameSemantics(new ScreenMap("after", 101, 5, List.of(element(true)))));
        ScreenMap.Element changed = new ScreenMap.Element("Send", "button", element(true).bounds, true, true);
        assertFalse(before.sameSemantics(new ScreenMap("after", 101, 4, List.of(changed))));
        assertFalse(before.sameSemantics(null));
    }
    @Test public void changedGeometryRoleOrClickabilityRejectsCapture() {
        ScreenMap.Element e = element(true);
        ScreenMap before = new ScreenMap("before", 100, 4, List.of(e));
        for (ScreenMap.Element changed : List.of(
                new ScreenMap.Element(e.label, e.role, new ScreenMap.Box(11, 20, 100, 60), true, true),
                new ScreenMap.Element(e.label, "text", e.bounds, true, true),
                new ScreenMap.Element(e.label, e.role, e.bounds, true, false))) {
            assertFalse(before.sameSemantics(new ScreenMap("after", 101, 4, List.of(changed))));
        }
    }
}
