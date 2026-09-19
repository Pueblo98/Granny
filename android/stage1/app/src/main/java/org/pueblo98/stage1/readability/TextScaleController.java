package org.pueblo98.stage1.readability;

/**
 * Owns C5 preview/apply/restore state. Applying is synchronous on the UI path,
 * but the store readback remains an independent outcome check.
 */
public final class TextScaleController {
    public enum PersistenceState { HEALTHY, ABSENT, CORRUPT, FAILED, UNKNOWN }
    public enum OperationResult {
        APPLIED,
        RESTORED,
        ALREADY_APPLIED,
        NO_PREVIEW,
        NO_RESTORE,
        PERSISTENCE_CORRUPT,
        PERSISTENCE_FAILED,
        PERSISTENCE_UNKNOWN,
        CONFLICT,
        UNVERIFIED
    }

    public static final class Snapshot {
        public final TextScale current;
        public final TextScale preview;
        public final boolean restoreAvailable;
        public final PersistenceState persistenceState;
        public final String message;

        private Snapshot(
                TextScale current,
                TextScale preview,
                boolean restoreAvailable,
                PersistenceState persistenceState,
                String message) {
            this.current = current;
            this.preview = preview;
            this.restoreAvailable = restoreAvailable;
            this.persistenceState = persistenceState;
            this.message = message;
        }
    }

    private final TextScaleStore store;
    private TextScaleStore.StoredValue stored;
    private TextScale current;
    private TextScale preview;
    private PersistenceState persistenceState;
    private String message;

    public TextScaleController(TextScaleStore store) {
        this.store = store;
        load();
    }

    public Snapshot snapshot() {
        return new Snapshot(
                current,
                preview,
                stored != null && stored.previous != null,
                persistenceState,
                message);
    }

    /** Reloads a durable value after foreground return and abandons an old preview. */
    public void reload() {
        preview = null;
        load();
    }

    public boolean preview(TextScale requested) {
        if (requested == null || !canWrite()) {
            return false;
        }
        preview = requested;
        message = "Preview: " + requested.label() + ". Choose Apply or Stop.";
        return true;
    }

    /** Stop before Apply only abandons the unpersisted preview. */
    public boolean cancelPreview() {
        if (preview == null) {
            return false;
        }
        preview = null;
        message = currentMessage();
        return true;
    }

    public OperationResult apply() {
        if (preview == null) {
            return OperationResult.NO_PREVIEW;
        }
        if (!canWrite()) {
            return unavailableResult();
        }
        if (preview == current) {
            preview = null;
            message = currentMessage();
            return OperationResult.ALREADY_APPLIED;
        }
        long version = nextVersion();
        if (version < 0) {
            return versionExhausted();
        }
        TextScaleStore.StoredValue update = new TextScaleStore.StoredValue(version, preview, current);
        OperationResult write = writeAndVerify(stored, update, OperationResult.APPLIED);
        if (write == OperationResult.APPLIED) {
            preview = null;
        }
        return write;
    }

    public OperationResult restore() {
        if (!canWrite()) {
            return unavailableResult();
        }
        if (stored == null || stored.previous == null) {
            return OperationResult.NO_RESTORE;
        }
        long version = nextVersion();
        if (version < 0) {
            return versionExhausted();
        }
        TextScaleStore.StoredValue update = new TextScaleStore.StoredValue(version, stored.previous, null);
        OperationResult write = writeAndVerify(stored, update, OperationResult.RESTORED);
        if (write == OperationResult.RESTORED) {
            preview = null;
        }
        return write;
    }

    private void load() {
        TextScaleStore.ReadResult result = store.read();
        persistenceState = stateFor(result.status);
        if (result.status == TextScaleStore.ReadResult.Status.PRESENT) {
            stored = result.value;
            current = result.value.current;
        } else {
            stored = null;
            current = TextScale.DEFAULT;
        }
        message = messageFor(persistenceState);
    }

    private boolean canWrite() {
        return persistenceState == PersistenceState.HEALTHY || persistenceState == PersistenceState.ABSENT;
    }

    private long nextVersion() {
        return stored == null ? 1 : stored.version == Long.MAX_VALUE ? -1 : stored.version + 1;
    }

    private OperationResult writeAndVerify(
            TextScaleStore.StoredValue expected,
            TextScaleStore.StoredValue update,
            OperationResult success) {
        TextScaleStore.WriteResult write = store.compareAndSet(expected, update);
        if (write == TextScaleStore.WriteResult.CONFLICT) {
            load();
            preview = null;
            message = "Text size changed elsewhere. Review the current size.";
            return OperationResult.CONFLICT;
        }
        if (write == TextScaleStore.WriteResult.FAILED) {
            latchUncertain(PersistenceState.FAILED,
                    "Text size could not be saved. It will not be retried automatically.");
            return OperationResult.PERSISTENCE_FAILED;
        }
        if (write == TextScaleStore.WriteResult.UNKNOWN) {
            latchUncertain(PersistenceState.UNKNOWN,
                    "Text size could not be confirmed saved. It will not be retried automatically.");
            return OperationResult.PERSISTENCE_UNKNOWN;
        }
        TextScaleStore.ReadResult observed = store.read();
        persistenceState = stateFor(observed.status);
        if (observed.status == TextScaleStore.ReadResult.Status.PRESENT && update.equals(observed.value)) {
            stored = observed.value;
            current = observed.value.current;
            message = success == OperationResult.APPLIED
                    ? "Text size is now " + current.label() + "."
                    : "Text size was restored to " + current.label() + ".";
            return success;
        }
        latchUncertain(PersistenceState.UNKNOWN,
                "Text size could not be confirmed saved. It will not be retried automatically.");
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
                "Text size could not be saved. It will not be retried automatically.");
        return OperationResult.PERSISTENCE_UNKNOWN;
    }

    private void latchUncertain(PersistenceState state, String outcomeMessage) {
        persistenceState = state;
        preview = null;
        message = outcomeMessage;
    }

    private static PersistenceState stateFor(TextScaleStore.ReadResult.Status status) {
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
                return "Text size could not be read. It was not changed.";
            case FAILED:
                return "Text size could not be read. Try again later.";
            case UNKNOWN:
                return "Text size could not be confirmed. It will not be retried automatically.";
            default:
                return currentMessage();
        }
    }

    private String currentMessage() {
        return "Text size: " + current.label() + ".";
    }
}
