package org.pueblo98.granny.c2observer;

import java.nio.ByteBuffer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public final class FrameSampleTest {
    @Test
    public void markerBandExcludesTheRestOfTheFrame() {
        int width = 120;
        int height = 120;
        int pixelStride = 4;
        int rowStride = width * pixelStride;
        ByteBuffer rgba = ByteBuffer.allocate(rowStride * height);

        fill(rgba, width, height, rowStride, 220, 20, 20);
        fillRegion(rgba, width / 4, height / 12, (3 * width) / 4, height / 4,
                rowStride, 11, 110, 79);

        FrameSample sample = FrameSample.fromMarkerBandRgba(
                rgba, width, height, pixelStride, rowStride, 8);

        assertEquals(11, sample.red);
        assertEquals(110, sample.green);
        assertEquals(79, sample.blue);
        assertEquals(64, sample.sampleCount);
    }

    @Test
    public void invalidMarkerBandGeometryIsRejected() {
        assertThrowsIllegalArgument(() -> FrameSample.fromMarkerBandRgba(
                ByteBuffer.allocate(4), 0, 1, 4, 4, 1));
    }

    private void fill(
            ByteBuffer buffer,
            int width,
            int height,
            int rowStride,
            int red,
            int green,
            int blue) {
        fillRegion(buffer, 0, 0, width, height, rowStride, red, green, blue);
    }

    private void fillRegion(
            ByteBuffer buffer,
            int left,
            int top,
            int right,
            int bottom,
            int rowStride,
            int red,
            int green,
            int blue) {
        for (int y = top; y < bottom; y++) {
            for (int x = left; x < right; x++) {
                int offset = y * rowStride + x * 4;
                buffer.put(offset, (byte) red);
                buffer.put(offset + 1, (byte) green);
                buffer.put(offset + 2, (byte) blue);
                buffer.put(offset + 3, (byte) 255);
            }
        }
    }

    private void assertThrowsIllegalArgument(Runnable action) {
        boolean threw = false;
        try {
            action.run();
        } catch (IllegalArgumentException expected) {
            threw = true;
        }
        assertTrue(threw);
    }
}
