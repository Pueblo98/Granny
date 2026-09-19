---
title: "Stage 1 Voice and Content Contract"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, voice]
related:
  - product-design-spec.md
  - accessibility.md
  - ../03-agent/autonomy-model.md
---

# Voice and content contract

Proposed behavior for [screen states](product-design-spec.md) and PRD-FR-001/004/007/009/016, PRD-ACC-003/004. Warm, specific adult language; identify as software, do not pretend human emotions, kinship, medical authority or a need for continued conversation.

Context Rooms keep the same voice and personality. Granny names the current room when scope matters, identifies a material cross-room source and never speaks as a separate Kitchen/Fitness specialist. A person can ask any general request from Home or inside a room; unnecessary room selection is not a clarification step.

## Activation, transcription and interruption

In the authorized [conversation browser prototype](browser-prototype.md), Talk presents a deliberately simulated listening/transcript path, never browser speech or microphone capture. Typed supported intents progress directly without a mandatory confirmation of interpretation or category picker. Explicit transcript submission and chat submission request interpretation only; exact external consequences still use their dedicated active preview control. Incidental “yes” is not approval. All live audio/native behavior below remains a production proposal and unrun evidence.

MVP is tap-to-talk, not wake-word or ambient listening. Talk changes to Listening with words/icon and optional short cue; Done listening ends capture. Proposed cap 30s, with gentle no-speech prompt at 10s and typed alternative. Partial text is provisional; final text can be edited. No hidden capture after app exits, lock, Stop or revoked permission. Speaker mute and microphone off are distinct.

Barge-in works only during an explicitly active listening period and must be tested against speaker echo/noise; do not advertise always-listening interruption. Touch Stop is always the independent path for active automation. While reading a preview, Repeat restates it; the user activates Talk to respond. A speech-stop recognizer may cancel but never authorize a consequence from background audio. Unknown/ambiguous approval remains clarification.

Speech follows Android audio focus and user's selected output. When TalkBack is active, prefer its announcements and avoid duplicate TTS. Do not read private message content automatically when private-content speech is off. Neither headphones nor audio output implies consent to capture.

## Content rules

Default progress/result: one or two short sentences, one next step. Explain details on request. Announce meaningful state changes, not every tap, model reasoning or unverified progress. At 5s name the wait; at 15s offer manual continuation; bounded timeout ends work. Repetition never repeats an action.

Use “I found…”, “The app reports…”, “I couldn't verify…” according to evidence. Never “Done” for launch-only success. Distinguish no result from insufficient access. Replace “You did it wrong” with description of current state and recovery. No pet names, “good girl/boy”, faux nurse voice, dementia assumptions or exaggerated praise for ordinary actions.

Names: show original spelling, ask pronunciation if user corrects it, store phonetic preference only with explicit Save choice. Name pronunciation is not identity resolution; a familiar sound cannot choose between two contacts. English is a proposed prototype language only; locale/market selection precedes release copy and language promises.

App V1 communication starts from the person's setup choice, then may quietly tune brevity, pacing, formatting, explanation depth, question frequency and light humor. Adaptation should reduce effort, not announce itself repeatedly. Direct requests such as “be shorter” take effect immediately and outrank learned behavior. Voice/gender presentation, language and access settings do not change silently. Settings exposes the current baseline plus Pause and Reset.

An admitted automatic fact uses a compact, non-blocking receipt such as “Remembered: Rosa is your daughter. Undo.” Do not ask “Should I remember this?” for every allowed fact. Do not display the receipt for a rejected, duplicated or uncertain candidate, and never turn the receipt into action authority.

## Journey copy bank

| Journey/state | Proposed spoken/visible copy | Controls |
|---|---|---|
| J-001 start | “I'm looking for Sophie's photos from yesterday in [app].” | Stop / Take over |
| J-001 ambiguous | “Which Sophie do you mean?” | Named choices / None of these |
| J-001 no match | “I found the conversation, but no photos for that date.” | Change date / Done |
| J-001 uncertain | “I found these photos, but I can't verify when Sophie sent them.” | Continue manually / Done |
| J-002 explain | “This is [app]'s display settings. I can take you back to [verified prior title].” | Back to reading / Explain options / Take over |
| J-002 incomplete | “I can't read enough of this screen to operate it. You can choose a screenshot for me to explain.” | Choose screenshot / Home |
| J-002 auth | “This app is asking you to sign in. I'll stop reading the screen while you do that.” | Open app yourself / Home |
| J-003 preview | “Open this draft to David in [app]: ‘I'll call after dinner’? You'll still need to tap Send there.” | Open this draft / Change it / Cancel |
| J-003 admitted send | “Send David this message in [app]: ‘I'll call after dinner’?” | Send to David / Change it / Cancel |
| J-003 handoff | “The draft is open. Review it there and tap Send.” | Continue manually / Home |
| J-003 verified | “The app reports the message sent to David.” | Done |
| J-003 unknown | “I can't confirm whether it sent. Check the conversation before trying again.” | Review status / Continue manually |
| J-004 V1 helper | “Alice suggests changing text size from [old] to [new]. She cannot see your messages or screen.” | Approve this change / Reject |
| J-004 remote | “Remote assistance isn't available in this version.” | Set up together / Done |
| J-005 media | “[Title] by [artist] is playing in [app].” | Pause / Done |
| J-005 paywall | “This app is asking for a subscription. I haven't started the music.” | Open app yourself / Choose another source |
| J-006 applied | “Granny's text is larger.” | Restore previous size / Done |
| J-006 scope | “Do you mean Granny's text or this app's text?” | Granny / This app / Cancel |
| J-007 declined | “You can still type requests. You can enable the microphone later in Settings.” | Try by touch |
| J-007 memory empty | “There is no saved contact alias for Sophie here.” | Add an alias / Done |
| J-008 call prepared | “Start a call to Sophie using [app]?” | Start call / Change / Cancel |
| J-008 unavailable | “There isn't a supported calling app set up on this tablet.” | Open apps / Home |
| J-009 room entry | “Kitchen brings your recipes and cooking lists closer. You can still ask me anything.” | Browse Kitchen / Ask Granny / Rooms / Home |
| J-009 cross-room source | “I also used your Travel packing list because it mentions the portable blender.” | View source / Exclude this source |
| J-009 delete room | “Delete the Kitchen room? Your recipes and lists will stay available in Unfiled unless you choose a separate data deletion.” | Delete room only / Archive / Cancel |
| Any interrupted | “I stopped. [Precisely state completed or uncertain effect.]” | Continue manually / Review status |
| Any expired preview | “Please review this again before I continue.” | Renew preview / Change it / Cancel |
| Any offline | “The connection is unavailable. You can still change Granny's settings or use the tablet yourself.” | Settings / Continue manually |
| Restricted request | “I can't make payments for you. You can open your banking app yourself.” | Home / user-chosen manual route |

Sample statements with app/title values may only render values supported by current evidence. Do not mechanically use the success row when the adapter reports unknown.
