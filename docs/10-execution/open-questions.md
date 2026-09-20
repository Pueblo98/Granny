---
title: "Stage 1 decision queue and evidence unknowns"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution]
related:
  - development-readiness.md
  - backlog.md
  - ../09-decisions/README.md
  - ../02-design/naming-exploration.md
---

# Decision queue and evidence unknowns

No clarification blocks completing the documentation. Routine reversible choices are proposed; these consequential decisions require Simon or actual evidence. “Choose” and “measure” are different work. No market, launch date, vendor, price, public name or final brand has been accepted here.

| ID / type | Decision brief / recommendation | Alternatives and tradeoff | Evidence / downstream effect / owner |
|---|---|---|---|
| OQ-01 · resolved decision | Simon accepted five MVP experiments and two external delegation bar on 2026-09-14; [ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) | Guidance-only tests a different thesis; broader autonomy increases route/safety risk; acceptance does not promise feasibility | GATE-02 passed; T-100 complete; RES-01/02/04 and T-104–106 evidence remain unrun |
| OQ-02 · accepted posture + open evidence | Simon accepted API/integration-led candidate, evidence-gated static recipes and separate synthetic dynamic lab on 2026-09-14; actual distribution viability remains unknown | Private pilot has install/support friction and no Play assurance; genuine disability-specific product is a material audience change, not a label | [Policy evidence](../08-research/android-stage-1-feasibility.md); GATE-04 still Needs evidence; Android/policy |
| OQ-03 · evidence | Inventory actual Samsung tablet; propose API34 synthetic test floor plus current stable and second OEM before expansion | Wider support costs testing; named marketing model may be inaccurate | RES-04/T-101; exact min/target SDK and support matrix remain unselected |
| OQ-04 · Simon + evidence | Local policy/Stop/data authority, replaceable cloud/local proposals; [ADR-0010](../09-decisions/ADR-0010-local-authority-and-data.md) | Local-only lowers egress but capability unknown; cloud-owned authority risks outage/overcapture | RES-05/08; GATE-06/08; provider terms/cost budget before real data |
| OQ-05 · resolved decision + open evidence | Simon accepted tap-to-talk/full touch and Android on-device recognition with conservative non-model cleanup on 2026-09-20; [ADR-0011](../09-decisions/ADR-0011-explicit-activation-and-access.md). Follow-up smoke feedback is positive for repaired continuity/access paths, while spoken readback remains insufficiently natural | Always-on remains deferred; bundled local ASR is the next input comparison only if measured native recognition fails. Alternate local or cloud TTS needs its own quality/privacy/dependency comparison under OQ-04; no route is selected | [Follow-up device feedback](../08-research/2026-09-20-native-tablet-followup-feedback.md); T-120/T-121; RES-03/06; EVAL-005/007/009/012; GATE-05/06/07; exact configuration, denominators and realistic acoustic evidence remain incomplete |
| OQ-06 · Simon | Name architecture: one provisional masterbrand/product/companion, company legal name unconstrained; finalists Daykind, Handspan, Clearfold | Daykind warm daily presence; Handspan agency with dictionary/crowding concerns; Clearfold clarity/platform with known paper-mark lead—hold legal review | [Iteration kit](../02-design/naming-exploration.md); RES-09; no availability claim; no commitment before market/language/mark screening |
| OQ-07 · current visual system selected + open production evidence | Simon selected Harbour Blue, iteration 5 / 04, as the design system for now on 2026-09-19; main-board and displayed palette choice is resolved | Earlier Soft Plum and assistant shortlist recommendations are superseded; retain iterations as history | [FINAL image and written reference](../02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md); production font files, dimensions, logo, dark/unshown states and GATE-05 evidence remain open |
| OQ-08 · Simon | Select initial pilot market/language and recruitment context; English is prototype language only | One market reduces linguistic/support load; multilingual launch multiplies consent/voice/name/legal work | RES-01/06/09; specialist privacy/consumer/trademark review scoped after choice; no Spain inference |
| OQ-09 · accepted behavior + open evidence | MVP explicit preferences/aliases only; App V1 automatically captures allowed important facts and adapts bounded communication under [ADR-0012](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md); optional helper proposals get no private-memory access | Lower user effort increases false-save, profiling and correction risk; typed local admission and durable rights require evidence | RES-08 and ADR-0010 placement/vendor questions; EVAL-017; GATE-06/09; adult preference overrides buyer convenience |
| OQ-10 · Simon before pilot | Accept prospective metric thresholds/sample plan and risk budget; name responsible support/incident reviewer and budget | Small formative pilot learns usability but cannot prove rare-event safety; expansion needs stronger evidence | [Eval strategy](../06-evals/eval-strategy.md), RES-07; GATE-09; no post-hoc threshold lowering |
| OQ-11 · evidence | Prove visible accessible Stop/return and exclusion of human action during external control | If overlay/service/foreground lifecycle cannot meet it, use manual handoff; cannot claim guaranteed takeover | EVAL-006, T-101/104; GATE-03/06; device-specific |
| OQ-12 · Simon + evidence | Find real permitted route to person/date/photo and media/message postconditions. Android's standard play-from-search intent reached YT Music in one T-124 device attempt, but its session remained paused; playback identity and Pause remain unproved. Spotify's SDK route remains policy no-go | Review exact provider terms and define a non-personal identity/playing oracle before explaining the paused result or running another variant. If the handoff cannot mature beyond `requested`, choose an owner integration, revise the outcome, replace a workflow or revisit ADR-0009's bar | [T-124 device evidence](../08-research/2026-09-20-t124-media-handoff-device-evidence.md); [route inventory](../08-research/2026-09-19-t101-route-inventory.md); EVAL-001/003/004; GATE-03/04/07; no further provider/account/device action authorized |

T-113 refined execution/journal/Stop and admission contracts without accepting new product decisions. OQ-04/09 still govern durable data placement and retention: [execution protocol](../03-agent/execution-protocol.md) proposes content-free journal fields and explicit missing-history limits; [capability admission](../04-architecture/capability-admission.md) identifies configuration evidence needed for OQ-02/03/11/12. The [task packets](task-packets.md) make these testable; no new vendor/framework/backend is selected.

## Current interaction review — OQ-13

**Shape decision, Simon, 2026-09-17:** [Round conversation](../02-design/brand-and-visual-identity.md#accepted-shape-direction--round-conversation) is selected for future compact/normal/expanded composers and favicon exploration. This resolves composer shape only; the broader identity territories under OQ-07, remaining visual values and human/accessibility evidence remain open. Earlier review text below is historical context, not a request to reopen the selected shape.

**Current fictional iteration accepted; final design evidence open:** Simon authorized the [conversation-first build](../02-design/conversation-first-plan.md) on 2026-09-14, continued its message checkpoint on 2026-09-15 and reviewed the integrated first iteration on 2026-09-20. He reported it cohesive and good for now, including the Home/Rooms scrolling refinement, with no immediate frontend change requested. This owner review does not accept final public identity, widen autonomy or pass GATE-05. Representative older-adult comprehension remains unrun.

## Brainstorming alignment review — OQ-14

**Resolved direction; evidence remains open:** [Simon's 2026-09-17 class brainstorm](../08-research/source-material/2026-09-17-class-brainstorming.md) reinforces conversation-led entry, contextual result modules, optional guidance/annotations, Android delivery and an orchestrator posture. Simon retained consequence-based approval and the MVP/App V1/later split, accepted automatic important-fact capture plus bounded adaptive communication in [ADR-0012](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md), and accepted [bounded semantic interface composition](../09-decisions/ADR-0013-bounded-interface-composition.md). ADR-0014's earlier one-panel Home remains historical; [ADR-0016](../09-decisions/ADR-0016-explicit-home-room-row.md) now owns the selected Context Rooms Home composition. Older-adult comprehension/access evidence remains open.

## Context Rooms direction — OQ-15

**Core direction and fictional iteration accepted; production evidence remains open:** Simon accepted [ADR-0015](../09-decisions/ADR-0015-context-rooms.md) and then directed the notebook/future plan to adopt it on 2026-09-19. [Context Rooms](../02-design/context-rooms.md) are optional recognizable spaces around one global assistant: Home remains universal, room context foregrounds related references, policy-scoped cross-room retrieval remains available, direct browse/search is mandatory, visual atmosphere is bounded and deleting a room does not silently delete underlying data. T-119's in-memory browser iteration is integrated and owner-reviewed as cohesive; PRD-FR-022 still proposes App V1 production placement without expanding MVP or admitting persistent data.

**Home composition resolved, Simon, 2026-09-19:** Simon selected
[Explicit Scroll Row](../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md)
as the accessible, direct and visually preferred Home treatment. Accepted
[ADR-0016](../09-decisions/ADR-0016-explicit-home-room-row.md) supersedes
ADR-0014's zero-or-one-region limit for Context Rooms while retaining stable
conversation anchors. Future sessions start from the compact continuation,
open portraits, written Previous/Next and See all rooms rather than reopening
the earlier Home variants.

Open decisions are the zero/default/user-created starting set, final product term, cross-room source disclosure threshold and private-room semantics. Visual variation is now bounded by the selected Home plus the proposed [five-role reviewed-pack system](../02-design/context-room-visual-system.md); eight [Kitchen and Fitness directions](../02-design/context-room-starter-catalog.md) await contact-sheet and in-UI review rather than acceptance by documentation. Resolve the remaining questions through the T-119 fictional-data prototype and EVAL-008/012 before persistent data or release admission. PRD-FR-022, UC-026, J-009, SCR-003/016/017, CMP-011/012 and CAP-15 now provide stable owners. The row is not a room tile grid and does not expand the five-workflow MVP.

## Simon's minimum next decision packet

OQ-01 and OQ-02's control posture were accepted together on 2026-09-14; actual route admission remains evidence-gated. OQ-14's six product conflicts and OQ-15's Context Rooms plan now have explicit direction. Remaining decisions include ADR-0010/0011, the [name feedback table](../02-design/naming-exploration.md), the [four identity boards](../02-design/identity-review.html) and OQ-15's access/visual/privacy details after T-119. Choosing Home or Rooms does not imply accepting final visuals, name/legal clearance, token values or persistent-data admission. Fake contract replay T-103 can proceed independently.

Unknowns must produce dated evidence or remain unknown. Only update an ADR to accepted with Simon's explicit decision and authority/date; never convert a tentative preference, lack of objection or a successful synthetic test into acceptance.

## Legacy question migration

The initialization queue used three-digit OQ IDs. They are preserved here as aliases or unresolved source questions; the two-digit decision briefs above are new records, not reused meanings.

| Legacy ID / original topic | Current owner / disposition |
|---|---|
| OQ-001 market/user setting | OQ-08 + RES-01; unresolved |
| OQ-002 MVP workflows | OQ-01; experiment scope accepted by Simon 2026-09-14, feasibility and release still gated |
| OQ-003 V1/memory/family scope | OQ-09 and scope map; proposed |
| OQ-004 observed workarounds | RES-01/07; unrun |
| OQ-005 action classes/confirmation | Action policy now specified; OQ-01/05 and EVAL-010/012 validate |
| OQ-006 data/retention/rights | Privacy policy now specified; OQ-04/09 and RES-05/08 |
| OQ-007 helper scope/revocation | OQ-09; explicit proposal, evidence unrun |
| OQ-008 threats/account recovery | Threat model now specified; EVAL-008/010/016, no runtime proof |
| OQ-009 activation | OQ-05 resolved by accepted ADR-0011; tap-to-talk, no physical control dependency; device/access evidence remains open |
| OQ-010 access targets | OQ-05/07; measured color arithmetic only, access/user tests absent |
| OQ-011 initiative/quiet hours | Proactive execution excluded MVP/V1; later App new decision required |
| OQ-012 exact tablet | OQ-03/11; inventory absent |
| OQ-013 local/remote | OQ-04; ADR-0010 proposed |
| OQ-014 providers/storage/identity | OQ-04; defer replaceable choices until evidence, no MVP helper backend |
| OQ-015 future OS entry | Dormant future-stage context; not a current backlog item |
| OQ-016 original conversation export | Still unknown whether a byte-original export exists; current structured capture preserved. Nonblocking; do not invent or replace it |
| OQ-017 public naming architecture | OQ-06; full naming package written, no selected name |
