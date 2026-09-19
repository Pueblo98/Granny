package org.pueblo98.stage1.voice;

import java.util.regex.Pattern;

/** Conservative, deterministic formatting that does not add or remove words. */
public final class TranscriptCleaner {
    private static final Pattern WHITESPACE = Pattern.compile("[\\p{Z}\\s]+");
    private static final Pattern BEFORE_PUNCTUATION = Pattern.compile("\\s+([,!?;:.])");
    private static final Pattern MISSING_SAFE_SPACE =
            Pattern.compile("([,!?;])(?=[\\p{L}])");

    private TranscriptCleaner() {}

    public static String clean(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        String result = WHITESPACE.matcher(input).replaceAll(" ").trim();
        result = BEFORE_PUNCTUATION.matcher(result).replaceAll("$1");
        return MISSING_SAFE_SPACE.matcher(result).replaceAll("$1 ");
    }
}
