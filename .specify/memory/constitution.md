# Member Services API Constitution

**Amendment status: Proposed v2.3.0; pending PR adoption.** On 2026-11-13, the user
explicitly approved this amendment in both the tech lead and security champion
roles in this conversation. This records the user's approval, not a GitHub PR
review or merge. The amendment still requires the PR process specified under
Governance. Until adoption, v2.2.0's approved-internal-feeds-only requirement
remains effective; the dependency policy below is proposed wording.

## Core Principles

### I. Spec Before Code
Every feature MUST start from an approved spec (`spec.md`) that states the user
need, acceptance criteria and out-of-scope items. Plans and tasks MUST trace back
to a requirement in the spec. No implementation begins while the spec still has
an open `[NEEDS CLARIFICATION]` marker.
*Rationale: rework from unclear requirements costs more than writing the spec.*

### II. Security and Identity by Default
- Services MUST authenticate with Microsoft Entra ID and managed identities; no
  API keys, connection strings or shared secrets in code, config or pipelines.
- Secrets that cannot be avoided MUST live in Azure Key Vault.
- Data services MUST use private endpoints; public network access is disabled.
- Least privilege: role assignments are scoped to the resource, never the
  subscription.
*Rationale: regulated data; auditors expect identity-based access with no
public exposure.*

### III. Data Protection and Privacy
- PII and account data MUST be classified, encrypted at rest (customer-managed keys
  where required) and in transit (TLS 1.2+).
- PII MUST NOT appear in logs, traces, test fixtures or prompts to AI models.
- Data stays in approved US regions.

### IV. Test-First Quality (NON-NEGOTIABLE)
- Tests are written from the acceptance criteria before implementation and MUST
  fail first.
- Minimum 80% line coverage on business logic; every bug fix adds a regression test.
- Contract tests are required for every public API endpoint.

### V. Observability and Auditability
- Structured logging, distributed tracing and metrics via Application Insights
  (Entra-authenticated ingestion, local auth disabled).
- Every state-changing operation emits an audit event: who, what, when, and outcome.
- Errors return correlation IDs, never stack traces.

### VI. Simplicity and Maintainability
- Prefer platform services over custom code; no new framework without a written
  justification in `plan.md`.
- YAGNI: build only what the current spec requires.
- Public interfaces are versioned; breaking changes require a new major version.

### VII. Responsible AI (when the feature uses AI)
- AI-generated output that affects a member MUST have human review or a documented
  confidence threshold and fallback.
- Prompts, model versions and evaluation results are version-controlled.
- Content safety filters stay enabled; grounding data honors source permissions.

### VIII. Documentation Stays Current
- Every change MUST include a review of affected documentation and README files.
  Any documentation made inaccurate or incomplete by the change MUST be updated
  in the same PR, not deferred to later work.
- Updates MUST cover affected setup instructions, usage examples, API contracts,
  configuration, architecture, project structure, and deployment guidance.
- PRs MUST identify the documentation updated. If no documentation updates are
  needed, the PR MUST explain why; unrelated documentation edits are not required.
*Rationale: documentation is part of the deliverable and must describe the
current behavior and structure of the project.*

## Additional Constraints
- **Frontend:** Angular with TypeScript in `src/frontend/`. The Angular version
  and compatible toolchain MUST be recorded in `plan.md`.
- **Backend:** C# using .NET 11 in `src/backend/`, with Azure Functions and
  Container Apps as appropriate to the approved design.
- **Data and infrastructure:** Azure SQL and Bicep for IaC. Infrastructure
  definitions belong in `infra/`; shared contracts and reusable libraries belong
  in `src/shared/`. Cross-stack contracts MUST be language-neutral or supported by
  generated language-specific clients.
- **Dependencies:** local npm operations MUST use the approved internal registry,
  `https://packagefeedproxy.microsoft.io/npm/`. GitHub Actions MUST use
  `https://registry.npmjs.org/` for public npm dependencies. Private dependencies
  and non-npm packages MUST use approved internal feeds in every environment.
  Registry selection MUST be explicit for each environment; feed access failures
  MUST stop retrieval, not trigger fallback to another registry. Private package
  names, credentials, and package contents MUST NOT be sent to the public registry.
  No new dependency is permitted without a license and vulnerability check.
- **Infrastructure:** all resources are deployed by IaC through pipelines; no
  portal changes in test or prod.
- **Performance:** p95 API latency under 300 ms at expected peak load.

## Development Workflow
1. `/speckit-specify` -> peer review of the spec by product owner and tech lead.
2. `/speckit-clarify` resolves all open questions before planning.
3. `/speckit-plan` MUST include a Constitution Check that lists each principle
   as pass, fail or justified exception.
4. `/speckit-tasks` -> `/speckit-analyze` for consistency -> `/speckit-implement`.
5. Every PR needs one approving review, passing CI (build, tests, SAST, secret
   scan, dependency scan) and a link to its spec.
6. AI-generated code is held to the same review standard as human code.

## GitHub Planning and Task Tracking
- Each feature implementation plan (`plan.md`) MUST have a corresponding GitHub
  milestone in this repository. The milestone description MUST link to the
  feature's spec and plan; `plan.md` MUST record the milestone URL.
- Each task in `tasks.md` MUST have a corresponding GitHub issue assigned to that
  milestone. The issue MUST identify the feature and task ID, link to the spec and
  plan, and describe the task scope, acceptance criteria, and dependencies.
  `tasks.md` MUST record the issue URL for each task.
- Plans and tasks remain the source of implementation detail. Changes to scope,
  dependencies, or completion status MUST be reflected in the linked GitHub
  milestone and issues as part of the same work.
- Before creating tracking items, check existing feature links and task IDs and
  reuse matching milestones and issues. Do not duplicate items when rerunning
  planning or task generation.
- If GitHub access or permissions prevent synchronization, report the blocker
  and record pending tracking items. Do not invent URLs or claim synchronization
  succeeded.

## Governance
- This constitution overrides conflicting team conventions and agent defaults.
- Exceptions MUST be recorded in `plan.md` under "Complexity Tracking", with the
  reason and the simpler alternative that was rejected.
- Amendments go through a PR approved by the tech lead and the security champion,
  bump the version, and update dependent templates.
- Compliance is reviewed at each release.

**Version**: 2.3.0 (Proposed; effective version remains 2.2.0) | **Ratified**: 2026-11-13 | **Last Amended**: 2026-11-13
