---
description: "Scoped QA engineering practices for member-services tests and feature test plans; no execution or approval grant."
applyTo: "tests/**/*,specs/**/test-plan.md"
---

# QA Engineering Best Practices

## Authority and scope

- Follow the constitution, repository instructions, approved feature artifacts,
  reviewed architecture decisions, and applicable C#, security, accessibility,
  and documentation instructions. These rules complement, not replace, them.
- Test strategy is planning-only by default. Editing a test plan does not
  authorize application/test implementation, test execution, load or security
  testing, tool installation, provisioning, deployment, or environment mutation.
  Each execution activity needs separate explicit authorization for its scope
  and target and the applicable feature, security, and environment approvals.
- Keep requirements/spec clarification, architecture exploration, documented
  proposals and proposed ADRs, human review, then Spec Kit plan/tasks in order.
  Early coverage proposals must label assumptions and review blockers. Do not
  invent requirements or approvals, replace Spec Kit artifacts, or add a competing
  `/plan` or `.copilot-tracking` workflow.
- Keep feature test plans in `specs/<feature>/` only when requested, following
  existing documentation approval rules. Do not choose an unrelated feature.

## Test-first, risk-based design

- For authorized implementation, derive acceptance tests from approved criteria
  and observe failure before changing behavior. Every bug fix needs a fail-first
  regression test. Tests belong under `tests/`, following existing conventions.
- Trace every planned scenario to a requirement or explicitly proposed criterion.
  Record risk/priority, level/type, preconditions/data, action/expected outcome,
  manual/automated approach, proposed owner or unassigned, environment, and
  required evidence. Identify dependencies/order, entry/exit criteria, exclusions,
  unresolved decisions, and residual risks.
- Choose the smallest reliable level that proves behavior: business-rule unit,
  Angular component/UI, service/SQL integration, public API contract, and
  end-to-end member journeys/regression. Do not enforce arbitrary pyramid ratios.
  Cover boundaries, negative/error paths, and state transitions as relevant.
- Require contract tests for every public API endpoint: methods, routes, versions,
  request/response shapes, headers, status codes, and error schemas. Preserve
  compatibility and the major-version rule for breaking public interfaces.
  Derive expectations from contracts, not invented endpoints or status codes.
- Preserve the minimum 80% line coverage on business logic. Inspect assertion
  quality and critical branches too; line coverage is not the sole quality
  measure. Static contract-drift and test-gap skills do not prove runtime
  behavior or replace executable contracts and measured coverage.

## Determinism, boundaries, and data

- Name tests for behavior and expected outcome using existing conventions.
  Keep assertions focused on one logical behavior, with exact meaningful
  outcomes rather than truthiness or implementation details.
- Isolate state per test. Control time, seeds, and dependencies; avoid fixed
  sleeps, order dependence, shared mutable fixtures, and live uncontrolled
  services. Use bounded state-based waits and actionable failure diagnostics.
- Mock deliberately at unit boundaries, not everything. Integration tests must
  exercise the real service/SQL boundaries they claim to verify in authorized
  isolated environments. A mocked database is not SQL integration evidence.
- Use minimal synthetic-only fixtures and collision-safe run identifiers.
  Define authorized setup, lifecycle/retention, reset, and cleanup on success and
  failure. Never copy production member records or put PII, account data, secrets,
  tokens, or sensitive payloads in fixtures, logs, traces, screenshots, or reports.
- Do not disable identity, authorization, validation, or scans to make tests pass.
  Cover Entra ID and role boundaries, cross-member isolation, privacy, correlation
  IDs, safe errors, state-change audit events, and PII-free telemetry as relevant.

## Holistic and operational coverage

- Combine automated accessibility checks with manual keyboard and screen-reader
  testing. Use approved criteria, or explicitly propose WCAG 2.2 AA as a review
  baseline; automated checks alone do not prove conformance. Cover the approved
  browser compatibility matrix; unknown targets remain unresolved.
- Include exploratory and UAT scenarios, relevant release smoke, rollback and
  recovery verification, and failure/timeout/retry/idempotency/concurrency risks.
  Tailor coverage and explain exclusions without inventing architecture.
- Measure performance only in separately authorized isolated environments with
  reviewed synthetic volumes and workloads. The constitutional API target is
  p95 **<300 ms** at spec-defined expected peak load. Unknown load remains an
  unresolved blocker, not a fabricated number. Distinguish load, stress, and soak;
  record workload, duration, ramp phases, latency distribution, throughput,
  error rate, environment, and measurement limitations. Never invent benchmarks.

## CI, defects, and truthful evidence

- Use existing approved frameworks and commands; do not install dependencies or
  change CI as a side effect of planning. Preserve required premerge checks,
  including build, tests, SAST, secret and dependency scans, and human/environment
  approvals. Nightly or postmerge suites cannot replace required premerge checks.
- Propose fast feedback and separately scheduled expensive suites where relevant.
  Do not hide flakes with retries, skips, or weakened assertions; record the
  defect, proposed owner, investigation, and any required review of disposition.
- Report defects with impact/severity, minimal reproduction steps, expected versus
  actual result, environment/version, sanitized evidence, proposed owner,
  retest criteria, and regression coverage. Label suspected issues separately.
- Report only checks actually run with their scope, result, and evidence.
  Distinguish passed, failed, blocked, and not run; unexecuted tests never passed.
  Document limitations and required approvals; never self-approve release readiness.

Adapted from [Awesome Copilot's QA Engineering Best Practices](https://github.com/github/awesome-copilot/blob/1683f50e94c9fd489191f73d7c8f7e2bd871bd0c/instructions/qa-engineering-best-practices.instructions.md).
See [attribution and license](../AWESOME-COPILOT-NOTICE.md).
