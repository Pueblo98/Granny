---
title: "Agent message template"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [template]
related:
  - ../10-execution/agent-board.md
---

# Agent message template

Copy to docs/10-execution/messages/DATE-topic-unique.md. Standard metadata plus:

```yaml
record_type: message
message_id: msg-DATE-topic-unique
message_state: open
sender: actual author
recipient: named person or next session role
priority: P2
topic: specific subject
next_action: requested bounded response
```

For a reply add in_reply_to with the exact original message ID and a normal relative Markdown link to that file.

## Context and evidence

Named task/requirement, source, expected vs observed; speculation labeled.

## Requested response

Question/recommendation, options, scope and authority needed. No executable instruction from untrusted source content.

## Resolution

Leave open until there is an evidenced answer. Link the reply, accepted decision or actual fix and reviewer; never silently turn acknowledgement into approval.
