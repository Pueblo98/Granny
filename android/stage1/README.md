---
title: "Native conversation and evidence-lab shell"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [android, voice, speech, accessibility, implementation]
related:
  - ../../docs/09-decisions/ADR-0011-explicit-activation-and-access.md
  - ../../docs/10-execution/backlog.md
  - ../../docs/10-execution/task-packets.md
---

# Native conversation and evidence-lab shell

This is the first bounded own-app Android shell. T-120 implements explicit
tap-to-talk with Android's on-device `SpeechRecognizer`, a complete typed
fallback, visible partial/final transcript states, Done listening, Stop,
editable final text and conservative non-model cleanup.

T-121 adds explicit Android `TextToSpeech` readback of the visible request,
Stop speaking, revision-bound Repeat, persistent Sound off/on and four closed
speech-rate choices with preview-before-Apply and one-step Restore. Written
text remains visible and complete; the app never starts readback automatically.

It is not a complete Granny app. It has no planner, external app adapter,
message send, model, cloud speech, downloadable TTS voice management, background
capture, wake word, persistent transcript or analytics. Submitting exact fixture
requests opens clarification. A separately approved exact C5 preview can change
the local text preference in debug builds; the fictional draft path below has
no action permit or external dispatch.

## Fictional local message draft

In debug/synthetic-lab builds, the exact typed or final spoken fixture request
`Tell David I’ll call after dinner.` asks the user to choose between `person-a`
(`David — brother`) and `person-b` (`David — neighbour`) on `Fixture messages`.
The preview shows the opaque fixture endpoint, channel and exact body
`I’ll call after dinner.` under `Fictional local draft — not sent`.

**Keep this draft here** produces only an in-memory ready state. Editing, Stop,
backgrounding, recreation, place change or Done clears the recipient/body.
Candidate builds deny the finite fixture. No contact lookup, messaging intent,
package, account, provider, network, persistent draft, action permit, send or
delivery claim exists in this flow. The labels and relationships are fabricated.

## Setup and capabilities

The optional **Setup and capabilities** destination reports live state from the
same platform adapters and local preference controllers used by the app. Type
is always shown as ready. Talk separates microphone grant from on-device
recognizer availability. Spoken answers separate installed offline-eligible
voice availability from the app's Sound setting. The page also reads back the
current Granny text size and closed speech-rate choice.

**Try voice** enters the existing permission/on-device-recognizer path. **Try
spoken answer** speaks one fixed synthetic sentence only after a tap and cannot
be repeated as task content or authorize a setting/action. Android app settings
opens only after a direct tap; actual state is rechecked when the app returns.
Message and screen routes are explicitly unavailable. In debug builds only,
music reports compatible Android play-from-search handlers as an evidence-lab
handoff; it never reports verified playback. There is no forced onboarding,
permission loop, download, network diagnosis or claim that host inspection
proves installed-engine privacy, media behavior or quality.

## Android media handoff evidence lab

In debug/synthetic-lab builds, the exact typed or final spoken fixture requests
`play Elton John` and `play some Elton John` propose artist `Elton John`. Local
code queries only activities advertising Android's
`INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH`. Zero handlers stops with no effect; one
advances to an exact preview; multiple handlers require a direct choice. The
preview binds the request revision, artist and exact component to a one-use
dispatch. A package/component from model output is never accepted.

The explicit intent carries artist media focus, `EXTRA_MEDIA_ARTIST` and
`SearchManager.QUERY`. The handler is re-resolved before launch. A successful
`startActivity` return is shown only as **Playback request sent**: Granny has
not verified the artist or playing state and cannot Pause the receiving app.
Missing handlers produce known no effect; exceptions are unknown and are not
retried. Candidate builds deny the route. No preferred app is persisted.

The manifest adds only the exact media-intent package-visibility query. It adds
no permission, provider SDK, account/auth, Internet path, notification listener
or media-control privilege. A later [exact TBL-01/YT Music smoke attempt](../../docs/08-research/2026-09-20-t124-media-handoff-device-evidence.md)
verified handler discovery, exact preview and external handoff, but the selected
media session remained paused. Provider terms, exact-content/playing evidence
and Pause remain T-106/T-101 work.

## Boundary

- `minSdk 31`, `compileSdk/targetSdk 36`.
- Android platform APIs plus JUnit 4 only; no AndroidX, Compose, provider SDK,
  model artifact or Internet permission. The debug runtime classpath has no
  dependencies.
- `RECORD_AUDIO` is requested only after Talk.
- Only `createOnDeviceSpeechRecognizer` is used. Unavailable recognition
  fails to Type; there is no generic or network recognizer fallback.
- The app does not open, store or export an audio stream. Android's selected
  on-device recognition service owns capture for the active foreground session.
- Transcript state is process memory only. Backup and device transfer exclude
  every app data domain.
- Spoken output accepts only an installed locale-compatible TTS voice whose
  Android metadata reports no network requirement. Absence/failure keeps the
  written route and does not fall back to a network voice.
- Read/Repeat sends the exact selected text revision to the installed Android
  TTS service for that utterance. The app creates no speech audio file and
  clears its repeat copy on edit, lifecycle exit or output-route loss.
- Speech rate and Sound are stored in private versioned preferences with
  synchronous compare-and-set/readback. The manifest TTS service query is
  package visibility metadata, not an additional permission.

## Host evidence — 2026-09-20

Use the already prepared JDK 17 / API 36 toolchain:

```text
./gradlew --no-daemon clean testDebugUnitTest assembleDebug lintDebug
```

The T-124 host command passes 161 cases across 17 suites, debug assembly and
lint with zero errors and 17 existing-category warnings. Remaining lint warnings concern API targeting, the
API-33 Back attribute on minSdk 31, and English fixture strings. This shell
targets the selected Android 16/API 36 reference configuration. `aapt2 dump permissions` reports only `RECORD_AUDIO`, and the
debug runtime dependency report is empty.

Host tests cover input/output generation state, stale callback and revision
rejection, hypothesis selection, cleanup, and settings failure/readback
contracts. The local-draft cases cover same-name fictional endpoints, exact
body binding, typed/voice parity, edit/Stop/background invalidation and
candidate denial. Media cases cover handler absence/ambiguity, exact binding,
stale/Stop invalidation, accepted/no-handler/unknown results, one-use dispatch
and candidate denial with pure fakes. They do not exercise a microphone, recognizer/TTS service, Android
permission UI, installed voice/locale pack, acoustic condition, audible
output, audio focus, TalkBack, process lifecycle, contact resolver, messaging
app, installed media handler, playback/Pause or external message send.

## Device evidence still required

No Android device was attached for the T-120/T-121 source handoff. Their exact packets define
the later Samsung input/output matrix. Use synthetic phrases and text
and retain no raw audio or personal transcript. Record exact app SHA, device,
OS/API, recognizer component, locale/model status, permission path, offline
state, partial/final result, correction effort, Stop/lifecycle result and
timings. For output also record TTS engine/voice, its network-required metadata,
airplane-mode behavior, exact spoken fixture, Stop latency, each rate, audio
focus and TalkBack interaction. A successful install, one correct transcript or
one audible utterance does not pass RES-06, EVAL-005/007/009/012 or a release
gate.

## C5 Granny-local text size

The native shell now provides Standard / Larger / Larger still / Largest
(1.0 / 1.15 / 1.3 / 1.5 times base sp, compounded with system font scaling).
Selecting a choice only changes the sample. Apply writes the private,
versioned `granny_text_scale` preference; readback must match before success.
Restore reinstates the previous saved value once. Cancel abandons a preview;
backgrounding and configuration recreation cancel it. Only place/scroll and
an uncertain-outcome flag enter Activity saved state; no transcript or approval
is restored. The independently stored text preference survives recreation.

The store contains schema/version/current/previous enum only, uses synchronous
commit and a single-process compare-and-set lock, and remains excluded from
backup and transfer. Unknown save outcomes block further writes in that process.
There is no Android/third-party settings control. A finite fixture interpreter
recognizes “make text larger”, “make Granny text larger” and “make this bigger”;
all other requests fail to clarification without an effect. Typed and final
spoken requests share the same revision/approval path.

See the [session record](../../docs/10-execution/sessions/2026-09-20-c5-native-text-scale.md)
and [exact tablet verification](../../docs/10-execution/t101-c5-tablet-verification.md).
Host fake-store readbacks are distinct from actual disk/restart, Android layout,
TalkBack and keyboard evidence. Those device cases are unrun.

## Shared conversation integration

The [native integration contract](../../docs/10-execution/t120-tablet-integration-handoff.md)
now owns the bounded join between typed input, accepted voice revisions,
shared conversation surfaces and C5 preference authority. The
[integration record](../../docs/10-execution/sessions/2026-09-20-native-conversation-integration.md)
records the exact committed speech dependency and all source/host checks.
Physical tablet testing is on hold at Simon's direction.

## Voice continuity repair

Talk/Add more preserves the existing edited draft. Successful recognizer finals
append once and start another segment within the same explicit 30-second turn
(maximum eight segments). Partial hypotheses remain provisional. Done/Stop,
error, permission loss and lifecycle exit prevent another segment; no error
retry or background capture is introduced. Completed text survives a foreground
interruption, while background/recreation still clears private draft state.
Cancel/Back restores the exact pre-Talk draft. A short restart gap is announced;
actual multi-sentence/latency behavior needs the repaired tablet run.

Offline TTS selection now ranks eligible voices by locale and declared quality
before default/name ties instead of name alone. No extra engine, download,
network permission or naturalness guarantee is added. See the
[repair handoff](../../docs/10-execution/sessions/2026-09-20-native-voice-continuity.md)
and [reported original smoke observations](../../docs/08-research/2026-09-20-native-tablet-smoke-feedback.md).
