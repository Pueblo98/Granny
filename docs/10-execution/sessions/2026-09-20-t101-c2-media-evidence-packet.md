---
title: "T-101 C2 identity, retention and egress packet plus media desk review"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, research, android, evidence, media]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../development-readiness.md
  - ../../08-research/2026-09-19-t101-route-inventory.md
  - ../../08-research/2026-09-19-t101-c2-device-evidence.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: docs/t101-c2-media-evidence
next_action: Simon chooses whether to investigate a policy-compatible media provider or revise the media outcome; a separate source task builds C2 fixture-origin and privacy-audit harnesses before any claim-bearing device run
changed_paths:
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/t101-c2-identity-retention-egress-packet.md
  - docs/10-execution/sessions/2026-09-20-t101-c2-media-evidence-packet.md
  - docs/README.md
---

# T-101 C2 identity, retention and egress packet plus media desk review

## Scope and authority

Simon requested preparation of the narrow T-101 C2 evidence packet while the
media route is investigated. This documentation-only session may inspect the
existing synthetic lab, prior content-free device evidence and current primary
sources, then freeze a future procedure and claim boundary. It does not
authorize a tablet connection, APK build/install, permission or settings
change, packet capture, shell command, account creation/login, provider contact,
media playback or gate acceptance.

## What changed

- Added the [narrow C2 identity/retention/egress packet](../t101-c2-identity-retention-egress-packet.md).
  It records that the current MediaProjection observer cannot establish the
  selected package, separates source evidence from runtime retention/egress
  evidence and specifies prerequisites for later metadata-only procedures.
- Refreshed the [route inventory](../../08-research/2026-09-19-t101-route-inventory.md)
  against current primary Android and provider sources. Spotify's API remains
  technically capable, but current provider policy prohibits Granny's accepted
  voice-assistant control behavior. Spotify is therefore no-go for the current
  product scope, not a device-spike candidate.
- Recorded Apple MusicKit for Android as an unselected desk lead and YouTube's
  IFrame route as an in-app video lead, not control of YouTube Music. Neither is
  admitted or authorized for dependency/account/device work.
- Propagated the route decision point and C2 prerequisites through readiness,
  backlog, milestone, open questions and vault navigation. T-106 is blocked
  pending Simon's route/outcome choice; ADR-0009 itself is unchanged.

## Evidence

Evidence classes remain separate:

- **Desk/source:** current Android API and network-permission documentation;
  Spotify Android SDK, release, policy and terms; Apple MusicKit Android/auth
  documentation and program terms; YouTube Android/IFrame documentation and
  minimum-functionality policy. Accessed 2026-09-20.
- **Static repository inspection:** observer has no `INTERNET`, storage,
  microphone, contacts, account, notification-listener or accessibility grant;
  backup/transfer is disabled; capture uses a bounded in-memory `ImageReader`;
  result delivery is package-scoped and the service is nonexported.
- **Prior device evidence:** the existing C2 ledger's bounded lifecycle
  observations remain valid only for their recorded source/build/configuration.
- **Unrun:** controlled fixture-origin proof, durable-store inspection and
  per-UID egress audit. No runtime conclusion or gate pass is inferred.

No tablet was connected or operated. No APK was built, installed or run; no
account, provider, network, permission or settings action occurred. No provider
was contacted and no legal/store approval is claimed.

## Handoff

Worktree: `/home/lgtw/Work/granny-worktrees/t101-c2-media-evidence`.
Base: `origin/main` at `c834e4297d56860ba4547bcca60b6b9f24acb66e`.
The primary checkout and its untracked user files remain untouched.

Local validation passed on 2026-09-20: cockpit write/check, documentation
validation (0 errors), 47 documentation-tooling unit tests, handoff coverage
against `origin/main` and `git diff --check`. External links were not fetched by
the validator; the primary-source desk review above was performed separately.
Publication and post-merge vault visibility are recorded after Git completes.
