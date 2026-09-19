package org.pueblo98.granny.c2observer;

/** Pure state guard for one-use projection consent and Stop invalidation. */
public final class CaptureSessionStateMachine {
    public enum State {
        IDLE,
        REQUESTING_CONSENT,
        STARTING_SERVICE,
        CAPTURING,
        STOPPING,
        STOPPED,
        DENIED,
        UNAVAILABLE
    }

    private long generation;
    private State state = State.IDLE;

    public synchronized long beginRequest() {
        generation += 1;
        state = State.REQUESTING_CONSENT;
        return generation;
    }

    public synchronized boolean consentDenied(long candidateGeneration) {
        if (!accepts(candidateGeneration, State.REQUESTING_CONSENT)) {
            return false;
        }
        state = State.DENIED;
        return true;
    }

    public synchronized boolean consentGranted(long candidateGeneration) {
        if (!accepts(candidateGeneration, State.REQUESTING_CONSENT)) {
            return false;
        }
        state = State.STARTING_SERVICE;
        return true;
    }

    public synchronized boolean serviceStarted(long candidateGeneration) {
        if (!accepts(candidateGeneration, State.STARTING_SERVICE)) {
            return false;
        }
        state = State.CAPTURING;
        return true;
    }

    public synchronized void requestStop() {
        generation += 1;
        if (state == State.IDLE || state == State.DENIED || state == State.UNAVAILABLE) {
            state = State.STOPPED;
        } else if (state != State.STOPPED) {
            state = State.STOPPING;
        }
    }

    /** Invalidates only the named outstanding chooser request. */
    public synchronized boolean requestStop(long candidateGeneration) {
        if (!accepts(candidateGeneration, State.REQUESTING_CONSENT)) {
            return false;
        }
        generation += 1;
        state = State.STOPPING;
        return true;
    }

    public synchronized void stopped() {
        state = State.STOPPED;
    }

    public synchronized void unavailable() {
        generation += 1;
        state = State.UNAVAILABLE;
    }

    public synchronized State state() {
        return state;
    }

    public synchronized long generation() {
        return generation;
    }

    private boolean accepts(long candidateGeneration, State expected) {
        return generation == candidateGeneration && state == expected;
    }
}
