---
title: Product Principles
status: proposed
owner: Simon
last_updated: 2026-09-19
tags:
  - vision
  - principles
related:
  - product-vision.md
  - ../02-design/design-system.md
  - ../05-safety-privacy/safety-and-privacy.md
---

# Product Principles

These principles are extracted from the working Dream Book and planning conversation. They are coherent but remain **proposed** until reviewed.

1. **Ask, don't navigate.** Prefer natural intent to requiring knowledge of apps or menus.
2. **AI does the work when it safely can.** Do not stop at instructions when Granny can reliably perform the task.
3. **Preserve human control.** The user can interrupt, cancel, correct, undo where possible, or take over by touch.
4. **Calm over dense.** Present one clear thing at a time; do not turn life into a dashboard.
5. **Familiar apps remain available.** Operate the existing digital world rather than rebuilding every service.
6. **Explain consequential actions.** Show what will happen before it happens and what occurred afterward.
7. **Errors belong to the system, not the person.** Explain and recover without blame or technical jargon.
8. **Relationships over engagement.** Optimize for useful outcomes and human connection, not screen or conversation time.
9. **Never infantilize the user.** Assume autonomy and competence; adapt to preferences and access needs without condescension.
10. **Accessibility is architecture, not polish.** Voice, touch, readability, semantics, timing, and recovery shape the system from the start.
11. **Remember appropriately.** Store only useful, permissioned context with correction, inspection, deletion, and sharing controls.
12. **Earn autonomy.** Broader initiative follows explicit delegation and demonstrated reliability; uncertainty narrows action.
13. **Organize by recognition without trapping.** Optional Context Rooms may bring related material closer, but Home, direct browse/search and one consistent assistant remain available.

## Technical corollaries

- Prefer supported APIs → semantic accessibility actions → structured UI automation → vision/coordinates.
- Verify every meaningful action and design recovery as a normal path.
- Keep model providers replaceable.
- Use custom OS work only to solve demonstrated limitations, following an accepted ADR.

## Review questions

- Which principles are immutable product constraints versus preferences?
- How are conflicts resolved—for example, familiar app behavior versus radical simplicity?
- Which measurable design/eval rules demonstrate each principle?
