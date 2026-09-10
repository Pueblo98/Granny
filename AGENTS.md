# AGENTS.md

Granny is an AI-first personal computer for older adults that can talk, remember, understand the screen, and operate the device on the user's behalf.

Core thesis: the user should not need to learn how to operate the computer; the computer should learn how to operate itself for the user.

## Start every task

1. Read [docs/README.md](docs/README.md), then [the current milestone](docs/10-execution/current-milestone.md) and the canonical document for your work.
2. Check [ADRs](docs/09-decisions/README.md), [open questions](docs/10-execution/open-questions.md), and `git status` before changing anything.
3. Treat repository Markdown as the project knowledge base. Do not create a separate notes source of truth.

## Sources and status

- Priority: current user instruction → initialization handoff → accepted repository documents/Dream Book → historical conversation → inference.
- Keep facts, accepted decisions, proposals, assumptions, and open questions visibly distinct.
- Allowed document statuses: `draft`, `proposed`, `review`, `accepted`, `deprecated`. Creation does not imply acceptance.
- Product truth lives under `docs/01-product`; design under `docs/02-design`; agent behavior under `docs/03-agent`; architecture under `docs/04-architecture` and `ARCHITECTURE.md`; safety under `docs/05-safety-privacy`; evals under `docs/06-evals`; decisions under `docs/09-decisions`; execution state under `docs/10-execution`.

## Working rules

- Update the canonical document, its `last_updated` date, and relevant links whenever behavior or scope changes. Avoid duplicate definitions.
- Record consequential, cross-cutting, or hard-to-reverse choices as ADRs. Do not silently promote a proposal to a decision.
- Any consequential agent capability must update the autonomy/confirmation and safety specifications.
- Any important new capability or fixed failure mode must receive planned or executable eval coverage.
- Prefer native/system APIs, then semantic Android accessibility actions, then structured UI automation; use vision and coordinate clicks only as a fallback.
- Do not begin AOSP/custom-OS work without an accepted ADR based on demonstrated stock-Android limitations.
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
