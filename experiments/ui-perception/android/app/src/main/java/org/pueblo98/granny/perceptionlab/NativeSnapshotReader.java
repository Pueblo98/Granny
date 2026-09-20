package org.pueblo98.granny.perceptionlab;

import android.graphics.Rect;
import android.view.accessibility.AccessibilityNodeInfo;
import java.util.ArrayList;
import java.util.List;

/** Traverses only the explicit lab window, bounded by fixture geometry. */
public final class NativeSnapshotReader {
    private final List<ScreenMap.Element> entries = new ArrayList<>();
    private int visited;

    public ScreenMap read(AccessibilityNodeInfo root, Rect fixture, long now) {
        entries.clear(); visited = 0;
        if (!root.refresh() || !root.isVisibleToUser()) throw new IllegalArgumentException("obsolete or invisible root");
        visit(root, fixture, 0, true);
        return new ScreenMap("obs-" + java.util.UUID.randomUUID(), now, root.getWindowId(), entries);
    }

    private void visit(AccessibilityNodeInfo node, Rect fixture, int depth, boolean parentVisible) {
        if (++visited > 512 || depth > 32) throw new IllegalArgumentException("tree limit");
        if (!node.refresh()) throw new IllegalArgumentException("obsolete node");
        if (!FixtureAccessibilityService.PACKAGE.contentEquals(node.getPackageName() == null ? "" : node.getPackageName()))
            throw new IllegalArgumentException("unsupported package");
        if (node.isPassword() || node.isAccessibilityDataSensitive()) throw new IllegalArgumentException("sensitive node");
        boolean visible = parentVisible && node.isVisibleToUser();
        Rect box = new Rect(); node.getBoundsInScreen(box);
        CharSequence description = node.getContentDescription(), text = node.getText();
        String label = description != null && description.length() > 0 ? description.toString() : text == null ? "" : text.toString();
        String className = node.getClassName() == null ? "" : node.getClassName().toString();
        String role = switch (className.substring(className.lastIndexOf('.') + 1)) {
            case "Button", "ImageButton" -> "button";
            case "EditText" -> "text_input";
            case "Switch" -> "switch";
            case "CheckBox" -> "checkbox";
            case "TextView" -> "text";
            case "ImageView" -> "image";
            default -> "unknown";
        };
        if (visible && !box.isEmpty() && fixture.contains(box) && (!label.isEmpty() || node.isClickable())) {
            entries.add(new ScreenMap.Element(label, role,
                    new ScreenMap.Box(box.left, box.top, box.right, box.bottom), node.isEnabled(), node.isClickable()));
        }
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child == null) throw new IllegalArgumentException("incomplete children");
            visit(child, fixture, depth + 1, visible);
        }
    }
}
