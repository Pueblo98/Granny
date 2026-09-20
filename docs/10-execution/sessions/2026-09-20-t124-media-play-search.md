---
title: "T-124 Android media play-from-search experiment"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, media, evidence]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../08-research/2026-09-19-t101-route-inventory.md
  - ../../03-agent/tool-contracts.md
  - ../../../android/stage1/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t124-media-play-search
next_action: Review the pushed T-124 source branch; authorize an exact named-handler device run separately if desired
changed_paths:
  - android/stage1/README.md
  - android/stage1/app/build.gradle.kts
  - android/stage1/app/src/main/AndroidManifest.xml
  - android/stage1/app/src/main/java/org/pueblo98/stage1/MainActivity.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/conversation/ConversationSessionCoordinator.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/media/AndroidMediaPlayFromSearchPort.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/media/MediaPlayFromSearchPort.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/setup/CapabilityCenterModel.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/ui/ConversationSurfaceModel.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/conversation/ConversationSessionCoordinatorTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/setup/CapabilityCenterModelTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/ui/ConversationSurfaceModelTest.java
  - docs/01-product/traceability.md
  - docs/03-agent/tool-contracts.md
  - docs/04-architecture/capability-admission.md
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/task-packets.md
  - docs/10-execution/sessions/2026-09-20-t124-media-play-search.md
  - docs/README.md
---

# T-124 Android media play-from-search experiment

## Scope and authority

Simon asked to revise the media-route plan and try the standard Android route
after identifying that Granny can interpret a request such as “play Elton
John” before handing it to the person's music app. This session may implement
one bounded, debug-only adapter for Android's documented
`INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH` contract, exact compatible-handler
selection and an explicit preview.

This is not authority to install or control a tablet, authenticate an account,
accept provider terms, add a provider SDK, use personal media, purchase
content, claim playback from an activity launch, or admit CAP-10 in a candidate
build. The source/static experiment must fail closed outside the existing
synthetic-lab build mode. Any device run requires separate exact authority.

## Evidence plan

- Preserve the exact parsed artist and selected package/component through the
  preview and one-use dispatch boundary.
- Discover only handlers for the exact Android play-from-search action; never
  accept a model-supplied package or broad package inventory.
- Treat successful `startActivity` return as a handoff acknowledgement only.
  Display “request sent” with unverified playback and no automatic retry.
- Prove in host tests that zero/one/multiple handlers, editing, Stop, stale
  approval, launch failure and candidate mode all fail safely.
- Run the existing offline unit/build/lint suite and repository documentation
  checks. Record device, provider and independent playback evidence as unrun.

## What changed

- Added a pure `MediaPlayFromSearchPort` and an Android adapter that discovers
  only exact play-from-search handlers, sorts/deduplicates them, rechecks the
  chosen component and sends artist focus, `EXTRA_MEDIA_ARTIST` and the exact
  query to that component.
- Extended the existing conversation authority rather than adding a parallel
  task owner. The finite fixture accepts `play Elton John` / `play some Elton
  John`; zero handlers stop, one advances to preview and multiple require an
  explicit locally sourced choice. Preview/approval bind request generation,
  revision, consequence, artist and component to one dispatch.
- Added requested/no-effect/unknown surfaces. Launch acknowledgement never says
  playing; after handoff Granny says it cannot verify or Pause the receiving
  app. Stop/edit/background revoke queued authority and unknown never retries.
- Added the exact manifest package-visibility query and Setup status. Release
  candidate mode denies the route. Version is 5 / `0.5-media-handoff-lab`; no
  new permission, runtime dependency, provider SDK, account or network path.
- Revised T-101/T-106/OQ-12/CAP-10/admission/trace docs: the Android route is a
  valid handoff experiment, distinct from Spotify's prohibited SDK route, but
  not playback completion or evidence toward the external-workflow bar.

## Evidence

With Temurin 17.0.20.1, API/build-tools 36 and the existing T-122 Gradle cache,
the clean offline build passed 161 unit tests across 17 suites, debug assembly
and lint with zero errors / 17 existing-category warnings. Debug runtime
classpath is `No dependencies`. API-36 `aapt2` reports package
`org.pueblo98.stage1`, version 5 / `0.5-media-handoff-lab`, minSdk 31,
target/compile SDK 36 and only `android.permission.RECORD_AUDIO`; APK SHA-256 is
`ec19dc93154de13bb0c8e25cc6f685ceeeee38db84bb2b3c0e99cc57b340ff4c`.

Repository checks pass: cockpit write/check; documentation validation with 0
errors; 47 documentation-tool tests; and `git diff --check`. An initial command
used the wrong empty temporary Gradle cache, downloaded the Gradle wrapper and
then failed offline plugin resolution; it changed no repository file. The
reported clean result uses the prepared cache above.

No tablet, emulator, provider app/account, media catalog, playback, Pause,
TalkBack, large text, rotation, policy approval or independent player/session
oracle was exercised. Static Android documentation and host fakes do not prove
that any installed app advertises or correctly handles the intent.

## Handoff

This branch depends on the unmerged T-123/T-122 native chain. The primary
checkout and its untracked user files remain untouched. This mixed code/docs
task may be pushed under standing authority but is not authorized for PR merge
or primary-vault synchronization.
