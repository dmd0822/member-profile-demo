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

## Project Structure

Use the member-services layout documented in `README.md`:

```text
src/                 Application code only
  frontend/          Angular frontend (TypeScript)
    src/app/
      components/    Reusable UI components
      pages/         Routed member-facing views
      services/      API clients and frontend application services
  backend/           .NET 11 backend (C#), member APIs, and Azure-hosted services
    Models/          Backend domain and data models
    Services/        Business logic and application services
    Api/             HTTP endpoints, request handling, and middleware
  shared/            Shared API contracts, member schemas, and reusable libraries
tests/               Unit, integration, and public API contract tests
  unit/              Isolated frontend and backend logic tests
  integration/       Service and data-access integration tests
  contract/          Public API request and response contract tests
infra/               Bicep infrastructure as code, modules, and deployment parameters only
docs/                Architecture docs, ADRs, architecture plans, and diagrams
specs/               Spec Kit feature specs, implementation plans, tasks, and contracts
.github/workflows/   Separate infrastructure and application CI/CD workflows
```

- Keep application runtime code out of `infra/` and `docs/`, and infrastructure
  definitions out of `src/`. Do not add a device or Raspberry Pi runtime layer.
- Put shared code in `src/shared/` only when reuse is required by the approved
  feature; do not create speculative abstractions. Keep cross-stack contracts
  language-neutral or generate language-specific clients; Angular must not
  directly depend on C# implementation libraries.
- Keep Spec Kit feature artifacts in `specs/<feature>/`, not `docs/`. Keep Spec Kit
  configuration, templates, and the constitution in `.specify/`.
- Keep tests outside `src/` and organize them by test type and service as needed.
- Separate infrastructure validation/deployment from application build/test/deployment
  in distinct workflow files. Application workflows must cover the Angular
  frontend and .NET 11 backend. Scope triggers to relevant paths, including shared
  code, tests, and build configuration where applicable, so dependent checks are
  not skipped. Preserve required checks and environment approvals; do not leave
  required checks pending because a path-filtered workflow never starts.
- Create directories and workflow files only when required by approved work.
  This layout is guidance, not a request to scaffold or deploy the system.

## Implementation Guardrails

- Implement the frontend in Angular with TypeScript under `src/frontend/` and the
  backend in C# using .NET 11 under `src/backend/`. Follow the constitution's Azure
  Functions and Container Apps, Azure SQL, and Bicep stack. Record the Angular
  version and compatible toolchain in `plan.md`. Keep changes minimal and scoped
  to the current spec.
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
- Review affected documentation and README files for every change and update them
  in the same PR. Identify the documentation updated in the PR description, or
  explain why no documentation updates are needed. Do not defer required updates.
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
