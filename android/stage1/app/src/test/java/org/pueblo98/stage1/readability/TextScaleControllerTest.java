package org.pueblo98.stage1.readability;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class TextScaleControllerTest {
    @Test
    public void choicesAreClosedAndHaveStablePresentationValues() {
        assertEquals(4, TextScale.values().length);
        assertEquals(1.0f, TextScale.DEFAULT.multiplier(), 0.0f);
        assertEquals(1.15f, TextScale.COMFORTABLE.multiplier(), 0.0f);
        assertEquals(1.3f, TextScale.LARGE.multiplier(), 0.0f);
        assertEquals(1.5f, TextScale.EXTRA_LARGE.multiplier(), 0.0f);
        assertEquals("Largest", TextScale.EXTRA_LARGE.label());
    }

    @Test
    public void previewAndStopDoNotWrite() {
        FakeStore store = new FakeStore();
        TextScaleController controller = new TextScaleController(store);

        assertTrue(controller.preview(TextScale.LARGE));
        assertEquals(TextScale.LARGE, controller.snapshot().preview);
        assertTrue(controller.cancelPreview());
        assertNull(controller.snapshot().preview);
        assertEquals(0, store.writes);
        assertEquals(TextScale.DEFAULT, controller.snapshot().current);
    }

    @Test
    public void applyPersistsAndFreshControllerReadsBackExactValue() {
        FakeStore store = new FakeStore();
        TextScaleController controller = new TextScaleController(store);
        controller.preview(TextScale.LARGE);

        assertEquals(TextScaleController.OperationResult.APPLIED, controller.apply());
        assertEquals(TextScale.LARGE, controller.snapshot().current);
        assertTrue(controller.snapshot().restoreAvailable);
        assertEquals(new TextScaleStore.StoredValue(1, TextScale.LARGE, TextScale.DEFAULT), store.value);

        TextScaleController restarted = new TextScaleController(store);
        assertEquals(TextScale.LARGE, restarted.snapshot().current);
        assertTrue(restarted.snapshot().restoreAvailable);
    }

    @Test
    public void sameScaleApplyIsIdempotentAndDoesNotWrite() {
        FakeStore store = new FakeStore(new TextScaleStore.StoredValue(4, TextScale.LARGE, TextScale.DEFAULT));
        TextScaleController controller = new TextScaleController(store);

        controller.preview(TextScale.LARGE);
        assertEquals(TextScaleController.OperationResult.ALREADY_APPLIED, controller.apply());
        assertEquals(0, store.writes);
        assertEquals(TextScale.LARGE, controller.snapshot().current);
    }

    @Test
    public void restoreUsesStoredPriorValueAndClearsRestoreAvailability() {
        FakeStore store = new FakeStore(new TextScaleStore.StoredValue(2, TextScale.EXTRA_LARGE, TextScale.COMFORTABLE));
        TextScaleController controller = new TextScaleController(store);

        assertEquals(TextScaleController.OperationResult.RESTORED, controller.restore());
        assertEquals(TextScale.COMFORTABLE, controller.snapshot().current);
        assertFalse(controller.snapshot().restoreAvailable);
        assertEquals(new TextScaleStore.StoredValue(3, TextScale.COMFORTABLE, null), store.value);
        assertEquals(TextScaleController.OperationResult.NO_RESTORE, controller.restore());
    }

    @Test
    public void corruptStoreUsesSafeDefaultAndRejectsOverwrite() {
        FakeStore store = new FakeStore();
        store.readResult = TextScaleStore.ReadResult.corrupt();
        TextScaleController controller = new TextScaleController(store);

        assertEquals(TextScale.DEFAULT, controller.snapshot().current);
        assertEquals(TextScaleController.PersistenceState.CORRUPT, controller.snapshot().persistenceState);
        assertEquals("Text size could not be read. It was not changed.", controller.snapshot().message);
        assertFalse(controller.preview(TextScale.LARGE));
        assertEquals(TextScaleController.OperationResult.NO_PREVIEW, controller.apply());
        assertEquals(0, store.writes);
    }

    @Test
    public void failedAndUnknownWritesDoNotClaimApplied() {
        FakeStore failed = new FakeStore();
        TextScaleController failedController = new TextScaleController(failed);
        failedController.preview(TextScale.LARGE);
        failed.writeResult = TextScaleStore.WriteResult.FAILED;
        assertEquals(TextScaleController.OperationResult.PERSISTENCE_FAILED, failedController.apply());
        assertEquals(TextScale.DEFAULT, failedController.snapshot().current);
        assertEquals(TextScaleController.PersistenceState.FAILED, failedController.snapshot().persistenceState);
        assertNull(failedController.snapshot().preview);

        FakeStore unknown = new FakeStore();
        TextScaleController unknownController = new TextScaleController(unknown);
        unknownController.preview(TextScale.LARGE);
        unknown.writeResult = TextScaleStore.WriteResult.UNKNOWN;
        assertEquals(TextScaleController.OperationResult.PERSISTENCE_UNKNOWN, unknownController.apply());
        assertEquals(TextScale.DEFAULT, unknownController.snapshot().current);
        assertEquals(TextScaleController.PersistenceState.UNKNOWN, unknownController.snapshot().persistenceState);
        assertNull(unknownController.snapshot().preview);
        unknownController.reload();
        assertFalse(unknownController.preview(TextScale.EXTRA_LARGE));
    }

    @Test
    public void mismatchedReadbackIsUnknownOutcomeNotSuccess() {
        FakeStore store = new FakeStore();
        store.readbackOverride = new TextScaleStore.StoredValue(1, TextScale.COMFORTABLE, TextScale.DEFAULT);
        TextScaleController controller = new TextScaleController(store);
        controller.preview(TextScale.LARGE);

        assertEquals(TextScaleController.OperationResult.UNVERIFIED, controller.apply());
        assertEquals(TextScale.DEFAULT, controller.snapshot().current);
        assertEquals(TextScaleController.PersistenceState.UNKNOWN, controller.snapshot().persistenceState);
        assertNull(controller.snapshot().preview);
        controller.reload();
        assertFalse(controller.preview(TextScale.EXTRA_LARGE));
    }

    @Test
    public void unknownReadbackIsNotReportedAsApplied() {
        FakeStore store = new FakeStore();
        TextScaleController controller = new TextScaleController(store);
        controller.preview(TextScale.LARGE);
        store.readbackStatus = TextScaleStore.ReadResult.Status.UNKNOWN;

        assertEquals(TextScaleController.OperationResult.UNVERIFIED, controller.apply());
        assertEquals(TextScale.DEFAULT, controller.snapshot().current);
        assertEquals(TextScaleController.PersistenceState.UNKNOWN, controller.snapshot().persistenceState);
        assertEquals("Text size could not be confirmed saved. It will not be retried automatically.", controller.snapshot().message);
    }

    @Test
    public void exhaustedVersionRefusesToWriteOrOverflow() {
        FakeStore store = new FakeStore(new TextScaleStore.StoredValue(
                Long.MAX_VALUE, TextScale.DEFAULT, null));
        TextScaleController controller = new TextScaleController(store);
        controller.preview(TextScale.LARGE);

        assertEquals(TextScaleController.OperationResult.PERSISTENCE_UNKNOWN, controller.apply());
        assertEquals(0, store.writes);
        assertEquals(TextScaleController.PersistenceState.UNKNOWN, controller.snapshot().persistenceState);
        assertNull(controller.snapshot().preview);
    }

    @Test
    public void conflictReloadsCurrentValueAndCancelsOldPreview() {
        FakeStore store = new FakeStore(new TextScaleStore.StoredValue(2, TextScale.COMFORTABLE, TextScale.DEFAULT));
        TextScaleController controller = new TextScaleController(store);
        controller.preview(TextScale.LARGE);
        store.value = new TextScaleStore.StoredValue(3, TextScale.EXTRA_LARGE, TextScale.COMFORTABLE);

        assertEquals(TextScaleController.OperationResult.CONFLICT, controller.apply());
        assertEquals(TextScale.EXTRA_LARGE, controller.snapshot().current);
        assertNull(controller.snapshot().preview);
        controller.reload();
        assertNull(controller.snapshot().preview);
        assertEquals(TextScale.EXTRA_LARGE, controller.snapshot().current);
    }

    private static final class FakeStore implements TextScaleStore {
        StoredValue value;
        ReadResult readResult;
        StoredValue readbackOverride;
        ReadResult.Status readbackStatus;
        WriteResult writeResult = WriteResult.WRITTEN;
        int writes;

        FakeStore() {}

        FakeStore(StoredValue value) {
            this.value = value;
        }

        @Override
        public ReadResult read() {
            if (readResult != null) {
                return readResult;
            }
            if (readbackStatus != null && writes > 0) {
                switch (readbackStatus) {
                    case UNKNOWN:
                        return ReadResult.unknown();
                    case FAILED:
                        return ReadResult.failed();
                    case CORRUPT:
                        return ReadResult.corrupt();
                    default:
                        throw new AssertionError("Only failure states are test overrides.");
                }
            }
            if (readbackOverride != null && writes > 0) {
                return ReadResult.present(readbackOverride);
            }
            return value == null ? ReadResult.absent() : ReadResult.present(value);
        }

        @Override
        public WriteResult compareAndSet(StoredValue expected, StoredValue update) {
            writes++;
            if (writeResult != WriteResult.WRITTEN) {
                return writeResult;
            }
            if (expected == null ? value != null : !expected.equals(value)) {
                return WriteResult.CONFLICT;
            }
            value = update;
            return WriteResult.WRITTEN;
        }
    }
}
