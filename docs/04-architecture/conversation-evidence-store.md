---
title: "Local conversation and evidence store — synthetic prototype v1"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [architecture, prototype, conversations, evidence, sqlite]
related:
  - conversation-runtime-contract.md
  - system-overview.md
  - ../02-design/context-rooms.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../09-decisions/ADR-0017-local-conversation-evidence-store.md
  - ../10-execution/sessions/2026-09-20-conversation-evidence-store.md
---

# Local conversation and evidence store

This contract describes the implemented **synthetic browser prototype**, schema version 1. It is not the production Android data design and does not admit personal data. Its central invariant is:

> An assistant message displays citations by querying evidence-use records for that exact assistant message ID. Historical citations are never inferred from current Room contents, accumulated conversation sources or a mutable selected-source value.

## Runtime boundary and storage choice

The loopback Node backend owns a fixed SQLite database under the operating system temporary directory. The CLI server uses `${tmpdir()}/granny-conversation-runtime/conversations-v1.sqlite3`; tests inject `:memory:` or a test-owned temporary file. The browser cannot provide a path or issue SQL. The backend exposes narrow same-origin JSON methods and keeps API keys server-side.

SQLite is the smallest durable choice that matches the existing Node backend: Node 26 supplies `node:sqlite`, so no new dependency is required; transactions, foreign keys, unique constraints and numbered migrations are built in; and the relational ownership maps plausibly to a later Android Room/SQLite design. That mapping remains proposed and must be separately designed and admitted.

Rejected alternatives:

- IndexedDB would split authority between the browser and the existing backend, complicate provider-run idempotency, and map poorly to the intended Android authority boundary.
- JSON/file storage would require custom locking, transactions, migrations and referential-integrity behavior.
- Continued process/tab memory would lose conversations on restart and preserve the current ownership bug.

## Schema v1 and ownership

`001-conversation-evidence.sql` creates these explicit owners:

| Record | Ownership and purpose |
|---|---|
| `conversations` | Stable UUID, timestamps, display title, active/archived/deleted state, live/offline-test/fictional-sample mode and optional current place. A Room is metadata on one assistant conversation, not another assistant. |
| `messages` | Stable UUID, conversation foreign key, exact sequence, user/assistant/action-result role, content, time, runtime/provider identities and pending/completed/stopped/failed/unknown state. Verified action results have their own role. |
| `rooms`, `collections`, `canonical_sources`, `source_memberships` | Canonical fictional organization and current availability/sensitivity state. Membership does not duplicate the source. |
| `source_revisions` | Immutable bounded title/content/excerpt, provenance and integrity metadata for one canonical source revision. |
| `retrieval_runs`, `retrieval_decisions` | One user-message-triggered request, conversation/Room scope, selector/policy versions, admitted revision decisions and bounded reason/score metadata. Rejected private content is not copied into diagnostics or decision records. |
| `message_evidence` | Exact assistant message, exact immutable revision, retrieval run, citation order and optional bounded chunk/excerpt reference. The composite uniqueness and foreign keys prevent duplicate or cross-owner attachment. |
| `conversation_source_preferences` | Future-only selected/excluded source state with effective boundary. It is separate from historical evidence. |
| `provider_runs` | Request/event identity, model/mode, status/error code and idempotency key. It excludes keys and raw provider errors. |
| `action_history` | Minimal consequential task result and evidence grade, distinct from transcript messages. Assistant prose never proves that an action happened. |

The repository reconstructs provider context from canonical stored revisions after conversation, Room, availability, sensitivity and future-preference checks. Browser-supplied source text is never the provider-context authority. Retrieval decisions are recorded before provider work. Only the provider's structured `usedSourceIds` declaration may become evidence links; unknown, rejected or cross-scope IDs fail the turn. The completed message and evidence links commit in one transaction, then citations are read back through `fetchMessageCitations(assistantMessageId)`.

## Narrow API

The same-origin server provides bounded operations corresponding to:

- create/list/get conversations;
- append and complete one runtime turn through the typed runtime command path;
- fetch citations for one exact assistant message;
- select a source for the next reply or exclude it from future replies;
- clear archived history or reset the synthetic store.

There is no query endpoint, file-path parameter, source-content mutation endpoint or client-controlled database location. Runtime request IDs, provider-event IDs and citation uniqueness make replayed events idempotent. A stale response must match the same retrieval run, conversation and user message before it can create an assistant message.

## Conversation and source lifecycle

- Starting a conversation creates a fresh UUID and runtime session, archives the prior active nonfixture conversation and keeps its transcript. The title is derived once from the first user message, bounded to 54 characters. Prior Today rows are read-only in this slice; selecting one loads its exact conversation ID.
- Two deterministic fictional samples use fixed UUIDs and `fictional-sample` mode. They never resolve to the active live/offline conversation.
- Page reload reconnects the UI to the active stored conversation. Graceful backend shutdown closes SQLite; restarting the CLI server reopens the same temporary database. Runtime permits, pending work and MCP draft authority are never restored.
- Source selection and exclusion affect later retrieval. They do not insert a citation or rewrite earlier messages.
- A historical citation opens its exact immutable revision. If the canonical source is deleted or unavailable, the title, revision, provenance and integrity receipt remain while stored content/excerpt is redacted from the API response. A later source revision never silently replaces evidence previously used.
- Clear history deletes archived nonfixture conversations and their dependent transcript/evidence rows while retaining the active conversation and labelled fictional samples. Full reset deletes every nonfixture conversation and action-history row, restores deterministic fixture source state, and creates a fresh offline-test conversation.
- Existing tab/process-memory chats are discarded rather than fabricated as migrated data because they were never durable records.

## Bounds, startup and failure

The synthetic store retains at most 20 nonfixture conversations, 200 messages per conversation and 100 action-history rows. Creation prunes the oldest archived nonfixture conversations. This is an implementation bound, not a production retention policy or deletion guarantee. OS temporary-file cleanup, backup behavior and at-rest encryption are not claimed.

Startup creates a missing database, applies numbered migrations transactionally, validates foreign keys and seeds deterministic fictional sources/samples idempotently. Schema version is recorded with SQLite `user_version`. A database newer than this runtime fails with `unsupported_schema`; corruption/open/migration failure produces `database_unavailable`. The server does not fall back to global browser state.

For this synthetic prototype, the preferred recovery is the bounded full-reset API. A clean file rollback requires stopping the server, removing `conversations-v1.sqlite3` plus any `-wal`/`-shm` companions from the fixed temporary directory, and restarting so schema v1 and fixtures are recreated. Copy the file first only when test diagnosis needs it; it contains synthetic transcripts. No downgrade migration or production backup/restore promise exists.

## Production boundary

This implementation proves a local relational ownership model and deterministic browser/backend behavior. It does not establish Android Room migrations, device encryption, backup exclusion, durable deletion, multi-process safety, production retention, crash recovery for consequential actions, or suitability for personal information. Those remain product, privacy, architecture and device-evidence decisions.
