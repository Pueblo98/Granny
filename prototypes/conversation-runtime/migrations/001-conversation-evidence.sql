CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  title TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('active', 'archived', 'deleted')),
  mode TEXT NOT NULL CHECK (mode IN ('live', 'offline_test', 'fictional_sample')),
  current_place_kind TEXT NOT NULL CHECK (current_place_kind IN ('home', 'room')),
  current_room_id TEXT,
  current_room_name TEXT,
  runtime_session_id TEXT,
  fixture INTEGER NOT NULL DEFAULT 0 CHECK (fixture IN (0, 1)),
  CHECK ((current_place_kind = 'home' AND current_room_id IS NULL) OR current_place_kind = 'room')
) STRICT;

CREATE UNIQUE INDEX one_active_nonfixture_conversation
ON conversations(state) WHERE state = 'active' AND fixture = 0;

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL CHECK (ordinal > 0),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  provider_event_id TEXT UNIQUE,
  idempotency_key TEXT UNIQUE,
  payload_hash TEXT,
  state TEXT NOT NULL CHECK (state IN ('pending', 'completed', 'stopped', 'failed', 'unknown')),
  content_kind TEXT NOT NULL CHECK (content_kind IN ('user_text', 'assistant_text', 'verified_action_result', 'status')),
  in_reply_to_message_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
  UNIQUE (conversation_id, ordinal)
) STRICT;

CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  fixture INTEGER NOT NULL DEFAULT 1 CHECK (fixture IN (0, 1))
) STRICT;

CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  local_id TEXT NOT NULL,
  label TEXT NOT NULL,
  UNIQUE (room_id, local_id)
) STRICT;

CREATE TABLE canonical_sources (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  provenance TEXT NOT NULL,
  sensitivity TEXT NOT NULL CHECK (sensitivity IN ('normal', 'private', 'restricted')),
  current_revision_id TEXT,
  availability TEXT NOT NULL CHECK (availability IN ('available', 'deleted', 'unavailable')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE source_revisions (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES canonical_sources(id) ON DELETE RESTRICT,
  revision_number INTEGER NOT NULL CHECK (revision_number > 0),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  provenance TEXT NOT NULL,
  integrity_sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('available', 'deleted', 'unavailable')),
  UNIQUE (source_id, revision_number)
) STRICT;

CREATE TABLE source_memberships (
  source_id TEXT NOT NULL REFERENCES canonical_sources(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  PRIMARY KEY (source_id, room_id, collection_id)
) STRICT;

CREATE TABLE retrieval_runs (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL UNIQUE,
  room_id TEXT,
  selector_version TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('selected', 'completed', 'failed', 'stopped', 'unknown')),
  created_at TEXT NOT NULL,
  UNIQUE (conversation_id, user_message_id)
) STRICT;

CREATE TABLE retrieval_decisions (
  retrieval_run_id TEXT NOT NULL REFERENCES retrieval_runs(id) ON DELETE CASCADE,
  source_id TEXT REFERENCES canonical_sources(id) ON DELETE SET NULL,
  source_revision_id TEXT REFERENCES source_revisions(id) ON DELETE RESTRICT,
  decision TEXT NOT NULL CHECK (decision IN ('selected', 'excluded', 'private', 'cross_scope', 'unavailable', 'unknown')),
  reason_code TEXT NOT NULL,
  score INTEGER,
  selection_order INTEGER,
  PRIMARY KEY (retrieval_run_id, source_id),
  CHECK ((decision = 'selected' AND source_revision_id IS NOT NULL AND selection_order IS NOT NULL) OR decision != 'selected')
) STRICT;

CREATE TABLE provider_runs (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  retrieval_run_id TEXT NOT NULL REFERENCES retrieval_runs(id) ON DELETE CASCADE,
  runtime_session_id TEXT NOT NULL,
  request_id TEXT NOT NULL UNIQUE,
  provider_event_id TEXT UNIQUE,
  model TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('live', 'offline_test')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'stopped', 'failed', 'unknown')),
  error_code TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  assistant_message_id TEXT REFERENCES messages(id) ON DELETE SET NULL
) STRICT;

CREATE TABLE message_evidence (
  assistant_message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  source_revision_id TEXT NOT NULL REFERENCES source_revisions(id) ON DELETE RESTRICT,
  retrieval_run_id TEXT NOT NULL REFERENCES retrieval_runs(id) ON DELETE CASCADE,
  citation_order INTEGER NOT NULL CHECK (citation_order > 0),
  chunk_reference TEXT,
  PRIMARY KEY (assistant_message_id, source_revision_id),
  UNIQUE (assistant_message_id, citation_order)
) STRICT;

CREATE TABLE conversation_source_preferences (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES canonical_sources(id) ON DELETE CASCADE,
  preference TEXT NOT NULL CHECK (preference IN ('selected_next', 'excluded_future')),
  effective_at TEXT NOT NULL,
  effective_after_message_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
  consumed_at_message_id TEXT REFERENCES messages(id) ON DELETE SET NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  PRIMARY KEY (conversation_id, source_id)
) STRICT;

CREATE TABLE action_history (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('completed', 'stopped', 'failed', 'unknown')),
  evidence_grade TEXT NOT NULL CHECK (evidence_grade IN ('verified', 'unverified', 'unknown')),
  code TEXT NOT NULL,
  runtime_session_id TEXT,
  request_id TEXT UNIQUE
) STRICT;

CREATE INDEX messages_by_conversation ON messages(conversation_id, ordinal);
CREATE INDEX retrieval_by_message ON retrieval_runs(user_message_id);
CREATE INDEX evidence_by_message ON message_evidence(assistant_message_id, citation_order);
CREATE INDEX conversations_by_updated ON conversations(fixture, state, updated_at DESC);

PRAGMA user_version = 1;
