---
title: "Native voice continuity and readback quality repair"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, voice, evidence]
related:
  - ../task-packets.md
  - ../../02-design/voice-ux.md
record_type: session
session_state: active
record_basis: contemporaneous
agent: GPT-6 Astra with Terra implementation and Sol review
branch: fix/native-voice-continuity
next_action: Repair draft preservation and bounded dictation continuity, then validate the combined artifact.
changed_paths: []
---

# Native voice continuity and readback quality repair

Simon requested source fixes after manually testing installed integration APK
`ec0b389a45e202f4243f0257de7c660cebaa974cff1a51a6dc272b7bbf4132ae`
(source `481b001`, published integration `3483f88`). He reported cases 1
(cancel), 2 (Apply/Restore), and 5 (background) worked great. These are
user-reported observations with no repetition counts, timing, engine identity,
connectivity confirmation or individual capture/output breakdown. They do not
admit C2 or any gate. Case 3 produced audible but robotic speech; Stop/Repeat
subcases were not individually confirmed. Voice input reportedly loses earlier
words and ends after one sentence. No personal transcript is retained.

Root owns MainActivity, conversation and voice continuity files, tests and
scoped docs in the dedicated native-voice-continuity worktree. Terra owns only
speech voice-selection code/tests in native-offline-voice-quality on its own
branch. Sol reviews read-only. Primary/other peer worktrees remain untouched.
No device command, microphone use, install, engine/model download or network
speech is part of this source repair. Keep the explicit foreground 30-second
capture budget, Stop and written fallback; no retry on recognition errors.
Readback quality remains a human/device judgment after source improvements.
