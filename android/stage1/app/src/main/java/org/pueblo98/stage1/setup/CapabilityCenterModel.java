package org.pueblo98.stage1.setup;

import java.util.List;
import java.util.Objects;

/** Pure projection of independently observed app/platform state for the capability center. */
public final class CapabilityCenterModel {
    public enum Tone { READY, NEEDS_ATTENTION, UNAVAILABLE }

    public static final class Input {
        public final boolean microphoneAllowed;
        public final boolean onDeviceRecognizerAvailable;
        public final boolean spokenOutputAvailable;
        public final boolean soundEnabled;
        public final boolean mediaLabEnabled;
        public final int mediaHandlerCount;
        public final String textSize;
        public final String speechRate;

        public Input(boolean microphoneAllowed, boolean onDeviceRecognizerAvailable,
                boolean spokenOutputAvailable, boolean soundEnabled,
                boolean mediaLabEnabled, int mediaHandlerCount,
                String textSize, String speechRate) {
            this.microphoneAllowed = microphoneAllowed;
            this.onDeviceRecognizerAvailable = onDeviceRecognizerAvailable;
            this.spokenOutputAvailable = spokenOutputAvailable;
            this.soundEnabled = soundEnabled;
            this.mediaLabEnabled = mediaLabEnabled;
            this.mediaHandlerCount = Math.max(0, mediaHandlerCount);
            this.textSize = Objects.requireNonNull(textSize);
            this.speechRate = Objects.requireNonNull(speechRate);
        }
    }

    public static final class Row {
        public final String label;
        public final String status;
        public final String detail;
        public final Tone tone;

        private Row(String label, String status, String detail, Tone tone) {
            this.label = label;
            this.status = status;
            this.detail = detail;
            this.tone = tone;
        }
    }

    public final List<Row> rows;
    public final boolean canTryVoice;
    public final boolean canTrySpokenAnswer;

    private CapabilityCenterModel(List<Row> rows, boolean canTryVoice,
            boolean canTrySpokenAnswer) {
        this.rows = List.copyOf(rows);
        this.canTryVoice = canTryVoice;
        this.canTrySpokenAnswer = canTrySpokenAnswer;
    }

    public static CapabilityCenterModel from(Input input) {
        Row talk;
        if (!input.onDeviceRecognizerAvailable) {
            talk = row("Talk", "Unavailable",
                    "This tablet has not reported an available on-device recognizer. Type still works.",
                    Tone.UNAVAILABLE);
        } else if (!input.microphoneAllowed) {
            talk = row("Talk", "Microphone not allowed",
                    "Try voice asks through Android. You can skip it and keep using Type.",
                    Tone.NEEDS_ATTENTION);
        } else {
            talk = row("Talk", "Ready",
                    "Uses Android's available on-device recognizer after you choose Talk.", Tone.READY);
        }

        Row spoken;
        if (!input.spokenOutputAvailable) {
            spoken = row("Spoken answers", "Unavailable",
                    "No installed locale-compatible voice currently reports offline eligibility. Written text remains complete.",
                    Tone.UNAVAILABLE);
        } else if (!input.soundEnabled) {
            spoken = row("Spoken answers", "Sound off",
                    "Turn Sound on to try an answer. Nothing is spoken automatically.",
                    Tone.NEEDS_ATTENTION);
        } else {
            spoken = row("Spoken answers", "Ready",
                    "Uses an installed voice that reports no network requirement. Runtime egress and quality still need device evidence.",
                    Tone.READY);
        }

        Row media;
        if (!input.mediaLabEnabled) {
            media = row("Music handoff", "Not available in this build",
                    "Candidate builds keep this route disabled until device and provider evidence is accepted.",
                    Tone.UNAVAILABLE);
        } else if (input.mediaHandlerCount == 0) {
            media = row("Music handoff", "No compatible app found",
                    "Android reported no app for the play-from-search handoff. Nothing can be opened.",
                    Tone.UNAVAILABLE);
        } else {
            media = row("Music handoff", "Evidence lab only",
                    input.mediaHandlerCount + (input.mediaHandlerCount == 1 ? " compatible app is" : " compatible apps are")
                            + " visible. Granny can request playback, but cannot verify or pause it.",
                    Tone.NEEDS_ATTENTION);
        }

        return new CapabilityCenterModel(List.of(
                row("Type", "Ready", "Type works without microphone access or spoken output.", Tone.READY),
                talk,
                spoken,
                row("Granny text size", input.textSize,
                        "This changes Granny only, not Android or other apps.", Tone.READY),
                row("Speech speed", input.speechRate,
                        "Preview a closed speed choice before applying it.", Tone.READY),
                media,
                row("Messages and screen help", "Not available in this build",
                        "These external routes remain under evidence review. This app will not send messages or inspect another app.",
                        Tone.UNAVAILABLE)),
                input.onDeviceRecognizerAvailable,
                input.spokenOutputAvailable && input.soundEnabled);
    }

    private static Row row(String label, String status, String detail, Tone tone) {
        return new Row(label, status, detail, tone);
    }
}
