package org.pueblo98.granny.perceptionlab;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/** Platform-independent geometry and reference lookup. Never an action object. */
public final class ScreenMap {
    public static final class Box {
        public final int left, top, right, bottom;
        public Box(int l, int t, int r, int b) {
            if (r <= l || b <= t) throw new IllegalArgumentException("empty bounds");
            left = l; top = t; right = r; bottom = b;
        }
        public int width() { return right - left; }
        public int height() { return bottom - top; }
        public boolean contains(Box b) {
            return b.left >= left && b.top >= top && b.right <= right && b.bottom <= bottom;
        }
    }

    public static final class Element {
        public final String label, role;
        public final Box bounds;
        public final boolean enabled, clickable;
        public Element(String label, String role, Box bounds, boolean enabled, boolean clickable) {
            if (label == null || label.length() > 4096) throw new IllegalArgumentException("label");
            this.label = label; this.role = role; this.bounds = bounds;
            this.enabled = enabled; this.clickable = clickable && enabled;
        }
    }

    public final String observationId;
    public final long capturedAt;
    public final int windowId;
    public final List<Element> elements;

    public ScreenMap(String id, long time, int window, List<Element> entries) {
        if (entries.size() > 512) throw new IllegalArgumentException("too many elements");
        observationId = id; capturedAt = time; windowId = window;
        ArrayList<Element> sorted = new ArrayList<>(entries);
        sorted.sort(Comparator.comparingInt((Element e) -> e.bounds.top).thenComparingInt(e -> e.bounds.left));
        elements = List.copyOf(sorted);
    }

    public String lookup(String label, long now, int currentWindow) {
        if (now < capturedAt || now - capturedAt > 2000 || currentWindow != windowId) return "stale";
        List<Element> matches = new ArrayList<>();
        for (Element element : elements) if (normalize(element.label).equals(normalize(label))) matches.add(element);
        if (matches.isEmpty()) return "not-found";
        if (matches.size() > 1) return "ambiguous";
        return matches.get(0).enabled ? "observed-only" : "unavailable";
    }

    private static String normalize(String text) { return text.strip().toLowerCase(Locale.ROOT).replaceAll("\\s+", " "); }

    public static Box toImage(Box screen, Box window, int width, int height) {
        if (width <= 0 || height <= 0 || width > 4096 || height > 4096 || !window.contains(screen))
            throw new IllegalArgumentException("unsupported geometry");
        double sx = (double) width / window.width(), sy = (double) height / window.height();
        return new Box((int) Math.floor((screen.left - window.left) * sx),
                (int) Math.floor((screen.top - window.top) * sy),
                (int) Math.ceil((screen.right - window.left) * sx),
                (int) Math.ceil((screen.bottom - window.top) * sy));
    }
}
