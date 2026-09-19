package org.pueblo98.stage1.voice;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public final class TranscriptCleanerTest {
    @Test
    public void collapsesWhitespaceAndRepairsSafePunctuationSpacing() {
        assertEquals(
                "Please call María, tomorrow! Thanks.",
                TranscriptCleaner.clean("  Please\tcall María ,tomorrow !   Thanks.  "));
    }

    @Test
    public void preservesWordsNamesNumbersAndDates() {
        assertEquals(
                "Send 42 euros to O'Connor on 20/09/2026",
                TranscriptCleaner.clean("Send 42 euros to O'Connor on 20/09/2026"));
    }

    @Test
    public void isIdempotentAndHandlesEmptyInput() {
        String once = TranscriptCleaner.clean("Hola;mañana");
        assertEquals("Hola; mañana", once);
        assertEquals(once, TranscriptCleaner.clean(once));
        assertEquals("", TranscriptCleaner.clean(null));
        assertEquals("", TranscriptCleaner.clean(" \n "));
    }
}
