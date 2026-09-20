package org.pueblo98.stage1.voice;

import java.util.function.BooleanSupplier;
import java.util.function.LongSupplier;

/** Dedicated absolute deadline and revocable restart queue, shared by Activity and host tests. */
public final class VoiceTurnScheduler {
    public interface Queue { void after(long milliseconds, Runnable work); }
    private final LongSupplier clock;
    private final Queue queue;
    private long epoch, deadline;
    private boolean active;
    private Runnable onExpired;
    public VoiceTurnScheduler(LongSupplier clock, Queue queue) { this.clock=clock; this.queue=queue; }
    public void begin(long absoluteDeadline, Runnable expired) {
        cancel(); active=true; deadline=absoluteDeadline; onExpired=expired;
        long token=epoch;
        queue.after(Math.max(0,deadline-clock.getAsLong()),()->expire(token));
    }
    public void restartAfter(long delay, BooleanSupplier stillAllowed, Runnable start) {
        long token=epoch;
        if(!active)return;
        queue.after(Math.min(delay,Math.max(0,deadline-clock.getAsLong())),()->{
            if(!active||token!=epoch)return;
            if(clock.getAsLong()>=deadline){expire(token);return;}
            if(stillAllowed.getAsBoolean())start.run();
        });
    }
    public void cancel() { epoch++;active=false;onExpired=null; }
    private void expire(long token) {
        if(!active||epoch!=token)return;
        if(clock.getAsLong()<deadline) {
            queue.after(deadline-clock.getAsLong(),()->expire(token));return;
        }
        Runnable callback=onExpired;cancel();callback.run();
    }
}
