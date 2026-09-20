package org.pueblo98.stage1.voice;

/** One explicitly activated foreground turn, spanning bounded recognizer segments. */
public final class DictationSession {
    public static final long MAX_MILLIS = 30_000;
    public static final int MAX_SEGMENTS = 8;
    public enum Result { STALE, CONTINUE, COMPLETE }
    private long turn, segment = -1, deadline;
    private int segments;
    private boolean active, done, segmentOpen;
    private String draft = "", partial = "", original = "";

    public long begin(String existingDraft, long now) {
        clear(); draft = existingDraft == null ? "" : existingDraft; original = draft;
        active = true; deadline = now + MAX_MILLIS;
        return turn;
    }
    public boolean beginSegment(long expectedTurn, long generation, long now) {
        if (expectedTurn != turn || !active || done || segmentOpen || now >= deadline
                || segments >= MAX_SEGMENTS) return false;
        segment = generation; segmentOpen = true; partial = "";
        return true;
    }
    public boolean partial(long generation, String text) {
        if (!active || !segmentOpen || generation != segment || done) return false;
        partial = text == null ? "" : text; return true;
    }
    public Result finalSegment(long generation, String text, long now) {
        if (!active || !segmentOpen || generation != segment) return Result.STALE;
        if (now >= deadline) { finish(); return Result.COMPLETE; }
        segmentOpen = false; segments++;
        String words = text == null ? "" : text;
        if (!words.isBlank()) { draft = join(draft, words); partial = ""; }
        else { finish(); return Result.COMPLETE; }
        if (done || segments >= MAX_SEGMENTS || tooLong(draft)) {
            finish(); return Result.COMPLETE;
        }
        return Result.CONTINUE;
    }
    public boolean requestDone() {
        if (!active) return false;
        done = true; return segmentOpen;
    }
    /** Only finalized segments enter the draft; provisional words are discarded on interruption. */
    public String finish() {
        partial = "";
        active = false; segmentOpen = false; done = true; segment = -1;
        return draft;
    }
    public String originalDraft() { return original; }
    public boolean shouldPrompt() { return active && segments == 0 && partial.isBlank(); }
    public long promptRemaining(long now) { return Math.max(0, deadline - MAX_MILLIS + 10_000 - now); }
    public String visibleText() { return join(draft, partial); }
    public boolean active() { return active; }
    public long deadline() { return deadline; }
    public long turn() { return turn; }
    public long remaining(long now) { return Math.max(0, deadline - now); }
    public void clear() {
        turn++; segment = -1; segments = 0; active = false; done = false;
        segmentOpen = false; draft = ""; partial = ""; original = ""; deadline = 0;
    }
    private static boolean tooLong(String text) { return text.codePointCount(0, text.length()) > 4096; }
    private static String join(String before, String after) {
        if (after.isBlank()) return before;
        if (before.isEmpty()) return after;
        return before + (Character.isWhitespace(before.charAt(before.length()-1))
                || Character.isWhitespace(after.charAt(0)) ? "" : " ") + after;
    }
}
