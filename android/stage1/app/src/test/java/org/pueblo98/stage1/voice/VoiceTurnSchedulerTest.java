package org.pueblo98.stage1.voice;

import org.junit.Test;
import static org.junit.Assert.*;
import java.util.PriorityQueue;

/** Fake monotonic event loop exercises the same deadline/restart scheduler used by Activity. */
public final class VoiceTurnSchedulerTest {
    @Test public void finalFiftyMillisecondsBeforeDeadlineNeverStartsAnotherRecognizer() {
        Rig r=new Rig();r.begin();r.loop.advance(29_950);r.finalWords("First sentence.");
        r.loop.advance(30_000);
        assertEquals(1,r.starts);assertEquals(1,r.expirations);assertFalse(r.dictation.active());
        assertEquals("Seed First sentence.",r.draft);r.loop.advance(40_000);assertEquals(1,r.starts);
    }
    @Test public void doneInRestartGapKeepsDraftWithoutAnotherStart() {
        Rig r=new Rig();r.begin();r.finalWords("Sentence.");r.dictation.requestDone();r.finish();r.loop.advance(40_000);
        assertEquals(1,r.starts);assertEquals("Seed Sentence.",r.draft);assertEquals(0,r.expirations);
    }
    @Test public void stopCancelAndBackgroundInvalidateAlreadyQueuedRestart() {
        for(int mode=0;mode<3;mode++) {
            Rig r=new Rig();r.begin();r.finalWords("Sentence.");
            String original=r.dictation.originalDraft();r.finish();
            if(mode==1)r.draft=original;
            if(mode==2){r.dictation.clear();r.draft="";}
            r.loop.advance(40_000);assertEquals(1,r.starts);
            assertEquals(mode==0?"Seed Sentence.":mode==1?"Seed":"",r.draft);
        }
    }
    @Test public void permissionLossDuringGapFinishesWithoutRecognizerEntry() {
        Rig r=new Rig();r.begin();r.finalWords("Sentence.");r.permission=false;r.loop.advance(150);
        assertEquals(1,r.starts);assertEquals("Seed Sentence.",r.draft);assertFalse(r.dictation.active());
    }
    @Test public void synchronousStartFailureCancelsDeadlineAndDoesNotRetry() {
        Rig r=new Rig();r.failStart=true;r.begin();r.loop.advance(40_000);
        assertEquals(1,r.starts);assertEquals("Seed",r.draft);assertEquals(0,r.expirations);
    }
    @Test public void priorSegmentCallbacksCannotAlterNewSegmentOrQueueAnotherStart() {
        Rig r=new Rig();r.begin();long old=r.voice.snapshot().generation;r.finalWords("First.");r.loop.advance(150);
        assertEquals(2,r.starts);assertFalse(r.voice.partial(old,"late"));
        assertFalse(r.voice.finalResult(old,"late","late"));assertFalse(r.voice.error(old,"late"));
        r.dictation.requestDone();r.finalWords("Second.");
        assertEquals("Seed First. Second.",r.draft);r.loop.advance(40_000);assertEquals(2,r.starts);
    }
    @Test public void replacementTurnCannotBeExpiredByOldDeadline() {
        Loop loop=new Loop();int[] expired={0},starts={0};VoiceTurnScheduler s=new VoiceTurnScheduler(()->loop.now,loop);
        s.begin(100,()->expired[0]++);s.restartAfter(50,()->true,()->starts[0]++);s.cancel();
        s.begin(200,()->expired[0]++);loop.advance(100);assertEquals(0,expired[0]);assertEquals(0,starts[0]);
        loop.advance(200);assertEquals(1,expired[0]);
    }
    @Test public void foregroundGuardRejectsRestartEvenWithoutQueueRemoval() {
        Loop loop=new Loop();int[] starts={0};VoiceTurnScheduler s=new VoiceTurnScheduler(()->loop.now,loop);
        s.begin(30_000,()->{});s.restartAfter(150,()->false,()->starts[0]++);loop.advance(150);assertEquals(0,starts[0]);
    }
    @Test public void stoppedPermissionGenerationCannotStartMicrophone() {
        VoiceSessionController voice=new VoiceSessionController();long pending=voice.beginVoice(false);voice.stop("Stopped");
        assertFalse(voice.permissionGranted(pending));assertEquals(VoiceSessionController.Phase.IDLE,voice.snapshot().phase);
    }
    private static final class Rig {
        final Loop loop=new Loop();final DictationSession dictation=new DictationSession();
        final VoiceSessionController voice=new VoiceSessionController();
        final VoiceTurnScheduler scheduler=new VoiceTurnScheduler(()->loop.now,loop);
        int starts,expirations;boolean permission=true,failStart;String draft="";
        void begin(){dictation.begin("Seed",loop.now);scheduler.begin(dictation.deadline(),()->{expirations++;finish();});start();}
        void start(){if(!permission){finish();return;}long g=voice.beginVoice(true);
            if(!dictation.beginSegment(dictation.turn(),g,loop.now)){finish();return;}
            starts++;if(failStart){voice.error(g,"start failed");finish();}else voice.ready(g);}
        void finalWords(String words){long g=voice.snapshot().generation;
            if(!voice.finalResult(g,words,words))return;
            DictationSession.Result result=dictation.finalSegment(g,words,loop.now);
            if(result==DictationSession.Result.CONTINUE)scheduler.restartAfter(150,dictation::active,this::start);
            else if(result==DictationSession.Result.COMPLETE)finish();}
        void finish(){draft=dictation.finish();voice.stop("Finished");scheduler.cancel();}
    }
    private static final class Loop implements VoiceTurnScheduler.Queue {
        long now,sequence;final PriorityQueue<Job> jobs=new PriorityQueue<>();
        public void after(long delay,Runnable work){jobs.add(new Job(now+delay,sequence++,work));}
        void advance(long target){while(!jobs.isEmpty()&&jobs.peek().time<=target){Job j=jobs.remove();now=j.time;j.work.run();}now=target;}
    }
    private static final class Job implements Comparable<Job> {
        final long time,sequence;final Runnable work;
        Job(long time,long sequence,Runnable work){this.time=time;this.sequence=sequence;this.work=work;}
        public int compareTo(Job other){int c=Long.compare(time,other.time);return c!=0?c:Long.compare(sequence,other.sequence);}
    }
}
