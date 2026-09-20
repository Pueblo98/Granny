---
title: "Read-only UI perception lab"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [android, perception, experiment]
related:
  - ../../docs/08-research/2026-09-20-screen-understanding.md
  - ../../docs/10-execution/sessions/2026-09-20-screen-understanding.md
---

# Read-only UI perception lab

Implemented experiment, not an admitted production capability. Reuses the
browser fixture vocabulary without replacing its existing screen explanations
or the C2 MediaProjection safety lab. No provider calls or actions.

## Host: real OCR, structured map and numbered image

Requires Python 3.10+, installed Tesseract with English data and ImageMagick for
fixture rendering. No pip packages. Tested with Tesseract 5.5.3. From repository root:

```sh
python3 -m unittest discover -s experiments/ui-perception -p 'test_*.py'
python3 experiments/ui-perception/evaluate.py /tmp/granny-perception-new-run
```

Use a **new** output directory each time. Open its `fused/review.html` locally:
numbered screenshot, accessible element table and expandable structured JSON.
`observation.json` supports image-free reasoning; `annotated.svg` supports an
image-based reasoning input. Neither route invokes a reasoning model here.

To process separately supplied **synthetic** fixtures:

```sh
python3 experiments/ui-perception/perception.py \
  --image /tmp/granny-perception-new-run/fixture/screen.png \
  --tree /tmp/granny-perception-new-run/fixture/tree.xml \
  --context /tmp/granny-perception-new-run/fixture/context.json \
  --ocr --output /tmp/granny-perception-new-map
```

The XML is a UIAutomator-shaped **replay**, not live device evidence. Context is
a caller assertion, not authenticated package identity. The CLI uses the fixture
clock; live freshness must not be inferred from it. `lookup()` separately checks
age, window and epoch. Duplicate, disabled, clipped and conflicting targets are
not usable references. OCR-only text is a visual candidate, never a button or an
authorized action. Confidence is an OCR recognition score, not calibrated truth.

Native bounds win during fusion. OCR text within a native box supports its
label; disagreement is retained and requests review. Numbering is local to each
observation. Identical fixture inputs produce repeatable elements, not a promise
of cross-device OCR determinism. Coverage always remains partial.

## Android: actual semantics and one-shot annotation

Separate Java-only Android 14+ app in `android/`; does not modify `android/stage1`
or the C2 observer.

The Android JSON has its own `granny.perception.android-lab.v1` schema and an
elapsed-realtime clock; it is not yet a wire-compatible input to the host replay
parser. A future production adapter must normalize context and coordinate space.

Uses the repository's existing Gradle wrapper and AGP version:

```sh
./experiments/c2-screen-explanation/gradlew -p experiments/ui-perception/android \
  :app:testDebugUnitTest :app:assembleDebug :app:lintDebug
```

Set your existing Android SDK/JDK paths as for the other native labs. Build output
is `android/app/build/outputs/apk/debug/app-debug.apk`. **Build is not permission
to install, enable accessibility or collect a tablet screen.** A separately
authorized synthetic-only device run should:

1. Enable only the clearly described lab service manually.
2. Open its fictional controls; tap Inspect once.
3. Compare numbered boxes and JSON with the three native controls. Canvas text
   must remain absent: Android OCR is deliberately not implemented yet.
4. Test Stop, leaving/locking/resizing the app and rapid screen changes; no late
   image may appear. Denial/disconnection must yield unavailable, not a guess.
5. Disable/uninstall the lab and perform the agreed privacy cleanup checks.

The service checks its own package and active window before and after capture,
rejects sensitive nodes and unsupported magnification/geometry, bounds traversal
and image size, and invalidates pending capture on accessibility changes. A
two-second fence rejects stale/late results. Screenshots are cropped to the
fixture for display; full-window pixels exist transiently in memory. Stop/pause
clears references and recycles bitmaps; secure erasure and OS/vendor retention
are **not proven**. No Internet permission, file export, gesture capability,
automatic enabling, action dispatcher or event-driven screen collection.

Android requires `flagRetrieveInteractiveWindows` for `node.getWindow()`.
This is a broad platform capability: the package event filter is **not** an OS
sandbox. Own-package restriction is enforced in the lab's code; it never
enumerates other windows or reads their text. This distinction must be explained
in any future device consent and independently checked before claiming isolation.

## Modules and limits

### Fresh semantics (version 0.3, owner-reported smoke retest)

Explicit inspection now clears the service's accessibility cache and refreshes
nodes; obsolete/invisible roots and missing children yield unavailable rather
than a silently truncated map. A second fresh read after screenshot capture must
match labels, roles, geometry, enabled/clickable state and window identity.
Mismatch withholds the result, without automatic retries. Existing Stop/time
fences still apply. These reads can increase latency; no tablet timing claim.

An empty stable tree remains possible (including Canvas only), but now explicitly
reports **coverage unknown**, not that the visible screen has no controls.
Two agreeing reads cannot establish completeness or detect every transition.
The reported transient Case 4 failure did not recur in the short
[owner-reported v0.3 sequence](../../docs/10-execution/sessions/2026-09-20-perception-v03-retest.md).
These are defensive fixes for concrete source gaps, not a proven root-cause
resolution. Four ordered inspections and one immediate-Stop prompt had positive
reports; no instrumented timing/geometry or broad reliability claim is made.
Simon reported disabling the service afterward.

### Adverse fixture cases (version 0.2)

Tap the **Next case** button to cycle, then **Inspect fixture once**. Changing
case clears the previous map; rotation starts at Baseline again. The summary
is computed from observed nodes, not from a scene-specific expected answer.
It describes reference checks at capture time, not a live action permit.

| Case | Independent expected observation |
| --- | --- |
| Baseline | Text size: observed-only; Send: not-found; zero unlabeled controls |
| Duplicate labels | Two Text size buttons; Text size: ambiguous, never pick the first |
| Missing label | Drawn plus-shaped button stays unlabeled; unlabeled controls: 1; do not invent Add or Send |
| Disabled control | Text size: unavailable; disabled node remains visible evidence |
| Canvas only | Visible sentence in screenshot, zero semantic elements; Text size and Send: not-found |

These deliberately incomplete/inaccessible fictional controls are test inputs,
not production UI patterns. Canvas/icon meaning still needs visual recognition;
this build does not pretend to have Android OCR. After testing, disable the lab
service. A successful baseline does not substitute for these adverse trials.

- `perception.py`: validation, semantic replay, installed OCR adapter, fusion,
  reference lookup, JSON/HTML/SVG output.
- `make_fixture.py`, `evaluate.py`: real PNG and independent label/absence oracle;
  semantic-only, OCR-only and fused arms, three repeats each.
- Android `NativeSnapshotReader`, `FixtureAccessibilityService`, `CaptureFence`,
  `ScreenMap`, `MainActivity`: actual read-only service, bounded capture and review.
- Python and Java tests: geometry, ambiguity, privacy denial, stale identity,
  conflicts, injection-safe output and cancellation invariants.

Not implemented: arbitrary-app admission, Android OCR/model runtime, visual icon
detector, Compose/custom-canvas completeness, persistent map cache, production
agent wiring, model fallback, actions or continuous capture. Fixture labels do
not establish natural-language screen comprehension. Host files intentionally
persist until the operator removes the chosen output directory; use fictional
data only. Unit tests and APK builds are not device/privacy evidence.
