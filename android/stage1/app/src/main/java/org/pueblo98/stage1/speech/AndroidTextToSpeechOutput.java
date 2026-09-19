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
    private final ConcurrentHashMap<String, Long> generations = new ConcurrentHashMap<>();
    private TextToSpeech engine;
    private Availability availability = Availability.INITIALIZING;
    private Listener activeListener;
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
        activeListener = listener;
        engine.stop();
        if (engine.setSpeechRate(rate) != TextToSpeech.SUCCESS) {
            listener.onError(generation,
                    "This speech rate is unavailable. The written text remains available.");
            return false;
        }
        String utteranceId = UTTERANCE_PREFIX + generation;
        generations.put(utteranceId, generation);
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
        engine.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
                Long generation = generations.get(utteranceId);
                Listener listener = activeListener;
                if (generation != null && listener != null) {
                    listener.onStarted(generation);
                }
            }

            @Override
            public void onDone(String utteranceId) {
                Long generation = generations.remove(utteranceId);
                Listener listener = activeListener;
                if (generation != null && listener != null) {
                    listener.onCompleted(generation);
                }
            }

            @Override
            public void onError(String utteranceId) {
                onError(utteranceId, TextToSpeech.ERROR);
            }

            @Override
            public void onError(String utteranceId, int errorCode) {
                Long generation = generations.remove(utteranceId);
                Listener listener = activeListener;
                if (generation != null && listener != null) {
                    listener.onError(generation,
                            "Spoken readback stopped. Continue with the written text.");
                }
            }

            @Override
            public void onStop(String utteranceId, boolean interrupted) {
                Long generation = generations.remove(utteranceId);
                Listener listener = activeListener;
                if (generation != null && listener != null) {
                    listener.onStopped(generation);
                }
            }
        });

        Voice selected = selectInstalledVoice(engine.getVoices(), Locale.getDefault());
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

    static Voice selectInstalledVoice(Set<Voice> voices, Locale locale) {
        if (voices == null || locale == null) {
            return null;
        }
        List<Voice> candidates = new ArrayList<>();
        for (Voice voice : voices) {
            if (voice != null && !voice.isNetworkConnectionRequired()
                    && locale.getLanguage().equals(voice.getLocale().getLanguage())) {
                candidates.add(voice);
            }
        }
        candidates.sort(Comparator
                .comparing((Voice voice) -> !locale.equals(voice.getLocale()))
                .thenComparing(Voice::getName));
        return candidates.isEmpty() ? null : candidates.get(0);
    }
}
