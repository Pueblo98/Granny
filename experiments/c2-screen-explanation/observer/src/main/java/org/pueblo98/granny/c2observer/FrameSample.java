package org.pueblo98.granny.c2observer;

import java.nio.ByteBuffer;

/** A deliberately lossy 16x16-or-smaller color summary; no screenshot is retained. */
public final class FrameSample {
    public final int red;
    public final int green;
    public final int blue;
    public final int lumaRange;
    public final int sampleCount;

    public FrameSample(int red, int green, int blue, int lumaRange, int sampleCount) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.lumaRange = lumaRange;
        this.sampleCount = sampleCount;
    }

    public static FrameSample fromSolidArgb(int argb, int count) {
        return new FrameSample(
                (argb >>> 16) & 0xff,
                (argb >>> 8) & 0xff,
                argb & 0xff,
                0,
                count);
    }

    public static FrameSample fromRgba(
            ByteBuffer buffer,
            int width,
            int height,
            int pixelStride,
            int rowStride,
            int gridSize) {
        return fromRgbaRegion(
                buffer,
                width,
                height,
                pixelStride,
                rowStride,
                gridSize,
                0,
                0,
                width,
                height);
    }

    /** Samples only the fixture's centered upper marker band. */
    public static FrameSample fromMarkerBandRgba(
            ByteBuffer buffer,
            int width,
            int height,
            int pixelStride,
            int rowStride,
            int gridSize) {
        return fromRgbaRegion(
                buffer,
                width,
                height,
                pixelStride,
                rowStride,
                gridSize,
                width / 4,
                height / 12,
                Math.max(width / 4 + 1, (3 * width) / 4),
                Math.max(height / 12 + 1, height / 4));
    }

    private static FrameSample fromRgbaRegion(
            ByteBuffer buffer,
            int width,
            int height,
            int pixelStride,
            int rowStride,
            int gridSize,
            int left,
            int top,
            int right,
            int bottom) {
        if (width <= 0 || height <= 0 || pixelStride < 4 || rowStride <= 0 || gridSize <= 0
                || left < 0 || top < 0 || right <= left || bottom <= top
                || right > width || bottom > height) {
            throw new IllegalArgumentException("invalid frame geometry");
        }

        long red = 0;
        long green = 0;
        long blue = 0;
        int minLuma = 255;
        int maxLuma = 0;
        int count = 0;

        for (int gy = 0; gy < gridSize; gy++) {
            int y = Math.min(bottom - 1,
                    top + ((2 * gy + 1) * (bottom - top)) / (2 * gridSize));
            for (int gx = 0; gx < gridSize; gx++) {
                int x = Math.min(right - 1,
                        left + ((2 * gx + 1) * (right - left)) / (2 * gridSize));
                int offset = y * rowStride + x * pixelStride;
                if (offset < 0 || offset + 2 >= buffer.limit()) {
                    continue;
                }
                int r = buffer.get(offset) & 0xff;
                int g = buffer.get(offset + 1) & 0xff;
                int b = buffer.get(offset + 2) & 0xff;
                int luma = (299 * r + 587 * g + 114 * b) / 1000;
                red += r;
                green += g;
                blue += b;
                minLuma = Math.min(minLuma, luma);
                maxLuma = Math.max(maxLuma, luma);
                count += 1;
            }
        }

        if (count == 0) {
            return new FrameSample(0, 0, 0, 0, 0);
        }
        return new FrameSample(
                (int) (red / count),
                (int) (green / count),
                (int) (blue / count),
                maxLuma - minLuma,
                count);
    }
}
