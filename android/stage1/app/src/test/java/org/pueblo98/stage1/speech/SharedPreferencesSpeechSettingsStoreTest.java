package org.pueblo98.stage1.speech;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import android.content.SharedPreferences;

import org.junit.Test;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/** Tests the Android settings adapter with a map fake; no Android runtime is involved. */
public final class SharedPreferencesSpeechSettingsStoreTest {
    private static final String SCHEMA = "speech.schema";
    private static final String VERSION = "speech.version";
    private static final String RATE = "speech.rate";
    private static final String PREVIOUS = "speech.previous_rate";
    private static final String SOUND = "speech.sound_enabled";

    @Test
    public void writesReadbackAndRestoreRemovalUseVersionedSchema() {
        MapPreferences preferences = new MapPreferences();
        SharedPreferencesSpeechSettingsStore store =
                new SharedPreferencesSpeechSettingsStore(preferences);
        SpeechSettingsStore.StoredValue applied = new SpeechSettingsStore.StoredValue(
                1, SpeechRate.FASTER, SpeechRate.NORMAL, false);

        assertEquals(SpeechSettingsStore.WriteResult.WRITTEN,
                store.compareAndSet(null, applied));
        assertEquals(applied, store.read().value);
        assertEquals(1, preferences.values.get(SCHEMA));
        assertEquals(1L, preferences.values.get(VERSION));
        assertEquals("FASTER", preferences.values.get(RATE));
        assertEquals("NORMAL", preferences.values.get(PREVIOUS));
        assertEquals(false, preferences.values.get(SOUND));

        SpeechSettingsStore.StoredValue restored = new SpeechSettingsStore.StoredValue(
                2, SpeechRate.NORMAL, null, true);
        assertEquals(SpeechSettingsStore.WriteResult.WRITTEN,
                store.compareAndSet(applied, restored));
        assertEquals(restored, store.read().value);
        assertFalse(preferences.values.containsKey(PREVIOUS));
    }

    @Test
    public void partialOrMalformedRecordsAreCorrupt() {
        MapPreferences partial = new MapPreferences();
        partial.values.put(RATE, "NORMAL");
        assertEquals(SpeechSettingsStore.ReadResult.Status.CORRUPT,
                new SharedPreferencesSpeechSettingsStore(partial).read().status);

        assertCorrupt(SCHEMA, "one");
        assertCorrupt(SCHEMA, 2);
        assertCorrupt(RATE, "NOT_A_RATE");
        assertCorrupt(VERSION, 0L);
        MapPreferences missingSound = completePreferences();
        missingSound.values.remove(SOUND);
        assertEquals(SpeechSettingsStore.ReadResult.Status.CORRUPT,
                new SharedPreferencesSpeechSettingsStore(missingSound).read().status);
    }

    @Test
    public void compareAndSetConflictDoesNotWrite() {
        MapPreferences preferences = completePreferences();
        SharedPreferencesSpeechSettingsStore store =
                new SharedPreferencesSpeechSettingsStore(preferences);
        SpeechSettingsStore.StoredValue wrong = new SpeechSettingsStore.StoredValue(
                2, SpeechRate.SLOWER, null, true);

        assertEquals(SpeechSettingsStore.WriteResult.CONFLICT, store.compareAndSet(
                wrong, new SpeechSettingsStore.StoredValue(3, SpeechRate.FASTER, null, true)));
        assertEquals(0, preferences.commitCalls);
    }

    @Test
    public void failedCommitStaysUnknownAcrossSameProcessAdapters() {
        MapPreferences preferences = new MapPreferences();
        preferences.commitResult = false;
        SharedPreferencesSpeechSettingsStore first =
                new SharedPreferencesSpeechSettingsStore(preferences);
        SpeechSettingsStore.StoredValue value = new SpeechSettingsStore.StoredValue(
                1, SpeechRate.FASTER, SpeechRate.NORMAL, true);

        assertEquals(SpeechSettingsStore.WriteResult.UNKNOWN,
                first.compareAndSet(null, value));
        assertEquals(SpeechSettingsStore.ReadResult.Status.UNKNOWN, first.read().status);
        SharedPreferencesSpeechSettingsStore fresh =
                new SharedPreferencesSpeechSettingsStore(preferences);
        assertEquals(SpeechSettingsStore.ReadResult.Status.UNKNOWN, fresh.read().status);
        assertEquals(SpeechSettingsStore.WriteResult.UNKNOWN,
                fresh.compareAndSet(null, value));
        assertEquals(1, preferences.commitCalls);
    }

    private static void assertCorrupt(String key, Object value) {
        MapPreferences preferences = completePreferences();
        preferences.values.put(key, value);
        assertEquals(SpeechSettingsStore.ReadResult.Status.CORRUPT,
                new SharedPreferencesSpeechSettingsStore(preferences).read().status);
    }

    private static MapPreferences completePreferences() {
        MapPreferences preferences = new MapPreferences();
        preferences.values.put(SCHEMA, 1);
        preferences.values.put(VERSION, 1L);
        preferences.values.put(RATE, "NORMAL");
        preferences.values.put(SOUND, true);
        return preferences;
    }

    private static final class MapPreferences implements SharedPreferences {
        final Map<String, Object> values = new HashMap<>();
        boolean commitResult = true;
        int commitCalls;

        @Override public boolean contains(String key) { return values.containsKey(key); }
        @Override public Editor edit() { return new MapEditor(); }
        @Override public Map<String, ?> getAll() { return new HashMap<>(values); }
        @Override public boolean getBoolean(String key, boolean fallback) { return typed(key, Boolean.class, fallback); }
        @Override public float getFloat(String key, float fallback) { return typed(key, Float.class, fallback); }
        @Override public int getInt(String key, int fallback) { return typed(key, Integer.class, fallback); }
        @Override public long getLong(String key, long fallback) { return typed(key, Long.class, fallback); }
        @Override public String getString(String key, String fallback) { return typed(key, String.class, fallback); }
        @Override public Set<String> getStringSet(String key, Set<String> fallback) { return typed(key, Set.class, fallback); }
        @Override public void registerOnSharedPreferenceChangeListener(OnSharedPreferenceChangeListener listener) {}
        @Override public void unregisterOnSharedPreferenceChangeListener(OnSharedPreferenceChangeListener listener) {}

        @SuppressWarnings("unchecked")
        private <T> T typed(String key, Class<?> type, T fallback) {
            Object value = values.get(key);
            if (value == null) return fallback;
            if (!type.isInstance(value)) throw new ClassCastException(key);
            return (T) value;
        }

        private final class MapEditor implements Editor {
            final Map<String, Object> changes = new HashMap<>();
            final Set<String> removals = new HashSet<>();
            boolean clear;
            @Override public Editor putString(String key, String value) { changes.put(key, value); return this; }
            @Override public Editor putStringSet(String key, Set<String> value) { changes.put(key, value); return this; }
            @Override public Editor putInt(String key, int value) { changes.put(key, value); return this; }
            @Override public Editor putLong(String key, long value) { changes.put(key, value); return this; }
            @Override public Editor putFloat(String key, float value) { changes.put(key, value); return this; }
            @Override public Editor putBoolean(String key, boolean value) { changes.put(key, value); return this; }
            @Override public Editor remove(String key) { removals.add(key); return this; }
            @Override public Editor clear() { clear = true; return this; }
            @Override public boolean commit() { applyChanges(); commitCalls++; return commitResult; }
            @Override public void apply() { applyChanges(); }
            private void applyChanges() {
                if (clear) values.clear();
                for (String key : removals) values.remove(key);
                values.putAll(changes);
            }
        }
    }
}
