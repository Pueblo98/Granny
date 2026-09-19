package org.pueblo98.stage1.conversation;

import java.util.Objects;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

/** Finite C5 execution and independently injected observation boundaries. */
public final class CapabilityPorts {
    private CapabilityPorts() {}
    public static final class Prepared {
        public final TextScaleStore.StoredValue prior;
        /** Null represents the unchanged default when there is no saved override. */
        public final TextScaleStore.StoredValue target;
        public final boolean restore;
        public Prepared(TextScaleStore.StoredValue prior, TextScaleStore.StoredValue target, boolean restore) {
            this.prior = prior; this.target = target; this.restore = restore;
        }
        public TextScale before() { return prior == null ? TextScale.DEFAULT : prior.current; }
        public TextScale after() { return target == null ? TextScale.DEFAULT : target.current; }
        public boolean noChange() { return Objects.equals(prior, target); }
    }
    public interface CapabilityAdapter {
        Prepared prepare(TextScale scale, boolean restore);
        boolean dispatch(Prepared prepared);
        void cancel();
    }
    public interface OutcomeObserver { TextScaleStore.ReadResult observe(); }

    public static boolean matches(TextScaleStore.ReadResult observed, TextScaleStore.StoredValue expected) {
        if (observed == null) return false;
        return expected == null ? observed.status == TextScaleStore.ReadResult.Status.ABSENT
                : observed.status == TextScaleStore.ReadResult.Status.PRESENT && expected.equals(observed.value);
    }

    public static final class C5Adapter implements CapabilityAdapter {
        private final TextScaleController controller;
        private final TextScaleStore store;
        public C5Adapter(TextScaleController controller, TextScaleStore store) {
            this.controller = Objects.requireNonNull(controller);
            this.store = Objects.requireNonNull(store);
        }
        public Prepared prepare(TextScale scale, boolean restore) {
            controller.reload();
            TextScaleController.PersistenceState health = controller.snapshot().persistenceState;
            if (health != TextScaleController.PersistenceState.HEALTHY
                    && health != TextScaleController.PersistenceState.ABSENT) return null;
            TextScaleStore.ReadResult read = store.read();
            if (read.status != TextScaleStore.ReadResult.Status.PRESENT
                    && read.status != TextScaleStore.ReadResult.Status.ABSENT) return null;
            TextScaleStore.StoredValue prior = read.value;
            TextScale current = prior == null ? TextScale.DEFAULT : prior.current;
            TextScale target = restore ? (prior == null ? null : prior.previous) : scale;
            if (target == null || !restore && !controller.preview(target)) return null;
            if (!restore && target == current) return new Prepared(prior, prior, false);
            if (prior != null && prior.version == Long.MAX_VALUE) return null;
            long version = prior == null ? 1 : prior.version + 1;
            return new Prepared(prior, new TextScaleStore.StoredValue(version, target, restore ? null : current), restore);
        }
        public boolean dispatch(Prepared prepared) {
            if (!matches(store.read(), prepared.prior)) return false;
            if (prepared.noChange()) { controller.cancelPreview(); return true; }
            // A mutable preview is not authority. Refuse if anything replaced the frozen choice.
            if (!prepared.restore && controller.snapshot().preview != prepared.after()) return false;
            TextScaleController.OperationResult result = prepared.restore ? controller.restore() : controller.apply();
            return result == TextScaleController.OperationResult.APPLIED
                    || result == TextScaleController.OperationResult.RESTORED;
        }
        public void cancel() { controller.cancelPreview(); }
    }

    public static final class StoreObserver implements OutcomeObserver {
        private final TextScaleStore store;
        public StoreObserver(TextScaleStore store) { this.store = Objects.requireNonNull(store); }
        public TextScaleStore.ReadResult observe() { return store.read(); }
    }
}
