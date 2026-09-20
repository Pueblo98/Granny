package org.pueblo98.stage1.speech;

/** Closed speech-rate choices from the Stage 1 design contract. */
public enum SpeechRate {
    SLOWER(0.75f, "Slower"),
    NORMAL(1.0f, "Normal"),
    FASTER(1.25f, "Faster"),
    FASTEST(1.5f, "Fastest");

    private final float multiplier;
    private final String label;

    SpeechRate(float multiplier, String label) {
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
