# Granny — brand guide for the design system

**Status: proposed. Nothing in this guide is accepted.**

Generated from the Granny repository at source revision
`cc97e48420e2679f5b39c700052f751f6d84fb6e` (2026-09-17). Canonical ownership
stays in the repository; this guide restates it for whoever builds with the
system and introduces no product rule of its own.

| Subject | Canonical owner in the repository |
|---|---|
| Brand foundation, the four identity territories | `docs/02-design/brand-and-visual-identity.md` |
| Semantic component contracts | `docs/02-design/design-system.md` |
| Accessibility targets | `docs/02-design/accessibility.md` |
| Voice and content | `docs/02-design/voice-ux.md` |
| What may execute, and what must be confirmed | `docs/05-safety-privacy/action-policy.md` |
| Bounded composition | `docs/09-decisions/ADR-0013-bounded-interface-composition.md` |
| Token maturity and promotion | `design-tokens/README.md` |

---

## What this product is

**Purpose.** Return practical agency to people who want the outcome of
computing without its interface burden.

**Promise.** Ask for something useful, understand what happens, stay in charge.

**Central idea.** Capability made approachable. The computer takes on the
navigation work; the adult remains the author of the task.

It is an ordinary stock-Android tablet app for independent older adults with
differing access needs. It is **not** a medical service, a caregiver-monitoring
dashboard or a replacement operating system.

"Granny" is a temporary codename. There is no accepted public name and no
wordmark. Do not invent one, and do not use grandmother imagery, a robot
mascot, or any age caricature.

---

## The five qualities, and what each one costs

A brand quality only means something if it rules something out. Each row names
what the system gives up to hold the quality.

| Quality | How the system expresses it | What it refuses |
|---|---|---|
| **Capable and candid** | Every outcome carries its evidence level. Prepared, complete and unknown are visibly different results. | A success tone for an unconfirmed effect. There is no success toast anywhere in this system. |
| **Respectful** | Adult language and adult proportions. The person approves each consequence. | Praise for ordinary actions, diagnosis, patronising simplification, a helper who can act without approval. |
| **Clear** | Strong hierarchy, generous spacing, labels that wrap instead of truncating. | Minimalist ambiguity. An icon is never the whole control. |
| **Warm** | Patient wording, comfortable rhythm, thoughtful colour. | Faux intimacy, pet names, childish shapes, a gendered assistant persona. |
| **Steady** | One component anatomy, predictable focus, restrained motion. | Restless layout, engagement mechanics, anything that moves to attract attention. |

---

## Visual principles

**1. Private content is the centre; nothing decorates over it.**
A message being previewed, a photo, a contact's name — these are the point of
the screen. Accents, illustration and colour stay at the edges.

**2. Group with spacing and rules, not with stacks of cards.**
Elevation is reserved for a surface that genuinely floats above another. A
shadow never means "this is tappable".

**3. Colour reinforces a label; it never replaces one.**
Every state has a word, an icon or a boundary as well as a hue. The system is
readable in greyscale, and it must be.

**4. The accent is punctuation.**
The decorative accent (`accent.decorative`) appears as a small edge or mark. It
is never a warning background, never a default action fill, and never carries
essential text that misses the contrast target. This is enforced structurally
in `design-tokens/validate-contrast.mjs`, not merely stated here.

**5. Consequence is proportional, and sending is not danger.**
The destructive role is for deletion and removal. Sending a message is the
primary role with exact wording. Red is not the colour of "important".

**6. Controls appear when they are relevant.**
This catalogue contains many components. A screen shows the ones its current
state needs. A catalogue is not a layout.

---

## Do and don't

| Do | Don't |
|---|---|
| "Send to David" | "Confirm", "OK", "Yes" |
| "I can't confirm whether it sent. Check the conversation before trying again." | "Done!" when nothing was verified |
| "The connection is unavailable. You can still change Granny's settings." | "Something went wrong" |
| Show the whole recipient and the whole message body | Truncate either, at any text size |
| Name the categories being deleted | "Delete 12 items" |
| Let a long label wrap and the button grow | Shrink the text or clip the label |
| State why a control is unavailable, next to it | Grey it out silently |
| Keep Stop live at all times | Disable Stop while something is in flight |
| One primary action per decision region | A row of equally weighted buttons |
| A flat panel separated by space and a rule | A floating card inside a floating card |
| An icon beside its word | An icon-only essential action |

### Specifically ruled out by Simon's 2026-09-17 review

The browser prototype was rejected as **too button-heavy and generically
AI-styled**. That means, concretely:

- no AI gradients, sparkles, orbs or glass effects;
- no repeated floating cards;
- no pill-shaped decoration on ordinary labels;
- no dense collections of buttons competing for attention;
- no confetti, streaks, or engagement mechanics of any kind.

The older brand text describing a Home "grid of labelled shortcuts" does **not**
override this. This system deliberately fixes no Home composition; that remains
open under OQ-14.

---

## Voice

One or two short sentences, then one next step. Explain more on request.

Match the verb to the evidence: "I found…", "The app reports…", "I couldn't
verify…". Never "Done" for a launch-only success. Distinguish *no result* from
*insufficient access*.

Describe the current state rather than a mistake: replace "you did that wrong"
with what is true now and what can be done next.

Names keep their original spelling. Ask about pronunciation only if the person
corrects it.

---

## Typography

Open Day proposes **Atkinson Hyperlegible Next**; Bright Signal proposes
**Manrope** with **Source Sans 3**. All three are bundled under the SIL Open
Font License 1.1 — there is no remote font dependency.

Verified from the font binaries themselves, not from their metadata:

| Family | Weight axis | Mapped codepoints | Script coverage |
|---|---|---|---|
| Atkinson Hyperlegible Next | 200–800 | 362 | Latin and Latin-1 only. **No Cyrillic, Greek, Arabic, Devanagari or CJK.** |
| Manrope | 200–800 | 678 | Latin, partial Greek and Cyrillic |
| Source Sans 3 | 200–900 | 1615 | Latin, partial Greek and Cyrillic |

**This is a real constraint on the working theme.** Atkinson covers the
proposed English prototype language and nothing beyond Latin. Any non-Latin
locale falls back to the platform's Noto faces, with different metrics. Locale
and market selection has to precede any language promise.

All three are variable fonts whose default instance is **not** 400 (Manrope and
Source Sans 3 default to 200), so every type role sets an explicit weight.

Sizes are proposed Android sp: display 32/40, heading 28/36, body-large 24/34,
body 20/30, button 20/28, status 20/28, supporting 18/26. Body is the reading
size. Nothing caps the font size.

---

## Accessibility targets

Granny's internal targets are stricter than WCAG AA. They are audit targets,
not a conformance claim.

- Essential text, including every action label and status word: **7:1**
- Supporting text: **4.5:1**
- Essential control boundaries and focus: **3:1**
- Targets **56dp**; primary, Stop and consequential actions **64dp**
- **12dp** between distinct primary targets
- Focus ring **3dp** with **2dp** separation, never clipped

92 colour pairs are measured across both themes in
`design-tokens/build/contrast-report.json`, including flattened composites. 40
of them are states this build proposed and measured directly — no value
inherits a result from the brand document.

Two design decisions came out of those measurements rather than preceding them:

- **Status blocks carry no tinted fill.** Every tint dark enough to read as a
  block pushed the status word below 7:1. Outcome blocks use a coloured rule on
  the panel surface instead, where the words hold 7.6–8.6:1.
- **A pressed secondary button inverts** rather than tinting. The tinted
  alternative measured 5.93:1 for the label.

---

## What is proposed, and what that means

Everything. The palette, the typefaces, the radii, the motion durations, the
icon shapes and the component anatomy are all proposed. Only Simon can accept
any of it, and a polished artefact never confers acceptance.

Two things carry more weight than the rest, because they follow accepted
decisions rather than taste: the **bounded composition boundary** (ADR-0013,
accepted 2026-09-17) and the **consequence-specific approval model** in the
action policy. Both are encoded in the components, not just described here.

**Dark mode is out of scope for v1.** A dark palette is not an inversion of
this one and is not derived here.

### What this system does not decide

- The Home composition, and whether any module persists there — open under OQ-14.
- App screens, navigation and end-to-end product design — a separate session.
- The public name, the wordmark and any logo.
- The final identity territory.
- Anything about Android implementation. React here is a transfer format for
  design review, not a framework decision.

### What has not been tested

Browser evidence exists: 29 automated checks of computed geometry, colour,
focus, keyboard reachability and reflow in Chromium, recorded in
`design-tokens/build/specimen-checks.json`.

Not run, and not claimed: TalkBack, switch access, physical dexterity, native
font and IME behaviour, any physical tablet, and any participant study. CSS
pixels are not Android dp or sp. Nothing here is an accessibility-conformance
claim.
