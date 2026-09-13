# AGENTS.md

Granny is the temporary project codename for an AI-first personal computer for
older adults that can talk, remember, understand the screen, and operate the
device on the user's behalf. Do not treat `Granny` as the accepted public
product, company, companion, or wake-word name; naming remains an active brand
decision.

Core thesis: the user should not need to learn how to operate the computer; the computer should learn how to operate itself for the user.

## Active product stage — hard scope gate

Granny has three long-term stages:

1. **Stage 1 — Android tablet app:** an installable application running on
   stock Android tablets. This is the only active stage.
2. **Stage 2 — Granny OS:** a future Android/AOSP fork providing deeper system
   ownership and reliability.
3. **Stage 3 — Granny hardware:** a future dedicated tablet plus voice
   dock/base with microphones, speaker, charging, and physical controls.

Until Simon explicitly changes the active stage, all product planning, design,
research, architecture, implementation, and evaluation must serve **Stage 1**.
Stage 2 and Stage 3 documents are long-term context only. Do not treat their
capabilities as Stage 1 requirements, start OS/AOSP or hardware work, expand a
task to prepare those stages, or reject a viable Stage 1 design merely because
it does not implement the final OS/hardware vision.

When a source mixes stages, extract only the Stage 1 implications and label
everything else `future-stage context`. If stage ownership is genuinely
ambiguous and would materially change the result, record an open question
instead of guessing.

## Start every task

1. Read [docs/README.md](docs/README.md), then [the current milestone](docs/10-execution/current-milestone.md) and the canonical document for your work.
2. Check [ADRs](docs/09-decisions/README.md), [open questions](docs/10-execution/open-questions.md), and `git status` before changing anything.
3. Treat repository Markdown as the project knowledge base. `docs/` is the
   Obsidian vault; do not create another notes source of truth.

## Sources and status

- Priority: current explicit user instruction → accepted ADRs and accepted
  canonical repository documents → initialization handoff → Dream Book as
  long-term vision → historical planning conversation → proposed/draft
  documents → current primary-source research → inference.
- Keep facts, accepted decisions, proposals, assumptions, and open questions visibly distinct.
- Allowed document statuses: `draft`, `proposed`, `review`, `accepted`, `deprecated`. Creation does not imply acceptance.
- Product truth lives under `docs/01-product`; design under `docs/02-design`; agent behavior under `docs/03-agent`; architecture under `docs/04-architecture` and `ARCHITECTURE.md`; safety under `docs/05-safety-privacy`; evals under `docs/06-evals`; decisions under `docs/09-decisions`; execution state under `docs/10-execution`.

## Working rules

- Update the canonical document, its `last_updated` date, and relevant links whenever behavior or scope changes. Avoid duplicate definitions.
- Record consequential, cross-cutting, or hard-to-reverse choices as ADRs. Do not silently promote a proposal to a decision.
- Any consequential agent capability must update the autonomy/confirmation and safety specifications.
- Any important new capability or fixed failure mode must receive planned or executable eval coverage.
- Prefer native/system APIs, then semantic Android accessibility actions, then structured UI automation; use vision and coordinate clicks only as a fallback.
- Do not begin Stage 2 AOSP/custom-OS or Stage 3 hardware work without an
  explicit user instruction activating that stage and the required accepted
  technical ADRs.
- Preserve direct touch operation, visible agency, verification, recovery, and understandable confirmation.
- Never invent user research, test results, approved design values, or regulatory claims.
- Do not commit secrets, credentials, signing materials, personal user data, or machine-specific Obsidian state.

## Git workflow

- `main` is the protected integration branch. Do normal work on a short-lived branch named `feature/<topic>`, `fix/<topic>`, `docs/<topic>`, or `chore/<topic>`.
- Before editing, run `git status --short --branch` and review the current milestone. Preserve unrelated changes and never rewrite shared history.
- Keep commits focused and use an imperative summary such as `Define MVP photo workflow`. Do not mix unrelated cleanup into a task commit.
- Before committing, inspect `git diff`, run relevant validation, and update canonical docs, ADRs, safety policy, and eval coverage when behavior changes.
- Push the task branch and merge through a reviewed pull request. Do not force-push `main`, bypass failed checks, or commit directly to `main` after repository bootstrap unless the user explicitly requests an exceptional hotfix.
- Never commit API keys, GitHub tokens, credentials, signing materials, `.env` files, personal user data, generated build output, or volatile Obsidian workspace state.
- After merge, synchronize local `main` with a fast-forward-only pull and remove the completed local branch when safe.

## Finish every task

1. Validate the change in proportion to risk, including links and affected evals.
2. Update [current milestone](docs/10-execution/current-milestone.md), [backlog](docs/10-execution/backlog.md), [open questions](docs/10-execution/open-questions.md), or an ADR when the work changes project state.
3. Leave the repository so the next agent can understand what changed without reading chat history.
