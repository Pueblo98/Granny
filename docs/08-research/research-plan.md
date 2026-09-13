---
title: "Stage 1 evidence and research program"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [research]
related:
  - android-stage-1-feasibility.md
  - README.md
  - ../06-evals/canonical-tasks.md
  - ../10-execution/development-readiness.md
---

# Stage 1 evidence and research program

**No participant study, physical-device capability experiment, competitor benchmark, provider comparison or runtime eval has been completed by this planning mission.** Dated primary-source desk research exists in [Android feasibility](android-stage-1-feasibility.md), [accessibility](../02-design/accessibility.md) and [naming](../02-design/naming-exploration.md). Source statements, inference, recommendations and unknowns remain separate.

## Order, recruitment and evidence handling

Kill-risk order: distribution desk assessment + valued jobs → physical platform/verification checks → low-fi control comprehension → privacy and voice/access trials → identity/naming iteration → synthetic controlled prototype → paired baseline → consented pilot. Work in independent lanes may overlap, but participants must not encounter live consequential automation before safety gates. No Stage 2/3 experiment is authorized.

Proto-personas are recruitment hypotheses, not diagnoses. Include cognitively independent adults with low and high technical confidence and hearing/vision/dexterity needs. Higher-assistance/medical/safeguarding contexts are outside MVP, not people to label incapable. Offer large-print/audio consent, teach-back, interpreter where feasible, breaks, withdrawal and separate permission for recording. Recruit helper independently when privacy interests differ.

Proposed research data schedule: assign random participant IDs; contact/recruitment key stored separately in restricted research system, never Git. No recording by default. If explicitly consented, raw study recordings delete within30days after synthesis; de-identified notes within90days after study close unless refreshed consent; compensation/contact records follow specialist-approved obligations once jurisdiction known. Participant withdrawal triggers deletion of linkable research data where feasible; explain limits of already anonymized aggregate findings. These are proposals requiring ethics/privacy review before recruitment, not legal retention advice.

Use synthetic contacts, content and accounts for prototype tasks. Do not ask participants to expose bank, medical or intimate messages to prove need. A moderator can ask for an anonymized recent example instead. Log consent, date/environment, artifact version, method, observation versus interpretation, disconfirming examples and limitations using [research template](../_templates/research-note.md). Research lead recommends; Simon accepts consequential changes.

<a id="res-01"></a>
## RES-01 — Valued jobs and desired delegation

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** Older adults want selectable delegation for frequent tablet jobs; tech discomfort is not cognitive impairment.
- **Method / participants / environment:** 12–16 proposed discovery interviews/contextual observations across independent adults with varied tech comfort and sensory/dexterity needs; ask recent actual tasks before showing concept. Do not recruit only helpers or existing enthusiasts.
- **Artifact / protocol:** Observe current workaround with participant-selected nonsensitive task; frequency/value diary optional; artifact anonymized job map and revised proto-personas.
- **Decision criterion:** Retain jobs only with repeated specific value examples; if guidance dominates or two valuable delegable jobs cannot be identified, reshape MVP before build. No numeric prevalence inference from qualitative sample.
- **Order / owner / trace / gate:** Research lead; first, parallel with RES-02; PRD-OUT-001/003; GATE-02.
- **Ethics / privacy:** Accessible consent, voluntary breaks/withdrawal, avoid opening private accounts; no cognitive diagnosis or hidden observation.

<a id="res-02"></a>
## RES-02 — Viable distribution and honest target-user claim

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** A permitted control/distribution route can preserve useful delegation without claiming an unearned accessibility exemption.
- **Method / participants / environment:** Android architect + policy specialist review official Google Play text; prepare exact manifest/data flow/control modes/listing/video script; ask authoritative policy channels about actual candidate behavior when authorized.
- **Artifact / protocol:** Artifact route-by-capability decision matrix, dated evidence and unanswered review questions; compare API-led, static recipes, private lab and genuine disability-specific product only if user research supports it.
- **Decision criterion:** GATE-04 needs documented permissible route for planned capabilities and actual required declaration/review steps. General autonomous accessibility assistant public Play route remains no-go under current text; absence of reply is not approval.
- **Order / owner / trace / gate:** Policy/research lead; first kill-risk; PRD-DST-001/002; GATE-02/04.
- **Ethics / privacy:** No false accessibility-tool declaration; no store submission/external correspondence in this session; market/consumer/privacy specialist review after jurisdiction decision.

<a id="res-03"></a>
## RES-03 — Understandable control and recovery

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** People can distinguish prepare, external handoff, verified completion and unknown outcome, and can stop without being blamed.
- **Method / participants / environment:** Two formative rounds of 5–6 proposed participants each, separate from family; low-fidelity prototype followed by revised interaction; include P-02 access profiles.
- **Artifact / protocol:** Think-aloud only where not disrupting task; ask teach-back before commit/after result; wrong-person, timeout and partial tasks; artifact confusion map and frame revisions.
- **Decision criterion:** Proposed ≥90% correct consequence/outcome explanations and find Stop within5s; any high-consequence misunderstanding blocks that flow and triggers redesign/retest. Report n and caveats.
- **Order / owner / trace / gate:** Design/research lead; after initial jobs, before polished identity selection; PRD-OUT-002/ACC-004/SAF-002; GATE-05.
- **Ethics / privacy:** Disclose Wizard-of-Oz; all messages fictional; adult can reject delegation; no shame/leading coaching; accessible study material.

<a id="res-04"></a>
## RES-04 — Stock Android can observe, act and independently verify

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** At least two useful external workflows have reliable supported observation/action/verification and a visible local Stop on actual stock tablets.
- **Method / participants / environment:** Inventory reference hardware without serial/IMEI/account IDs; synthetic apps/accounts. Matrix physical Samsung exact SKU/API/One UI plus current stable/older supported API emulator and second OEM before expansion.
- **Artifact / protocol:** Run EVAL-001–006/009/010 with action/permission/version fixtures; log native vs semantic vs unavailable; screen-tree completeness, mark-read effects, app update, background/secure windows and stop races.
- **Decision criterion:** No supported route if independent verification/Stop unavailable. Proposed ≥80% nominal trials plus all safety invariants; at least two external jobs or return to scope. Model confidence never substitutes evidence.
- **Order / owner / trace / gate:** Android/executor lead; after RES-02 desk posture, before GATE-03/07; PRD-FR-005/006/009/010/012/013 and DST-003.
- **Ethics / privacy:** Synthetic content only; no root/device-owner workaround; testing policy and service grants explicit; no production release implied.

<a id="res-05"></a>
## RES-05 — Privacy-preserving local/cloud boundary

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** A replaceable cloud or local adapter can meet comprehension/latency while respecting scoped consent and deletion.
- **Method / participants / environment:** Compare fake first, then candidate providers only after authorization/terms review; local-only capability sample on reference tablet; use synthetic audio/screens and public test text.
- **Artifact / protocol:** Artifact capability/latency/cost/data-egress/retention table with provider version, dated primary price/terms sources and capture scope. Failure-inject offline/timeouts/schema invalidity.
- **Decision criterion:** No real-data provider if retention/training/subprocessor/deletion terms conflict with privacy contract. Stop/local rights must work without model/network. Cost budget needs Simon before paid pilot.
- **Order / owner / trace / gate:** Agent/privacy lead; after interfaces, before real-data prototype; PRD-PRV-001/NFR-002/004; GATE-06/08.
- **Ethics / privacy:** No credentials or provider keys in Git; no model selected by planning; legal obligations depend on market, specialist review not invented classification.

<a id="res-06"></a>
## RES-06 — Voice and access work in realistic homes

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** Tap-to-talk plus touch meets needs better than forced voice; internal target sizes/text help without infantilization.
- **Method / participants / environment:** Consented noisy-room and quiet-room tasks at conversational distance on tablet, hearing/vision/dexterity profiles; compare typed/touch with voice, accents and name corrections; no far-field hardware assumption.
- **Artifact / protocol:** Artifact error/latency by condition, accessibility traversal/layout audit and participant preference; test 200% font, TalkBack/switch/keyboard, caption and reduced-motion variants.
- **Decision criterion:** All supported tasks have nonvoice/non-audio path; no inaccessible Stop/confirmation; speech errors cannot cause consequence without corrected preview. If voice not usable, touch remains first-class and scope/marketing changes.
- **Order / owner / trace / gate:** Accessibility/voice lead; low-fi then device; PRD-FR-001/011/ACC-001–003; GATE-05/07/09.
- **Ethics / privacy:** No raw voice retained without separate time-limited study consent; no accent/age stereotypes; participant chooses modality and breaks.

<a id="res-07"></a>
## RES-07 — The MVP outperforms alternatives on useful tasks

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** Delegation reduces interface burden compared with participants' current method without reducing understanding.
- **Method / participants / environment:** Versioned paired baseline: ordinary Android/apps, current built-in assistant where actually available, accessibility/simplified-launcher option participants already use. Document exact region/device/app/model/account entitlements and official current feature source at execution.
- **Artifact / protocol:** Same synthetic photo/message/media goals, counterbalanced order; record verified outcome, assistance/time, confusion and chosen control mode. Artifact per-task comparative evidence, not feature-marketing matrix.
- **Decision criterion:** Proposed ≥25% assistance reduction and ≥70% choose delegation for at least one valued job, while ≥2 external jobs verified. Failure reshapes value proposition; no comparison based only on app-open speed.
- **Order / owner / trace / gate:** Research/product lead; after safe prototype; PRD-OUT-001/003; GATE-07/09.
- **Ethics / privacy:** Do not purchase/install/activate services without authorization; privacy equally constrained across baselines; no current competitor performance claims made here.

<a id="res-08"></a>
## RES-08 — Memory, family and support preserve user primacy

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** Explicit limited memory and adult-approved helper proposals create value without surveillance or coerced consent.
- **Method / participants / environment:** Separate adult interviews and 6–8 proposed helper interviews, not joint answers on private interests; memory cards, export/deletion teach-back and helper-permission scenarios; privacy reviewer tests data flows.
- **Artifact / protocol:** Artifact allowed/undesired memory classes and helper scopes; adversarial buyer-control, revocation, lost device, support impersonation; synthetic deletion/restore/egress tests.
- **Decision criterion:** Adults can explain stored/shared data and revoke; no helper needs private history to provide proposed setup support. If desired value requires surveillance, reject scope rather than normalize it. V1 facts/helper stay gated.
- **Order / owner / trace / gate:** Privacy/research lead; early concept then storage tests; PRD-PRV-001–006; GATE-06/09 and V1.
- **Ethics / privacy:** Recruit adult privately where safe; no disclosure of one party's interview to other; compensation not conditioned on agreement; specialist safeguarding advice for coercion cases.

<a id="res-09"></a>
## RES-09 — Name and identity communicate dignity and agency

- **Status:** planned / unrun (desk sources linked separately).
- **Hypothesis:** A non-age-coded name and concrete high-contrast identity can feel warm/capable, not clinical, childish or obscure.
- **Method / participants / environment:** Simon first labels naming iteration kit; representative adults/helpers separately hear 3 finalists before seeing spelling; randomized wordmark/icon/territory comparisons after structural usability.
- **Artifact / protocol:** Artifact heard/spelled/remembered/confused names, spontaneous associations and comprehension; target-language native review once markets chosen; professional trademark check in actual classes/jurisdictions.
- **Decision criterion:** Reject misleading/patronizing/confusable direction even if visually liked; name commitment waits for legal/linguistic checks; compare Open Day with Bright Signal or user-favored challenger. Brand styling cannot lower access targets.
- **Order / owner / trace / gate:** Brand/design lead; after low-fi review, before public identity; PRD-OUT-002/003/ACC-002; GATE-05.
- **Ethics / privacy:** Discovery web screening is not availability/clearance. English prototype is not launch-market choice. No stereotyped age imagery or emotion recognition.

## First study and device worksheets

Use the [research execution protocols](research-protocols.md) for concrete session prompts, consent/readiness, access/voice, helper/privacy and naming comparisons. Use [evidence protocol](../06-evals/evidence-protocol.md) for actual records and [T-101/108 packets](../10-execution/task-packets.md) for bounded deliverables. Methods below remain planned; protocols do not imply participant recruitment or device execution.

Discovery prompts: “Tell me about the last tablet task you wanted to finish”; “What did you do when it stopped working?”; “When would you want the computer to act, and when only explain?”; “Who may help, and what should they never see?” Avoid introducing memory/caregiver features before hearing actual needs. Record job, context, frequency example, workaround, failure impact, acceptable delegation and contradictory cases.

Reference-device worksheet: local anonymous fixture label, manufacturer/exact model/SKU, Android/API/security patch, OEM UI/build, RAM/storage class, display/logical dp/font scale, installed target package/version, language/timezone, permission grant method, launcher/default roles, service/background behavior, network profile, app signed-in synthetic/not-signed-in state. Do not collect serial/IMEI/MAC/account address. Current supplied marketing name is unverified; [hardware owner](../07-hardware/reference-hardware.md) must be updated only after actual inventory.

Per-capability worksheet: requested result, native API/integration availability, semantic tree quality, side effects, required grant, secure-screen behavior, element freshness, action idempotency, independent postcondition, visible Stop/return route, failure/rollback, current distribution implication, exact EVAL variant and trial count. A “works once” note is not admitted support.

Before pilot research: document actual market/language, recruitment safeguards, real-data/cloud contract, incident contact, support and withdrawal procedure, participant instructions explaining limitations and no emergency service. [Readiness](../10-execution/development-readiness.md) gates real-user testing.
