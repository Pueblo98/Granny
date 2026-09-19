package org.pueblo98.granny.c2observer;

/**
 * Requires a temporally separated marker-phase transition before accepting a
 * fixed fixture interpretation. A static cached frame can never pass.
 */
final class FreshFrameGate {
    enum Decision { WAITING, ACCEPT, REJECT }

    static final long MIN_TRANSITION_MILLIS = 500L;

    private String fixtureId;
    private int firstPhase = -1;
    private long firstSeenAtMillis;
    private boolean terminal;

    Decision observe(FixtureMarkerInterpreter.Interpretation interpretation, long nowMillis) {
        if (terminal) {
            return Decision.REJECT;
        }
        if (interpretation.status == FixtureMarkerInterpreter.Status.UNAVAILABLE
                || interpretation.markerPhase < 0) {
            return Decision.WAITING;
        }
        if (fixtureId == null) {
            fixtureId = interpretation.fixtureId;
            firstPhase = interpretation.markerPhase;
            firstSeenAtMillis = nowMillis;
            return Decision.WAITING;
        }
        if (!fixtureId.equals(interpretation.fixtureId)) {
            terminal = true;
            return Decision.REJECT;
        }
        if (interpretation.markerPhase == firstPhase
                || nowMillis - firstSeenAtMillis < MIN_TRANSITION_MILLIS) {
            return Decision.WAITING;
        }
        terminal = true;
        return Decision.ACCEPT;
    }
}
