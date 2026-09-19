package org.pueblo98.stage1.voice;

import java.util.Collections;
import java.util.List;

/** Selects Android final hypotheses without treating alternatives as cleanup output. */
public final class TranscriptHypotheses {
    public final String raw;
    public final String display;

    private TranscriptHypotheses(String raw, String display) {
        this.raw = raw;
        this.display = display;
    }

    public static TranscriptHypotheses select(
            List<String> hypotheses, boolean formattedPairRequested) {
        List<String> values = hypotheses == null ? Collections.emptyList() : hypotheses;
        String first = values.isEmpty() || values.get(0) == null ? "" : values.get(0);
        String raw = first;
        String displayCandidate = first;

        if (formattedPairRequested && values.size() >= 2) {
            String second = values.get(1);
            if (second != null && !second.isBlank()) {
                raw = second;
            }
            if (displayCandidate.isBlank()) {
                displayCandidate = raw;
            }
        }

        return new TranscriptHypotheses(raw, TranscriptCleaner.clean(displayCandidate));
    }
}
