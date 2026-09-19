package org.pueblo98.stage1.conversation;

import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

/** Closed C5 adapter/observation ports; no arbitrary capability verbs exist. */
public final class CapabilityPorts {
    private CapabilityPorts() {}
    public static final class Prepared {
        public final TextScaleStore.StoredValue prior, target;
        public final boolean restore;
        public Prepared(TextScaleStore.StoredValue prior, TextScaleStore.StoredValue target, boolean restore) { this.prior=prior; this.target=target; this.restore=restore; }
    }
    public interface CapabilityAdapter { Prepared prepare(TextScale scale, boolean restore); boolean dispatch(Prepared prepared); void cancel(); }
    public interface OutcomeObserver { TextScaleStore.ReadResult observe(); }
    public static final class C5Adapter implements CapabilityAdapter {
        private final TextScaleController controller; private final TextScaleStore store;
        public C5Adapter(TextScaleController c, TextScaleStore s) { controller=c; store=s; }
        public Prepared prepare(TextScale scale, boolean restore) {
            TextScaleStore.ReadResult r=store.read(); if (r.status!=TextScaleStore.ReadResult.Status.PRESENT && r.status!=TextScaleStore.ReadResult.Status.ABSENT) return null;
            TextScaleStore.StoredValue prior=r.value; TextScale current=prior==null?TextScale.DEFAULT:prior.current;
            TextScale target=restore ? (prior==null?null:prior.previous) : scale;
            if (target==null || (!restore && !controller.preview(target))) return null;
            long version=prior==null?1:prior.version==Long.MAX_VALUE?-1:prior.version+1; if(version<0) return null;
            return new Prepared(prior,new TextScaleStore.StoredValue(version,target,restore?null:current),restore);
        }
        public boolean dispatch(Prepared p) { TextScaleController.OperationResult r=p.restore?controller.restore():controller.apply(); return r==TextScaleController.OperationResult.APPLIED||r==TextScaleController.OperationResult.ALREADY_APPLIED||r==TextScaleController.OperationResult.RESTORED; }
        public void cancel() { controller.cancelPreview(); }
    }
    public static final class StoreObserver implements OutcomeObserver { private final TextScaleStore store; public StoreObserver(TextScaleStore s){store=s;} public TextScaleStore.ReadResult observe(){return store.read();} }
}
