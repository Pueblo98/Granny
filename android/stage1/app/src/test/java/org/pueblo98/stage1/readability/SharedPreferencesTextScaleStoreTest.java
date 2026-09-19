package org.pueblo98.stage1.readability;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import android.content.SharedPreferences;

import org.junit.Test;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/** Tests the Android adapter with a map fake; no Android runtime is involved. */
public final class SharedPreferencesTextScaleStoreTest {
    private static final String SCHEMA = "text_scale.schema";
    private static final String VERSION = "text_scale.version";
    private static final String CURRENT = "text_scale.current";
    private static final String PREVIOUS = "text_scale.previous";

    @Test
    public void writesReadbacksAndRestoreRemovalUseTheVersionedSchema() {
        MapPreferences preferences = new MapPreferences();
        SharedPreferencesTextScaleStore store = new SharedPreferencesTextScaleStore(preferences);
        TextScaleStore.StoredValue applied = new TextScaleStore.StoredValue(
                1, TextScale.LARGE, TextScale.DEFAULT);

        assertEquals(TextScaleStore.WriteResult.WRITTEN, store.compareAndSet(null, applied));
        assertEquals(TextScaleStore.ReadResult.Status.PRESENT, store.read().status);
        assertEquals(applied, store.read().value);
        assertEquals(1, preferences.values.get(SCHEMA));
        assertEquals(1L, preferences.values.get(VERSION));
        assertEquals("LARGE", preferences.values.get(CURRENT));
        assertEquals("DEFAULT", preferences.values.get(PREVIOUS));

        TextScaleStore.StoredValue restored = new TextScaleStore.StoredValue(
                2, TextScale.DEFAULT, null);
        assertEquals(TextScaleStore.WriteResult.WRITTEN, store.compareAndSet(applied, restored));
        assertEquals(restored, store.read().value);
        assertFalse(preferences.values.containsKey(PREVIOUS));
    }

    @Test
    public void missingSchemaWithAnyPartialDataIsCorrupt() {
        MapPreferences preferences = new MapPreferences();
        preferences.values.put(CURRENT, "LARGE");

        assertEquals(TextScaleStore.ReadResult.Status.CORRUPT,
                new SharedPreferencesTextScaleStore(preferences).read().status);
    }

    @Test
    public void malformedTypesAndUnsupportedSchemaValuesAreCorrupt() {
        assertCorrupt(SCHEMA, "one");
        assertCorrupt(SCHEMA, 2);
        assertCorrupt(CURRENT, "NOT_A_SCALE");
        assertCorrupt(VERSION, 0L);
    }

    @Test
    public void compareAndSetConflictDoesNotWrite() {
        MapPreferences preferences = completePreferences(2, TextScale.COMFORTABLE, TextScale.DEFAULT);
        SharedPreferencesTextScaleStore store = new SharedPreferencesTextScaleStore(preferences);
        TextScaleStore.StoredValue wrongExpected = new TextScaleStore.StoredValue(
                1, TextScale.DEFAULT, null);

        assertEquals(TextScaleStore.WriteResult.CONFLICT, store.compareAndSet(
                wrongExpected, new TextScaleStore.StoredValue(3, TextScale.LARGE, TextScale.COMFORTABLE)));
        assertEquals(0, preferences.commitCalls);
        assertEquals("COMFORTABLE", preferences.values.get(CURRENT));
    }

    @Test
    public void failedCommitWithUpdatedCacheStaysUnknownForAllSameProcessAdapters() {
        MapPreferences preferences = new MapPreferences();
        preferences.commitResult = false;
        SharedPreferencesTextScaleStore first = new SharedPreferencesTextScaleStore(preferences);
        TextScaleStore.StoredValue value = new TextScaleStore.StoredValue(
                1, TextScale.LARGE, TextScale.DEFAULT);

        assertEquals(TextScaleStore.WriteResult.UNKNOWN, first.compareAndSet(null, value));
        assertEquals("LARGE", preferences.values.get(CURRENT));
        assertEquals(TextScaleStore.ReadResult.Status.UNKNOWN, first.read().status);
        SharedPreferencesTextScaleStore freshAdapter = new SharedPreferencesTextScaleStore(preferences);
        assertEquals(TextScaleStore.ReadResult.Status.UNKNOWN, freshAdapter.read().status);
        assertEquals(TextScaleStore.WriteResult.UNKNOWN, freshAdapter.compareAndSet(null, value));
        assertEquals(1, preferences.commitCalls);
    }

    private static void assertCorrupt(String changedKey, Object changedValue) {
        MapPreferences preferences = completePreferences(1, TextScale.DEFAULT, null);
        preferences.values.put(changedKey, changedValue);
        assertEquals(TextScaleStore.ReadResult.Status.CORRUPT,
                new SharedPreferencesTextScaleStore(preferences).read().status);
    }

    private static MapPreferences completePreferences(long version, TextScale current, TextScale previous) {
        MapPreferences preferences = new MapPreferences();
        preferences.values.put(SCHEMA, 1);
        preferences.values.put(VERSION, version);
        preferences.values.put(CURRENT, current.name());
        if (previous != null) {
            preferences.values.put(PREVIOUS, previous.name());
        }
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
