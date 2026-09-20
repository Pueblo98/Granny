package org.pueblo98.granny.perceptionlab;

/** Pure one-shot generation fence. Main-thread owner in Android; no async authority. */
public final class CaptureFence {
    private long generation;
    private long started;
    private int window;
    private boolean pending;

    public long begin(long now, int windowId) {
        if (pending || now < 0 || windowId < 0) return -1;
        pending = true;
        started = now;
        window = windowId;
        return ++generation;
    }

    public boolean accepts(long token, long now, int windowId) {
        return pending && token == generation && windowId == window
                && now >= started && now - started <= 2000;
    }

    public boolean finish(long token, long now, int windowId) {
        if (!accepts(token, now, windowId)) return false;
        pending = false;
        return true;
    }

    public void stop() { pending = false; generation++; }
    public boolean pending() { return pending; }
}
