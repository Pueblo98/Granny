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
    private long activeRequestGeneration;
    private State state = State.IDLE;

    public CaptureSessionStateMachine() {
        this(0L);
    }

    CaptureSessionStateMachine(long initialGeneration) {
        generation = Math.max(0L, initialGeneration);
        activeRequestGeneration = generation;
    }

    CaptureSessionStateMachine(LabSessionLedger.Snapshot snapshot) {
        this(snapshot.generation);
        if (snapshot.phase == LabSessionLedger.Phase.REQUESTING) {
            state = State.REQUESTING_CONSENT;
        } else if (snapshot.phase == LabSessionLedger.Phase.ACTIVE) {
            state = State.CAPTURING;
        } else if (snapshot.phase == LabSessionLedger.Phase.STOPPING) {
            state = State.STOPPING;
        } else if (snapshot.phase == LabSessionLedger.Phase.RESULT) {
            state = State.STOPPED;
        }
    }

    public synchronized long beginRequest() {
        if (!canBeginRequest()) {
            return -1L;
        }
        generation += 1;
        activeRequestGeneration = generation;
        state = State.REQUESTING_CONSENT;
        return generation;
    }

    public synchronized boolean canBeginRequest() {
        return state == State.IDLE
                || state == State.STOPPED
                || state == State.DENIED
                || state == State.UNAVAILABLE;
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

    public synchronized void reconcile(LabSessionLedger.Snapshot snapshot) {
        if (snapshot.generation < activeRequestGeneration) {
            return;
        }
        // Cancellation advances the local consent epoch, but cleanup still
        // acknowledges the request it stopped. It may close, never revive it.
        if (snapshot.generation < generation
                && snapshot.phase != LabSessionLedger.Phase.RESULT
                && snapshot.phase != LabSessionLedger.Phase.STOPPING) {
            return;
        }
        generation = Math.max(generation, snapshot.generation);
        activeRequestGeneration = snapshot.generation;
        if (snapshot.phase == LabSessionLedger.Phase.REQUESTING) {
            state = State.REQUESTING_CONSENT;
        } else if (snapshot.phase == LabSessionLedger.Phase.ACTIVE) {
            state = State.CAPTURING;
        } else if (snapshot.phase == LabSessionLedger.Phase.STOPPING) {
            state = State.STOPPING;
        } else if (snapshot.phase == LabSessionLedger.Phase.RESULT) {
            state = State.STOPPED;
        }
    }

    public synchronized long generation() {
        return generation;
    }

    private boolean accepts(long candidateGeneration, State expected) {
        return generation == candidateGeneration && state == expected;
    }
}
