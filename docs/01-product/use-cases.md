---
title: "Stage 1 Use Cases"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [product, use-cases]
related:
  - prd.md
  - user-journeys.md
  - ../06-evals/canonical-tasks.md
---

# Stage 1 use-case catalog

25 proposed cases preserve UC-001–012 and extend coverage. All cases are **proposed/unvalidated**; blocked capabilities stay inaccessible in earlier releases. Each card includes the outcome, trigger, route, dependencies, risk and evidence. [PRD](prd.md) owns requirements; [journeys](user-journeys.md) own sequence; [policy](../05-safety-privacy/action-policy.md) owns action classes; [evals](../06-evals/canonical-tasks.md) own fixtures. P and JOB definitions live in [personas](personas.md).

POL-00 = scoped observe, POL-01 = reversible navigation, POL-02 = local preparation, POL-03 = confirmed consequence, POL-R = restricted/manual only. Case class denotes maximum allowed consequence, not permission for every step. All workflows stop on revocation, stale state, unsupported adapter, lost visible control or invalid approval. Every case supports Cancel and a text alternative; ordinary external Android controls remain system-owned.

<a id="uc-001"></a>
## UC-001 — Call a known person

**Release / priority / actor / job:** App V1 / Must / P-01 / JOB-01.
**Request / touch:** “Call Sophie.” / People → Sophie → Call.
**Start and preconditions:** signed-in supported calling app; resolved person/endpoint.
**Data and permissions:** contacts and approved route; no call-log access.
**Expected behavior:** Resolve person/channel → prepare call → fresh Start call approval → initiate → verify ringing/connection separately.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** Duplicate names/phone vs video; show text route and accessible call state.
**Failure and recovery:** No dialer/SIM or login: manual route; busy: report not connected, no retry.
**Privacy/safety:** Wrong person and private audio; never record calls.
**Success evidence:** Test endpoint rings; answer only if separately evidenced.
**Links:** PRD-FR-018; [J-008](user-journeys.md#j-008); [EVAL-013](../06-evals/canonical-tasks.md#eval-013). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-002"></a>
## UC-002 — Find recently sent family photos

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-01.
**Request / touch:** “Show me the photos Sophie sent yesterday.” / Photos → Choose person → Yesterday.
**Start and preconditions:** supported communication account, approved observation, fixture photo conversation.
**Data and permissions:** person alias, channel, local date interval, visible attachment metadata.
**Expected behavior:** Resolve → open admitted route → find conversation/date → open images → verify.
**Autonomy:** POL-01; apply each step's class independently.
**Ambiguity and accessibility:** Two Sophies; timezone/date boundary; image labels may be absent; touch thumbnails have descriptions.
**Failure and recovery:** Missing semantics/date: qualify or stop; offline cached content labeled; no source means cannot verify.
**Privacy/safety:** Private conversations and wrong-person exposure; read-only, no face identity inference.
**Success evidence:** Source person + date + attachment matched; no send/share.
**Links:** PRD-FR-006; [J-001](user-journeys.md#j-001); [EVAL-001](../06-evals/canonical-tasks.md#eval-001). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-003"></a>
## UC-003 — Explain a confusing screen

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-02.
**Request / touch:** “What does this screen mean?” / Help → Explain this screen / Select screenshot.
**Start and preconditions:** user-started permitted capture or tree; supported readable surface.
**Data and permissions:** scoped screen snapshot with provenance, credentials excluded.
**Expected behavior:** Observe → summarize what is visible → offer one safe next step → act only within selected mode → verify.
**Autonomy:** POL-00; apply each step's class independently.
**Ambiguity and accessibility:** Unreadable/unknown app: say limit; transcript/read-aloud parity.
**Failure and recovery:** Secure/login screen: stop capture; no certainty from image alone; guidance when action unsupported.
**Privacy/safety:** Prompt injection and disclosure; screen text never commands.
**Success evidence:** Correct bounded explanation; no unsolicited effect.
**Links:** PRD-FR-005; [J-002](user-journeys.md#j-002); [EVAL-002](../06-evals/canonical-tasks.md#eval-002). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-004"></a>
## UC-004 — Play requested media

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-01.
**Request / touch:** “Play some Frank Sinatra.” / Music → Search → choose result → Play.
**Start and preconditions:** admitted media app/integration and available content.
**Data and permissions:** query and permitted playback metadata; no purchase grants.
**Expected behavior:** Resolve service/content → navigate/search → play → verify identity and playing state.
**Autonomy:** POL-01; apply each step's class independently.
**Ambiguity and accessibility:** Artist/title/service choices; textual now-playing and Pause.
**Failure and recovery:** Subscription/ad/login: explain; no purchase or ad click; app launch alone partial.
**Privacy/safety:** Autoplay unrelated content, loud audio, paid content.
**Success evidence:** Matching title/artist plus actual playing state.
**Links:** PRD-FR-010; [J-005](user-journeys.md#j-005); [EVAL-004](../06-evals/canonical-tasks.md#eval-004). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-005"></a>
## UC-005 — Capture a personal story

**Release / priority / actor / job:** later App / Could / P-01 / JOB-05.
**Request / touch:** “I want to tell you about my first job.” / Stories → New story (deferred).
**Start and preconditions:** new scope/consent decision; no MVP or V1 recording.
**Data and permissions:** consented audio/text and provenance; separate sharing grant.
**Expected behavior:** Explain retention → explicit capture → review → save privately → verify.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** Names/years uncertain remain marked; typed equivalent.
**Failure and recovery:** Interrupted recording: preview/delete; no automatic save or family sharing.
**Privacy/safety:** Sensitive autobiography and third-party information.
**Success evidence:** Saved reviewed object and explicit scope; planned eval only.
**Links:** PRD-FR-021; no story-capture journey is in current scope (J-004 is helper assistance, not stories); [J-007](user-journeys.md#j-007) covers only current memory-rights infrastructure; [EVAL-017](../06-evals/canonical-tasks.md#eval-017) includes the deferred story boundary, not a completed capture implementation.

<a id="uc-006"></a>
## UC-006 — Draft and confirm a message

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-01.
**Request / touch:** “Tell David I'll call after dinner.” / Message → Choose person → Type or dictate → Review.
**Start and preconditions:** admitted channel and resolved recipient; owning app authentication valid.
**Data and permissions:** exact message and recipient route, temporary local draft.
**Expected behavior:** Resolve → draft → review → approve exact handoff/send → recheck → verify or truthful partial.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** Duplicate David; ambiguous yes not approval; no paraphrased commitments.
**Failure and recovery:** Unknown send status: reconcile once, never auto-resend; cancel during dispatch reports possible effect.
**Privacy/safety:** Wrong recipient/content, duplicate send, cloud exposure.
**Success evidence:** Exact prepared text and endpoint; receipt distinguishes opened/sent/delivered.
**Links:** PRD-FR-008, PRD-FR-009; [J-003](user-journeys.md#j-003); [EVAL-003](../06-evals/canonical-tasks.md#eval-003). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-007"></a>
## UC-007 — Make content easier to see

**Release / priority / actor / job:** MVP / Must / P-02 / JOB-03.
**Request / touch:** “Make this bigger.” / Settings → Accessibility → Text size.
**Start and preconditions:** Granny foreground for in-app scale; external settings user-owned.
**Data and permissions:** local UI setting; no global settings privilege.
**Expected behavior:** Identify scope → preview larger text → apply → verify layout → offer restore.
**Autonomy:** POL-02; apply each step's class independently.
**Ambiguity and accessibility:** This could mean photo/text/system; clarify outside Granny; read labels aloud.
**Failure and recovery:** Clipped preview rejected; external app requires manual setting; saved old value permits restore.
**Privacy/safety:** Confusing global vs app scope; no diagnosis inferred.
**Success evidence:** Visible larger text with no clipped Stop/confirmation; stored setting matches.
**Links:** PRD-FR-011; [J-006](user-journeys.md#j-006); [EVAL-007](../06-evals/canonical-tasks.md#eval-007). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-008"></a>
## UC-008 — Create a reminder

**Release / priority / actor / job:** App V1 / Must / P-01 / JOB-01.
**Request / touch:** “Remind me tomorrow to call the dentist.” / Today → Add reminder.
**Start and preconditions:** admitted scheduling route, timezone; notification grant explained.
**Data and permissions:** text, local date/time/timezone; no health inference.
**Expected behavior:** Clarify time → preview → confirm → create once → read back schedule.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** Tomorrow/DST/missing time; no forced recall of parsed date.
**Failure and recovery:** Permission denied or alarm unavailable: show limitation; no medication reliability claim.
**Privacy/safety:** Missed or duplicate reminder.
**Success evidence:** One stored schedule at confirmed local time; notification tested separately.
**Links:** PRD-FR-019; [J-007](user-journeys.md#j-007); [EVAL-014](../06-evals/canonical-tasks.md#eval-014). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-009"></a>
## UC-009 — Understand connectivity failure

**Release / priority / actor / job:** MVP / Should / P-01 / JOB-02.
**Request / touch:** “Why isn't the internet working?” / Help → Connection status.
**Start and preconditions:** visible app with local connectivity facts.
**Data and permissions:** connection availability; no SSID/password/export identifiers.
**Expected behavior:** Read available network state → distinguish Wi-Fi from service reachability → offer settings.
**Autonomy:** POL-00; apply each step's class independently.
**Ambiguity and accessibility:** Do not diagnose router/ISP from one timeout; text status equivalent.
**Failure and recovery:** Provider down: distinguish unknown from device offline; settings remain user-operated.
**Privacy/safety:** Credential exposure and false diagnosis.
**Success evidence:** Evidence-backed status; no network/security toggle.
**Links:** PRD-FR-016; [J-002](user-journeys.md#j-002); [EVAL-009](../06-evals/canonical-tasks.md#eval-009). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-010"></a>
## UC-010 — Review and correct memory

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-05.
**Request / touch:** “What do you remember about Sophie?” / Settings → Memory → People.
**Start and preconditions:** MVP saved explicit alias/preference; App V1 may add automatically captured allowed important facts and bounded communication adjustments.
**Data and permissions:** local items/source/policy class/scope; no private transcript search.
**Expected behavior:** App V1 quietly receipts an admitted automatic fact with Undo → Memory lists exact items and communication baseline/adaptation state → select → edit, pause/reset or delete with review → verify removal/update.
**Autonomy:** POL-02; apply each step's class independently.
**Ambiguity and accessibility:** Two aliases or conflicting facts: keep the existing value and expose the source; never invent or silently overwrite memory. Receipt/Undo and controls work without audio.
**Failure and recovery:** Empty: say none saved; deletion failure stays pending; no resurrection.
**Privacy/safety:** Sensitive relationship sharing and derived caches.
**Success evidence:** Corrected value used; deleted value absent from store/index/export.
**Links:** PRD-PRV-002; [J-007](user-journeys.md#j-007); [EVAL-008](../06-evals/canonical-tasks.md#eval-008). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-011"></a>
## UC-011 — Return to previous reading/task

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-02.
**Request / touch:** “Take me back to what I was reading.” / Help → Previous task.
**Start and preconditions:** same-session known app/task reference; supported navigation.
**Data and permissions:** ephemeral recent task state, no browsing-history crawl.
**Expected behavior:** Identify known target → offer recovery → bounded back/open → verify.
**Autonomy:** POL-01; apply each step's class independently.
**Ambiguity and accessibility:** Multiple prior tasks: ask; do not imply full-day memory.
**Failure and recovery:** Lost state/unsaved edits: manual guidance; two no-effect states stop.
**Privacy/safety:** Discarded user work, false continuity.
**Success evidence:** Correct known content restored or honest unavailable.
**Links:** PRD-FR-012, PRD-FR-014; [J-002](user-journeys.md#j-002); [EVAL-002](../06-evals/canonical-tasks.md#eval-002). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-012"></a>
## UC-012 — Request remote help

**Release / priority / actor / job:** later App / Could / P-03 / JOB-05.
**Request / touch:** “Ask Alice to help with this screen.” / Help → Remote assistance (deferred).
**Start and preconditions:** separate consent/security design and authenticated scoped session.
**Data and permissions:** only specifically shared surface, no private content.
**Expected behavior:** User initiates → review helper/scope → approve → visible session → terminate → verify revoke.
**Autonomy:** POL-R; apply each step's class independently.
**Ambiguity and accessibility:** Cannot prove non-coercion; private route to decline; no silent family escalation.
**Failure and recovery:** Network/revocation/expiry ends access; no resume.
**Privacy/safety:** Surveillance and helper impersonation.
**Success evidence:** No connection in MVP/V1; future scope enforcement tested.
**Links:** PRD-FR-021; [J-004](user-journeys.md#j-004); [EVAL-016](../06-evals/canonical-tasks.md#eval-016). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-013"></a>
## UC-013 — Start by voice or touch

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-01.
**Request / touch:** “Show my photos.” / Home → Type a request / Photos.
**Start and preconditions:** app installed; microphone optional.
**Data and permissions:** ephemeral audio/transcript or typed request.
**Expected behavior:** Activate → capture → display/edit interpretation → choose workflow.
**Autonomy:** POL-00; apply each step's class independently.
**Ambiguity and accessibility:** Accent/noise/hesitation; keyboard and switch equivalents.
**Failure and recovery:** Denied mic/no speech: Type a request remains; no repeated permission nag.
**Privacy/safety:** Ambient audio exposure.
**Success evidence:** All signature workflows reachable without microphone.
**Links:** PRD-FR-001, PRD-FR-002; [J-007](user-journeys.md#j-007); [EVAL-005](../06-evals/canonical-tasks.md#eval-005). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-014"></a>
## UC-014 — Set up and revoke permissions

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-04.
**Request / touch:** “Help me set this up.” / First launch → Continue; Settings → Permissions.
**Start and preconditions:** ordinary Android ownership and supported install route.
**Data and permissions:** permission states and separate cloud-consent record.
**Expected behavior:** Explain purpose → accept/skip → OS grant handoff → recheck → practice revoke.
**Autonomy:** POL-R; apply each step's class independently.
**Ambiguity and accessibility:** Android screens may be smaller; co-present help optional, adult decides.
**Failure and recovery:** Denied/revoked/restricted: feature-specific guidance; no automatic enablement.
**Privacy/safety:** Bundled/coerced consent and privilege escalation.
**Success evidence:** Decline grants independently; revoked dependency cannot act.
**Links:** PRD-FR-003, PRD-DST-004; [J-007](user-journeys.md#j-007); [EVAL-005](../06-evals/canonical-tasks.md#eval-005). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-015"></a>
## UC-015 — Correct a misunderstood request

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-04.
**Request / touch:** “No, I meant tomorrow.” / Transcript → Edit request.
**Start and preconditions:** heard or draft state; no already-completed effect to edit.
**Data and permissions:** new intent revision replaces old temporary context.
**Expected behavior:** Stop pending action → edit → resolve again → invalidate preview/approval → replan.
**Autonomy:** POL-02; apply each step's class independently.
**Ambiguity and accessibility:** Exact correction vs new task; never silently change sent message.
**Failure and recovery:** If already sent: say so and offer separate new draft.
**Privacy/safety:** Old approval applied to new content.
**Success evidence:** No old-version commit; corrected intent visible.
**Links:** PRD-SAF-002; [J-003](user-journeys.md#j-003); [EVAL-010](../06-evals/canonical-tasks.md#eval-010). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-016"></a>
## UC-016 — Choose the right person/content

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-04.
**Request / touch:** “The David from my walking group.” / Choose person → labeled option.
**Start and preconditions:** multiple approved candidates.
**Data and permissions:** minimum distinguishing contact facts.
**Expected behavior:** Ask one question → show candidates → user chooses → bind identity.
**Autonomy:** POL-02; apply each step's class independently.
**Ambiguity and accessibility:** No relationship label if user never entered it; accessible rows.
**Failure and recovery:** No match: add/select contact manually or cancel.
**Privacy/safety:** Unnecessary private details and wrong person.
**Success evidence:** Chosen stable endpoint used; uncertainty blocks consequence.
**Links:** PRD-FR-007; [J-003](user-journeys.md#j-003); [EVAL-003](../06-evals/canonical-tasks.md#eval-003). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-017"></a>
## UC-017 — Stop or mute spoken output

**Release / priority / actor / job:** MVP / Must / P-02 / JOB-03.
**Request / touch:** “Stop talking.” / Stop speaking / Sound off.
**Start and preconditions:** speech/listening visible; no ambient wake word.
**Data and permissions:** speech preference only.
**Expected behavior:** Stop output immediately → preserve visual state → allow repeat.
**Autonomy:** POL-01; apply each step's class independently.
**Ambiguity and accessibility:** Stop cancels task if unqualified during acting; Stop speaking only output.
**Failure and recovery:** Audio focus loss: text persists; voice barge-in only when capture active.
**Privacy/safety:** False belief mic is muted by volume change.
**Success evidence:** Speaker mute and mic state separately visible.
**Links:** PRD-ACC-003; [J-007](user-journeys.md#j-007); [EVAL-007](../06-evals/canonical-tasks.md#eval-007). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-018"></a>
## UC-018 — Inspect or clear task history

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-05.
**Request / touch:** “What did you do?” / History → task / Clear history.
**Start and preconditions:** local audit available.
**Data and permissions:** minimal outcome/time/code, no raw content.
**Expected behavior:** Show result and evidence strength → review deletion → clear → verify.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** Unknown outcome stays unknown; no invented messages.
**Failure and recovery:** Crash recovery shows incomplete/unknown; failed delete does not claim done.
**Privacy/safety:** Retention and diagnostic leakage.
**Success evidence:** Entries removed locally; no private content exported.
**Links:** PRD-FR-015, PRD-PRV-006; [J-007](user-journeys.md#j-007); [EVAL-008](../06-evals/canonical-tasks.md#eval-008). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-019"></a>
## UC-019 — Stop and take over a task

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-04.
**Request / touch:** “Stop. I'll do it.” / Stop / Take over.
**Start and preconditions:** any active task; visible stop route required.
**Data and permissions:** cancel latch and minimal action journal.
**Expected behavior:** Latch cancellation → deny dispatch → reconcile in-flight effect → leave current app → explicit restart only.
**Autonomy:** POL-01; apply each step's class independently.
**Ambiguity and accessibility:** Touch origin not always detectable externally; unsupported cases disable automation.
**Failure and recovery:** Process death or lost stop surface: no further dispatch; unknown effect reported.
**Privacy/safety:** Race causes unintended send.
**Success evidence:** Zero dispatch after latch; user manually continues.
**Links:** PRD-FR-013; [J-002](user-journeys.md#j-002); [EVAL-006](../06-evals/canonical-tasks.md#eval-006). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-020"></a>
## UC-020 — Get help and share diagnostics

**Release / priority / actor / job:** MVP / Should / P-01 / JOB-02.
**Request / touch:** “This keeps failing.” / Help → Report a problem → Preview diagnostics.
**Start and preconditions:** local redacted events; export optional.
**Data and permissions:** versions, codes, timing; no serial/account/content.
**Expected behavior:** Explain failure → offer next step → preview optional export → user shares.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** No technical vocabulary required; optional note can contain private text, warn and allow remove.
**Failure and recovery:** Offline: local export available; no automatic background upload.
**Privacy/safety:** Support data overcollection.
**Success evidence:** User sees exact export; redaction verified.
**Links:** PRD-FR-017; [J-007](user-journeys.md#j-007); [EVAL-008](../06-evals/canonical-tasks.md#eval-008). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-021"></a>
## UC-021 — Get co-present setup help

**Release / priority / actor / job:** MVP / Should / P-03 / JOB-05.
**Request / touch:** “Can Alice help me set it up?” / Help → Set up together.
**Start and preconditions:** adult present and willing.
**Data and permissions:** only current user-controlled screen.
**Expected behavior:** Explain scope → adult operates grants → helper explains → end setup.
**Autonomy:** POL-R; apply each step's class independently.
**Ambiguity and accessibility:** No assumption family is trusted; user can skip.
**Failure and recovery:** Pressure/refusal: end without notifying helper.
**Privacy/safety:** Coercion and shoulder surfing.
**Success evidence:** No helper account or retained access created.
**Links:** PRD-PRV-004; [J-007](user-journeys.md#j-007); [EVAL-008](../06-evals/canonical-tasks.md#eval-008). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-022"></a>
## UC-022 — Use without voice/audio

**Release / priority / actor / job:** MVP / Must / P-02 / JOB-03.
**Request / touch:** “I want to type instead.” / Home → Type a request; Settings → Sound off.
**Start and preconditions:** touch/keyboard/switch and screen available.
**Data and permissions:** typed request; local access preference.
**Expected behavior:** Navigate same flow → read status → touch confirm → inspect outcome.
**Autonomy:** POL-01; apply each step's class independently.
**Ambiguity and accessibility:** TalkBack and captions must not compete; large text.
**Failure and recovery:** Mic/audio absence never blocks core task.
**Privacy/safety:** Accessibility exclusion.
**Success evidence:** Same outcomes and policies across input modes.
**Links:** PRD-ACC-003; [J-007](user-journeys.md#j-007); [EVAL-007](../06-evals/canonical-tasks.md#eval-007). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-023"></a>
## UC-023 — Review helper configuration proposal

**Release / priority / actor / job:** App V1 / Should / P-01 / JOB-05.
**Request / touch:** “What did Alice suggest changing?” / Settings → Helpers → Pending suggestion.
**Start and preconditions:** authenticated optional helper and current grant.
**Data and permissions:** proposed contact/settings diff, no private content.
**Expected behavior:** Open diff → user approves/rejects → apply local change → audit → revoke if wanted.
**Autonomy:** POL-03; apply each step's class independently.
**Ambiguity and accessibility:** Helper identity verified; explain effects in adult language.
**Failure and recovery:** Expired/revoked grant rejects pending proposal; no background apply.
**Privacy/safety:** Helper overreach and spoofing.
**Success evidence:** Only approved diff applies; revocation immediate locally.
**Links:** PRD-PRV-005; [J-004](user-journeys.md#j-004); [EVAL-016](../06-evals/canonical-tasks.md#eval-016). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-024"></a>
## UC-024 — Open/read selected document

**Release / priority / actor / job:** App V1 / Must / P-02 / JOB-01.
**Request / touch:** “Read this document to me.” / Help → Choose document → Read aloud.
**Start and preconditions:** user selects readable file via system picker.
**Data and permissions:** scoped URI/text, ephemeral model slice if consented.
**Expected behavior:** Select → identify file → extract safe text → read with transcript → stop.
**Autonomy:** POL-00; apply each step's class independently.
**Ambiguity and accessibility:** Bad OCR or unknown language labeled; no hidden link execution.
**Failure and recovery:** Expired URI/password file: user action required; no credential tool.
**Privacy/safety:** Document injection and private content.
**Success evidence:** Read matches fixture; links do not invoke tools.
**Links:** PRD-FR-020; [J-002](user-journeys.md#j-002); [EVAL-015](../06-evals/canonical-tasks.md#eval-015). Later cases use planned cross-cutting evals, not implied execution.

<a id="uc-025"></a>
## UC-025 — Handle restricted request honestly

**Release / priority / actor / job:** MVP / Must / P-01 / JOB-04.
**Request / touch:** “Pay this bill for me.” / Type request → restriction explanation.
**Start and preconditions:** any request crossing finance/legal/credentials/emergency boundary.
**Data and permissions:** minimum intent for category; no protected screen read.
**Expected behavior:** Classify restricted → explain specific limit → offer user-controlled app/help route.
**Autonomy:** POL-R; apply each step's class independently.
**Ambiguity and accessibility:** Do not imply emergency assistance or ability to verify medical advice.
**Failure and recovery:** No workaround through vision, helper or another app.
**Privacy/safety:** High-consequence unauthorized action.
**Success evidence:** Zero restricted dispatch and understandable limitation.
**Links:** PRD-SAF-005; [J-002](user-journeys.md#j-002); [EVAL-010](../06-evals/canonical-tasks.md#eval-010). Later cases use planned cross-cutting evals, not implied execution.
