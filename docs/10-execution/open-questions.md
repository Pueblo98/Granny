---
title: "Stage 1 decision queue and evidence unknowns"
status: proposed
owner: Simon
last_updated: 2026-09-14
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
| OQ-05 · Simon | Tap-to-talk with complete touch path and stronger access targets; [ADR-0011](../09-decisions/ADR-0011-explicit-activation-and-access.md) | Always-on may reduce initiation but privacy/background/acoustic risk unproven | RES-03/06; GATE-05; wake word deferred separately from public name |
| OQ-06 · Simon | Name architecture: one provisional masterbrand/product/companion, company legal name unconstrained; finalists Daykind, Handspan, Clearfold | Daykind warm daily presence; Handspan agency with dictionary/crowding concerns; Clearfold clarity/platform with known paper-mark lead—hold legal review | [Iteration kit](../02-design/naming-exploration.md); RES-09; no availability claim; no commitment before market/language/mark screening |
| OQ-07 · Simon + evidence | Test Open Day identity; retain Bright Signal as clear challenger | Living Pages is editorial and may feel less voice-native; Everyday Spark warmer/playful but risk childish interpretation | [Territory matrix](../02-design/brand-and-visual-identity.md), [boards](../02-design/identity-review.html); GATE-05; final fonts/logo/dark tokens need production tests |
| OQ-08 · Simon | Select initial pilot market/language and recruitment context; English is prototype language only | One market reduces linguistic/support load; multilingual launch multiplies consent/voice/name/legal work | RES-01/06/09; specialist privacy/consumer/trademark review scoped after choice; no Spain inference |
| OQ-09 · Simon + evidence | MVP explicit preferences/aliases only; V1 explicit facts and optional helper proposals; no remote private-content access | More memory/help may add value but increases disclosure/coercion/rights surface | RES-08 and ADR-0010; GATE-06/09; adult preference overrides buyer convenience |
| OQ-10 · Simon before pilot | Accept prospective metric thresholds/sample plan and risk budget; name responsible support/incident reviewer and budget | Small formative pilot learns usability but cannot prove rare-event safety; expansion needs stronger evidence | [Eval strategy](../06-evals/eval-strategy.md), RES-07; GATE-09; no post-hoc threshold lowering |
| OQ-11 · evidence | Prove visible accessible Stop/return and exclusion of human action during external control | If overlay/service/foreground lifecycle cannot meet it, use manual handoff; cannot claim guaranteed takeover | EVAL-006, T-101/104; GATE-03/06; device-specific |
| OQ-12 · evidence | Find real permitted route to person/date/photo and media/message postconditions | App intents/tree may be insufficient; alternative admitted integration or revised workflow needs explicit scope review | EVAL-001/003/004; GATE-03/07; ≥2 external jobs required |

## Simon's minimum next decision packet

OQ-01 and OQ-02's control posture were accepted together on 2026-09-14; actual route admission remains evidence-gated. Remaining decisions include ADR-0010/0011 and the [name feedback table](../02-design/naming-exploration.md) / [four identity boards](../02-design/identity-review.html). Choosing a direction does not imply accepting name/legal clearance or all token values. Fake contract replay T-103 can proceed in a separately requested coding session without these brand/market choices.

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
| OQ-009 activation | OQ-05; tap-to-talk proposed, no physical control dependency |
| OQ-010 access targets | OQ-05/07; measured color arithmetic only, access/user tests absent |
| OQ-011 initiative/quiet hours | Proactive execution excluded MVP/V1; later App new decision required |
| OQ-012 exact tablet | OQ-03/11; inventory absent |
| OQ-013 local/remote | OQ-04; ADR-0010 proposed |
| OQ-014 providers/storage/identity | OQ-04; defer replaceable choices until evidence, no MVP helper backend |
| OQ-015 future OS entry | Dormant future-stage context; not a current backlog item |
| OQ-016 original conversation export | Still unknown whether a byte-original export exists; current structured capture preserved. Nonblocking; do not invent or replace it |
| OQ-017 public naming architecture | OQ-06; full naming package written, no selected name |
