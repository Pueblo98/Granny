package org.pueblo98.stage1.speech;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class SpeechSettingsControllerTest {
    @Test
    public void rateChoicesMatchTheClosedDesignContract() {
        assertEquals(4, SpeechRate.values().length);
        assertEquals(0.75f, SpeechRate.SLOWER.multiplier(), 0f);
        assertEquals(1f, SpeechRate.NORMAL.multiplier(), 0f);
        assertEquals(1.25f, SpeechRate.FASTER.multiplier(), 0f);
        assertEquals(1.5f, SpeechRate.FASTEST.multiplier(), 0f);
    }

    @Test
    public void rateCannotApplyUntilMatchingPreviewFinishes() {
        FakeStore store = new FakeStore();
        SpeechSettingsController controller = new SpeechSettingsController(store);

        assertTrue(controller.preview(SpeechRate.FASTER));
        assertEquals(SpeechSettingsController.OperationResult.PREVIEW_REQUIRED,
                controller.applyRate());
        assertFalse(controller.markPreviewHeard(SpeechRate.SLOWER));
        assertTrue(controller.markPreviewHeard(SpeechRate.FASTER));
        assertEquals(SpeechSettingsController.OperationResult.APPLIED,
                controller.applyRate());
        assertEquals(SpeechRate.FASTER, controller.snapshot().currentRate);
        assertEquals(1, store.writes);
    }

    @Test
    public void applyPersistsAndRestoreReturnsToPriorRate() {
        FakeStore store = new FakeStore();
        SpeechSettingsController controller = new SpeechSettingsController(store);
        controller.preview(SpeechRate.FASTEST);
        controller.markPreviewHeard(SpeechRate.FASTEST);
        controller.applyRate();

        SpeechSettingsController restarted = new SpeechSettingsController(store);
        assertEquals(SpeechRate.FASTEST, restarted.snapshot().currentRate);
        assertTrue(restarted.snapshot().restoreAvailable);
        assertEquals(SpeechSettingsController.OperationResult.RESTORED,
                restarted.restoreRate());
        assertEquals(SpeechRate.NORMAL, restarted.snapshot().currentRate);
        assertFalse(restarted.snapshot().restoreAvailable);
    }

    @Test
    public void soundOffPersistsAndBlocksRatePreview() {
        FakeStore store = new FakeStore();
        SpeechSettingsController controller = new SpeechSettingsController(store);

        assertEquals(SpeechSettingsController.OperationResult.SOUND_CHANGED,
                controller.setSoundEnabled(false));
        assertFalse(controller.snapshot().soundEnabled);
        assertFalse(controller.preview(SpeechRate.SLOWER));

        SpeechSettingsController restarted = new SpeechSettingsController(store);
        assertFalse(restarted.snapshot().soundEnabled);
        assertEquals(SpeechSettingsController.OperationResult.SOUND_CHANGED,
                restarted.setSoundEnabled(true));
        assertTrue(restarted.snapshot().soundEnabled);
    }

    @Test
    public void cancellingRatePreviewDoesNotWrite() {
        FakeStore store = new FakeStore();
        SpeechSettingsController controller = new SpeechSettingsController(store);
        controller.preview(SpeechRate.SLOWER);

        assertTrue(controller.cancelPreview());
        assertNull(controller.snapshot().previewRate);
        assertEquals(0, store.writes);
    }

    @Test
    public void conflictReloadsAndCancelsPreview() {
        FakeStore store = new FakeStore(new SpeechSettingsStore.StoredValue(
                2, SpeechRate.NORMAL, null, true));
        SpeechSettingsController controller = new SpeechSettingsController(store);
        controller.preview(SpeechRate.FASTER);
        controller.markPreviewHeard(SpeechRate.FASTER);
        store.value = new SpeechSettingsStore.StoredValue(3, SpeechRate.SLOWER, null, true);

        assertEquals(SpeechSettingsController.OperationResult.CONFLICT,
                controller.applyRate());
        assertEquals(SpeechRate.SLOWER, controller.snapshot().currentRate);
        assertNull(controller.snapshot().previewRate);
    }

    @Test
    public void unknownWriteDoesNotClaimNewSettingOrRetry() {
        FakeStore store = new FakeStore();
        SpeechSettingsController controller = new SpeechSettingsController(store);
        controller.preview(SpeechRate.FASTER);
        controller.markPreviewHeard(SpeechRate.FASTER);
        store.writeResult = SpeechSettingsStore.WriteResult.UNKNOWN;

        assertEquals(SpeechSettingsController.OperationResult.PERSISTENCE_UNKNOWN,
                controller.applyRate());
        assertEquals(SpeechRate.NORMAL, controller.snapshot().currentRate);
        assertEquals(SpeechSettingsController.PersistenceState.UNKNOWN,
                controller.snapshot().persistenceState);
        assertFalse(controller.preview(SpeechRate.FASTEST));
        assertEquals(1, store.writes);
    }

    @Test
    public void mismatchedReadbackIsUnverified() {
        FakeStore store = new FakeStore();
        SpeechSettingsController controller = new SpeechSettingsController(store);
        controller.preview(SpeechRate.FASTER);
        controller.markPreviewHeard(SpeechRate.FASTER);
        store.readbackOverride = new SpeechSettingsStore.StoredValue(
                1, SpeechRate.SLOWER, SpeechRate.NORMAL, true);

        assertEquals(SpeechSettingsController.OperationResult.UNVERIFIED,
                controller.applyRate());
        assertEquals(SpeechRate.NORMAL, controller.snapshot().currentRate);
        assertEquals(SpeechSettingsController.PersistenceState.UNKNOWN,
                controller.snapshot().persistenceState);
    }

    @Test
    public void corruptStoreUsesSafeDefaultsAndRefusesWrites() {
        FakeStore store = new FakeStore();
        store.readResult = SpeechSettingsStore.ReadResult.corrupt();
        SpeechSettingsController controller = new SpeechSettingsController(store);

        assertEquals(SpeechRate.NORMAL, controller.snapshot().currentRate);
        assertTrue(controller.snapshot().soundEnabled);
        assertFalse(controller.preview(SpeechRate.FASTER));
        assertEquals(SpeechSettingsController.OperationResult.PERSISTENCE_CORRUPT,
                controller.setSoundEnabled(false));
        assertEquals(0, store.writes);
    }

    private static final class FakeStore implements SpeechSettingsStore {
        StoredValue value;
        ReadResult readResult;
        StoredValue readbackOverride;
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
            if (readbackOverride != null && writes > 0) {
                return ReadResult.present(readbackOverride);
            }
            return value == null ? ReadResult.absent() : ReadResult.present(value);
        }

        @Override
        public WriteResult compareAndSet(StoredValue expected, StoredValue update) {
            writes += 1;
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
