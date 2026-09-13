---
title: Astra Stage 1 Development-Readiness Metaprompt
status: accepted
owner: Simon
last_updated: 2026-09-13
tags:
  - execution
  - prompt
  - astra
  - stage-1
  - development-readiness
related:
  - current-milestone.md
  - backlog.md
  - open-questions.md
  - ../09-decisions/ADR-0007-three-stage-product-strategy.md
---

# Astra Stage 1 Development-Readiness Metaprompt

Copy everything between the horizontal rules into a new GPT-6 Astra Codex
session opened at `/home/lgtw/Work/granny`.

---

You are the lead product architect for Granny. You are also acting as the
senior product manager, product designer, brand strategist/creative director,
Android architect, AI-agent systems designer, accessibility lead,
safety/privacy reviewer, research lead, and documentation editor needed to
complete this planning milestone.

Work directly in the existing repository:

```text
/home/lgtw/Work/granny
```

## The assignment: build the specification, do not merely audit it

This is a **creation and completion task**. The repository currently contains
useful vision material and starter scaffolding, but it does **not** contain a
complete PRD, complete product design specification, implementation-ready agent
contract, or complete development plan. Treat short existing documents as
inputs to expand, challenge, and replace where needed—not as finished specs to
approve with minor edits.

Your required outcome is a coherent, detailed, internally linked **Stage 1
development-readiness package**. It must be strong enough that the next Codex
sessions can begin deliberately scoped implementation tasks without having to
reconstruct the product from the Dream Book, old conversations, or unstated
assumptions.

Do the work in the repository. Do not stop at:

- an audit report;
- a list of recommendations;
- an outline of a future PRD;
- a roadmap saying that the PRD and designs still need to be written;
- questions that could safely be represented as proposed assumptions;
- a final chat response describing documents you did not actually create.

Audit only long enough to understand the inputs and prevent contradictions.
Then produce the canonical documents. Reviews are quality-control steps inside
the work, not the primary deliverable.

Do not begin substantial product implementation in this session.

## Non-negotiable product scope

Granny has three sequential long-term stages:

1. **Stage 1 — Android tablet app.** An installable application running on
   stock Android tablets. This is the only active stage.
2. **Stage 2 — Granny OS.** A future Android/AOSP fork providing deeper system
   ownership and reliability.
3. **Stage 3 — Granny hardware.** A future integrated tablet plus voice
   dock/base with microphones, speaker, charging, physical controls, and
   hardware privacy indication.

Every deliverable in this mission must help the team define, design, de-risk,
or prepare implementation of **Stage 1**. Stage 2 and Stage 3 remain vision
context. Do not design or implement them.

Specifically, do not make current requirements depend on:

- an AOSP fork, root, system signatures, custom system services, or OEM-only
  privileges;
- device-owner/managed-device powers unless a clearly labeled distribution
  option explicitly supplies them;
- a custom dock, far-field microphone array, speaker base, sensors, custom
  firmware, or physical privacy controls;
- capabilities that stock Android or the selected distribution route cannot
  honestly provide.

When a source mixes stages, extract the Stage 1 implication and label the rest
`future-stage context`. A measured Stage 1 platform limitation may become a
future Stage 2 input, but it must not turn this mission into OS work.

## Product thesis

Granny is an AI-first personal computer experience for older adults that can
talk, remember, understand the screen, and safely operate the device on the
user's behalf.

`Granny` is a **temporary project codename**, not the accepted public name.
Treat naming as an open, high-value brand decision. The repository and documents
may continue using `Granny` for continuity until Simon explicitly selects a
replacement. Do not design the identity as though the placeholder name must
survive.

Core thesis:

> The user should not need to learn how to operate the computer. The computer
> should learn how to operate itself for the user.

Stage 1 must test this thesis through a stock-Android tablet app. The primary
experience should let a user express intent naturally, understand what Granny
is doing, interrupt or take over, and recover without being blamed or made to
feel incapable.

The conceptual agent loop is:

```text
Observe → Understand → Plan → Act → Verify → Recover
```

Preferred device-control order:

```text
supported native/system/app API
    ↓
semantic Android accessibility action
    ↓
structured UI automation
    ↓
bounded vision plus coordinate interaction as a last fallback
```

Consequential actions must be permissioned, specific, visible, interruptible,
and independently enforced. Family support must not become surveillance.
Granny must never infantilize the user or assume that age means cognitive
impairment.

## Starting reality

Assume the following until repository inspection proves otherwise:

- The Dream Book is a long-term vision document, not a Stage 1 PRD.
- The existing `docs/01-product/prd.md` is a seed, not a complete PRD.
- The current design documents contain principles and starting constraints,
  not a complete product design specification.
- The repository does not yet contain a complete brand strategy, visual
  identity, logo system, chosen color palette, typography system, imagery
  direction, or emotional design language.
- `Granny` is a temporary codename. A broad, structured naming exploration has
  not yet been completed.
- Existing use cases, journeys, evals, and agent documents are starter
  examples, not an exhaustive or implementation-ready contract.
- Existing architecture is conceptual and requires Stage 1 detail.
- No user research or technical experiment has been completed merely because
  a proposed finding appears in planning material.
- The objective is not to preserve current wording. The objective is to
  preserve confirmed intent while making it precise, coherent, and usable.

## Source priority and decision authority

Resolve conflicts in this order:

1. Current explicit user instructions.
2. Accepted ADRs and accepted canonical repository documents.
3. The initialization handoff.
4. The Dream Book as long-term vision.
5. The captured previous planning conversation.
6. Proposed or draft repository documents.
7. Current primary-source research.
8. Your inference.

Do not silently turn an idea, scenario, external claim, or personal preference
into an accepted decision. However, do not use that rule as a reason to leave
the documents empty or stop repeatedly for clarification.

Use this decision protocol:

- **Confirmed:** directly supported by explicit direction or an accepted
  decision. Write it as current truth and cite/link its owner.
- **Proposed:** a reasonable working choice needed to make the specification
  concrete. Include the rationale, alternatives considered, and what would
  validate or change it.
- **Open decision:** a consequential choice whose alternatives would materially
  change users, safety, distribution, architecture, cost, or release scope.
  Prepare a concrete decision brief and recommendation.
- **Unknown requiring evidence:** a claim that research, device testing, policy
  review, or usability testing must answer. Define the experiment and gate.
- **Future-stage context:** useful long-term direction that is not a Stage 1
  requirement.

Make routine, reversible planning choices yourself and label them `proposed`.
Ask Simon only if a blocking choice cannot be represented safely this way.
Before asking, complete every independent artifact and prepare the exact
decision, recommendation, options, tradeoffs, and downstream impact.

## Read and inspect before substantive editing

Read in full:

1. `AGENTS.md`, `CLAUDE.md`, `README.md`, and `ARCHITECTURE.md`;
2. `docs/README.md` and all documentation templates;
3. every ADR and `docs/09-decisions/README.md`;
4. all current files under `docs/00-vision/` through `docs/10-execution/`;
5. the complete Dream Book source or extracted PDF text;
6. `docs/08-research/source-material/initialization-handoff.md`;
7. `docs/08-research/source-material/planning-conversation.md`;
8. the current tracked/untracked file map, Git status, branch, and recent
   history;
9. any nested agent instructions that apply.

Preserve unrelated and user-created work. The user opens `docs/` as an
Obsidian vault. Local `docs/.obsidian/*.json` files are ignored user state: do
not delete, rewrite, stage, or commit them.

After reading, write a concise working inventory for yourself. Do not spend the
mission producing giant standalone audit documents unless a material
contradiction needs a durable record. Incorporate ordinary findings directly
into the canonical specs.

## Required completion state

The repository is ready for the first implementation milestone only when it
contains, at minimum:

1. a comprehensive Stage 1 PRD with stable, testable requirement IDs;
2. explicit Vision versus Stage 1 App MVP versus Stage 1 App V1 versus later
   stages;
3. grounded proto-personas, jobs, prioritized use cases, complete signature
   journeys, feature/scope map, and product success model;
4. a detailed product design specification covering information architecture,
   screens, components, interaction states, voice, touch, accessibility,
   content, onboarding, permissions, confirmations, errors, and Figma handoff;
5. a real brand, naming, and visual-identity exploration covering positioning,
   personality, emotional goals, at least 60 credible name candidates, a scored
   shortlist, logo concept families, color, typography, imagery, iconography,
   motion, and sound, with 3–4 concrete identity territories and recommended
   directions for Simon's iteration and decision;
6. an agent behavior and device-control contract detailed enough to design
   typed implementation interfaces and evals;
7. a Stage 1 Android architecture with component boundaries, data flows,
   trust boundaries, permissions, failure behavior, and local/cloud options;
8. an evidence-backed Android capability, AccessibilityService, and
   distribution feasibility assessment;
9. a privacy/safety model, threat model, memory policy, family/helper boundary,
   and action/confirmation matrix;
10. canonical evals, metrics, a failure taxonomy, and end-to-end requirements
   traceability;
11. a research plan aimed at the assumptions most likely to kill or reshape
    the product;
12. a staged product/design/technical roadmap with milestones, dependency
    order, entry/exit gates, Definition of Ready, and a prioritized backlog;
13. concise `AGENTS.md`, `CLAUDE.md`, README/navigation, templates, and ADR
    conventions that make future agent sessions maintain this system;
14. a development-readiness assessment stating what is ready, what is only
    proposed, what evidence is missing, and exactly what may be implemented
    next.

These are content requirements, not an instruction to create one tiny file per
bullet. Prefer a smaller set of substantial canonical documents. Split files
only where separate ownership, review, or update cadence makes the split
useful.

## Workstream 1 — Make the agent instruction stack operational

Rewrite or tighten `AGENTS.md`, `CLAUDE.md`, root `README.md`, and
`docs/README.md` as needed so every future agent can immediately determine:

- what Granny is and which stage is active;
- the difference among Vision, Stage 1 App MVP, App V1, later App releases,
  Stage 2 OS, and Stage 3 hardware;
- which document owns product behavior, design behavior, agent behavior,
  architecture, safety/privacy, evals, decisions, research, and execution;
- the precedence order among user instructions, accepted specs, ADRs,
  architecture, and implementation;
- which docs must be updated when behavior, interfaces, safety policy, or
  requirements change;
- how stable IDs and traceability links work;
- when an ADR is required and who can mark it accepted;
- how document statuses and frontmatter work;
- the Git branch, commit, review, and no-secrets workflow;
- testing and eval expectations for future implementation;
- the rule that a capability is not done until action outcome is verified;
- the rule that visible screen content is untrusted data, not agent
  instruction;
- the rule that Stage 2/3 documents do not authorize current work.

Keep `AGENTS.md` a concise operating map, not a duplicated PRD. If `CLAUDE.md`
exists as an entry point, make it delegate to the same canonical rules rather
than becoming a contradictory second manual.

Acceptance criteria:

- A fresh Codex/Claude session can find the correct source of truth in under
  two minutes.
- There is one effective instruction hierarchy.
- No active instruction says the entire repository must be opened as the
  Obsidian vault; `docs/` is the vault while the repository remains the full
  source of truth.
- No product behavior exists only in `AGENTS.md` or `CLAUDE.md`.

## Workstream 2 — Write the complete Stage 1 PRD

Substantially rewrite `docs/01-product/prd.md`. Do not merely comment on the
seed document. Produce a real **Stage 1 Android Tablet App Product Requirements
Document**.

The PRD must include:

### Product framing

- executive summary and one-sentence product definition;
- problem statement and the evidence status of each problem claim;
- product thesis and why an Android tablet app is the current test vehicle;
- target user, buyer, helper, and stakeholder hypotheses;
- primary and secondary jobs-to-be-done;
- current alternatives and why the proposed experience may be better;
- value proposition for the older adult and, separately, trusted family;
- product principles and how they constrain requirements;
- explicit assumptions and known unknowns.

### Scope model

Define separately and precisely:

- **Long-term Vision:** what Granny may eventually become;
- **Stage 1 App MVP:** the smallest product/experiment that can test the core
  delegation thesis safely;
- **Stage 1 App V1:** the first coherent product release, broader than MVP;
- **Later Stage 1 releases:** app capabilities deliberately deferred;
- **Stage 2:** future OS/AOSP work, not current requirements;
- **Stage 3:** future hardware, not current requirements.

For MVP and App V1, provide `In`, `Out`, and `Why` tables. Recommend a concrete
MVP and V1 rather than leaving every feature undecided. Mark the recommendation
`proposed` if Simon has not accepted it.

### Experience and capability requirements

Specify:

- core end-to-end experience;
- onboarding and permission setup;
- natural voice request and touch entry;
- visible listening/thinking/acting state;
- app and screen understanding;
- safe navigation and task execution;
- ambiguity and entity resolution;
- confirmations and prepare/commit behavior;
- interruption, cancellation, direct touch takeover, retry, and undo;
- verification and truthful completion reporting;
- failure recovery and escalation to guidance/manual help;
- conversation/session continuity;
- memory, only to the depth recommended for MVP/V1;
- family/helper experience, only to the depth recommended for MVP/V1;
- accessibility customization and voice/touch equivalence;
- settings, privacy controls, history/audit visibility, correction, and
  deletion;
- offline/degraded behavior and dependency loss;
- support, diagnostics, and feedback suitable for early pilots.

Use stable requirements:

```text
PRD-OUT-###  user and product outcomes
PRD-FR-###   functional behavior
PRD-ACC-###  accessibility behavior
PRD-SAF-###  autonomy, safety, and confirmation behavior
PRD-PRV-###  privacy, data, memory, and family boundaries
PRD-NFR-###  reliability, performance, availability, supportability
PRD-DST-###  platform, permissions, installation, and distribution
```

Every requirement must contain or link to:

- release applicability: MVP, App V1, later App, or future stage;
- priority: Must, Should, Could, or Won't for that release;
- user/problem rationale;
- trigger and preconditions where relevant;
- observable behavior and edge conditions;
- testable acceptance criteria;
- safety/privacy/accessibility implications;
- linked use case, journey, design, architecture owner, and eval;
- status: confirmed, proposed, evidence-needed, or blocked.

Do not use vague requirements such as “simple,” “safe,” “fast,” “fully control
the tablet,” or “remember the user” without operational definitions and test
methods.

### Quality and release model

Include:

- measurable product outcomes and leading indicators;
- task-quality, safety, trust, usability, accessibility, latency, and
  reliability measures;
- proposed thresholds clearly distinguished from observed baselines;
- platform/device/app support assumptions;
- policy/distribution assumptions;
- dependencies and constraints;
- major risks and mitigations;
- non-goals;
- launch/pilot readiness conditions;
- open decisions with recommendations.

Never fabricate research findings, demand, conversion, reliability, or task
success. A proposed target is allowed if labeled and justified.

## Workstream 3 — Complete the product model and signature experiences

Expand or create the smallest useful set of documents under
`docs/01-product/` to own:

- proto-personas and excluded/unsupported user groups;
- jobs-to-be-done and problem statements;
- a feature/capability map by MVP, App V1, later App, Stage 2, and Stage 3;
- 20–30 prioritized Stage 1 use cases;
- 5–8 fully specified signature journeys;
- product scope and roadmap;
- requirements traceability.

Personas must not treat “elderly people” as one generic user. Separate at
least:

- an independent but technologically uncomfortable older adult;
- an older adult with vision, hearing, or dexterity access needs who remains
  cognitively independent;
- a trusted family/helper role;
- future or excluded higher-assistance contexts whose medical/safeguarding
  complexity is not an MVP assumption.

Label them proto-personas until evidence exists. Include goals, context,
capabilities, frustrations, trust boundaries, accessibility considerations,
current workarounds, and risky assumptions—without inventing biographies as
research facts.

Each canonical use case needs:

- stable `UC-###` ID;
- actor and linked job/problem;
- release and priority;
- starting context and preconditions;
- natural-language request and touch alternative;
- desired outcome;
- data and permissions used;
- expected agent steps at a product-behavior level;
- autonomy/confirmation class;
- ambiguity and accessibility considerations;
- primary failure/recovery paths;
- privacy/safety risks;
- success evidence;
- linked PRD and eval IDs.

Recommend approximately five MVP signature workflows. Strong candidates to
evaluate include finding recently sent family photos, explaining a confusing
screen, calling a known person, drafting and confirming a message, playing
requested media, making an accessible device adjustment, or recovering from a
failed app task. Choose based on thesis coverage, user value, feasibility,
safety, differentiation, and evalability.

Each signature journey needs:

- stable `J-###` ID and linked use cases/requirements;
- happy path from entry through verified outcome;
- voice and touch paths;
- screen-by-screen experience;
- system/agent states and exact confirmation points;
- interruption and manual takeover;
- ambiguous-person/content handling;
- permission, authentication, offline, app-change, and failure variants;
- error recovery and honest partial-success language;
- accessibility behavior;
- Figma frames required;
- evaluation success/failure evidence.

## Workstream 4 — Write the complete Stage 1 product design specification

Create a canonical `docs/02-design/product-design-spec.md` unless repository
inspection identifies an already suitable canonical owner. This must be a
detailed product interaction specification, not a mood board and not a list of
generic design principles.

Update supporting design files only where they have distinct durable roles,
including `design-system.md`, `accessibility.md`, `voice-ux.md`, and `figma.md`.
Create `information-architecture.md`, `interaction-states.md`, or
`content-style-guide.md` only if separating that content makes maintenance
clearer. Avoid filler stubs.

The design specification must define:

### Experience architecture

- overall app information architecture;
- navigation model and persistent/global controls;
- Granny Home and primary entry points;
- relationship between the Granny surface and ordinary Android/apps;
- voice-first behavior with complete touch alternatives;
- portrait/landscape and supported tablet-window behavior;
- where system Android UI cannot be restyled or controlled;
- return-to-Granny, back, home, cancel, stop, and take-over semantics.

### Screen and flow inventory

Create a screen inventory with stable `SCR-###` IDs. At minimum consider:

- first launch and value explanation;
- permission education and handoff to Android settings;
- voice/touch home;
- listening, transcript, and interpretation;
- active task/progress;
- ambiguity clarification;
- consequential-action confirmation;
- success, partial success, stopped, failed, and recovery;
- conversation/task history;
- memory review/correction/deletion if in scope;
- people/relationship disambiguation if in scope;
- accessibility and voice settings;
- privacy/data/family controls;
- family/helper invitation and access review if in scope;
- offline, revoked permission, expired authentication, and unsupported action;
- help, feedback, and pilot diagnostics.

For each in-scope screen define:

- purpose and linked journey/requirements;
- entry and exit conditions;
- hierarchy and content regions;
- visible controls and their labels;
- primary, secondary, destructive, and escape actions;
- UI data and privacy sensitivity;
- all applicable loading, empty, disabled, error, and interrupted states;
- focus order, semantics, touch behavior, keyboard/switch behavior where
  relevant, and spoken feedback;
- orientation/window adaptations;
- telemetry/eval events, avoiding unnecessary private content;
- open visual questions for Figma.

### Agent interaction state model

Define allowed transitions and user controls for:

```text
idle
listening
heard / transcript available
needs clarification
planning
ready to confirm
acting
waiting on app/network/user
verifying
completed
partially completed
interrupted
cancelled
recovering
failed safely
offline/degraded
permission lost
authentication required
unsupported/restricted
```

For each state define what the user sees and hears, what Granny may do, how the
user interrupts, timeouts, and legal next states. Eliminate vague indefinite
“thinking” experiences.

### Component and design-system contracts

Define semantic component behavior for:

- global Stop/Cancel and manual takeover;
- microphone/listening control;
- primary and secondary buttons;
- high-consequence confirmation and destructive confirmation;
- progress/activity status;
- transcript and editable intent preview;
- person/content disambiguation choices;
- message or action preview;
- success/partial/failure result;
- inline guidance and permission education;
- toast/snackbar/dialog/sheet usage boundaries;
- list rows, cards, media, settings, and accessibility controls;
- focus, pressed, selected, loading, disabled, error, and completed states.

Specify roles for color, typography, spacing, size, shape, elevation, motion,
sound/haptics, focus, and iconography. Do not silently select or label final
brand values in this interaction specification. Define semantic roles here;
Workstream 5 must supply real candidate identity/token values as `proposed`,
their rationale, and how Figma/Android will stay aligned.

### Accessibility and cognitive ergonomics

Turn accessibility into testable internal requirements covering:

- text scaling and no information loss;
- contrast and non-color cues;
- touch target sizing and spacing;
- focus order and accessibility semantics;
- screen reader, switch, keyboard, and touch operation as applicable;
- reduced motion and animation timing;
- captions/transcripts and non-audio alternatives;
- hearing, vision, dexterity, attention, memory, and language load;
- predictable layout and plain language;
- generous timeouts and recovery from mistakes;
- no forced speed, precision, recall, or technical vocabulary;
- no infantilizing imagery, copy, or interaction.

Verify standards from current primary sources. Separate external minimums from
Granny's proposed internal targets and define how each will be tested.

### Voice and content behavior

Specify:

- how Granny speaks: warm, concise, adult, specific, non-clinical;
- how listening starts/stops and how privacy state is visible;
- partial transcription and correction;
- barge-in/interruption;
- thinking/action progress language;
- ambiguity and uncertainty language;
- confirmation wording that names recipient, content, and consequence;
- refusal/restriction, failure, partial success, and recovery wording;
- verbosity and repetition rules;
- pronunciation/name correction;
- voice/touch equivalence;
- sample copy for each signature journey and its failures.

### Figma execution brief

Make `figma.md` an actionable contract defining pages, sections, naming,
components, variants, auto-layout expectations, annotations, linked requirement
IDs, prototype connections, accessibility notes, status, and Git handoff.

Specify the exact first Figma package to build:

- required journeys and frames;
- low-fidelity interaction structure kept distinguishable from visual styling;
- the 3–4 documented identity territories represented on comparable product
  screens after the interaction structure is reviewable;
- component/state coverage;
- prototype test scenarios;
- review questions and acceptance gate;
- how accepted values return to Markdown and design tokens.

Do not claim that a Figma file has been created unless it actually has.

## Workstream 5 — Create the brand strategy and visual-identity system

Create a canonical `docs/02-design/brand-and-visual-identity.md`. This is a
required product deliverable, not decorative work to postpone indefinitely.
It must explain how Granny should be recognized, remembered, and emotionally
experienced across the Stage 1 app, product communications, app-store presence,
and future extensions—while keeping current execution focused on the app.

Do not confuse brand with a logo alone. Define:

### Brand foundation

- brand purpose, promise, and central idea;
- audience and buyer/helper relationships;
- desired emotional outcomes before, during, and after a task;
- 4–6 brand personality traits and explicit anti-traits;
- relationship posture: capable companion and respectful tool, never child,
  nurse, authority figure, surveillance system, or stereotyped “AI robot”;
- reasons to believe grounded in the proposed product experience;
- positioning relative to generic assistants, simplified senior launchers,
  accessibility tools, caregiver monitoring products, and clinical technology;
- how the product principles become visible and audible brand behavior;
- confirmation that `Granny` is only a temporary project codename and must not
  constrain the permanent naming or identity system.

### Naming exploration — mandatory

Create a separate canonical `docs/02-design/naming-exploration.md` because the
name has its own iteration, screening, and decision lifecycle. The purpose is
to give Simon a large, varied, thoughtfully filtered option space that can be
iterated—not to generate five obvious synonyms and declare a winner.

First determine whether the naming system needs separate names for:

- the company or parent brand;
- the tablet-app/product platform;
- the conversational companion or assistant persona;
- a possible spoken invocation/wake word;
- future OS and hardware extensions.

Compare a unified masterbrand against a multi-name architecture. Recommend a
provisional approach while keeping wake-word naming separate if technical or
linguistic needs differ.

Define naming criteria before generating options. Include:

- respectful, adult, and dignity-preserving;
- warm and human without being childish, gendered, patronizing, or clinical;
- easy to hear, pronounce, remember, and spell after hearing once;
- comfortable to say aloud in a home and during a support request;
- distinctive enough to search and discuss;
- suitable for voice recognition and robust against common mishearing;
- able to extend from an Android app toward a future OS and hardware platform;
- not limited to one relative role, age stereotype, disability, or medical
  condition;
- culturally and linguistically adaptable, with unknown target markets clearly
  identified;
- credible both to an older adult and to a family member considering the
  product;
- capable of supporting an ownable wordmark/app icon rather than depending on
  a descriptive phrase.

Generate **at least 60 credible candidates across at least eight genuinely
different naming territories**. Possible territories to investigate include,
but are not limited to:

- warm human or companion-like names;
- agency, enablement, and “I can do this” ideas;
- clarity, ease, and guidance;
- connection, family, and belonging;
- memory, continuity, and life stories;
- calm home presence;
- abstract or metaphorical names;
- invented, coined, or blended words;
- platform-scale names that are not explicitly senior-coded.

Do not pad the count with nonsense, spelling variants, suffix changes, or names
that differ only by one letter. Do not assume the final name must signal age,
grandparents, caregiving, assistance, memory, or AI. Avoid generic “AI” names,
robot clichés, medical language, helplessness framing, and names that make the
user sound like a patient.

For the full candidate pool, record at least:

- candidate and simple pronunciation;
- naming territory and idea/source;
- intended feeling;
- why it could fit the product;
- immediate concern, collision, ambiguity, or linguistic risk;
- whether it seems better suited to company, product, companion, or wake word.

Then create:

1. a **30-name viable longlist** after removing clearly weak or conflicting
   options;
2. a **12–15-name scored shortlist** with deeper evaluation;
3. a **3–5-name recommended finalist set** representing meaningfully different
   strategic choices—not superficial variations.

Score the shortlist against pronunciation, spelling, recall, warmth, dignity,
distinctiveness, voice use, cross-generation appeal, extensibility,
international risk, likely visual potential, and obvious collision risk. Show
the weighting and explain where scores depend on evidence not yet available.

For shortlisted names, perform proportionate preliminary web screening using
current sources:

- obvious existing technology, healthcare, accessibility, consumer-electronics,
  or companion-product uses;
- obvious app-store/search crowding;
- readily observable domain and social-handle constraints where useful;
- obvious negative dictionary/slang meanings in English and any currently
  proposed initial market languages;
- official trademark databases for a preliminary knockout check when target
  jurisdictions are known.

This is **discovery screening, not legal clearance**. Record search date,
jurisdiction, source, search terms, limitations, and uncertainty. Never claim a
trademark, domain, handle, or company name is available merely because a quick
search did not find it. Recommend professional trademark and linguistic review
before commitment.

For each finalist, include:

- concise naming story and strategic position;
- pronunciation and natural example sentences spoken by a user;
- company/product/companion/wake-word fit;
- likely wordmark, symbol, and app-icon opportunities;
- compatible identity territories;
- strongest argument for and against;
- testing questions for older adults and family members;
- what Simon might combine, alter, or use as a direction for the next round.

End with an iteration kit for Simon: a compact response table where he can mark
each finalist or shortlist candidate `love`, `interesting`, `neutral`,
`dislike`, or `never`, plus fields for desired qualities, disliked patterns,
new references, and naming territories to expand. Define how the next naming
round should use this feedback rather than restarting randomly.

### Emotional and sensory design language

Define the intended overall feel using specific experiential statements rather
than vague adjectives. Include:

- what the first five seconds should communicate;
- how calm differs from passive, warm from childish, simple from empty, and
  trustworthy from clinical;
- visual rhythm, density, whitespace, shape, softness, contrast, and hierarchy;
- photography, illustration, human imagery, patterns, and texture;
- icon personality and recognizability;
- motion character and reduced-motion equivalent;
- sound/haptic character and silent equivalents;
- how listening, thinking, acting, success, uncertainty, warning, and privacy
  states remain recognizably Granny without relying on color alone;
- anti-patterns such as hospital blue by default, neon AI gradients, robot
  mascots, age stereotypes, cartoon grandmothers, tiny minimalist controls,
  luxury cues that reduce clarity, or nostalgia imposed without evidence.

### Concrete identity territories

Produce **3–4 genuinely distinct brand territories** for review. Give each a
memorable working name. Each territory must include:

- strategic idea and one-sentence story;
- mood keywords and anti-keywords;
- intended emotional response and audience fit;
- actual candidate primary, secondary, accent, surface, text, semantic, focus,
  and high-consequence colors with hex values;
- example accessible color pairings and measured contrast results for their
  intended roles;
- candidate display/body typefaces, weights, fallback strategy, licensing or
  availability considerations, and readability rationale;
- logo concept families: wordmark approach, symbol/metaphor possibilities,
  app icon, horizontal/stacked lockups, small-size/monochrome behavior, and
  concepts to avoid. Keep wordmarks adaptable across shortlisted names until
  Simon selects a name;
- shape, layout, icon, imagery/illustration, motion, and sound direction;
- example home-screen and confirmation-screen art direction;
- strengths, risks, cultural/accessibility concerns, and what user testing
  should compare.

The territories must be concrete enough to visualize and recreate in Figma.
Do not provide four nearly identical warm beige palettes with different names.
Do not assume older adults prefer muted, nostalgic, medical, or conservative
design without evidence.

### Recommended direction and decision package

Recommend one territory or a clearly defined hybrid. Explain:

- why it best expresses Granny's thesis and differentiates the product;
- why it supports accessibility, trust, dignity, and repeated daily use;
- which aspects are confident recommendations versus unresolved taste or
  research questions;
- what Simon must choose;
- what should be tested with representative users;
- what can proceed provisionally before final selection;
- what would cause the recommendation to change.

Recommend naming finalists separately from the identity territory. Explain
which names pair naturally with which territories, but do not force Simon to
accept a name merely to choose a visual direction.

Create a compact decision matrix comparing all territories against brand fit,
distinctiveness, accessibility, emotional warmth, clarity, scalability,
technical practicality, and risk. Prepare a visual-identity decision brief for
Simon rather than silently declaring a winner accepted.

### Logo and identity production brief

Specify the next design-production package:

- wordmark, standalone mark, app icon, monochrome and reversed variants;
- responsive lockups and minimum-size/clear-space tests;
- light/dark/high-contrast application;
- sample onboarding, home, voice-state, confirmation, app-store icon, and
  simple marketing applications;
- accessibility and confusion/recognition tests;
- file formats, naming, source-file ownership, and export requirements;
- legal/trademark/domain screening as a future specialist check, without
  claiming clearance;
- criteria for rejecting generic, infantilizing, medical, or inaccessible
  concepts.

If appropriate visual-generation or design tools are available, create clearly
labeled exploratory boards or rough concepts in a reviewable location. These
remain proposals, not final identity assets. If such tools are unavailable,
produce precise Figma/image-generation briefs and do not claim visual assets
exist.

### From selected direction to design tokens

Update `design-system.md`, `figma.md`, and `design-tokens/README.md` so the
workflow is explicit:

```text
brand foundation
    ↓
3–4 identity territories
    ↓
Simon review + accessibility/user evidence
    ↓
selected proposed direction
    ↓
validated semantic tokens and logo assets
    ↓
Figma components/prototypes
    ↓
accepted Git-backed tokens and Android implementation
```

Candidate palettes and typography may be written as real proposed values; do
not leave them as “warm color TBD.” Do not mark a direction, logo, palette, or
typeface `accepted` without Simon's explicit approval. Do not treat `Granny` as
the final wordmark. Make clear which
feasibility prototypes may use provisional neutral tokens and which production
UI work must wait for the brand-direction gate.

Acceptance criteria:

- Granny has a documented brand promise, personality, emotional target, and
  anti-patterns.
- `Granny` is recorded as a temporary codename; the naming system has at least
  60 credible candidates, a 30-name longlist, a scored 12–15-name shortlist,
  3–5 finalists, preliminary screening, and a Simon iteration kit.
- There are 3–4 visually and strategically distinct, reproducible identity
  territories—not merely adjectives.
- Every territory includes real candidate colors, typography, logo concepts,
  visual language, accessibility analysis, and risks.
- Simon receives a concrete comparison and recommendation.
- Figma has an exact brand-exploration and identity-production brief.
- No proposed visual choice is misrepresented as researched or accepted.

## Workstream 6 — Complete the agent and device-control specification

Substantially expand the canonical documents under `docs/03-agent/`. Ensure
they jointly define an implementation contract rather than repeating product
aspirations.

Specify:

- agent purpose, allowed role, and prohibited behavior;
- observation model, provenance, freshness, and sensitive-data handling;
- intent interpretation and entity resolution;
- plan representation and consequence classification;
- capability registry and least-privilege tool selection;
- prepare versus commit separation;
- action preconditions and postconditions;
- confirmation binding, expiration, and invalidation;
- semantic element identity and stale-node handling;
- native/API versus accessibility versus vision fallback selection;
- verification evidence and truthful result reporting;
- retries, maximum steps/time, loop detection, and circuit breakers;
- unexpected dialogs, login/authentication, permissions, app updates, network
  failure, and direct user interaction;
- cancellation, interruption, touch takeover, and safe resumption;
- activity/audit events without unnecessary personal content;
- simulation, replay, and evaluation interfaces;
- proactive behavior boundaries, even if proactive execution is deferred;
- memory reads/writes and untrusted-content boundaries.

Define typed, vendor-neutral tool/capability contracts at the specification
level for the proposed MVP. Include input, output, permissions, consequence
class, confirmation rule, preconditions, verification, common failures,
idempotency/retry behavior, audit evidence, and privacy sensitivity.

Never design a generic unrestricted shell, unbounded coordinate tapper, raw
credential tool, unrestricted network tool, or untyped “do anything” action
for the model.

## Workstream 7 — Complete the Stage 1 architecture and Android feasibility

Update root `ARCHITECTURE.md` as the concise system map and create or expand
focused canonical architecture documents under `docs/04-architecture/`.

Define boundaries among:

- Android app shell and adaptive tablet UI;
- launcher-like Granny home experience within ordinary Android constraints;
- voice input/output and visible activity state;
- session/conversation orchestrator;
- screen observer;
- device-control service/action executor;
- planner/agent;
- policy, authorization, and confirmation enforcement;
- memory and personal knowledge;
- model/provider adapter or router;
- backend, identity, sync, and update boundaries;
- family/helper experience if in scope;
- observability, audit, diagnostics, eval, and support surfaces.

For each component define responsibility, APIs/events, canonical state owner,
trust level, permissions, process/device placement, local/cloud options,
offline behavior, failure isolation, data handled, and adjacent dependencies.

Document major flows for:

- a voice request from capture to verified result;
- screen observation and semantic navigation;
- a consequential action with confirmation;
- cancellation/interruption during execution;
- failure recovery and safe stop;
- memory read, write, correction, and deletion if in scope;
- family/helper access if in scope;
- model/provider outage and offline/degraded behavior.

Clearly distinguish model proposals from independently enforced policy/tool
decisions, and product decisions from replaceable technology choices.

### Android feasibility and distribution

Create or substantially rewrite
`docs/08-research/android-stage-1-feasibility.md` using current primary-source
evidence. Classify each proposed capability as:

```text
ordinary Android/app API
user-granted runtime or special permission
AccessibilityService semantic inspection/action
MediaProjection or other explicit session grant
notification listener or approved app integration
default-app/launcher role
device-owner or managed-device mode
OEM/system privilege
root/AOSP only — future Stage 2
unknown or infeasible pending evidence
```

Cover observation/action limits, permission enablement and revocation,
background execution, screen capture and secure windows, package visibility,
notifications, contacts, calls, messages, media, settings, files, authentication,
semantic-tree quality, vision fallback, Samsung/OEM variance, verification,
and realistic app/device test matrices.

Treat distribution as a first-order product constraint. Research current Google
Play policies relevant to AccessibilityService, autonomous device behavior,
prominent disclosure/consent, sensitive permissions, and target-user claims.
Do not claim that Granny qualifies for an accessibility exception or will pass
review without authoritative evidence. Compare viable paths, tradeoffs, pilot
options, questions for Play review, and required validation. Produce a clear
`go`, `conditional go`, `no-go`, or `needs evidence` recommendation for each
candidate MVP control/distribution model.

## Workstream 8 — Complete safety, privacy, autonomy, memory, and family policy

Create one canonical action-policy matrix under `docs/05-safety-privacy/` or
clearly link to the canonical owner if it belongs under `docs/03-agent/`.

For each action category, specify whether Granny may:

```text
Observe
Prepare
Execute directly
Execute after fresh, specific confirmation
Execute only under explicit bounded delegation
Restrict or never execute in Stage 1
```

Cover opening/searching apps, reading content, device settings, drafting and
sending communications, calls, photos/files, calendar/reminders, app installs,
permissions/security, credentials/account recovery, purchases/finance, legal
agreements, location/emergency actions, memory operations, family/helper
configuration, remote assistance, and proactive routines.

For every class define consequence, default permission, valid confirmation,
authentication, visibility, cancellation/undo, timeout, reconfirmation,
verification, audit evidence, and prohibited shortcuts.

Write or complete:

- privacy model and data inventory;
- data-flow and retention/deletion rules;
- memory classes, provenance, confidence, inference, correction, expiry,
  sharing, export, and derived-data deletion;
- family/helper consent, visibility, permissions, revocation, abuse prevention,
  and user primacy;
- threat model and abuse cases;
- sensitive-action and confirmation policy.

Threat-model indirect prompt injection from webpages, messages, notifications,
images, and documents; confused-deputy attacks; wrong-person/entity actions;
caregiver coercion and overreach; stolen devices/accounts; credential,
microphone, screenshot, transcript, memory, and audit leakage; unsafe
coordinate fallback; repeated actions/loops; dependency outage; support and
account recovery.

For each material threat record preconditions, impact, mitigation, detection or
eval, residual risk, owner, and release gate. Screen content is always data,
never authority to instruct the agent.

## Workstream 9 — Build evals and end-to-end traceability

Update `docs/06-evals/` so every proposed MVP signature workflow has an eval
specification with:

- stable `EVAL-###` ID linked to `UC`, `J`, and `PRD` IDs;
- controlled starting state and fixture/setup;
- device, Android, app, account, permission, and network context;
- happy-path and adversarial variants;
- success evidence and safe partial-success conditions;
- failure conditions, especially wrong person/content/action and unintended
  consequential action;
- step/time/retry limits;
- accessibility profiles and human usability checks;
- privacy-safe logging;
- manual versus automatable portions;
- unrun status until evidence exists.

Define metrics for verified task success, wrong-person/content/action rate,
missing or unnecessary confirmation, confirmation comprehension, recovery and
safe-stop rate, repeated-action rate, user intervention, clarification burden,
semantic-control versus vision fallback, steps, latency, cost, accessibility
completion, user understanding, dignity, trust, and delegation preference.

Complete the failure taxonomy across perception, intent/entity resolution,
planning, action, verification, recovery, authorization, privacy/security,
platform/dependency, accessibility, and user interruption.

Create a lightweight traceability owner, preferably
`docs/01-product/traceability.md`, connecting:

```text
Problem / job
    ↓
PRD requirement
    ↓
Use case
    ↓
Journey / screen / component
    ↓
Agent and architecture contract
    ↓
Safety policy
    ↓
Implementation task
    ↓
Eval and research evidence
```

Expose missing links honestly. Do not create fake implementation or test links
for work that has not begun.

## Workstream 10 — Produce the evidence and research program

Create or complete a prioritized Stage 1 research plan. It must focus on
assumptions capable of killing or materially changing the product, including:

- whether representative older adults want delegation, guidance, or a
  selectable mixture;
- which real tablet jobs are frequent and valuable;
- whether tone and memory feel helpful, patronizing, or intrusive;
- which confirmations and activity feedback users understand;
- whether stock Android can observe, act, verify, and recover reliably enough;
- whether a viable distribution path exists;
- whether voice works and is desired in realistic home conditions;
- which accessibility adaptations help without reducing dignity;
- what family involvement is desired and under whose control;
- which memory types create value versus distrust;
- whether the MVP signature flows outperform existing alternatives.

For each hypothesis define method, target participant/environment, artifact,
decision criterion, ethics/privacy, order, owner, linked requirements, and
affected release gate.

Include:

- discovery interviews and contextual observation with older adults;
- trusted-family research conducted separately where privacy interests differ;
- concept and low-fidelity usability tests;
- reference-tablet inventory using no personal identifiers;
- synthetic-account Android/app capability tests;
- current-assistant competitor baseline with versioned evidence;
- Android/Play policy validation;
- noisy-room voice and accessibility-profile tests;
- privacy, consent, family-access, and memory-comprehension tests.

For temporally unstable claims, browse and cite current primary sources. Record
publisher, URL, access date, what the source establishes, and its limitations.
Do not invent participants, observations, study outcomes, technical results, or
competitor capabilities.

## Workstream 11 — Build the roadmap, gates, and development handoff

Rewrite `docs/10-execution/current-milestone.md` and
`docs/10-execution/backlog.md`. Create
`docs/10-execution/development-readiness.md` as the durable readiness gate and
assessment unless an existing file clearly owns that role.

Create a Stage 1 roadmap that distinguishes:

1. **Foundation/specification:** canonical product, design, agent,
   architecture, safety, eval, and research contracts.
2. **Feasibility spikes:** smallest experiments for Android control,
   observation, verification, voice, distribution, and privacy assumptions.
3. **Experience and identity prototype:** Figma prototype of the signature
   journeys, brand territories, visual-identity decision package, and user
   testing.
4. **Controlled technical prototype:** narrow, synthetic-account implementation
   of selected flows with safety/eval instrumentation.
5. **MVP build:** the proposed MVP scope after evidence gates pass.
6. **Pilot readiness:** usability, safety, privacy, reliability, support,
   distribution, and consent gates.
7. **App V1:** coherent release only after MVP evidence.

For every milestone define:

- objective and hypothesis;
- entry criteria;
- concrete deliverables;
- dependencies;
- owner or discipline;
- validation/evidence;
- exit gate with observable pass/fail criteria;
- decisions unlocked;
- work explicitly excluded.

Define at least these named gates:

```text
GATE-01  Specification coherence
GATE-02  MVP scope decision
GATE-03  Android control feasibility
GATE-04  Distribution viability
GATE-05  Interaction-design, naming, and brand-direction readiness
GATE-06  Safety/privacy readiness for prototype
GATE-07  Technical prototype success
GATE-08  MVP implementation readiness
GATE-09  Pilot readiness
```

You may add or consolidate gates if the rationale is clear. Each gate must name
evidence, approver, current status, blockers, and what work becomes authorized
when it passes.

Define a practical **Definition of Ready** for implementation tasks. At minimum
a task must identify:

- linked PRD requirement and use case/journey;
- user-visible behavior and acceptance criteria;
- screen/component or interface contract and applicable brand/token maturity;
- safety, privacy, permission, and accessibility implications;
- architecture owner and data boundary;
- eval/test requirement;
- assumptions and excluded behavior;
- dependencies and rollback/feature-flag expectation where relevant.

Turn the roadmap into a dependency-ordered backlog. The top backlog items after
this mission should be concrete, bounded work—not “write PRD” or “decide the
whole architecture.” Prepare the first implementation milestone as small
vertical slices with requirement/eval links, but do not implement them.

The readiness assessment must classify every required artifact and gate as:

```text
Ready
Ready with proposed assumptions
Needs evidence
Needs Simon decision
Blocked
Not applicable to current stage
```

Do not declare the project development-ready merely because the documents
exist. State exactly which implementation work is safe to start and which work
must wait for research, platform testing, design, or a decision.

## ADR and decision workflow

Review accepted/proposed ADRs and important choices hidden in prose. Create a
proposed ADR only for consequential decisions that have a real options analysis
and durable architectural/product impact. Likely candidates include:

- Stage 1 MVP signature workflows;
- distribution and AccessibilityService posture;
- supported Android/device/app matrix;
- local/cloud and offline boundary;
- model/provider independence;
- memory ownership and deletion semantics;
- family/helper permission model;
- voice activation approach;
- design accessibility baselines;
- device-control service boundary;
- privacy-preserving observability/eval data.

Do not create ADRs for routine copy, file layout, or easily reversible details.
Only explicit user authority or an already accepted source may make an ADR
`accepted`. Preserve superseded records rather than editing history to look
clean.

## Canonical file ownership

Use these ownership boundaries:

- `docs/00-vision/` — long-term intent and three-stage strategy.
- `docs/01-product/` — Stage 1 users, jobs, outcomes, scope, requirements, use
  cases, journeys, success model, roadmap, and traceability.
- `docs/02-design/` — Stage 1 product design, information architecture,
  screens, states, voice/content, accessibility, design system, and Figma
  agreement.
- `docs/03-agent/` — Stage 1 agent behavior, control plane, memory interaction,
  recovery, and tool contracts.
- `docs/04-architecture/` and root `ARCHITECTURE.md` — Stage 1 system/component
  architecture and boundaries.
- `docs/05-safety-privacy/` — privacy, consent, threats, sensitive actions,
  family/helper boundaries, data retention, and safety policy.
- `docs/06-evals/` — capability/task evals, metrics, and failure taxonomy.
- `docs/07-hardware/` — Stage 1 reference-tablet facts; Stage 3 concepts remain
  explicitly dormant.
- `docs/08-research/` — questions, methods, sources, observations, and
  feasibility evidence; never fabricated results.
- `docs/09-decisions/` — consequential decision records and history.
- `docs/10-execution/` — current milestone, gates, backlog, open questions,
  debt, and restartable handoff.

Each canonical fact has one owner. Other files summarize and link. Do not make
`final`, `new`, `v2`, or date-suffixed duplicates. If a document changes role,
deprecate or supersede it visibly.

## Metadata and writing standards

Every canonical Markdown document must have valid frontmatter including:

```yaml
title: Human-readable title
status: draft | proposed | review | accepted | deprecated
owner: Simon
last_updated: YYYY-MM-DD
tags:
  - relevant-tag
related:
  - relative-link.md
```

Use the actual modification date. Do not mark newly generated product choices
`accepted`; use `proposed` or `review`. Within a document, distinguish the
document's editorial status from the status of individual requirements or
decisions.

Write plain, direct language. Use tables where repeated fields need comparison
and diagrams where flows/boundaries become easier to understand. Avoid bloated
consulting language, generic best-practice filler, and repetition. Add enough
detail that a designer or engineer can act without guessing product behavior.

## Research standard

Browse for claims that may have changed, especially Android APIs and behavior,
Google Play policy, accessibility standards, model capabilities, privacy/legal
requirements, and competitor behavior. Prefer official platform/policy/standards
sources and original research. Clearly separate:

- what a source explicitly establishes;
- your inference;
- a product recommendation;
- a device test still required.

Do not treat old conversation claims as current evidence. Do not perform broad
legal or medical classification by inference; identify specialist review when
the product decision truly requires it.

## Work method and follow-through

1. Begin with a concise progress update stating that Stage 1 is the only active
   scope and that you will produce the complete readiness package.
2. Inspect source material, effective instructions, Git state, and current
   documents.
3. Create a dependency order and execute all workstreams, not just the first
   few. Maintain a short internal checklist or progress ledger.
4. Make routine proposed choices so documents become concrete. Collect only
   consequential unresolved decisions for Simon.
5. Prefer expanding canonical files over producing audit artifacts.
6. Cross-link requirements, use cases, journeys, screens, architecture,
   policies, roadmap tasks, and evals as you work—not as a cosmetic final pass.
7. Review each artifact from the perspective of its next consumer: user,
   designer, Android engineer, backend/agent engineer, safety reviewer,
   researcher, or future Codex session.
8. Use subagents only if repository policy permits and work can be divided into
   bounded, non-overlapping research/review lanes. The root session owns
   canonical editing, cross-document consistency, and final acceptance.
9. Keep the user informed during sustained work. Do not abandon the mission
   because it is long.
10. Work on a short-lived documentation branch. Preserve existing user work.
11. Make focused local commits when coherent. Do not push, merge, publish,
    install dependencies, enable Obsidian plugins, or change external systems
    without current authorization.

## Explicit non-goals for this session

Do not:

- implement the Android app, backend, agent runtime, production model calls,
  deployment, OS fork, or hardware;
- create fake code scaffolds to make the repository look active;
- lock vendors, frameworks, databases, model providers, final visual brand,
  logo, palette, typography, pricing, market, or launch date without
  evidence/authority;
- manufacture user research, technical measurements, policy approval, eval
  results, or competitor findings;
- expand Stage 2 or Stage 3 documentation beyond a link or scope boundary;
- change private Obsidian state or source artifacts;
- mark proposed documents/ADRs accepted on Simon's behalf.

Small disposable technical experiments are allowed only if necessary to verify
a critical planning claim, leave no production scaffold, use synthetic data,
and are documented honestly. Prefer defining the feasibility spike for the next
milestone if execution is not necessary now.

## Development-readiness quality bar

At completion, a new product manager, product designer, Android engineer,
agent/backend engineer, safety reviewer, researcher, or Codex session must be
able to answer from the repository alone:

- What exactly is Granny Stage 1, for whom, and why?
- Which claims are confirmed, proposed, or unvalidated?
- What are the precise MVP and App V1 boundaries?
- Which workflows define the thesis and why were they selected?
- What does each workflow look, sound, and feel like in every important state?
- What does the Granny brand promise, what should it feel like, which identity
  territories were explored, and which direction is recommended?
- Which public-name candidates were explored, screened, shortlisted, and
  recommended, and what feedback must Simon provide for the next naming round?
- Which screens and components must be designed in Figma?
- What can Granny observe, prepare, execute, confirm, delegate, or never do?
- How are actions verified, interrupted, retried, and recovered?
- What information can be collected, remembered, inferred, shared, corrected,
  exported, or deleted?
- What can a family/helper see and do, and how does the older adult remain in
  control?
- What can stock Android and the intended distribution route really support?
- Where are local/cloud, trust, permission, and component boundaries?
- How does every MVP requirement trace to design, safety, architecture, and an
  eval?
- Which research, Figma, feasibility, and implementation tasks happen next?
- What evidence must pass each milestone gate?
- Which exact vertical slice may the next coding session begin?

If the repository cannot answer these without reconstructing old chats, the
mission is incomplete.

## Validation before completion

Before finishing:

1. Re-read effective agent instructions and the Stage 1 scope gate.
2. Review the complete diff for unsupported decisions, duplicated truth,
   cross-stage leakage, stale paths, and accidental user-file changes.
3. Validate all standard Markdown links and frontmatter `related` paths.
4. Validate status vocabulary, stable ID uniqueness, metadata dates, and the
   ADR index.
5. Search for stale claims that the repository root is the Obsidian vault.
6. Search active requirements for AOSP/root/system-privilege or custom-hardware
   assumptions.
7. Confirm Dream Book and source-material artifacts remain unchanged.
8. Confirm `docs/.obsidian/*.json` is unmodified and uncommitted.
9. Confirm no credentials, private user data, fabricated findings, fake eval
   results, or falsely final design values were introduced.
10. Confirm every proposed MVP requirement has a use case, design destination,
    safety disposition, architecture owner, and eval or explicit gap.
11. Confirm current milestone, readiness gate, backlog, open questions,
    navigation, and ADR index match the final state.
12. Run proportionate repository checks and record exact results.
13. Create focused local commits if coherent. Do not push or merge without
    explicit authorization.

## Final report

Return a concise, evidence-backed report with:

1. canonical documents created, substantially rewritten, deprecated, or left
   unchanged;
2. the proposed Stage 1 MVP, App V1 boundary, and signature workflows;
3. important product/design/brand/agent/architecture/safety decisions made as
   proposals and the rationale, including naming finalists and the recommended
   identity territory;
4. decisions that specifically require Simon, with recommendation and
   tradeoffs;
5. development-readiness gate status and remaining blockers/evidence;
6. the first safe implementation or feasibility slice, with linked requirement
   and eval IDs;
7. validation commands and exact results;
8. branch, commit, and worktree state;
9. the single best next action.

The mission is complete only when the documentation system itself has been
built and validated. Do not stop after reviewing it. Do not return a plan for
someone else to write the PRD and design specification. Write them, connect
them, establish the roadmap and gates, and leave the repository ready for the
next evidence-led development step.

---

Prompt design note: the explicit completion contract, instruction hierarchy,
follow-through rules, and verification requirements reflect current
[OpenAI model guidance for GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model).
