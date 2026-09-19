package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public final class CaptureGeometryTest {
    @Test
    public void firstAllowedSizeInitializesAndRepeatIsUnchanged() {
        CaptureGeometry geometry = new CaptureGeometry();

        assertEquals(CaptureGeometry.Decision.INITIALIZE, geometry.update(2560, 1600));
        assertEquals(CaptureGeometry.Decision.UNCHANGED, geometry.update(2560, 1600));
    }

    @Test
    public void changedAllowedSizeRequiresResize() {
        CaptureGeometry geometry = new CaptureGeometry();
        geometry.update(2560, 1600);

        assertEquals(CaptureGeometry.Decision.RESIZE, geometry.update(1600, 2560));
    }

    @Test
    public void invalidOrExcessiveGeometryFailsClosedWithoutChangingState() {
        CaptureGeometry geometry = new CaptureGeometry();
        geometry.update(2560, 1600);

        assertEquals(CaptureGeometry.Decision.INVALID, geometry.update(0, 1600));
        assertEquals(CaptureGeometry.Decision.INVALID, geometry.update(4097, 1600));
        assertEquals(CaptureGeometry.Decision.INVALID, geometry.update(4096, 4096));
        assertEquals(CaptureGeometry.Decision.UNCHANGED, geometry.update(2560, 1600));
    }
}
