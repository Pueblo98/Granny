---
title: "Screen understanding: prior work, JEV fit and implemented perception lab"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [research, android, perception, evidence]
related:
  - ../../experiments/ui-perception/README.md
  - ../10-execution/sessions/2026-09-20-screen-understanding.md
  - ../10-execution/backlog.md
  - ../03-agent/tool-contracts.md
---

# Screen understanding implementation checkpoint

## What already existed

Simon was right that offline features had already been tested. The browser
prototype has fictional screen explanations and numbered guidance (merged PR
#44); T-103 has fake authority replay; the C2 lab has four bounded device runs
and later host-tested safety repairs (#31/#33). These are not general OCR or UI
parsers. The separate identity/retention/egress packet (#46) remains prerequisite
evidence, not a completed production permission route.

GitHub inspection on 2026-09-20 found no open PRs, main at `eeb1885`, published
T-122 setup/T-123 draft and room-chat branches, plus a dirty local T-124 media
worktree. Branches and session records show ownership, not real-time presence.
The new isolated lab avoids all their native-shell/browser/C2 files.

## JEV finding and recommendation

TypeSafe released Jev on 2026-09-15 as a non-text-generating decision model using
parallel outputs and RLCD training. The announcement explicitly says its Doom
demo receives structured state, not images. Its “no hallucination” claim is
schema/type safety, **not zero wrong decisions**. These are vendor claims, not
our benchmarks. [Official release](https://typesafe.ai/blog/introducing-system-one-models-and-jev).

The documented interface returns Choice, Score or Noul judgments over supplied
state. It does not expose screenshot-to-box detection or OCR. Jev could later
rank already-observed candidates; it cannot supply the missing eyes. We have not
established a downloadable Jev vision model, Android runtime, model-weight
license, parameter count or tablet CPU/GPU/NPU/RAM requirements. Do not confuse
SDK/source availability with model-weight availability. No JEV call or dependency
was added. [Official documentation](https://docs.typesafe.ai/introduction).

Recommend **native semantics → bounded local OCR/visual fallback → ambiguity
review → reasoning → independently authorized action layer**. Implemented here:
the first two host layers, annotation, reference validation and a native
fixture-only semantic observer. Remaining arrows are proposals, not production
wiring. A dedicated icon detector is a separate benchmark/dependency decision.

| Approach | Practical assessment for Granny |
| --- | --- |
| A: multimodal only | Rich visual context, variable paid latency and localization/label errors; no native identity; simple perception API but costly safety validation. Unbenchmarked here. |
| B: JEV only | Not a screenshot parser. No demonstrated boxes, OCR or custom-rendered UI understanding; this architecture cannot supply the requested map. |
| C: accessibility + local vision | Cheap native roles/bounds/text where exposed; OCR adds canvas text but not interactability or icon meaning. Deterministic validation, fallible observations; medium implementation complexity. Implemented lab direction. |
| D: C + multimodal fallback | Best proposed coverage/cost tradeoff; retain provenance/conflicts and use authorized image fallback only for unresolved questions. Highest integration/privacy complexity; model route unimplemented. |

Native Views/Compose semantics can expose roles and labels; missing/merged/custom
semantics remain incomplete. UIAutomator is useful for test replay, not a shipped
privileged automation assumption. This lab uses AccessibilityService's window
screenshot API (Android 14+) and own-package nodes, not framebuffer/root access.
The older C2 MediaProjection route is unchanged. Distribution, consent and
external-package admission still require their own gate evidence.
[Android API](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService#takeScreenshotOfWindow(int,java.util.concurrent.Executor,android.accessibilityservice.AccessibilityService.TakeScreenshotCallback)).

## Actual implementation and evidence

The [runnable lab](../../experiments/ui-perception/README.md) generates structured
JSON, numbered SVG and an accessible HTML review. Feeding that JSON alone to a
reasoner saves image input when labels suffice; numbered imagery preserves visual
context when they do not. Neither input is trusted instruction or action authority.

Initial host smoke run: one synthetic 800×640 layout, three repeated observations
per arm, Tesseract 5.5.3 English, local computer. All arms found 3/3 expected
control labels and correctly lacked “Send”; outputs repeated and no conflicts
were observed. Semantics missed the intentionally unexposed canvas sentence;
OCR and fusion recovered it. Median wall time: semantics **0.643 ms**, OCR
**376.623 ms**, fused **398.140 ms**. These are actual narrow measurements, not
tablet latency, broad accuracy, hallucination rate or an LLM comparison.
The real OCR adapter uses installed Tesseract's documented TSV output.
[Tesseract documentation](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html).

The smallest useful falsification experiment now runs locally without a provider:
compare semantic-only/OCR-only/fusion and an absent target on the same fixture.
Next extend to independently labeled light/dark/scaled/ambiguous/icon-only
fixtures, then run the explicit Android fixture checklist under fresh authority.
Measure missed/extra elements, box IoU, wrong target proposals, abstention, p50/p95
latency, peak memory and battery. The current test only evaluates label presence,
absence and repeatability; it does **not** measure box IoU or broad coverage.

On tablet, native traversal requires no model; OCR RAM/energy depends on the
chosen runtime and image size. Current native capture caps images at 8M pixels
and 4096 per dimension; several bitmap copies can still cost tens of MB. CPU,
GPU/NPU needs and battery impact remain unmeasured. Prefer explicit requests and
change invalidation, not continuous frame inference. A remote fallback introduces
upload latency, privacy and provider costs; none is enabled here.

No device was installed/enabled, no personal screenshot was processed and no
provider was called. T-101 and GATE-03/04/06 remain open. The session record owns
exact final test/build/publication results.
