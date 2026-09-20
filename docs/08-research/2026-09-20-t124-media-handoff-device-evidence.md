---
title: "T-124 Android media handoff device evidence"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [research, android, media, evidence, synthetic]
related:
  - 2026-09-19-t101-route-inventory.md
  - ../06-evals/canonical-tasks.md
  - ../06-evals/evidence-protocol.md
  - ../10-execution/backlog.md
  - ../10-execution/task-packets.md
  - ../10-execution/sessions/2026-09-20-t124-media-play-search.md
---

# T-124 Android media handoff device evidence

## Claim and execution status

**Execution status:** one completed synthetic-device attempt on 2026-09-20;
terminal classification **safe partial** for EVAL-004. The attempt supports the
narrow claim that the reviewed debug build can discover compatible handlers,
bind an exact user choice, preview the exact synthetic artist and open the
selected Android component. It does not support matching playback, active
playing state, Pause, provider-policy compatibility, candidate admission or a
GATE pass.

Simon explicitly authorized installing T-124 commit
`9325f2118e734e50de0548abb006e89fc41623f5` on `TBL-01` and running the
`play Elton John` smoke test, limited to Granny and compatible-handler metadata.
No app installation beyond Granny, sign-in, account inspection, unrelated
setting change, personal content, screenshot or retained account/device
identifier was authorized or performed.

## Artifact and configuration

| Item | Observed value |
|---|---|
| Granny source | `9325f2118e734e50de0548abb006e89fc41623f5` |
| APK SHA-256 | `ec19dc93154de13bb0c8e25cc6f685ceeeee38db84bb2b3c0e99cc57b340ff4c` |
| Installed Granny build | version code 5 / `0.5-media-handoff-lab`; update from existing debug build succeeded |
| Device | Pseudonymous `TBL-01`; Samsung model family code `SM-X238U` |
| OS | Android 16 / API 36; security patch 2026-07-05 |
| Granny permission declaration | `RECORD_AUDIO` only; its existing runtime grant was not changed |
| Selected handler | YT Music `com.google.android.apps.youtube.music`, version `9.37.55` / code `93755240` |
| Input | Typed synthetic fixture `play Elton John` |

The tablet initially exposed Samsung multi-window/Recents state and another
existing test package briefly appeared in a hierarchy read. The runner did not
interact with that package. Granny alone was restarted in a normal fullscreen
task before the claim-bearing sequence. This is a procedural deviation and a
reason not to treat the attempt as a clean latency measurement.

## Procedure and observations

1. Verified exactly one authorized connected device without retaining its
   transport identifier. Read only the allowed model/OS/patch configuration.
2. Verified branch HEAD and APK digest, then installed the APK with update
   semantics. No uninstall, data reset, permission change or additional app
   install occurred.
3. Queried only the exact Android
   `android.media.action.MEDIA_PLAY_FROM_SEARCH` route. The privileged package
   shell reported four activities, while Granny's caller-scoped query and Setup
   Center reported three compatible apps. The app-visible choices were:
   Spotify (`com.spotify.music`), YouTube (`com.google.android.youtube`) and YT
   Music (`com.google.android.apps.youtube.music`). The privileged-only fourth
   result appeared only in the shell query, was not exposed through Granny and
   was not selected. This run did not determine why the caller-visible sets
   differed.
4. Setup displayed `Music handoff — Evidence lab only`, `3 compatible apps are
   visible`, and the explicit limitation that Granny cannot verify or Pause
   playback.
5. Entered the exact typed fixture. Granny displayed `Which music app?` and the
   three locally discovered label/package choices. YT Music was selected to
   avoid exercising the known Spotify SDK-policy concern; no provider account
   state was inspected.
6. Granny previewed: `Ask YT Music to play artist “Elton John”`, followed by the
   exact limitation that it opens another app and cannot yet verify playback or
   Pause it. No external app had opened before the explicit action.
7. Activated `Ask music app to play` once. YT Music's exact selected component
   became the foreground activity. Android exposed a YT Music media-session
   entry, independently supporting that the handoff reached the selected app.
8. The selected session state was `PAUSED(2)` at both bounded post-dispatch
   checks. Media identity/metadata was deliberately not read, no audible result
   was claimed and no external screen hierarchy or screenshot was captured.
9. On return, Granny displayed `I can’t confirm the music handoff`, stated that
   the handoff may have reached the app, did not retry and did not claim
   playback or offer a false Pause control.

## Result and interpretation

| Claim | Result | Evidence layer / limit |
|---|---|---|
| Build installs as exact reviewed artifact | Supported for this tablet | Synthetic device; one update install |
| Caller-scoped compatible-handler discovery | Supported for this configuration | Three app-visible choices; privileged shell saw four, so shell inventory must not substitute for app visibility |
| Exact service clarification and preview | Supported | Granny UI semantic hierarchy; typed fixture only |
| Exact selected app received the handoff | Supported | Selected YT Music component foreground plus package-matched media-session entry |
| Elton John played | **Unsupported** | Session remained paused; artist metadata and audio were not inspected |
| Active playback | **Not achieved** | Package-matched session state `PAUSED(2)` at both checks |
| Pause | Unrun / unavailable in Granny | No verified playback reference or admitted generic control route |
| Honest unknown/no retry after external return | Supported | Granny returned to `MEDIA_UNKNOWN` copy; no repeat dispatch observed |

This is a positive result for T-124's narrow handoff mechanics and a safe
partial result for the requested-media outcome. It is a disconfirming result
for any assumption that Android's play-from-search intent alone reliably starts
playback in the selected app. The attempt cannot determine whether YT Music
paused because of account/auth state, provider behavior, app version, network,
catalog handling or another precondition because those states were outside the
authorized inspection scope.

## Privacy, retention and teardown

Only content-free package/version, handler count, route state and playback-state
category were retained. No serial/transport ID, account identifier, catalog
metadata, personal media, listening history, screenshot or raw external UI was
written to Git. Temporary Granny-only UI hierarchy files on the tablet were
deleted after each read. Granny was left foreground; the selected external
session was already paused. The reviewed Granny build remains installed. No
system setting, account state or provider app was modified.

## Follow-through

T-124 remains in review and T-106/EVAL-004 remain incomplete. GATE-03/04/06/07
do not change. Before another provider run, review the exact chosen provider's
terms and define a non-personal account/catalog fixture plus an independent,
content-safe identity oracle. A follow-up should explain the paused result
without reading personal account state, then test signed-out/offline/ad/paywall
variants only under new exact authority. Do not add automatic retries or claim
success from foreground arrival/media-session existence.
