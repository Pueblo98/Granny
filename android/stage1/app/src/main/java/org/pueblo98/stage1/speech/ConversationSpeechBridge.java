package org.pueblo98.stage1.speech;

/** Main-thread bridge: explicit output, exact visible revision, and input/output exclusion. */
public final class ConversationSpeechBridge implements SpeechOutputAdapter.Listener {
    public interface Focus { boolean acquire(); void release(); }
    private final SpeechOutputController output;
    private final SpeechSettingsController settings;
    private final SpeechOutputAdapter adapter;
    private final SpeechOutputAdapter.Listener platformListener;
    private final Focus focus;
    private final Runnable stopInput;
    private String visible = "";
    private long revision;
    private boolean foreground, screenReader;
    private SpeechRate previewRate;
    public ConversationSpeechBridge(SpeechOutputController output, SpeechSettingsController settings,
            SpeechOutputAdapter adapter, SpeechOutputAdapter.Listener platformListener,
            Focus focus, Runnable stopInput) {
        this.output = output; this.settings = settings; this.adapter = adapter;
        this.platformListener = platformListener == null ? this : platformListener;
        this.focus = focus; this.stopInput = stopInput;
    }
    public void visibleText(String text) {
        if (visible.equals(text)) return;
        visible = text; revision++;
        if (output.contentChanged(revision)) { adapter.stop(); focus.release(); }
    }
    public void environment(boolean foreground, boolean screenReader) {
        this.foreground = foreground; this.screenReader = screenReader;
        if (!foreground || screenReader) stop();
        if (!foreground) { output.clear(); visible = ""; revision++; }
    }
    public boolean available() {
        return foreground && !screenReader && settings.snapshot().soundEnabled
                && adapter.availability() == SpeechOutputAdapter.Availability.AVAILABLE;
    }
    public boolean canRepeat() { return available() && output.snapshot().canRepeat; }
    public boolean read() {
        if (!available()) return false;
        return start(output.beginReadback(visible, revision, settings.snapshot().currentRate.multiplier()));
    }
    public boolean repeat() {
        if (!available()) return false;
        return start(output.repeat(revision, settings.snapshot().currentRate.multiplier()));
    }
    public boolean preview(SpeechRate rate) {
        stop();
        if (!available() || !settings.preview(rate)) return false;
        previewRate = rate;
        return start(output.beginRatePreview("This is how Granny will sound at " + rate.label() + " speed.", rate.multiplier()));
    }
    private boolean start(SpeechOutputController.Request request) {
        if (request == null) return false;
        stopInput.run();
        if (!focus.acquire()) {
            output.error(request.generation, "Audio is busy. The written text remains available.");
            return false;
        }
        boolean accepted;
        try { accepted = adapter.speak(request.generation, request.exactText, request.rate, platformListener); }
        catch (RuntimeException unavailable) { accepted = false; }
        if (!accepted) {
            output.error(request.generation, "Spoken readback could not start. Continue with the written text.");
            adapter.stop(); focus.release();
        }
        return accepted;
    }
    public void stop() {
        output.stop("Speech stopped. The text remains on screen.");
        previewRate = null; settings.cancelPreview();
        adapter.stop(); focus.release();
    }
    public void sound(boolean enabled) { stop(); settings.setSoundEnabled(enabled); }
    public void onAvailabilityChanged(SpeechOutputAdapter.Availability availability, String explanation) {
        output.availabilityChanged(availability == SpeechOutputAdapter.Availability.AVAILABLE, explanation);
        if (availability != SpeechOutputAdapter.Availability.AVAILABLE) { adapter.stop(); focus.release(); }
    }
    public void onStarted(long generation) { output.started(generation); }
    public void onCompleted(long generation) {
        if (!output.completed(generation)) return;
        if (output.snapshot().purpose == SpeechOutputController.Purpose.RATE_PREVIEW && previewRate != null) {
            settings.markPreviewHeard(previewRate);
        }
        previewRate = null; focus.release();
    }
    public void onStopped(long generation) {
        if (output.stopped(generation)) { previewRate = null; settings.cancelPreview(); focus.release(); }
    }
    public void onError(long generation, String reason) {
        if (output.error(generation, reason)) { previewRate = null; settings.cancelPreview(); focus.release(); }
    }
}
