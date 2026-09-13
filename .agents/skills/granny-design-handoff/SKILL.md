---
name: granny-design-handoff
description: "Prepare or review Granny Stage 1 interaction frames, component states, accessibility annotations and Figma handoff. Keep design preparation distinct from external Figma writes and final brand acceptance."
metadata:
  owner: Simon
  status: proposed
  last_updated: "2026-09-14"
---

# Granny design handoff

Read [AGENTS](../../../AGENTS.md), [milestone](../../../docs/10-execution/current-milestone.md), selected J/SCR/CMP owners and [Figma contract](../../../docs/02-design/figma.md). Use the T-102/108 [packets](../../../docs/10-execution/task-packets.md) and WF-02 in [workflows](../../../docs/10-execution/operating-workflows.md).

Confirm artifact and fidelity: interaction manifest, low-fi prototype, identity comparison or implementation handoff. Preparing/reviewing a manifest does not authorize creating/editing an external Figma file. If an authorized design tool is available, inspect the target before mutation and stay within the requested file/frames; otherwise provide an honest preparation artifact, not a fabricated Figma link.

When the official Figma MCP is available, use its workflow skills rather than
improvising tool sequences. For design-to-code, load
`skill://figma/figma-design-to-code/SKILL.md`, use exact file/node links, and
obtain structured design context plus a reference screenshot before adapting
the design to Android. For from-scratch or code-to-Figma work, load
`skill://figma/figma-generate-design/SKILL.md` and
`skill://figma/figma-use/SKILL.md`, search the available design system first,
and use the native Figma authoring path for Android/generic UI. Create a new
file or mutate frames only when the current request authorizes that external
write. Use Code Connect only after real Figma and code components exist and an
explicit mapping task is authorized.

Define each frame's entry/exit, state owner, exact copy, controls, focus/semantics, private regions, loading/empty/error/Stop paths, requirement/eval links and token maturity. Read [product design](../../../docs/02-design/product-design-spec.md), [components](../../../docs/02-design/design-system.md), [accessibility](../../../docs/02-design/accessibility.md) and [voice](../../../docs/02-design/voice-ux.md) for behavior. Android-owned screens stay annotated placeholders until device evidence; do not assume an external overlay can guarantee Stop.

For identity work, read [brand](../../../docs/02-design/brand-and-visual-identity.md), [naming](../../../docs/02-design/naming-exploration.md) and [tokens](../../../design-tokens/README.md). Compare territories on identical behavior/copy/layout. Granny is a codename; no selected font/name/palette/logo follows from a mock or prior recommendation. Candidate values remain proposed until Simon approves the exact choice.

Review voice/touch equivalence, maximum scale, no color/audio-only meaning, exact recipient/content/consequence and unknown-vs-complete results. A Figma layout is not a device accessibility or usability pass. Use [research protocols](../../../docs/08-research/research-protocols.md) only when preparing/evaluating studies; no participant contact implied.

Hand off actual frame/source references if created, otherwise the manifest; coverage and missing variants; accepted/proposed token values; research questions; validation and remaining authority. Use the fewest MCP calls that preserve evidence: target exact nodes, batch related inspection, and avoid repeatedly fetching unchanged whole files. Do not implement UI code unless explicitly requested.
