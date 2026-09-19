---
title: "Shared conversation state surfaces"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [design, interaction, conversation, states, rooms]
related:
  - mockups/2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md
  - conversation-first-plan.md
  - context-rooms.md
  - product-design-spec.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - mockups/2026-09-20-shared-state-pack/iteration-1/README.md
  - ../09-decisions/ADR-0013-bounded-interface-composition.md
---

# Shared conversation state surfaces

Simon accepted this UX/UI direction on 2026-09-20 after reviewing the first
[shared state pack](mockups/2026-09-20-shared-state-pack/iteration-1/README.md).
The mockups define the important information, hierarchy and controls for each
state. **They do not define seven new pages or require the whole screen to be
replaced by the pictured composition.**

## The central rule

Home or the current Context Room remains the place the person is in. A shared
conversation state temporarily grows from the stable bottom composer or appears
as one task surface directly above it:

```text
Home or current Room
  ├─ existing room identity, atmosphere and useful content remain
  └─ stable bottom conversation area
       ├─ normal Round composer
       ├─ expanded composer state, or
       └─ one temporary task surface above the composer
```

If the person starts Talk in Kitchen, they remain in Kitchen. Kitchen does not
turn into a generic Listening page. Its written room name, background and
relevant content remain visible wherever space allows; the bottom composer
expands upward to show Listening and Heard so far. When the state ends, that
surface collapses and restores the same Kitchen position and context.

The same state components work on Home and in every Room. They belong to the
one Granny assistant and never create a Kitchen assistant, Fitness assistant or
separate room workflow.

Keeping the Room visible does not mean every background control stays active.
A modal consequence surface may contain focus until the person approves,
changes or cancels it. The underlying place is preserved rather than reset or
replaced.

## What the mockups control—and what they do not

The mockups control:

- the exact state name and the few pieces of copy that prevent confusion;
- the order of the important information;
- which controls must be immediately available;
- the distinction between ordinary, active, prepared and unknown states;
- the stable meaning and relative location of Talk, Send and Stop.

They do not require:

- a dedicated route or full-page destination for each state;
- the background Home or Room to disappear;
- the exact pixel positions, panel height or amount of visible background in
  the raster;
- every state to appear in one linear sequence;
- decorative room art to remain visible when space is needed for text.

At ordinary tablet sizes, prefer an anchored composer expansion or one
bottom-connected task surface. At narrow widths, with the keyboard open or at
large text, a safety-critical surface may temporarily occupy most of the
viewport and scroll. That is responsive presentation of the same state—not a
new product page. Returning or dismissing it restores the previous Home/Room
scroll and focus when still valid.

A large heading shown near the top of a raster can become the heading inside
the expanded bottom surface in implementation. Its hierarchy matters; its
screen coordinates do not.

Do not use a scrim for ordinary listening, transcript editing or results. A
renderer-owned scrim may be used only when a consequence preview needs modal
focus; it must not hide the current Home/Room identity completely or imitate an
Android/system dialog.

“Overlay” in this document means an in-app compositional layer inside Granny.
It does not claim that Granny can draw a universal Android overlay above other
apps; that remains dependent on separate platform and device evidence.

## The seven shared states

### 01 — Listening

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/01-listening.png)

**Form:** the Round composer expands upward from the bottom. Home or the Room
remains visible above it.

**Must show:**

- **Listening** — written state, not microphone icon alone;
- **Say what you would like to do.** — short instruction;
- **Heard so far** — persistent label proving that the words are provisional;
- the live provisional words and a visible caret;
- **Done listening**, **Cancel** and **Type instead**.

**Important behavior:** Talk has already been started explicitly. Type instead
ends listening and moves into typing without changing room. Do not add Send or
Stop to this capture state, announce every partial word, or suggest ambient
listening.

### 02 — Editable transcript

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/02-editable-transcript.png)

**Form:** the expanded composer becomes an editable review surface in the same
bottom position.

**Must show:**

- **Check what I heard**;
- the editable request with persistent **Request** label and visible caret;
- **This asks Granny to understand the request. It does not send anything.**;
- **Use this request**, **Listen again** and **Cancel**.

**Important behavior:** Use this request submits words for interpretation only.
It is not permission for an external action. The person stays on the same Home
or Room canvas.

### 03 — Clarification

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/03-which-david.png)

**Form:** one temporary choice surface appears above the compact composer. The
current Room/Home identity remains visible.

**Must show:**

- one direct question, such as **Which David?**;
- one short instruction, such as **Choose the person you mean.**;
- the current request so the person does not need to remember it;
- two to five broad labeled choice rows with the minimum useful
  differentiator;
- **None of these**, **Edit request** and **Cancel**;
- a compact answer composer so a person can type or talk instead of choosing a
  row.

**Important behavior:** each row is one semantic target. Do not guess an
identity, rely on an avatar, preselect a person or navigate to a generic form.

### 04 — Exact consequence preview

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/04-exact-draft-preview.png)

**Form:** one rectangular review sheet sits above the stable compact composer.
It may grow taller or become a focused scrollable sheet for long content, but
it remains a temporary layer over the current Home/Room.

**Must show:**

- **Check the draft** or the equivalent specific task heading;
- what has and has not happened yet;
- exact target, distinguishing detail, destination, content and consequence;
- one specific primary action, such as **Open this draft**;
- **Change it**, **Cancel** and **Repeat**.

**Important behavior:** the consequence appears before the action. No action is
preselected. Send in the composer can request a change, but cannot approve the
preview. Sensitive content is a private region.

### 05 — Active task and Stop

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/05-active-task-stop.png)

**Form:** one activity surface appears above the composer. The composer stays
anchored but changes to its active treatment; Stop occupies Send's stable
location.

**Must show:**

- a concrete activity heading, such as **Opening the draft**;
- **Goal**;
- **Latest verified step**;
- **Current step** and a plain wait reason when applicable;
- **Take over** and **Repeat status** when relevant;
- a written **Stop** with the stop-square symbol.

**Important behavior:** Stop uses reserved red and remains the strongest escape.
Do not show Send at the same time, invent a percentage or expose internal model
reasoning. The room behind the task stays the current room; active work does not
silently navigate the person elsewhere.

### 06 — Prepared, not sent

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/06-prepared-not-sent.png)

**Form:** a compact outcome surface appears above the restored normal composer.
It should feel like a result in the current conversation, not a success page.

**Must show:**

- the concrete result heading, such as **Draft opened**;
- the unmistakable outcome **Prepared — not sent**;
- **What Granny verified**;
- **What Granny did not do**;
- **Next step**;
- **Continue manually** and **Done**.

**Important behavior:** never imply sent, delivered or fully completed. Done
dismisses the result; it does not repeat the action. Continue manually is a
handoff, not evidence of a later result.

### 07 — Unknown outcome

[Reference image](mockups/2026-09-20-shared-state-pack/iteration-1/07-unknown-outcome.png)

**Form:** the same outcome position as 06, with candid uncertainty rather than
an alarming error page. The normal composer remains available for a genuinely
new request.

**Must show:**

- a plain heading such as **I can’t confirm whether it sent**;
- the written label **Unknown outcome**;
- **Known**, **Unknown** and **Next step**;
- **Granny will not retry this message automatically.**;
- **Review status**, **Open app yourself** and **Done**.

**Important behavior:** do not offer Retry unless the executor independently
marks retry safe. Do not use success styling, failure-red treatment or a toast
in place of the persistent result.

## Shared placement and continuity rules

- The stable composer remains attached to the bottom edge or normal document
  flow when reflow requires it. A state grows from that region rather than
  appearing as an unrelated floating card.
- Only one temporary task surface competes for attention at a time. Do not stack
  clarification, preview, progress and result cards.
- Room name, scope and a recognizable portion of the Room should remain visible
  when practical. Room decoration can be covered or removed before essential
  state text is compressed.
- Switching Rooms, going Home or opening another destination while listening or
  acting uses the appropriate Cancel/Stop/interruption behavior first. A state
  never follows silently into a different context.
- Finishing, cancelling or dismissing restores the same underlying place,
  scroll position and sensible focus unless that content became invalid.
- Prepared and Unknown are alternative result branches. The seven examples are
  a reusable state library, not a mandatory seven-step wizard.

## Visual and accessibility boundary

Use the selected Harbour Blue roles and Round composer. Ordinary state surfaces
are white with Harbour Blue outlines on Linen; red is reserved for Stop or real
destructive treatment. Essential meaning is always written, never supplied by
color, animation, room art or icon alone.

The first focus enters at the state heading or changed field, follows the
reading order, reaches the primary decision and escape actions, then returns to
the originating control when dismissed. State changes are announced once.
Controls must support the target sizes in [accessibility](accessibility.md), and
the renderer must stack content before shrinking type or clipping actions.

The raster pack is UX/UI reference only. It does not prove Android overlay
feasibility, exact dp/sp, TalkBack order, keyboard/switch behavior, microphone
capture, Stop effectiveness, independent outcome verification, 200% reflow or
older-adult comprehension. An implementation can look different while still
conforming if it preserves the state’s required information, hierarchy,
controls, semantics and underlying Home/Room continuity.

The active frontend implementation handoff is the
[shared-state implementation metaprompt](mockups/2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md).
