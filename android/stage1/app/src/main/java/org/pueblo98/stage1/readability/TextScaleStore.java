package org.pueblo98.stage1.readability;

/**
 * Versioned local preference boundary. A successful write is never itself the
 * outcome oracle: callers must read the value back before reporting success.
 */
public interface TextScaleStore {
    ReadResult read();

    WriteResult compareAndSet(StoredValue expected, StoredValue update);

    final class StoredValue {
        public final long version;
        public final TextScale current;
        public final TextScale previous;

        public StoredValue(long version, TextScale current, TextScale previous) {
            if (version < 1 || current == null) {
                throw new IllegalArgumentException("Stored scale must have a version and current value.");
            }
            this.version = version;
            this.current = current;
            this.previous = previous;
        }

        @Override
        public boolean equals(Object other) {
            if (!(other instanceof StoredValue)) {
                return false;
            }
            StoredValue that = (StoredValue) other;
            return version == that.version && current == that.current && previous == that.previous;
        }

        @Override
        public int hashCode() {
            int result = Long.hashCode(version);
            result = 31 * result + current.hashCode();
            return 31 * result + (previous == null ? 0 : previous.hashCode());
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
