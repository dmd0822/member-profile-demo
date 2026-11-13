# Copilot Coding Agent Instructions

This project uses Spec Kit, not Squad. Work directly from the issue, approved
feature artifacts, and project constitution. No Squad roster, routing, labels,
coordinator canaries, or role impersonation is required.

## Project Context and Startup

Before starting work:

1. Read `.specify/memory/constitution.md`, the authoritative project constitution.
   `constitution.txt` is the original adoption input, not a second source of truth.
2. Read `README.md`, the assigned issue and its acceptance criteria, and any
   applicable repository instructions.
3. Locate the relevant feature under `specs/` and read its `spec.md`, `plan.md`,
   and `tasks.md`, plus related contracts and research when present. Do not select
   an unrelated feature merely because its directory is newest.
4. Inspect the current branch and working tree. Preserve unrelated work and use
   the assigned checkout; do not modify another session's checkout.
5. Identify available build, test, and CI commands from repository files. Do not
   invent commands or claim that checks ran when the required tooling is absent.

Apply the constitution over conflicting project conventions, subject to
higher-priority platform instructions and security restrictions. If required
context is missing, inaccessible, or contradictory, report the specific blocker
instead of assuming approval.

## Capability and Readiness Check

Classify the work before implementation:

- **Ready:** Scope and acceptance criteria are clear, the necessary tools are
  available, and required approvals are recorded. Proceed within that scope.
- **Needs review:** The approach is understood, but it affects identity, privacy,
  authorization, public API contracts, infrastructure, dependencies, or AI behavior.
  Identify the review needed in the PR. Proceed only where existing approvals and
  the constitution permit; this classification does not waive any gate.
- **Blocked:** Requirements, access, approvals, or essential tools are missing, or
  the request conflicts with the constitution. Explain the blocker on the issue
  or to the user and request the specific decision or access needed. Do not guess
  requirements, self-approve, or bypass security controls.

## Spec Kit Workflow

For features, use the installed Copilot skills in order, reviewing each artifact:

1. `/speckit-specify` records user needs, acceptance criteria, and out-of-scope work.
   Obtain the constitution's product owner and tech lead spec review before
   implementation; generated documents are not evidence of human approval.
2. `/speckit-clarify` resolves open questions before planning. Do not implement
   while `spec.md` contains an open `[NEEDS CLARIFICATION]` marker.
3. `/speckit-plan` records the design and a Constitution Check covering each
   principle as pass, fail, or justified exception. Record exceptions in
   "Complexity Tracking" with the reason and rejected simpler alternative; do not
   treat recording an exception as permission to bypass required approval.
4. `/speckit-tasks` and `/speckit-analyze` establish actionable tasks and check
   consistency. Keep plans, tasks, and implementation traceable to spec requirements.
5. `/speckit-implement` follows the approved tasks. Write acceptance-based tests
   and observe them fail before implementation.
6. `/speckit-converge` checks for remaining gaps. Resolve gaps within the approved
   scope; bring scope changes back for review.

For bug fixes, add a regression test that fails for the original symptom before
the fix. Update affected specs or contracts when behavior changes. For
documentation-only work, do not manufacture application features or tests.

If a skill is unavailable, read its definition under `.github/skills/` and report
the limitation. Never claim a skill ran when it did not.

## Implementation Guardrails

- Follow the constitution's .NET 8 / C#, Azure Functions and Container Apps,
  Azure SQL, and Bicep stack. Keep changes minimal and scoped to the current spec.
- Use Microsoft Entra ID and managed identities. Unavoidable secrets belong in
  Azure Key Vault, never source, configuration files, or pipelines.
- Preserve private data-service access, resource-scoped least privilege,
  encryption requirements, and approved US-region residency.
- Never include PII in logs, traces, test fixtures, or AI prompts. Use synthetic
  test data that does not identify real people.
- Preserve structured Application Insights telemetry, audit events for
  state-changing operations, and correlation IDs without exposed stack traces.
- Require contract tests for every public API endpoint and at least 80% line
  coverage on business logic. Evaluate the p95 API latency target of under 300 ms
  against the expected peak load defined in the spec or plan, not an invented load.
- Use approved internal package feeds and perform license and vulnerability checks
  before introducing dependencies. Do not substitute public feeds if access fails.
- Deploy infrastructure through Bicep and pipelines. Do not make test or production
  portal changes or deploy merely because implementation is complete.
- Apply the constitution's responsible-AI requirements when the feature uses AI.

## Branch and Pull Request Guidelines

- Respect the branch assigned by the hosting environment. Do not rename or switch
  an existing session branch to enforce a naming convention. When a new branch is
  needed and no host convention applies, use a descriptive kebab-case name with
  the issue number when available.
- Follow any repository PR template. Explain why the change is needed, summarize
  the approach, link the relevant spec, and identify risks, exceptions, and reviews.
- Use `Closes #<issue-number>` only when the PR fully resolves that issue. For
  partial work, use `Relates to #<issue-number>`; qualify cross-repository references
  with `owner/repo`. Do not invent issue numbers.
- Report checks actually run and any checks blocked or not run. Required CI covers
  build, tests, SAST, secret scanning, and dependency scanning; unavailable checks
  are not passing checks.
- Every PR requires at least one approving review and passing required CI. Do not
  self-approve, bypass branch protections, or merge without explicit authorization.
- Constitution amendments require tech lead and security champion approval,
  version updates, and dependent-template updates as specified by the constitution.
