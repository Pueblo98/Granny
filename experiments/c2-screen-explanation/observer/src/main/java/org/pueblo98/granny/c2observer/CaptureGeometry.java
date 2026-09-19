package org.pueblo98.granny.c2observer;

/** Pure bounds and transition guard for capture-surface allocation. */
final class CaptureGeometry {
    enum Decision { INITIALIZE, RESIZE, UNCHANGED, INVALID }

    private static final int MAX_DIMENSION = 4_096;
    private static final long MAX_PIXELS = 8_388_608L;

    private int width;
    private int height;

    Decision update(int candidateWidth, int candidateHeight) {
        if (!isAllowed(candidateWidth, candidateHeight)) {
            return Decision.INVALID;
        }
        if (width == candidateWidth && height == candidateHeight) {
            return Decision.UNCHANGED;
        }
        Decision decision = width == 0 ? Decision.INITIALIZE : Decision.RESIZE;
        width = candidateWidth;
        height = candidateHeight;
        return decision;
    }

    private boolean isAllowed(int candidateWidth, int candidateHeight) {
        if (candidateWidth <= 0 || candidateHeight <= 0
                || candidateWidth > MAX_DIMENSION || candidateHeight > MAX_DIMENSION) {
            return false;
        }
        return (long) candidateWidth * candidateHeight <= MAX_PIXELS;
    }
}
