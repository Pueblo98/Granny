package org.pueblo98.stage1.speech;

import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/** Explicit-only Android TTS adapter that refuses voices requiring a network connection. */
public final class AndroidTextToSpeechOutput implements SpeechOutputAdapter {
    private static final String UTTERANCE_PREFIX = "granny-readback-";

    private final Listener availabilityListener;
    private final ConcurrentHashMap<String, Binding> generations = new ConcurrentHashMap<>();
    private TextToSpeech engine;
    private Availability availability = Availability.INITIALIZING;
    private static final class Binding {
        final long generation;
        final Listener listener;
        Binding(long generation, Listener listener) { this.generation = generation; this.listener = listener; }
    }
    private boolean destroyed;

    public AndroidTextToSpeechOutput(Context context, Listener listener) {
        availabilityListener = listener;
        engine = new TextToSpeech(context.getApplicationContext(), this::onInitialized);
    }

    @Override
    public Availability availability() {
        return availability;
    }

    @Override
    public boolean speak(long generation, String exactText, float rate, Listener listener) {
        if (destroyed || availability != Availability.AVAILABLE || engine == null
                || exactText == null || exactText.isBlank() || rate <= 0f
                || Float.isNaN(rate) || Float.isInfinite(rate)) {
            return false;
        }
        if (exactText.length() > TextToSpeech.getMaxSpeechInputLength()) {
            listener.onError(generation,
                    "This text is too long for spoken readback. It remains available on screen.");
            return false;
        }
        stop();
        if (engine.setSpeechRate(rate) != TextToSpeech.SUCCESS) {
            listener.onError(generation,
                    "This speech rate is unavailable. The written text remains available.");
            return false;
        }
        String utteranceId = UTTERANCE_PREFIX + generation;
        generations.put(utteranceId, new Binding(generation, listener));
        int result = engine.speak(exactText, TextToSpeech.QUEUE_FLUSH, null, utteranceId);
        if (result != TextToSpeech.SUCCESS) {
            generations.remove(utteranceId);
            listener.onError(generation,
                    "Spoken readback could not start. Continue with the written text.");
            return false;
        }
        return true;
    }

    @Override
    public void stop() {
        generations.clear();
        if (engine != null) {
            engine.stop();
        }
    }

    @Override
    public void destroy() {
        destroyed = true;
        availability = Availability.UNAVAILABLE;
        generations.clear();
        if (engine != null) {
            engine.stop();
            engine.shutdown();
            engine = null;
        }
    }

    private void onInitialized(int status) {
        if (destroyed || engine == null) {
            return;
        }
        if (status != TextToSpeech.SUCCESS) {
            unavailable("Spoken readback could not start on this tablet. Written text is still available.");
            return;
        }
        engine.setAudioAttributes(new android.media.AudioAttributes.Builder()
                .setUsage(android.media.AudioAttributes.USAGE_ASSISTANCE_ACCESSIBILITY)
                .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build());
        engine.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
                Binding binding = generations.get(utteranceId);
                if (binding != null) {
                    binding.listener.onStarted(binding.generation);
                }
            }

            @Override
            public void onDone(String utteranceId) {
                Binding binding = generations.remove(utteranceId);
                if (binding != null) {
                    binding.listener.onCompleted(binding.generation);
                }
            }

            @Override
            public void onError(String utteranceId) {
                onError(utteranceId, TextToSpeech.ERROR);
            }

            @Override
            public void onError(String utteranceId, int errorCode) {
                Binding binding = generations.remove(utteranceId);
                if (binding != null) {
                    binding.listener.onError(binding.generation,
                            "Spoken readback stopped. Continue with the written text.");
                }
            }

            @Override
            public void onStop(String utteranceId, boolean interrupted) {
                Binding binding = generations.remove(utteranceId);
                if (binding != null) {
                    binding.listener.onStopped(binding.generation);
                }
            }
        });

        Voice selected = selectInstalledVoice(engine.getVoices(), engine.getDefaultVoice(), Locale.getDefault());
        if (selected == null || engine.setVoice(selected) != TextToSpeech.SUCCESS) {
            unavailable("No installed offline voice matches this tablet language. Written text is still available.");
            return;
        }
        availability = Availability.AVAILABLE;
        availabilityListener.onAvailabilityChanged(availability,
                "Spoken readback is ready. Nothing is read automatically.");
    }

    private void unavailable(String explanation) {
        availability = Availability.UNAVAILABLE;
        generations.clear();
        if (engine != null) {
            engine.stop();
            engine.shutdown();
            engine = null;
        }
        availabilityListener.onAvailabilityChanged(availability, explanation);
    }

    static Voice selectInstalledVoice(Set<Voice> voices, Voice defaultVoice, Locale locale) {
        if (voices == null || locale == null) {
            return null;
        }
        List<OfflineVoiceSelection.VoiceMetadata> metadata = new ArrayList<>();
        for (Voice voice : voices) {
            if (voice != null) metadata.add(new OfflineVoiceSelection.VoiceMetadata(voice.getName(), voice.getLocale(),
                    voice.getQuality(), voice.equals(defaultVoice), voice.isNetworkConnectionRequired(),
                    (voice.getFeatures() == null || !voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED))));
        }
        OfflineVoiceSelection.VoiceMetadata selected = OfflineVoiceSelection.select(metadata, locale);
        if (selected == null) return null;
        for (Voice voice : voices) if (selected.name.equals(voice.getName())) return voice;
        return null;
    }
}
