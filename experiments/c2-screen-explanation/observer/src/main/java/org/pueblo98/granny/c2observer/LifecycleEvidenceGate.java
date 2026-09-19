package org.pueblo98.granny.c2observer;

/** Pure ordering guard for freshness and post-freshness resize evidence. */
final class LifecycleEvidenceGate {
    private boolean freshnessAccepted;
    private boolean resizeAfterFreshness;

    void onFreshnessAccepted() {
        freshnessAccepted = true;
    }

    void onResizeObserved() {
        if (freshnessAccepted) {
            resizeAfterFreshness = true;
        }
    }

    boolean canFinish(boolean requireResize) {
        return freshnessAccepted && (!requireResize || resizeAfterFreshness);
    }
}
