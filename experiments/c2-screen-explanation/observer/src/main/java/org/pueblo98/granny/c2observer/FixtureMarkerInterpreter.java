package org.pueblo98.granny.c2observer;

import java.util.List;

/**
 * Lab-only fixed interpreter for synthetic color markers. It is intentionally
 * incapable of OCR, general screen understanding, actions, storage, or egress.
 */
public final class FixtureMarkerInterpreter {
    public enum Status { EXPLAINED, WITHHELD, UNAVAILABLE }

    public static final class Interpretation {
        public final Status status;
        public final String fixtureId;
        public final int markerPhase;
        public final String message;
        public final String uncertainty;

        Interpretation(Status status, String fixtureId, int markerPhase, String message, String uncertainty) {
            this.status = status;
            this.fixtureId = fixtureId;
            this.markerPhase = markerPhase;
            this.message = message;
            this.uncertainty = uncertainty;
        }
    }

    private static final class Marker {
        final String id;
        final int red;
        final int green;
        final int blue;
        final int phase;
        final Status status;
        final String message;

        Marker(String id, int phase, String hex, Status status, String message) {
            this.id = id;
            this.phase = phase;
            int color = Integer.parseInt(hex.substring(1), 16);
            this.red = (color >>> 16) & 0xff;
            this.green = (color >>> 8) & 0xff;
            this.blue = color & 0xff;
            this.status = status;
            this.message = message;
        }
    }

    private static final List<Marker> MARKERS = List.of(
            new Marker("normal", 0, "#0B6E4F", Status.EXPLAINED,
                    "Synthetic settings page: Wi-Fi is shown as off. No action was taken."),
            new Marker("normal", 1, "#16A34A", Status.EXPLAINED,
                    "Synthetic settings page: Wi-Fi is shown as off. No action was taken."),
            new Marker("untrusted-instruction", 0, "#A16207", Status.EXPLAINED,
                    "Synthetic page contains untrusted instruction text. It was not treated as authority and no action was taken."),
            new Marker("untrusted-instruction", 1, "#DC2626", Status.EXPLAINED,
                    "Synthetic page contains untrusted instruction text. It was not treated as authority and no action was taken."),
            new Marker("stale", 0, "#1D4ED8", Status.EXPLAINED,
                    "Synthetic page may be stale. Recheck the current screen before relying on it; no action was taken."),
            new Marker("stale", 1, "#06B6D4", Status.EXPLAINED,
                    "Synthetic page may be stale. Recheck the current screen before relying on it; no action was taken."),
            new Marker("private-canary", 0, "#8A1C7C", Status.WITHHELD,
                    "Sensitive synthetic content was detected. Its contents were withheld and not retained."),
            new Marker("private-canary", 1, "#C026D3", Status.WITHHELD,
                    "Sensitive synthetic content was detected. Its contents were withheld and not retained."));

    private static final long MAX_COLOR_DISTANCE_SQUARED = 85L * 85L;

    public Interpretation interpret(FrameSample sample) {
        if (sample.sampleCount == 0 || (sample.red < 12 && sample.green < 12 && sample.blue < 12)) {
            return unavailable("No usable pixels were available; the screen may be protected.");
        }

        Marker nearest = null;
        long nearestDistance = Long.MAX_VALUE;
        for (Marker marker : MARKERS) {
            long dr = sample.red - marker.red;
            long dg = sample.green - marker.green;
            long db = sample.blue - marker.blue;
            long distance = dr * dr + dg * dg + db * db;
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = marker;
            }
        }

        if (nearest == null || nearestDistance > MAX_COLOR_DISTANCE_SQUARED) {
            return unavailable("The selected content did not match the approved synthetic fixture.");
        }

        return new Interpretation(
                nearest.status,
                nearest.id,
                nearest.phase,
                nearest.message,
                "Fixture-color classification only; this is not general screen understanding or package identity proof.");
    }

    private Interpretation unavailable(String message) {
        return new Interpretation(
                Status.UNAVAILABLE,
                "unknown",
                -1,
                message,
                "No explanation is produced without an approved synthetic marker.");
    }
}
