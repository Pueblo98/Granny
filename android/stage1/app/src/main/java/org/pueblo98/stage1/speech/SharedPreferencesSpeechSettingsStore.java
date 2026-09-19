package org.pueblo98.stage1.speech;

import android.content.SharedPreferences;

import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.Set;

/** Android-private implementation of the versioned speech-settings boundary. */
public final class SharedPreferencesSpeechSettingsStore implements SpeechSettingsStore {
    private static final Object LOCK = new Object();
    private static final Set<SharedPreferences> UNCERTAIN_PREFERENCES =
            Collections.newSetFromMap(new IdentityHashMap<>());
    private static final int SCHEMA_VERSION = 1;
    private static final String KEY_SCHEMA = "speech.schema";
    private static final String KEY_VERSION = "speech.version";
    private static final String KEY_RATE = "speech.rate";
    private static final String KEY_PREVIOUS_RATE = "speech.previous_rate";
    private static final String KEY_SOUND_ENABLED = "speech.sound_enabled";

    private final SharedPreferences preferences;

    public SharedPreferencesSpeechSettingsStore(SharedPreferences preferences) {
        this.preferences = preferences;
    }

    @Override
    public ReadResult read() {
        synchronized (LOCK) {
            return readLocked();
        }
    }

    @Override
    public WriteResult compareAndSet(StoredValue expected, StoredValue update) {
        synchronized (LOCK) {
            ReadResult actual = readLocked();
            if (actual.status == ReadResult.Status.CORRUPT) {
                return WriteResult.FAILED;
            }
            if (actual.status != ReadResult.Status.PRESENT
                    && actual.status != ReadResult.Status.ABSENT) {
                return WriteResult.UNKNOWN;
            }
            if (expected == null
                    ? actual.status != ReadResult.Status.ABSENT
                    : !expected.equals(actual.value)) {
                return WriteResult.CONFLICT;
            }
            try {
                SharedPreferences.Editor editor = preferences.edit()
                        .putInt(KEY_SCHEMA, SCHEMA_VERSION)
                        .putLong(KEY_VERSION, update.version)
                        .putString(KEY_RATE, update.currentRate.name())
                        .putBoolean(KEY_SOUND_ENABLED, update.soundEnabled);
                if (update.previousRate == null) {
                    editor.remove(KEY_PREVIOUS_RATE);
                } else {
                    editor.putString(KEY_PREVIOUS_RATE, update.previousRate.name());
                }
                if (editor.commit()) {
                    return WriteResult.WRITTEN;
                }
                UNCERTAIN_PREFERENCES.add(preferences);
                return WriteResult.UNKNOWN;
            } catch (RuntimeException exception) {
                UNCERTAIN_PREFERENCES.add(preferences);
                return WriteResult.UNKNOWN;
            }
        }
    }

    private ReadResult readLocked() {
        try {
            if (UNCERTAIN_PREFERENCES.contains(preferences)) {
                return ReadResult.unknown();
            }
            if (!preferences.contains(KEY_SCHEMA)) {
                return preferences.contains(KEY_VERSION)
                        || preferences.contains(KEY_RATE)
                        || preferences.contains(KEY_PREVIOUS_RATE)
                        || preferences.contains(KEY_SOUND_ENABLED)
                        ? ReadResult.corrupt()
                        : ReadResult.absent();
            }
            if (preferences.getInt(KEY_SCHEMA, -1) != SCHEMA_VERSION) {
                return ReadResult.corrupt();
            }
            long version = preferences.getLong(KEY_VERSION, -1);
            String rateName = preferences.getString(KEY_RATE, null);
            if (version < 1 || rateName == null || !preferences.contains(KEY_SOUND_ENABLED)) {
                return ReadResult.corrupt();
            }
            SpeechRate rate = SpeechRate.valueOf(rateName);
            String previousName = preferences.getString(KEY_PREVIOUS_RATE, null);
            SpeechRate previous = previousName == null ? null : SpeechRate.valueOf(previousName);
            boolean soundEnabled = preferences.getBoolean(KEY_SOUND_ENABLED, true);
            return ReadResult.present(new StoredValue(version, rate, previous, soundEnabled));
        } catch (ClassCastException | IllegalArgumentException exception) {
            return ReadResult.corrupt();
        } catch (RuntimeException exception) {
            return ReadResult.failed();
        }
    }
}
