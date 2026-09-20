package org.pueblo98.granny.perceptionlab;

import org.junit.Test;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import static org.junit.Assert.*;

public class LocalOcrRequestTest {
    @Test public void stopDropsLateResult() {
        AtomicInteger calls = new AtomicInteger();
        LocalOcr.Request request = new LocalOcr.Request((lines, elapsed, status) -> calls.incrementAndGet());
        request.cancel(); request.deliver(List.of(), 5, "completed-partial");
        assertFalse(request.active()); assertEquals(0, calls.get());
    }
    @Test public void timeoutOrSuccessConsumesCallbackExactlyOnce() {
        AtomicInteger calls = new AtomicInteger();
        LocalOcr.Request request = new LocalOcr.Request((lines, elapsed, status) -> calls.incrementAndGet());
        request.deliver(List.of(), 10000, "timeout");
        request.deliver(List.of(), 11000, "completed-partial");
        assertFalse(request.active()); assertEquals(1, calls.get());
    }
}
