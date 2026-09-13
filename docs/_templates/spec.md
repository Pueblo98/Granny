---
title: "Specification / stable requirement template"
status: draft
owner: Simon
last_updated: 2026-09-14
tags: [template]
related:
  - ../README.md
---

# Specification title

Copy this template, set actual title/date/related paths and delete instructional prompts. One canonical owner; no “final/new/v2” duplicate.

## Purpose and scope

State active Stage 1 release, user/job/problem, authority and exclusions. Separate confirmed intent, proposed choice, open decision and unknown evidence.

## Requirement records

For each stable PRD-category ID: release (MVP/App V1/later App/future-stage context), priority (Must/Should/Could/Won't), individual status (confirmed/proposed/evidence-needed/blocked), job/rationale, trigger/preconditions, observable behavior, edge/failure/cancel conditions, testable acceptance. Link UC/J/SCR/CMP, agent/interface/architecture owner, action/data/access policy, planned T-ID, EVAL and RES. Link traceability, not duplicate full rows elsewhere.

## Contract, dependencies and failures

Inputs/outputs/state owner, permissions/trust/data, pre/postconditions, freshness, verification, confirmation, retry/idempotency, Stop/takeover, privacy/retention and access implications. No vague safe/fast/complete claim.

## Decisions and validation

Options/recommendation/rationale/evidence that changes it; consequential ADR if needed. List actual tests/results separately from unrun planned evals and remaining gates.
