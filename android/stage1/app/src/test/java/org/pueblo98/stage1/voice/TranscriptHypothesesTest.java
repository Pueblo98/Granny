package org.pueblo98.stage1.voice;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;
import java.util.Collections;

import org.junit.Test;

public final class TranscriptHypothesesTest {
    @Test
    public void usesFirstHypothesisWhenFormattingWasNotRequested() {
        TranscriptHypotheses result =
                TranscriptHypotheses.select(Arrays.asList("first result", "alternative"), false);
        assertEquals("first result", result.raw);
        assertEquals("first result", result.display);
    }

    @Test
    public void retainsRawPairWhileDisplayingFormattedResult() {
        TranscriptHypotheses result =
                TranscriptHypotheses.select(
                        Arrays.asList("Call Ana, tomorrow.", "call ana tomorrow"), true);
        assertEquals("call ana tomorrow", result.raw);
        assertEquals("Call Ana, tomorrow.", result.display);
    }

    @Test
    public void fallsBackToRawWhenFormattedValueIsBlank() {
        TranscriptHypotheses result =
                TranscriptHypotheses.select(Arrays.asList("", "hello   world"), true);
        assertEquals("hello   world", result.raw);
        assertEquals("hello world", result.display);
    }

    @Test
    public void handlesNoHypotheses() {
        TranscriptHypotheses result = TranscriptHypotheses.select(Collections.emptyList(), true);
        assertEquals("", result.raw);
        assertEquals("", result.display);
    }

    @Test
    public void ignoresFurtherAlternativesAfterFormattedRawPair() {
        TranscriptHypotheses result = TranscriptHypotheses.select(
                Arrays.asList("Hello, Sam.", "hello sam", "yellow sand"), true);
        assertEquals("hello sam", result.raw);
        assertEquals("Hello, Sam.", result.display);
    }
}
