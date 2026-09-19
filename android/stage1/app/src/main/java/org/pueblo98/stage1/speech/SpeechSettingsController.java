package org.pueblo98.stage1.speech;

/** Owns speech-rate preview/apply/restore and the immediate Sound off preference. */
public final class SpeechSettingsController {
    public enum PersistenceState { HEALTHY, ABSENT, CORRUPT, FAILED, UNKNOWN }
    public enum OperationResult {
        APPLIED,
        RESTORED,
        SOUND_CHANGED,
        ALREADY_APPLIED,
        PREVIEW_REQUIRED,
        NO_RESTORE,
        PERSISTENCE_CORRUPT,
        PERSISTENCE_FAILED,
        PERSISTENCE_UNKNOWN,
        CONFLICT,
        UNVERIFIED
    }

    public static final class Snapshot {
        public final SpeechRate currentRate;
        public final SpeechRate previewRate;
        public final boolean previewHeard;
        public final boolean soundEnabled;
        public final boolean restoreAvailable;
        public final PersistenceState persistenceState;
        public final String message;

        private Snapshot(
                SpeechRate currentRate,
                SpeechRate previewRate,
                boolean previewHeard,
                boolean soundEnabled,
                boolean restoreAvailable,
                PersistenceState persistenceState,
                String message) {
            this.currentRate = currentRate;
            this.previewRate = previewRate;
            this.previewHeard = previewHeard;
            this.soundEnabled = soundEnabled;
            this.restoreAvailable = restoreAvailable;
            this.persistenceState = persistenceState;
            this.message = message;
        }
    }

    private final SpeechSettingsStore store;
    private SpeechSettingsStore.StoredValue stored;
    private SpeechRate currentRate;
    private SpeechRate previewRate;
    private boolean previewHeard;
    private boolean soundEnabled;
    private PersistenceState persistenceState;
    private String message;
    private boolean uncertainOutcome;

    public SpeechSettingsController(SpeechSettingsStore store) {
        this.store = store;
        load();
    }

    public Snapshot snapshot() {
        return new Snapshot(
                currentRate,
                previewRate,
                previewHeard,
                soundEnabled,
                stored != null && stored.previousRate != null && canWrite(),
                persistenceState,
                message);
    }

    public void reload() {
        previewRate = null;
        previewHeard = false;
        load();
        if (uncertainOutcome) {
            persistenceState = PersistenceState.UNKNOWN;
            message = "Speech settings could not be confirmed saved. They will not be retried automatically.";
        }
    }

    public boolean preview(SpeechRate requested) {
        if (requested == null || !canWrite() || !soundEnabled) {
            return false;
        }
        previewRate = requested;
        previewHeard = false;
        message = "Selected " + requested.label() + ". Preview it before applying.";
        return true;
    }

    public boolean markPreviewHeard(SpeechRate heardRate) {
        if (previewRate == null || heardRate != previewRate || !soundEnabled) {
            return false;
        }
        previewHeard = true;
        message = "Preview finished. Apply " + previewRate.label() + " or choose another rate.";
        return true;
    }

    public boolean cancelPreview() {
        if (previewRate == null) {
            return false;
        }
        previewRate = null;
        previewHeard = false;
        message = currentMessage();
        return true;
    }

    public OperationResult applyRate() {
        if (previewRate == null || !previewHeard) {
            return OperationResult.PREVIEW_REQUIRED;
        }
        if (!canWrite()) {
            return unavailableResult();
        }
        if (previewRate == currentRate) {
            previewRate = null;
            previewHeard = false;
            message = currentMessage();
            return OperationResult.ALREADY_APPLIED;
        }
        long version = nextVersion();
        if (version < 0) {
            return versionExhausted();
        }
        SpeechSettingsStore.StoredValue update = new SpeechSettingsStore.StoredValue(
                version, previewRate, currentRate, soundEnabled);
        OperationResult result = writeAndVerify(stored, update, OperationResult.APPLIED);
        if (result == OperationResult.APPLIED) {
            previewRate = null;
            previewHeard = false;
        }
        return result;
    }

    public OperationResult restoreRate() {
        if (!canWrite()) {
            return unavailableResult();
        }
        if (stored == null || stored.previousRate == null) {
            return OperationResult.NO_RESTORE;
        }
        long version = nextVersion();
        if (version < 0) {
            return versionExhausted();
        }
        SpeechSettingsStore.StoredValue update = new SpeechSettingsStore.StoredValue(
                version, stored.previousRate, null, soundEnabled);
        OperationResult result = writeAndVerify(stored, update, OperationResult.RESTORED);
        if (result == OperationResult.RESTORED) {
            previewRate = null;
            previewHeard = false;
        }
        return result;
    }

    public OperationResult setSoundEnabled(boolean enabled) {
        if (!canWrite()) {
            return unavailableResult();
        }
        if (enabled == soundEnabled) {
            return OperationResult.ALREADY_APPLIED;
        }
        long version = nextVersion();
        if (version < 0) {
            return versionExhausted();
        }
        SpeechSettingsStore.StoredValue update = new SpeechSettingsStore.StoredValue(
                version, currentRate, stored == null ? null : stored.previousRate, enabled);
        OperationResult result = writeAndVerify(stored, update, OperationResult.SOUND_CHANGED);
        if (result == OperationResult.SOUND_CHANGED) {
            previewRate = null;
            previewHeard = false;
        }
        return result;
    }

    private void load() {
        SpeechSettingsStore.ReadResult result = store.read();
        persistenceState = stateFor(result.status);
        if (result.status == SpeechSettingsStore.ReadResult.Status.PRESENT) {
            stored = result.value;
            currentRate = result.value.currentRate;
            soundEnabled = result.value.soundEnabled;
        } else {
            stored = null;
            currentRate = SpeechRate.NORMAL;
            soundEnabled = true;
        }
        message = messageFor(persistenceState);
    }

    private boolean canWrite() {
        return !uncertainOutcome
                && (persistenceState == PersistenceState.HEALTHY
                || persistenceState == PersistenceState.ABSENT);
    }

    private long nextVersion() {
        return stored == null ? 1 : stored.version == Long.MAX_VALUE ? -1 : stored.version + 1;
    }

    private OperationResult writeAndVerify(
            SpeechSettingsStore.StoredValue expected,
            SpeechSettingsStore.StoredValue update,
            OperationResult success) {
        SpeechSettingsStore.WriteResult write = store.compareAndSet(expected, update);
        if (write == SpeechSettingsStore.WriteResult.CONFLICT) {
            load();
            previewRate = null;
            previewHeard = false;
            message = "Speech settings changed elsewhere. Review the current settings.";
            return OperationResult.CONFLICT;
        }
        if (write == SpeechSettingsStore.WriteResult.FAILED) {
            latchUncertain(PersistenceState.FAILED,
                    "Speech settings could not be saved. They will not be retried automatically.");
            return OperationResult.PERSISTENCE_FAILED;
        }
        if (write == SpeechSettingsStore.WriteResult.UNKNOWN) {
            latchUncertain(PersistenceState.UNKNOWN,
                    "Speech settings could not be confirmed saved. They will not be retried automatically.");
            return OperationResult.PERSISTENCE_UNKNOWN;
        }
        SpeechSettingsStore.ReadResult observed = store.read();
        persistenceState = stateFor(observed.status);
        if (observed.status == SpeechSettingsStore.ReadResult.Status.PRESENT
                && update.equals(observed.value)) {
            stored = observed.value;
            currentRate = observed.value.currentRate;
            soundEnabled = observed.value.soundEnabled;
            if (success == OperationResult.APPLIED) {
                message = "Speech rate is now " + currentRate.label() + ".";
            } else if (success == OperationResult.RESTORED) {
                message = "Speech rate was restored to " + currentRate.label() + ".";
            } else {
                message = soundEnabled
                        ? "Sound is on. Granny still speaks only after an explicit control."
                        : "Sound is off. Written text remains available.";
            }
            return success;
        }
        latchUncertain(PersistenceState.UNKNOWN,
                "Speech settings could not be confirmed saved. They will not be retried automatically.");
        return OperationResult.UNVERIFIED;
    }

    private OperationResult unavailableResult() {
        switch (persistenceState) {
            case CORRUPT:
                return OperationResult.PERSISTENCE_CORRUPT;
            case FAILED:
                return OperationResult.PERSISTENCE_FAILED;
            default:
                return OperationResult.PERSISTENCE_UNKNOWN;
        }
    }

    private OperationResult versionExhausted() {
        latchUncertain(PersistenceState.UNKNOWN,
                "Speech settings could not be saved. They will not be retried automatically.");
        return OperationResult.PERSISTENCE_UNKNOWN;
    }

    private void latchUncertain(PersistenceState state, String outcomeMessage) {
        uncertainOutcome = true;
        persistenceState = state;
        previewRate = null;
        previewHeard = false;
        message = outcomeMessage;
    }

    private static PersistenceState stateFor(SpeechSettingsStore.ReadResult.Status status) {
        switch (status) {
            case PRESENT:
                return PersistenceState.HEALTHY;
            case ABSENT:
                return PersistenceState.ABSENT;
            case CORRUPT:
                return PersistenceState.CORRUPT;
            case FAILED:
                return PersistenceState.FAILED;
            default:
                return PersistenceState.UNKNOWN;
        }
    }

    private String messageFor(PersistenceState state) {
        switch (state) {
            case CORRUPT:
                return "Speech settings could not be read. They were not changed.";
            case FAILED:
                return "Speech settings could not be read. Try again later.";
            case UNKNOWN:
                return "Speech settings could not be confirmed. They will not be retried automatically.";
            default:
                return currentMessage();
        }
    }

    private String currentMessage() {
        return "Speech rate: " + currentRate.label() + ". Sound is "
                + (soundEnabled ? "on." : "off.");
    }
}
