package org.pueblo98.granny.c2observer;

/** Pure allowlist and timing contract for the manual lifecycle trials. */
final class CaptureTrialPlan {
    static final String STANDARD = "standard";
    static final String STOP = "stop";
    static final String REVOKE = "revoke";
    static final String RESIZE = "resize";
    static final String PROCESS_LOSS = "process-loss";

    private static final long LIFECYCLE_TRIAL_MILLIS = 10_000L;

    final String id;
    final long holdOpenMillis;
    final boolean requireResize;

    private CaptureTrialPlan(String id, long holdOpenMillis, boolean requireResize) {
        this.id = id;
        this.holdOpenMillis = holdOpenMillis;
        this.requireResize = requireResize;
    }

    static CaptureTrialPlan from(String requested) {
        String id = requested == null ? STANDARD : requested;
        switch (id) {
            case STANDARD:
                return new CaptureTrialPlan(id, 0L, false);
            case STOP:
            case REVOKE:
            case PROCESS_LOSS:
                return new CaptureTrialPlan(id, LIFECYCLE_TRIAL_MILLIS, false);
            case RESIZE:
                return new CaptureTrialPlan(id, LIFECYCLE_TRIAL_MILLIS, true);
            default:
                throw new IllegalArgumentException("unknown trial");
        }
    }
}
