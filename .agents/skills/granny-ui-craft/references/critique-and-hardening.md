# Critique and hardening

Use this reference for a read-only critique or as the final verification pass after an authorized interface edit.

## Inspect before judging

Resolve a concrete source path and, when available, inspect the rendered surface at representative compact, medium and expanded sizes. Separate direct observations from inferred user impact. Automated checks can find structural defects; they cannot establish comprehension, dignity or acceptance.

## Review lenses

Prioritize findings by user impact:

1. **Purpose and hierarchy:** Can a person identify the current goal, status and next available action without learning a feature taxonomy?
2. **Product specificity:** Does the interface express Granny's conversation-led delegation model, or could it be relabeled as any chatbot/dashboard?
3. **Control and truth:** Are Stop, correction, expiry, exact approval, handoff, partial and unknown states visible and semantically distinct?
4. **Accessibility:** Check target size/spacing, contrast, text scaling/reflow, focus order/restoration, keyboard/IME, TalkBack names/states, reduced motion and non-audio equivalence.
5. **Cognitive load and dignity:** Count simultaneous decisions, remove repeated explanations, avoid age caricatures, and keep one question or decision region primary.
6. **Android translation:** Flag web-shaped controls, hover dependence, fixed pixels, stretched tablet layout, system-bar/IME risks and behavior that cannot map to native semantics.
7. **State completeness:** Exercise long names/messages, empty, loading, slow, offline, permission denied/revoked, ambiguous entity, expired preview, interruption, safe failure and uncertain external effect.

## Report contract

Return:

- a one-sentence verdict;
- two or three strengths worth preserving;
- three to five prioritized findings with exact location, impact and a concrete fix;
- missing states or evidence;
- proposed next bounded design action.

Use P0 only when a person cannot complete, understand or stop the task safely; P1 for a major access/control failure; P2 for material friction; P3 for polish. Do not manufacture a numeric score or participant persona result without evidence. A review request stays read-only.
