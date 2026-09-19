package org.pueblo98.stage1.readability;

import android.content.SharedPreferences;

import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.Set;

/** Android-private implementation of the versioned C5 preference boundary. */
public final class SharedPreferencesTextScaleStore implements TextScaleStore {
    private static final Object LOCK = new Object();
    private static final Set<SharedPreferences> UNCERTAIN_PREFERENCES =
            Collections.newSetFromMap(new IdentityHashMap<>());
    private static final int SCHEMA_VERSION = 1;
    private static final String KEY_SCHEMA = "text_scale.schema";
    private static final String KEY_VERSION = "text_scale.version";
    private static final String KEY_CURRENT = "text_scale.current";
    private static final String KEY_PREVIOUS = "text_scale.previous";

    private final SharedPreferences preferences;

    public SharedPreferencesTextScaleStore(SharedPreferences preferences) {
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
            if (actual.status != ReadResult.Status.PRESENT && actual.status != ReadResult.Status.ABSENT) {
                return WriteResult.UNKNOWN;
            }
            if (expected == null ? actual.status != ReadResult.Status.ABSENT : !expected.equals(actual.value)) {
                return WriteResult.CONFLICT;
            }
            try {
                SharedPreferences.Editor editor = preferences.edit()
                        .putInt(KEY_SCHEMA, SCHEMA_VERSION)
                        .putLong(KEY_VERSION, update.version)
                        .putString(KEY_CURRENT, update.current.name());
                if (update.previous == null) {
                    editor.remove(KEY_PREVIOUS);
                } else {
                    editor.putString(KEY_PREVIOUS, update.previous.name());
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
                return preferences.contains(KEY_VERSION) || preferences.contains(KEY_CURRENT)
                        || preferences.contains(KEY_PREVIOUS)
                        ? ReadResult.corrupt()
                        : ReadResult.absent();
            }
            if (preferences.getInt(KEY_SCHEMA, -1) != SCHEMA_VERSION) {
                return ReadResult.corrupt();
            }
            long version = preferences.getLong(KEY_VERSION, -1);
            String currentName = preferences.getString(KEY_CURRENT, null);
            if (version < 1 || currentName == null) {
                return ReadResult.corrupt();
            }
            TextScale current = TextScale.valueOf(currentName);
            String previousName = preferences.getString(KEY_PREVIOUS, null);
            TextScale previous = previousName == null ? null : TextScale.valueOf(previousName);
            return ReadResult.present(new StoredValue(version, current, previous));
        } catch (ClassCastException | IllegalArgumentException exception) {
            return ReadResult.corrupt();
        } catch (RuntimeException exception) {
            return ReadResult.failed();
        }
    }
}
