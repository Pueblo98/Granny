---
title: "Native voice continuity and readback quality repair"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, voice, evidence]
related:
  - ../task-packets.md
  - ../../02-design/voice-ux.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: GPT-6 Astra with Terra implementation and Sol review
branch: fix/native-voice-continuity
next_action: Complete the authorized main merge and scoped cleanup; preserve overlapping primary design edits.
changed_paths:
  - android/stage1/README.md
  - android/stage1/app/build.gradle.kts
  - android/stage1/app/src/main/java/org/pueblo98/stage1/MainActivity.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/conversation/ConversationSessionCoordinator.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/AndroidTextToSpeechOutput.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/OfflineVoiceSelection.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/ui/ConversationSurfaceModel.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/DictationSession.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/VoiceTurnScheduler.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/conversation/ConversationSessionCoordinatorTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/speech/OfflineVoiceSelectionTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/voice/DictationSessionTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/voice/VoiceTurnSchedulerTest.java
  - docs/02-design/voice-ux.md
  - docs/04-architecture/system-overview.md
  - docs/08-research/2026-09-20-native-tablet-smoke-feedback.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/task-packets.md
---

# Native voice continuity and readback quality repair

Simon requested source fixes after manually testing installed integration APK
`ec0b389a45e202f4243f0257de7c660cebaa974cff1a51a6dc272b7bbf4132ae`
(source `481b001`, published integration `3483f88`). He reported cases 1
(cancel), 2 (Apply/Restore), and 5 (background) worked great. These are
user-reported observations with no repetition counts, timing, engine identity,
connectivity confirmation or individual capture/output breakdown. They do not
admit C2 or any gate. Case 3 produced audible but robotic speech; Stop/Repeat
subcases were not individually confirmed. Voice input reportedly loses earlier
words and ends after one sentence. No personal transcript is retained.

Root owns MainActivity, conversation and voice continuity files, tests and
scoped docs in the dedicated native-voice-continuity worktree. Terra owns only
speech voice-selection code/tests in native-offline-voice-quality on its own
branch. Sol reviews read-only. Primary/other peer worktrees remain untouched.
No device command, microphone use, install, engine/model download or network
speech is part of this source repair. Keep the explicit foreground 30-second
capture budget, Stop and written fallback; no retry on recognition errors.
Readback quality remains a human/device judgment after source improvements.


## Implemented slice and scope

Existing `android/stage1` is retained. PRD-FR-001/002/013/016,
PRD-ACC-003, UC-013/J-007, T-120/T-121 and RES-06 own the request/input/output
boundary; EVAL-005/006/007/009 remain full-eval unpassed. The separately recorded
[smoke feedback](../../08-research/2026-09-20-native-tablet-smoke-feedback.md)
is user-reported device evidence for the older APK, not evidence for this fix.

- `DictationSession` retains the exact existing edited draft and appends only
  accepted final segments once. Partial hypotheses replace the current provisional
  span and do not enter the committed editable request. Errors/empty finals retain
  earlier completed text and end capture without retry.
- `VoiceTurnScheduler` owns an absolute monotonic deadline on a dedicated queue
  that remains live between segments. Every restart binds its epoch and rechecks
  turn/conversation generation, foreground and permission. One explicit Talk has
  at most eight segments and 30 seconds; no ambient/background capture appears.
- Done in the restart gap completes immediately. Stop/Type retain completed words;
  Cancel/Back restores the pre-Talk draft. Background/recreation clears private
  draft, pending callbacks and raw/provisional state. Add more is an explicit
  new Talk activation, not replacement of the existing request.
- `completeVoice` opens editable transcript review with an explanatory status;
  neither completion nor the finite interpreter is action approval. C5 exact
  preview/one-use approval and independent readback remain unchanged.
- TTS selection prefers locale and declared quality, then equivalent default/name
  ties, rejecting network-required and advertised-not-installed voices. The
  official not-installed feature constant is used. No engine/model download,
  network fallback, dependency, permission or voice-setting persistence is added.
  This may choose the same voice if no better eligible one exists; human cadence
  and naturalness remain unverified.

Source references inspected on 2026-09-20:
[RecognizerIntent](https://developer.android.com/reference/android/speech/RecognizerIntent),
[RecognitionListener](https://developer.android.com/reference/android/speech/RecognitionListener),
[Voice metadata](https://developer.android.com/reference/android/speech/tts/Voice),
and [TextToSpeech](https://developer.android.com/reference/android/speech/tts/TextToSpeech).
Android's segmented/silence extras are implementation-dependent, so this slice
uses bounded successful-final continuation rather than relying on ignored extras,
opening an audio stream or claiming gapless recognition. It preserves the accepted
30-second budget; longer dictation needs a separate bounded decision.

## Git, artifact and independent review

Root worktree `/home/lgtw/Work/granny-worktrees/native-voice-continuity`, branch
`fix/native-voice-continuity`, baseline published integration `3483f88`.
Current `origin/main` `89f766d` was integrated in the task branch at `0fc470e`;
no main merge or primary-vault synchronization was performed by this session.
Existing integration/voice/TTS peer worktrees were not mutated.
Terra's exclusive branch `fix/native-offline-voice-quality` supplied `160dfc8`,
cherry-picked as `0dde417`. Root owns `8106a7a` continuity and `0099e6e`
deadline/oracle integration. Sol reviewed read-only and returned source PASS
once the independent timer and scheduler/controller harness closed its findings.

Exact tested source commit: `0099e6ef0a131df60c15083b3448a24d0e96fd7c`.
Package `org.pueblo98.stage1`, version code **2**, version name
**0.2-voice-continuity**. Debug APK:
`android/stage1/app/build/outputs/apk/debug/app-debug.apk`.
SHA-256: `657738dc424a06b6af3be3adf4cc2799cf4660aa1f7bd8eb6a3ecf630818719a`.
Local ignored build output; not installed or uploaded as a binary by this fix.
Final published branch SHA is the commit containing this handoff; remote equality
is verified at publication without a circular self-hash edit.

## Checks and evidence boundaries

Using the existing JDK/SDK only:

```text
JAVA_HOME=/tmp/granny-c2-toolchain/jdk
ANDROID_HOME=/tmp/granny-c2-toolchain/android-sdk
GRADLE_USER_HOME=/tmp/granny-c2-gradle-home
android/stage1/gradlew -p android/stage1 --offline --no-daemon :app:testDebugUnitTest :app:assembleDebug :app:lintDebug :app:dependencies --configuration debugRuntimeClasspath
```

- Pass: **138 native host tests / 16 suites**, zero failures/errors/skips.
  New coverage: 14 dictation, 9 scheduler/controller race cases, one conversation
  draft-preservation case, four voice-selection tests. Existing C5/speech/authority
  regressions are included. Android Activity wiring was statically reviewed;
  the deterministic harness exercises production scheduler/controllers, not a
  physical Activity or microphone. No fake timing is reported as device latency.
- Pass: debug assembly and lint, zero lint errors. Sixteen warnings cover English
  fixture strings, target/compile SDK notices and the API-33 Back attribute with
  minSdk 31. No lint check was suppressed to make this pass.
- Pass: runtime dependency graph empty; API-36 `aapt2 dump permissions` reports
  only `RECORD_AUDIO`. APK v2 signature verifies with one debug signer. Manifest
  is unchanged: no Internet, projection or accessibility service, backup/transfer
  disabled. No audio, transcript or engine-inventory log/export sink was added.
- Pass: `python3 scripts/validate-docs.py`, cockpit write/check, 47 documentation
  tooling tests, scoped `check_handoff.py --base origin/main --head HEAD`, and
  `git diff --check` at publication.
- Intermediate review found an uncovered deadline in the 150ms restart gap and
  missing orchestration race tests. Both were repaired and independently reviewed;
  all final executable checks pass. The prior integration's 49 C2 tests were not
  rerun here because no C2 code or dependency changed; no C2 evidence is promoted.
- Unrun: this repaired APK on Android, recognition accuracy, audible cadence,
  exact engine/locale behavior, restart gaps, Stop latency, permission dialogs,
  rotation/TalkBack/layout, engine retention/egress and human preference measures.
  Installation and speech use from the older smoke run are not current fix evidence.

## Prepared bounded retest — separate device authorization required

Do not execute or install from this record alone. The next concrete request must
name source/hash above and the permitted update of only `org.pueblo98.stage1`;
no new permission, settings change, voice download or unrelated package belongs
in the update. Simon operates all microphone, output and UI cases. Retain only
case outcome and content-free timing/metadata; no recording or screen capture.

1. Type the synthetic draft `Please call Ana.` without submitting. Tap Add more
   (or Talk where shown), say `Tomorrow at three.`, then Done listening. Check
   that both sentences remain editable, with original punctuation/spacing intact.
2. From an empty editor, Talk: say `The blue bag is ready.` Pause briefly, watch
   Continuing listening then Listening, and say `Bring it tomorrow.` Tap Done.
   Expect both completed sentences once. Report any missing boundary words or
   premature stop; do not call a recovery result successful dictation.
3. After one completed sentence, choose Done or Stop during the next-start gap.
   Expect no new capture, earlier completed words kept, no automatic submission.
   Repeat with Back: expect the exact pre-Talk draft. Type instead should preserve
   completed words and expose the editor. Background should clear ephemeral text
   and never resume capture on reopening.
4. Continue an explicit turn to 30 seconds. Expect capture to end without starting
   another segment; completed words remain for review. Add more starts another
   explicit turn. An unfinished provisional sentence must not silently become final.
5. Read the same synthetic text with the new voice selection at Normal speed.
   Compare intelligibility and cadence with the old subjective report; report
   same/better/worse, not a guessed engine-quality score. Stop speaking and Repeat
   still need independent observations. Unavailable offline voices are reported,
   never downloaded implicitly.

Stop immediately if capture/speech continues unexpectedly after Stop, the tablet
becomes unresponsive, or an unintended external action occurs. Teardown is limited
to the separately authorized test-package removal and restoration of any explicitly
changed setup settings; do not clear unrelated apps or data. No tablet actions or
new authorizations were performed/requested merely to finish this source task.

## Next action and rollback

Publish/review the repaired branch, then obtain exact updated-APK install/retest
scope. Revert only these repair commits through a reviewed branch if needed;
retain Type/written output as complete fallbacks. A natural-sounding replacement
engine or local model remains a dependency/privacy/product decision if the existing
eligible voices still disappoint. T-101 is in progress, C2 is unadmitted,
GATE-03/04/06 are open, and T-104 has no admitted route.

## Authorized integration and cleanup follow-up

Simon explicitly authorized merging all work from this session and cleaning up
its completed worktrees/branches. This supersedes the earlier main-merge hold.
The normal PR includes the full integration plus continuity repair. The same
version-2 APK above was subsequently updated on the connected SM-X238U through
an explicitly authorized package-only `adb install -r`; the command returned
Success. No data clear, permission grant, launch or microphone action was
performed. Simon has not supplied case-by-case retest observations for this
version; installation success is not a recognition/voice-quality pass.

Cleanup preserves both tested APKs and source-to-hash metadata outside the
worktrees under `/home/lgtw/Work/granny-artifacts/2026-09-20-native-tablet`.
Only clean worktrees/branches owned by this orchestration are cleanup targets;
peer voice/TTS/design worktrees remain outside that scope. Root task history
will be retained by the normal merge. Agent-only cherry-pick source histories
are retained under local archive tags before their clean worktrees are removed.

The primary checkout has new local design edits in mockups/README,
current-milestone and cockpit-snapshot plus untracked design/session assets.
Incoming integration overlaps milestone/snapshot. Leave this active local work
untouched; main integration is separate from primary vault synchronization.
The GitHub PR owns the eventual merge SHA; the final response reports actual
merge, cleanup and local visibility results, without another self-hash commit.
