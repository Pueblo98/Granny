# Granny — Codex Project Initialization Handoff

**Purpose:** Initialize the Granny product repository and knowledge base so future product, design, engineering, agent, hardware, and research work can proceed from a clean single source of truth.

**Working product name:** Granny  
**Current phase:** Product definition / design system / documentation foundation  
**Do not begin full product implementation in this task.**

---

## 1. Your Role

You are acting as the initial product-engineering operator for a new AI hardware/software project.

Your job in this session is to:

1. Read the context supplied with this handoff, especially the previous ChatGPT conversation containing the detailed proposed repository/documentation structure.
2. Initialize or cleanly organize the project repository.
3. Make the Git repository itself usable as an Obsidian knowledge base.
4. Move existing project artifacts into the correct locations.
5. Create the core documentation framework and navigation system.
6. Convert confirmed product context into a small set of canonical Markdown documents.
7. Set up conventions that future Codex sessions can follow.
8. Leave a clear backlog and list of unresolved decisions.
9. Stop before doing substantial Android/backend/hardware implementation unless explicitly instructed otherwise.

Do not treat this as a “generate a bunch of documents” exercise. The goal is to establish a durable operating system for the project.

---

## 2. What Granny Is

### One-line description

**Granny is an AI-first personal computer for older adults that can talk, remember, understand the screen, and operate the device on the user’s behalf.**

### Core product thesis

> The user should not need to learn how to operate the computer. The computer should learn how to operate itself for the user.

The long-term product is a purpose-built AI companion/computer for older adults. The visible interface begins as an Android tablet, but the end-state product is larger than a tablet app.

The intended system combines:

- a senior-first tablet interface;
- a conversational AI companion;
- persistent personal and relationship memory;
- an agent capable of operating the Android device and existing third-party apps;
- permissioned/proactive assistance;
- life-story and memory capture;
- a trusted family/caregiver support layer;
- and eventually dedicated physical hardware consisting of a tablet plus a sleek dock/base with high-quality microphones, speaker, tactile controls, charging, and a magnetic/mechanical attachment system.

The product should make normal computing accessible through natural intent rather than menus.

Example:

> “Sophie sent me pictures yesterday. Can you show them to me?”

The ideal system can understand who Sophie is, operate the relevant app, find the correct content, show it, explain what it is doing, recover if the UI changes, and ask for confirmation before consequential actions.

---

## 3. What Makes the Product Different

Do **not** define Granny as “Gemini/Alexa but for old people.”

General voice-assistant capabilities will increasingly be commoditized.

The differentiated product vision is the combination of:

1. **General device operation** — the agent can observe, understand, navigate, and operate the actual device and existing Android apps rather than relying only on purpose-built integrations.
2. **Senior-first computing experience** — calm UI, large controls, low cognitive load, simple language, strong accessibility, and excellent failure recovery.
3. **Persistent relationship memory** — people, relationships, preferences, routines, stories, places, important life events, and user-correctable long-term context.
4. **Life-story creation** — natural conversations can gradually become meaningful artifacts such as stories, timelines, family histories, recordings, and photo-linked memories.
5. **Family support** — a trusted family member can help configure the device, add useful information, send content, and assist with technical problems without forcing the older adult to navigate settings.
6. **Permissioned autonomy** — the agent can do safe work automatically while consequential actions remain clearly confirmed or restricted.
7. **Dedicated hardware presence** — eventually the software becomes an appliance-like companion rather than “just another tablet app.”

The AI model itself should be treated as replaceable infrastructure. Product value should not depend on one foundation-model vendor.

---

## 4. Current Strategic Decisions

Treat the following as current decisions unless newer user-provided context explicitly overrides them.

### Hardware reference device

The initial development/reference tablet is a **Samsung Galaxy Tab A11+**, purchased used for approximately **$140**.

### Android before iPadOS

Android is the primary platform because the product needs deep device interaction, custom launcher/device-management possibilities, accessibility-based UI inspection/control, and potentially a future path toward deeper Android/AOSP integration.

### Stock Android before an AOSP fork

Do **not** begin by maintaining a custom Android distribution.

The intended progression is approximately:

```text
stock Android
    ↓
custom senior launcher
    ↓
voice/companion layer
    ↓
AccessibilityService + semantic device control
    ↓
managed/dedicated-device capabilities
    ↓
deeper system integrations where needed
    ↓
evaluate AOSP/custom OS only after concrete limitations are known
```

### Semantic control before computer vision

For device automation, prefer:

```text
native/system API
    ↓
semantic Android accessibility action
    ↓
structured UI automation
    ↓
vision + coordinate interaction as fallback
```

The agent loop is conceptually:

```text
OBSERVE
  ↓
UNDERSTAND
  ↓
PLAN
  ↓
ACT
  ↓
VERIFY
  ↓
RECOVER
```

### Product design before major implementation

The immediate project phase is documentation and product/experience design.

The next major design environment is expected to be **Figma**.

Physical industrial/mechanical design may later move into a CAD tool such as Fusion, but custom hardware is not the immediate implementation priority.

---

## 5. Inputs You Will Receive

The user will provide or place in the working directory:

1. This handoff.
2. A previous ChatGPT conversation containing a much more detailed proposed project/repository/documentation structure.
3. The existing Granny “Dream Book,” potentially in both:
   - `granny_ai_dream_book.tex`
   - `granny_ai_dream_book.pdf`
4. Any additional product notes or mockups available in the current workspace.

Use the previous conversation as **source material**, not as permission to blindly generate every proposed file with filler.

Where the conversation includes a detailed repository tree, preserve that structure unless there is a clear technical reason to adjust it.

If you adjust it, document the reason.

---

## 6. Source-of-Truth Priority

When sources disagree, use this priority:

1. Current explicit user instructions.
2. This handoff.
3. Existing accepted project documents / Dream Book.
4. The supplied previous conversation.
5. Your own inference.

Never silently convert speculation into an accepted product decision.

When something is unresolved:
- mark it as an **Open Question**, or
- create/log a decision record with status **Proposed**.

Separate confirmed facts, accepted decisions, assumptions, hypotheses, and open questions.

Do not invent user research, market evidence, technical test results, accessibility findings, or product requirements that have not been established.

---

## 7. Repository Philosophy

The repository is the **single source of truth**.

Figma will contain visual design artifacts, but the reasoning, requirements, behavior, architecture, decisions, and implementation contracts should remain represented in the repository.

The same repository should also serve as the **Obsidian vault**.

Do not create a second independent notes repository.

Conceptually:

```text
Git repository
│
├── product documentation
├── Obsidian knowledge graph
├── design specifications
├── agent specifications
├── architecture
├── evals
├── Android code
├── backend code
└── hardware files
```

Obsidian is a way to navigate the repo, not a competing source of truth.

---

## 8. Repository Structure

The supplied previous conversation contains the fuller desired tree. Use it as the main structural reference.

At minimum, the project should support this organization:

```text
granny/
│
├── README.md
├── AGENTS.md
├── ARCHITECTURE.md
├── .gitignore
├── .obsidian/
│
├── docs/
│   ├── README.md
│   ├── 00-vision/
│   ├── 01-product/
│   ├── 02-design/
│   ├── 03-agent/
│   ├── 04-architecture/
│   ├── 05-safety-privacy/
│   ├── 06-evals/
│   ├── 07-hardware/
│   ├── 08-research/
│   ├── 09-decisions/
│   └── 10-execution/
│
├── design-tokens/
├── android/
├── backend/
├── agent/
├── evals/
└── hardware/
```

Do not create empty directories solely for aesthetics if Git will not track them. Where a planned directory must exist before content is ready, use a short `README.md` explaining its purpose rather than meaningless `.gitkeep` files.

---

## 9. Obsidian Setup

Treat the **repository root as the Obsidian vault**.

This allows project documentation to link naturally to architecture, root instructions, evals, and implementation material.

### Desired behavior

- Markdown remains readable in GitHub, editors, Codex, and Obsidian.
- Prefer standard Markdown links where practical rather than creating an Obsidian-only knowledge format.
- Use YAML frontmatter for document metadata.
- Keep navigation intentional rather than relying on the graph view.
- Do not require community plugins for basic project operation.
- Do not commit machine-specific Obsidian workspace state.

### Obsidian configuration

If the installed/current Obsidian configuration format can be verified, configure sensible project defaults.

If it cannot be verified, do **not** fabricate configuration keys. Create the vault structure and document the recommended manual settings instead.

At minimum, Git should ignore volatile/user-specific Obsidian files such as workspace/layout state while allowing useful shared vault configuration to be versioned where appropriate.

Do not install community plugins unless the user explicitly asks for them.

Useful core Obsidian features:
- backlinks;
- outgoing links;
- properties;
- templates;
- search;
- tags;
- graph/local graph;
- file recovery if available.

Do not make Daily Notes the center of the project. This is a product knowledge base, not a personal journal.

---

## 10. Documentation Conventions

All substantive Markdown documents should use consistent frontmatter similar to:

```yaml
---
title: Voice UX
status: draft
owner: Simon
last_updated: 2026-09-10
tags:
  - design
  - voice
related:
  - docs/01-product/prd.md
  - docs/03-agent/agent-behavior.md
---
```

Allowed status vocabulary:

```text
draft
proposed
review
accepted
deprecated
```

Do not mark a document `accepted` merely because you created it.

Use the actual date when creating or materially updating files.

Where appropriate, documents should include:

```markdown
# Title

## Purpose
## Context
## Requirements / Decisions
## Examples
## Constraints
## Open Questions
## Related Documents
```

Avoid duplicated canonical information. Link to the authoritative document instead.

---

## 11. Documentation Templates

Create lightweight templates for at least:

```text
docs/_templates/spec.md
docs/_templates/adr.md
docs/_templates/user-journey.md
docs/_templates/use-case.md
docs/_templates/research-note.md
docs/_templates/eval.md
```

Templates should encourage structured thinking but remain concise enough that people and agents will actually use them.

---

## 12. Core Documents to Establish During Initialization

Do not write every future document now.

Prioritize a small set of canonical starter documents.

### Root `README.md`

Explain:
- what Granny is;
- current project stage;
- how to navigate the repository;
- how to open it in Obsidian;
- key documentation entry points;
- major implementation directories;
- current reference hardware.

### `AGENTS.md`

This is the persistent navigation/instruction file for Codex and other coding agents.

Keep it concise.

It should include:
- the one-line product definition;
- core thesis;
- where product/design/agent/architecture/safety/eval specifications live;
- source-of-truth rules;
- engineering/documentation expectations;
- requirement that consequential agent capabilities update safety/confirmation specs;
- requirement that important new capabilities receive eval coverage;
- rule to prefer semantic device control over coordinate clicking;
- rule not to introduce AOSP/custom-OS work without an accepted decision;
- rule to update relevant documentation when behavior changes.

Do not turn `AGENTS.md` into the Dream Book.

### `ARCHITECTURE.md`

Initially this can be concise and high-level.

Describe the intended boundaries between:
- Android client;
- launcher/UI;
- voice layer;
- screen observation;
- action executor;
- device-control service;
- agent/planner;
- model layer;
- memory;
- backend;
- safety/permissions;
- family/caregiver experience.

If architecture is not yet decided, clearly label it as conceptual.

---

## 13. Vision Documents

Place the existing Dream Book under:

```text
docs/00-vision/dream-book.tex
docs/00-vision/dream-book.pdf
```

Preserve the originals unless there is a good reason not to.

Also establish:

### `product-vision.md`

A concise machine-readable canonical version of the vision.

Include:
- one-line description;
- one-paragraph explainer;
- core thesis;
- problem;
- intended end-state;
- major product layers;
- differentiation;
- current phase;
- boundaries between Vision, V1, and MVP.

### `product-principles.md`

Seed with confirmed/proposed principles such as:
- Ask, don’t navigate.
- AI does the work when it safely can.
- Preserve human control.
- Calm over dense.
- Familiar apps remain available.
- Explain consequential actions.
- Errors belong to the system, not the person.
- Relationships over engagement.
- Never infantilize the user.
- Accessibility is architecture, not polish.

Mark principles `proposed` unless the supplied context clearly establishes them as accepted.

---

## 14. Product Documentation

Create or initialize:

```text
docs/01-product/prd.md
docs/01-product/personas.md
docs/01-product/jobs-to-be-done.md
docs/01-product/use-cases.md
docs/01-product/user-journeys.md
docs/01-product/feature-map.md
docs/01-product/non-goals.md
docs/01-product/roadmap.md
```

Do not fill all of these with invented detail.

The most useful initial content is:
- known requirements;
- representative examples from the supplied conversation;
- explicit open questions;
- links to source documents.

### Keep these scopes distinct

**Vision** — everything the fully realized Granny product may eventually become.

**V1** — the first complete product that could reasonably be delivered to real users.

**MVP** — the smallest implementation/test necessary to validate critical product assumptions.

Do not let those scopes collapse into one another.

---

## 15. Use Cases and Journeys

Use cases should receive stable IDs.

Example:

```text
UC-001 — Call a known family member
UC-002 — Show photos a family member sent recently
UC-003 — Explain and recover from a confusing screen
UC-004 — Play requested music
UC-005 — Capture a personal story
```

The ID should remain stable even if the wording evolves.

Do not create 100 artificial use cases during initialization.

Create a representative seed set from known conversation context and establish the format for later expansion.

---

## 16. Design Documentation

Initialize:

```text
docs/02-design/design-principles.md
docs/02-design/design-system.md
docs/02-design/color-system.md
docs/02-design/typography.md
docs/02-design/spacing-and-layout.md
docs/02-design/components.md
docs/02-design/interaction-states.md
docs/02-design/voice-ux.md
docs/02-design/content-style-guide.md
docs/02-design/accessibility.md
docs/02-design/figma.md
```

Do **not** invent a final color palette yet.

Known qualitative direction:
- calm;
- warm;
- clear;
- non-clinical;
- non-infantilizing;
- minimal cognitive load;
- large readable type;
- generous touch targets;
- extremely clear state/confirmation design;
- voice-first but fully usable by touch.

`color-system.md` should initially define semantic color roles and the decision process rather than pretending final HEX values are approved.

`figma.md` should document the intended Figma file/page organization and how Figma relates to repo specifications.

---

## 17. Agent Documentation

Initialize:

```text
docs/03-agent/agent-behavior.md
docs/03-agent/autonomy-model.md
docs/03-agent/device-control.md
docs/03-agent/memory-system.md
docs/03-agent/proactive-behavior.md
docs/03-agent/confirmation-policy.md
docs/03-agent/recovery-behavior.md
docs/03-agent/tool-contracts.md
```

The agent is not simply a chatbot.

Its device interaction model is:

```text
Observe → Understand → Plan → Act → Verify → Recover
```

Consequential actions must be permissioned.

Useful initial conceptual autonomy tiers:

```text
Level 0 — Observe
Level 1 — Safe navigation
Level 2 — Prepare/reversible actions
Level 3 — Confirmed consequential actions
Level 4 — Explicitly delegated routine actions
Restricted — High-risk actions
```

Do not over-specify exact permissions until product/safety decisions are made.

---

## 18. Memory Model

The long-term memory system should conceptually distinguish:

- current conversation context;
- preferences;
- people and relationships;
- routines;
- important dates/events;
- stories;
- places;
- photos/documents;
- user corrections;
- inferred information;
- sensitive information.

Do not assume every kind of data should be stored.

Keep questions visible:
- What requires explicit consent?
- What can the user inspect/edit/delete?
- What can family members see?
- What can never be shared with a caregiver by default?
- What is inferred vs explicitly stated?
- How is confidence represented?
- What should expire?

No medical or cognitive diagnosis should be inferred as part of the ordinary companion experience.

---

## 19. Safety and Privacy

Initialize:

```text
docs/05-safety-privacy/
```

Important principle:

The family/caregiver feature must not silently become a surveillance product.

Distinguish:
- device administration;
- user-authorized family assistance;
- private conversations;
- safety-relevant events;
- sensitive data;
- agent action permissions.

Do not claim Granny is a medical device, emergency service, medication-management system, or diagnostic system unless a future accepted product decision explicitly moves it into those regulated areas.

---

## 20. Research Area

Initialize research documents for:
- current AI assistants / Gemini baseline;
- competitor analysis;
- senior user research;
- Android agent/device-control feasibility;
- reference-hardware notes;
- research log.

Research notes must distinguish current verified findings from assumptions.

Do not copy claims from the prior conversation into “research” as factual evidence unless they can be traced to a source or are explicitly labeled as prior working assumptions.

---

## 21. Evaluation Philosophy

Agent capabilities should eventually be measurable.

Initialize:

```text
docs/06-evals/eval-strategy.md
docs/06-evals/canonical-tasks.md
docs/06-evals/agent-success-metrics.md
docs/06-evals/usability-testing.md
docs/06-evals/failure-taxonomy.md
```

A future canonical task might look like:

```yaml
id: UC-002
goal: Show the photos Sophie sent yesterday.

starting_state:
  screen: home

success:
  - correct communication app opened
  - correct person identified
  - relevant recent images displayed

failure_conditions:
  - wrong person selected
  - unintended message sent
  - unrelated images displayed
```

Do not build the full eval harness during this initialization unless it is trivial and clearly useful.

---

## 22. Decision Records

Create:

```text
docs/09-decisions/README.md
docs/_templates/adr.md
```

Use decision records for consequential choices.

Possible initial records:

```text
ADR-0001 — Stock Android before AOSP
ADR-0002 — Android as primary initial platform
ADR-0003 — Repository is the project source of truth
ADR-0004 — Repository root doubles as Obsidian vault
ADR-0005 — Semantic device control before vision fallback
ADR-0006 — Samsung Galaxy Tab A11+ as initial reference hardware
```

If context does not justify `accepted`, mark the record `proposed`.

Each record should include:
- status;
- date;
- context;
- decision;
- rationale;
- consequences;
- alternatives considered;
- links.

---

## 23. Execution Area

Initialize:

```text
docs/10-execution/current-milestone.md
docs/10-execution/backlog.md
docs/10-execution/open-questions.md
docs/10-execution/tech-debt.md
docs/10-execution/completed/
```

The **current milestone** should be documentation/product-design foundation, not Android feature implementation.

A reasonable initial milestone:

> Establish a navigable single source of truth and prepare the product/design specifications required to begin Figma exploration and controlled technical prototyping.

---

## 24. Design Tokens

Create:

```text
design-tokens/
```

Do not invent approved brand values.

A reasonable initial structure can define schemas or placeholder semantic roles for:
- color;
- typography;
- spacing;
- radius;
- component dimensions;
- motion.

Any placeholder must be clearly marked as placeholder/proposed.

The eventual objective is for product design and implementation to share the same conceptual tokens.

---

## 25. Git Hygiene

If Git is not initialized, initialize it.

If Git already exists:
- preserve history;
- do not rewrite branches/history;
- inspect existing conventions before changing them.

Create a sensible `.gitignore` covering:
- OS junk;
- editor caches;
- build outputs;
- secrets/env files;
- temporary LaTeX build artifacts;
- volatile Obsidian workspace/layout state;
- Android/Gradle build output when those projects are introduced.

Do not ignore canonical project documents.

Do not commit credentials, API keys, signing materials, personal user data, or local secrets.

If Git identity is configured and it is safe to do so, a clean initialization commit is acceptable.

If not, leave the working tree ready and report what remains uncommitted rather than inventing identity configuration.

---

## 26. Do Not Overbuild

During this initialization task, avoid:
- building a full Android application;
- creating an AOSP fork;
- implementing production backend infrastructure;
- choosing a final model vendor;
- choosing a final database;
- finalizing colors without design exploration;
- finalizing industrial design;
- installing unnecessary dependencies;
- adding large frameworks “for later”;
- writing dozens of pages of speculative requirements;
- pretending unknowns are decisions.

This phase should reduce ambiguity, not bury it under generated documentation.

---

## 27. First-Pass Initialization Workflow

Execute roughly in this order.

### Step 1 — Inspect

Read:
- current repository contents;
- this handoff;
- the supplied prior conversation;
- Dream Book source/PDF;
- any existing notes or mockups.

Produce an internal map of confirmed decisions, proposed ideas, files already present, conflicts, and missing artifacts.

### Step 2 — Normalize

Create/reconcile the intended directory structure.

Do not duplicate existing documents merely because the proposed tree uses a different filename.

### Step 3 — Preserve and move artifacts

Place Dream Book source/output under `docs/00-vision/`.

Preserve useful originals and Git history where possible.

### Step 4 — Establish navigation

Create:
- root `README.md`;
- `AGENTS.md`;
- `docs/README.md`;
- key section READMEs if useful;
- links among canonical docs.

A new Codex session should be able to understand the project by reading `AGENTS.md` and following links.

### Step 5 — Establish Obsidian compatibility

Make the repository open cleanly as an Obsidian vault.

Avoid machine-specific committed state.

Create templates and metadata conventions.

### Step 6 — Create canonical starter docs

Create only the most important initial product/design/agent/architecture docs with known material and clearly marked open questions.

### Step 7 — Record decisions

Add ADRs for decisions that are clearly established.

### Step 8 — Establish execution state

Create:
- current milestone;
- prioritized documentation/design backlog;
- open questions.

### Step 9 — Validate

Check:
- internal Markdown links;
- duplicate canonical definitions;
- obvious stale paths;
- empty/meaningless files;
- accidental generated binary/build artifacts;
- Dream Book paths;
- Obsidian/Git hygiene.

### Step 10 — Report

At the end, give the user a concise report containing:

1. what was created/moved;
2. repository tree summary;
3. decisions captured;
4. important unresolved questions;
5. what should be done next;
6. whether any steps could not be completed.

---

## 28. Acceptance Criteria

The initialization is successful when:

- [ ] The project is a coherent Git repository.
- [ ] The repository root can serve as an Obsidian vault.
- [ ] The Dream Book is stored under the vision documentation.
- [ ] `README.md` explains the project and navigation.
- [ ] `AGENTS.md` gives future Codex sessions concise durable guidance.
- [ ] `docs/README.md` is a useful documentation index.
- [ ] Vision, product, design, agent, architecture, safety, eval, hardware, research, decisions, and execution areas exist in a sensible form.
- [ ] The repo distinguishes Vision, V1, and MVP.
- [ ] Documentation metadata/status conventions exist.
- [ ] Templates exist for specs, ADRs, use cases, journeys, research, and evals.
- [ ] Accepted decisions are distinguishable from proposals and open questions.
- [ ] No speculative final color system is presented as approved.
- [ ] No AOSP/custom-OS implementation has been started.
- [ ] No major production engineering has been started.
- [ ] Git ignores local/volatile artifacts appropriately.
- [ ] Important docs link to related docs.
- [ ] The current milestone and next actions are clear.
- [ ] Future Codex sessions can locate the correct source of truth without needing the entire historical chat.

---

## 29. What Comes Immediately After Initialization

Do not automatically perform these unless explicitly asked, but prepare the repo so the next work can proceed in this order:

```text
1. Refine product vision and product principles
2. Define personas and jobs-to-be-done
3. Expand canonical use cases
4. Write the most important end-to-end user journeys
5. Define accessibility + voice UX rules
6. Develop visual directions and design tokens
7. Create the first Figma product experience
8. Prototype the interface on the Galaxy Tab A11+
9. Benchmark Gemini/current assistants against canonical tasks
10. Specify the Android device-control layer
11. Build the smallest technical agent-control prototype
12. Create repeatable task evals
13. Only later move toward dedicated dock/hardware development
```

The project should evolve from:

```text
VISION
  ↓
PRODUCT REQUIREMENTS
  ↓
USE CASES
  ↓
USER JOURNEYS
  ↓
DESIGN SYSTEM
  ↓
FIGMA / EXPERIENCE PROTOTYPE
  ↓
TECHNICAL SPECIFICATION
  ↓
IMPLEMENTATION
  ↓
EVALS + USER TESTING
```

---

## 30. Final Operating Principle

Do not optimize this repository for the current conversation.

Optimize it so that six months from now a new engineer, designer, or Codex session can answer:

- What are we building?
- Why are we building it?
- Who is it for?
- What decisions have already been made?
- What is still unknown?
- What should the product feel like?
- What may the agent do?
- What must it never do without confirmation?
- How is the architecture intended to work?
- Where is the source of truth?
- How do we know whether the system is improving?
- What are we working on right now?

If the repository can answer those questions clearly, the initialization has succeeded.
