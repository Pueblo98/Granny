package org.pueblo98.stage1.voice;

import org.junit.Test;
import static org.junit.Assert.*;

public final class DictationSessionTest {
    @Test public void keepsExactEditedDraftAndAppendsTwoSentences() {
        DictationSession s = new DictationSession(); long t=s.begin("  Call Ana on Tuesday.  ",100);
        assertTrue(s.beginSegment(t,11,100)); s.partial(11,"At");
        assertEquals("  Call Ana on Tuesday.  At",s.visibleText());
        assertEquals(DictationSession.Result.CONTINUE,s.finalSegment(11,"At three.",500));
        assertTrue(s.beginSegment(t,12,650));
        assertEquals(DictationSession.Result.CONTINUE,s.finalSegment(12,"Bring the blue bag.",1000));
        assertEquals("  Call Ana on Tuesday.  At three. Bring the blue bag.",s.finish());
    }
    @Test public void partialReplacementDoesNotDuplicateWordsOrCommitThem() {
        DictationSession s=new DictationSession();long t=s.begin("Earlier.",0);s.beginSegment(t,1,0);
        s.partial(1,"I want");s.partial(1,"I would like");
        assertEquals("Earlier. I would like",s.visibleText());
        assertEquals("Earlier.",s.finish());
    }
    @Test public void finalCanBeConsumedOnlyOnceAndOldPartialIsRejected() {
        DictationSession s=new DictationSession();long t=s.begin("",0);s.beginSegment(t,1,0);
        assertEquals(DictationSession.Result.CONTINUE,s.finalSegment(1,"First.",100));
        assertEquals(DictationSession.Result.STALE,s.finalSegment(1,"First.",101));
        s.beginSegment(t,2,200);assertFalse(s.partial(1,"late"));
        assertEquals("First.",s.finish());
    }
    @Test public void doneDuringActiveSegmentAcceptsOneFinalAndNeverRestarts() {
        DictationSession s=new DictationSession();long t=s.begin("Earlier.",0);s.beginSegment(t,1,0);
        assertTrue(s.requestDone());assertFalse(s.partial(1,"late partial"));
        assertEquals(DictationSession.Result.COMPLETE,s.finalSegment(1,"Last.",100));
        assertEquals("Earlier. Last.",s.visibleText());assertFalse(s.beginSegment(t,2,200));
    }
    @Test public void doneDuringRestartGapKeepsCompletedDraft() {
        DictationSession s=new DictationSession();long t=s.begin("",0);s.beginSegment(t,1,0);
        s.finalSegment(1,"First.",100);assertFalse(s.requestDone());
        assertEquals("First.",s.finish());assertFalse(s.beginSegment(t,2,200));
    }
    @Test public void stopRevokesScheduledRestartAndLateCallbacks() {
        DictationSession s=new DictationSession();long t=s.begin("Seed",0);s.beginSegment(t,1,0);
        s.finalSegment(1,"first",100);s.finish();assertFalse(s.beginSegment(t,2,200));
        assertEquals(DictationSession.Result.STALE,s.finalSegment(1,"late",201));
    }
    @Test public void backgroundClearDropsEveryPrivateWordAndInvalidatesTurn() {
        DictationSession s=new DictationSession();long t=s.begin("Private seed",0);s.beginSegment(t,1,0);s.partial(1,"unfinished");
        s.clear();assertEquals("",s.visibleText());assertEquals("",s.originalDraft());
        assertFalse(s.beginSegment(t,2,200));assertFalse(s.partial(1,"late"));
    }
    @Test public void absoluteDeadlineNeverResetsOnAnotherSentence() {
        DictationSession s=new DictationSession();long t=s.begin("Seed",1000);s.beginSegment(t,1,1000);
        s.finalSegment(1,"first",2000);s.beginSegment(t,2,2200);
        assertEquals(28_800,s.remaining(2200));
        assertEquals(DictationSession.Result.COMPLETE,s.finalSegment(2,"too late",31_000));
        assertEquals("Seed first",s.visibleText());assertFalse(s.active());
    }
    @Test public void eighthFinalEndsTurnWithoutNinthSegment() {
        DictationSession s=new DictationSession();long t=s.begin("",0);
        for(int i=1;i<=8;i++) { assertTrue(s.beginSegment(t,i,i*100));
            assertEquals(i==8?DictationSession.Result.COMPLETE:DictationSession.Result.CONTINUE,s.finalSegment(i,"word"+i,i*100+1)); }
        assertFalse(s.beginSegment(t,9,1000));assertTrue(s.visibleText().endsWith("word8"));
    }
    @Test public void emptyFinalAndFailureKeepPriorCommittedWords() {
        DictationSession s=new DictationSession();long t=s.begin("Seed",0);s.beginSegment(t,1,0);s.finalSegment(1,"first",100);
        s.beginSegment(t,2,200);s.partial(2,"unfinished");
        assertEquals(DictationSession.Result.COMPLETE,s.finalSegment(2,"",300));
        assertEquals("Seed first",s.finish());
    }
    @Test public void deniedStartAndNoSpeechDoNotEraseDraft() {
        DictationSession s=new DictationSession();long t=s.begin("Exact draft  ",0);
        assertFalse(s.beginSegment(t,1,30_000));assertEquals("Exact draft  ",s.finish());
    }
    @Test public void noSpeechPromptIsSessionScoped() {
        DictationSession s=new DictationSession();long t=s.begin("Existing",1000);s.beginSegment(t,1,1000);
        assertEquals(5000,s.promptRemaining(6000));assertTrue(s.shouldPrompt());
        s.finalSegment(1,"Words",7000);s.beginSegment(t,2,7100);assertFalse(s.shouldPrompt());
    }
    @Test public void cancellationCanRestoreExactPreTalkDraft() {
        DictationSession s=new DictationSession();long t=s.begin("  Exact original  ",0);s.beginSegment(t,1,0);
        s.finalSegment(1,"new words",100);assertEquals("  Exact original  ",s.originalDraft());
    }
    @Test public void newExplicitTalkCannotBeStartedByOldQueuedTurn() {
        DictationSession s=new DictationSession();long old=s.begin("First",0);s.beginSegment(old,1,0);
        s.finalSegment(1,"words",100);long current=s.begin("Edited replacement",200);
        assertFalse(s.beginSegment(old,2,300));assertTrue(s.beginSegment(current,3,300));
        assertEquals("Edited replacement",s.finish());
    }
}
