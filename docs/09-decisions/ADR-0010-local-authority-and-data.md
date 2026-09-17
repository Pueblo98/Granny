---
title: "ADR-0010 — Propose local execution authority and explicit data ownership"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [adr]
related:
  - README.md
  - ../10-execution/open-questions.md
  - ../10-execution/development-readiness.md
---

# ADR-0010 — Propose local execution authority and explicit data ownership


## Context

A model may misunderstand or be manipulated by visible content. Remote dependency loss must not block Stop or deletion controls. Family buyer interests can diverge from the adult's privacy. Stage 1 has no accepted vendor/backend.

## Options

| Option | Benefit | Cost / risk |
|---|---|---|
| Cloud owns session, policy and device actions | Central orchestration and updates | Network-dependent safety, greater egress and confused-deputy risk |
| Fully on-device model and runtime | Smallest egress/offline opportunity | Unknown reference-tablet voice/reasoning capability and cost/performance; do not assume feasible |
| Local authoritative policy/executor/data with replaceable local/cloud proposal adapters | Independent limits/Stop, controlled egress, vendor choice deferred | More explicit interfaces and synchronization; local process lifecycle still needs device proof |

## Proposed decision

Third option. Local typed policy and executor own admission, cancellation latch, confirmation binding, dispatch journal and postcondition checks. Planner only proposes; UI displays locally owned state. Screen content is untrusted data. Local memory stores explicit MVP settings/aliases only; no passive transcript archive, cloud sync or helper backend. [Accepted ADR-0012](ADR-0012-automatic-memory-and-adaptive-communication.md) separately establishes automatic typed important-fact memory and adaptive communication as App V1 behavior. This ADR still leaves exact local placement, provider/backend and helper architecture proposed and evidence-gated.

[System map](../04-architecture/system-overview.md) owns component contracts; [privacy policy](../05-safety-privacy/safety-and-privacy.md) owns retention/deletion; [action policy](../05-safety-privacy/action-policy.md) owns effect classification. Cloud egress is separately consented, minimized and blocked for real data pending provider terms. Content-free local audit must not become surveillance. User corrections/deletion remove derivatives; tombstones prevent resurrection where restore/sync later exists. No provider/database/framework is selected.

## Consequences and validation

Can implement fake-adapter policy/verification/replay without network/permissions/personal data; cannot claim device safety from fake tests alone. Local authority needs tested permission/lifecycle/visibility isolation. Real-data use needs reviewed provider retention/egress, backup exclusions, export/deletion and incident support. Family may propose limited V1 configuration; never inherit history/screens because they pay.

RES-04/05/08 and EVAL-006/008/009/010/016/017; GATE-06/07/08. Alternative local-only deployment remains viable if measured; backend expands only with justified identity/sync use case and new threat review.

## Authority / reconsideration

**Proposed; Simon decision required for durable boundary and data posture.** Current explicit user instruction already requires independently enforced consequences and user primacy; exact placement/retention are proposals. Revisit after provider/device evidence, not vendor preference. No remote-account infrastructure authorized now.
