---
title: "Define the Context Rooms product direction"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, context, decision]
related:
  - ../../02-design/context-rooms.md
  - ../../09-decisions/ADR-0015-context-rooms.md
  - ../../03-agent/memory-system.md
  - ../../05-safety-privacy/safety-and-privacy.md
  - ../../06-evals/canonical-tasks.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Context Rooms specification session
branch: docs/context-rooms-concept
base_commit: 90af0f0
next_action: Simon reviews the Context Rooms write-up; the next separately authorized design task prototypes global Home, one Kitchen room, cross-room provenance, direct browsing and room deletion with fictional data.
changed_paths:
  - docs/README.md
  - docs/Cockpit.md
  - docs/02-design/context-rooms.md
  - docs/02-design/conversation-first-plan.md
  - docs/02-design/product-design-spec.md
  - docs/03-agent/memory-system.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/action-policy.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/05-safety-privacy/threat-model.md
  - docs/06-evals/canonical-tasks.md
  - docs/09-decisions/ADR-0015-context-rooms.md
  - docs/09-decisions/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/open-questions.md
---

# Scope and authority

Simon proposed rooms as recognizable background/context spaces for related
material and asked for critical review rather than agreement. After discussing
the risks, he explicitly retained global chat for simple tasks, selected one
assistant/personality with room and cross-room context, replaced emoji-only
navigation with large labels plus visual reinforcement, bounded per-room
atmosphere and accepted the optional-Rooms formulation for a full Obsidian
write-up.

# Result

The new canonical design concept defines Rooms as a secondary spatial
organization and retrieval layer around one assistant, not a Home dashboard,
folder skin or group of specialist agents. It specifies the user mental model,
global/current/cross-room context, direct browse/search, reference-based
organization, creation/archive/deletion behavior, bounded atmosphere,
accessibility and privacy constraints, failure handling and a four-phase build
and evidence plan.

ADR-0015 records the accepted principles and leaves exact access, terminology,
default set, visual treatment, screen/component IDs, release placement and real
data admission open. The memory and privacy owners separate room membership
from personal memory, preserve minimum-necessary provenance-carrying retrieval
and make underlying-data deletion a separate exact action. EVAL-008/012 gain
future fictional-data and comprehension coverage without claiming execution.

# Boundaries and evidence

This task changes product documentation only. It does not modify Claude Design,
implement rooms, connect real documents, accept a cognitive/dementia claim,
expand the current MVP or pass a gate. Documentation validation passed with
145 Markdown files and zero errors; cockpit freshness passed with 39 records;
handoff coverage and whitespace checks passed; all 47 documentation-tool unit
tests passed. These structural checks are not runtime, device, accessibility or
human evidence.
