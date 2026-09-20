package org.pueblo98.stage1.speech;

/** Versioned speech-settings boundary with explicit readback verification. */
public interface SpeechSettingsStore {
    ReadResult read();

    WriteResult compareAndSet(StoredValue expected, StoredValue update);

    final class StoredValue {
        public final long version;
        public final SpeechRate currentRate;
        public final SpeechRate previousRate;
        public final boolean soundEnabled;

        public StoredValue(
                long version,
                SpeechRate currentRate,
                SpeechRate previousRate,
                boolean soundEnabled) {
            if (version < 1 || currentRate == null) {
                throw new IllegalArgumentException("Stored speech settings require a version and rate.");
            }
            this.version = version;
            this.currentRate = currentRate;
            this.previousRate = previousRate;
            this.soundEnabled = soundEnabled;
        }

        @Override
        public boolean equals(Object other) {
            if (!(other instanceof StoredValue)) {
                return false;
            }
            StoredValue that = (StoredValue) other;
            return version == that.version
                    && currentRate == that.currentRate
                    && previousRate == that.previousRate
                    && soundEnabled == that.soundEnabled;
        }

        @Override
        public int hashCode() {
            int result = Long.hashCode(version);
            result = 31 * result + currentRate.hashCode();
            result = 31 * result + (previousRate == null ? 0 : previousRate.hashCode());
            return 31 * result + Boolean.hashCode(soundEnabled);
        }
    }

    final class ReadResult {
        public enum Status { PRESENT, ABSENT, CORRUPT, FAILED, UNKNOWN }

        public final Status status;
        public final StoredValue value;

        private ReadResult(Status status, StoredValue value) {
            this.status = status;
            this.value = value;
        }

        public static ReadResult present(StoredValue value) {
            return new ReadResult(Status.PRESENT, value);
        }

        public static ReadResult absent() {
            return new ReadResult(Status.ABSENT, null);
        }

        public static ReadResult corrupt() {
            return new ReadResult(Status.CORRUPT, null);
        }

        public static ReadResult failed() {
            return new ReadResult(Status.FAILED, null);
        }

        public static ReadResult unknown() {
            return new ReadResult(Status.UNKNOWN, null);
        }
    }

    enum WriteResult { WRITTEN, CONFLICT, FAILED, UNKNOWN }
}
