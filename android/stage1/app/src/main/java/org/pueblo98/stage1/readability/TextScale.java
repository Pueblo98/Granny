package org.pueblo98.stage1.readability;

/** The only text-size choices offered by the bounded Granny-owned C5 setting. */
public enum TextScale {
    DEFAULT(1.0f, "Standard"),
    COMFORTABLE(1.15f, "Larger"),
    LARGE(1.3f, "Larger still"),
    EXTRA_LARGE(1.5f, "Largest");

    private final float multiplier;
    private final String label;

    TextScale(float multiplier, String label) {
        this.multiplier = multiplier;
        this.label = label;
    }

    public float multiplier() {
        return multiplier;
    }

    public String label() {
        return label;
    }
}
