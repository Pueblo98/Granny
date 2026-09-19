package org.pueblo98.granny.c2observer;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public final class CaptureSessionStateMachineTest {
    @Test
    public void deniedConsentNeverStartsCapture() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long generation = machine.beginRequest();

        assertTrue(machine.consentDenied(generation));
        assertFalse(machine.serviceStarted(generation));
        assertEquals(CaptureSessionStateMachine.State.DENIED, machine.state());
    }

    @Test
    public void oneGrantCanReachCapturingOnce() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long generation = machine.beginRequest();

        assertTrue(machine.consentGranted(generation));
        assertTrue(machine.serviceStarted(generation));
        assertFalse(machine.serviceStarted(generation));
        assertEquals(CaptureSessionStateMachine.State.CAPTURING, machine.state());
    }

    @Test
    public void stopInvalidatesLateConsent() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long generation = machine.beginRequest();

        machine.requestStop();

        assertFalse(machine.consentGranted(generation));
        assertEquals(CaptureSessionStateMachine.State.STOPPING, machine.state());
        assertTrue(machine.generation() > generation);
    }

    @Test
    public void namedStopInvalidatesOnlyOutstandingChooserGeneration() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long first = machine.beginRequest();

        assertTrue(machine.requestStop(first));
        assertFalse(machine.requestStop(first - 1L));
        assertFalse(machine.consentGranted(first));
        assertEquals(CaptureSessionStateMachine.State.STOPPING, machine.state());
    }

    @Test
    public void replacementRequestInvalidatesOldConsent() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long first = machine.beginRequest();

        assertEquals(-1L, machine.beginRequest());
        machine.requestStop();
        machine.stopped();
        long second = machine.beginRequest();
        assertFalse(machine.consentGranted(first));
        assertTrue(machine.consentGranted(second));
    }

    @Test
    public void unavailableIsTerminalUntilNewExplicitRequest() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long first = machine.beginRequest();
        machine.unavailable();

        assertFalse(machine.consentGranted(first));
        assertEquals(CaptureSessionStateMachine.State.UNAVAILABLE, machine.state());

        long second = machine.beginRequest();
        assertTrue(machine.consentGranted(second));
    }

    @Test
    public void recreatedActivitySeedsGenerationAboveProcessLedger() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine(3L);

        long next = machine.beginRequest();

        assertEquals(4L, next);
        assertTrue(machine.consentGranted(next));
        assertFalse(machine.consentGranted(3L));
    }

    @Test
    public void stopAfterLocalAdmissionCannotAdmitAnotherCapture() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long generation = machine.beginRequest();

        assertTrue(machine.consentGranted(generation));
        assertTrue(machine.serviceStarted(generation));
        machine.requestStop();

        assertFalse(machine.serviceStarted(generation));
        assertEquals(CaptureSessionStateMachine.State.STOPPING, machine.state());
    }

    @Test
    public void concurrentRequestIsRefusedUntilTheCurrentSessionTerminates() {
        CaptureSessionStateMachine machine = new CaptureSessionStateMachine();
        long generation = machine.beginRequest();

        assertFalse(machine.canBeginRequest());
        assertEquals(-1L, machine.beginRequest());
        assertTrue(machine.consentGranted(generation));
        assertTrue(machine.serviceStarted(generation));
        assertEquals(-1L, machine.beginRequest());
        machine.stopped();
        assertTrue(machine.canBeginRequest());
    }

    @Test
    public void recreatedSurfaceRetainsActiveSessionExclusion() {
        LabSessionLedger ledger = new LabSessionLedger();
        assertTrue(ledger.requesting(7L, "Choose one app."));
        assertTrue(ledger.active(7L, "standard"));

        CaptureSessionStateMachine machine = new CaptureSessionStateMachine(ledger.snapshot());

        assertFalse(machine.canBeginRequest());
        assertEquals(-1L, machine.beginRequest());
    }
}
