---
title: "Native typed, voice and speech integration"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, conversation, voice]
related:
  - ../task-packets.md
  - ../../02-design/shared-conversation-state-surfaces.md
  - ../../../android/stage1/README.md
record_type: session
session_state: active
record_basis: contemporaneous
agent: GPT-6 Astra with Terra implementation and Sol independent review
branch: feature/native-conversation-integration
next_action: Integrate the native conversation coordinator and committed spoken-readback dependency; hold all tablet testing.
changed_paths: []
---

# Native typed, voice and speech integration

## Scope and authority

Simon explicitly invoked the native tablet integration metaprompt from peer
`feature/t120-native-voice` commit `9340e786ea209be3e4ca26fbc60cce7f1cc15078`
and requested voice, typed requests and the ongoing text-to-speech work to
converge in `android/stage1`. All physical tablet testing is explicitly on hold.
No new shell, framework, dependency, provider, network, personal data or
external-app actuation is authorized. C2 remains isolated and unavailable.

Baseline is current `origin/main` at
`5214d351bf5950781181f0f0ef5955679e352c2d`, containing the selected voice source
commit and C5 text-size controls. The primary checkout's local notes/assets
remain untouched. The voice peer branch is inspected read-only; its unrelated
browser changes are not Android dependencies.

## File ownership and source map

- Root, `feature/native-conversation-integration`: Activity, rendering/resources,
  voice-to-conversation and speech integration, scoped documentation and final
  integration/builds. Existing `android/stage1` is the single product shell.
- Terra, separate `feature/native-conversation-core`: only new `conversation/`
  types, coordinator, closed capability/interpretation contracts and host tests.
- Sol: read-only independent readiness, lifecycle, privacy and evidence review.
- Peer `feature/t121-spoken-readback`: owns `speech/` adapter, controller,
  rate preferences and tests in its own worktree. Its in-progress Activity,
  resources, manifest and documentation will be reviewed at a committed
  checkpoint and reconciled by root only in this integration worktree.
  No peer worktree/branch is mutated or uncommitted file copied as delivery.

The coordinator owns place, temporary surface, request revision/provenance,
operation generation, local authority and verified/unknown outcome. The voice
controller owns recognizer generation and capture state; the Activity bridges
accepted callbacks into the coordinator. TTS owns an independent output
lifecycle but participates in global Stop, input/output exclusion and revision
invalidation. The Activity owns actual View focus/scroll and restores only
valid origin anchors. C5 owns the private saved preference and independent
readback. The C2 observer remains a separate lab; no projection permission or
service enters the native shell.

## Readiness and evidence boundaries

T-120, PRD-FR-001/002, UC-013/J-007, shared conversation surfaces,
PRD-FR-011/PRD-PRV-002, UC-007/J-006 and CAP-11 own the bounded slice.
Only exact deterministic fixture interpretation is allowed; a proposal cannot
mint its approval or declare success. Partial speech never submits. Use this
request freezes exact visible words, not capability authority. Approval binds
revision/consequence once. Stop invalidates before cleanup; late callbacks
cannot revive authority. Unknown outcome never automatically retries.

No tablet testing, microphone/TTS engine use or gate admission occurs here.
Host tests, native build/lint/manifest/dependency inspection and documentation
checks will be recorded separately from unrun physical evidence.

## Handoff

Implementation and committed TTS dependency review in progress. No main merge
or primary-vault sync is claimed for this new mixed integration slice.
