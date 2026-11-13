# member-profile-demo

This project uses Spec Kit. The authoritative project constitution is
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).

Repository-wide guidance for GitHub Copilot is in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md).

## Architecture and documentation toolkit

The repository includes a focused starter set adapted from Awesome Copilot:

| Resource                                                                                             | Purpose                                                                                             |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Member Services Azure Architect](.github/agents/azure-principal-architect.agent.md)                 | Requirements discovery, Azure trade-offs, and design review without application code or deployment. |
| [Member Services Technical Writer](.github/agents/technical-writer.agent.md)                         | Accurate architecture explanations, developer guides, and API documentation.                        |
| [Create Architectural Decision Record](.github/skills/create-architectural-decision-record/SKILL.md) | Record one proposed decision, alternatives, consequences, and review evidence.                      |
| [Documentation Writer](.github/skills/documentation-writer/SKILL.md)                                 | Audience-focused tutorials, how-to guides, reference, and explanation.                              |
| [Architecture instructions](.github/instructions/architecture.instructions.md)                       | Constitution-first discovery and decision boundaries.                                               |
| [Documentation instructions](.github/instructions/documentation.instructions.md)                     | Documentation accuracy, consistency, privacy, and maintenance.                                      |

In a Copilot client that supports repository custom agents, select **Member
Services Azure Architect** for design discussions or **Member Services Technical
Writer** for documentation. Ask for the named skill when recording a decision
or writing a substantial guide. Availability and discovery depend on the client;
if a resource is not listed, refresh the session or explicitly reference its
file. Do not assume that installing these files configures any MCP server.

Example requests:

- "Explore the member-profile architecture with me. Start with requirements and
  open questions; do not generate code or an implementation plan."
- "Use create-architectural-decision-record to capture this proposed decision,
  including alternatives and the human reviews still needed."
- "Use documentation-writer to propose an outline for a developer-facing
  architecture explanation. Wait for outline approval before drafting."

Use this sequence: **requirements/spec clarification → architecture exploration →
documented proposal and proposed ADRs → human review → Spec Kit implementation
plan and tasks**.

Document the proposed architecture and decision rationale before human review;
keep ADRs **Proposed** until the required approval is recorded.
Exploration does not bypass spec approval or other constitutional gates.
Substantial new documentation starts with an approved outline; small corrections
to existing documents do not require a separate outline.

General architecture explanations belong in `docs/architecture/`; decision
records use `docs/adr/adr-NNNN-title-slug.md` and default to **Proposed**.
Feature-specific specs, contracts, plans, and tasks stay in `specs/<feature>/`.
These directories are created only when needed. No application architecture is
selected by installing the toolkit.

The upstream revision, local adaptations, and MIT license are recorded in
[Awesome Copilot attribution](.github/AWESOME-COPILOT-NOTICE.md).
The toolkit adds no application dependencies or deployment automation.

## Implementation and review toolkit

The initial implementation/review shortlist is also included:

| Resource                                                                             | Purpose                                                                             |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [Member Services C# Expert](.github/agents/csharp-expert.agent.md)                   | Approved .NET 11 backend work with test-first development and minimal abstractions. |
| [Member Services Accessibility Expert](.github/agents/accessibility-expert.agent.md) | Angular forms, keyboard navigation, focus, semantics, and accessibility review.     |
| [API Breaking Change Detector](.github/skills/api-breaking-change-detector/SKILL.md) | Read-only comparison of C# endpoints and DTOs against Angular/TypeScript consumers. |
| [Test Gap Audit](.github/skills/test-gap-audit/SKILL.md)                             | Read-only review of missing or weak behavioral tests and contract coverage.         |
| [C# instructions](.github/instructions/csharp.instructions.md)                       | Backend language, async, error handling, and test conventions.                      |
| [Security instructions](.github/instructions/security.instructions.md)               | Identity, member ownership, safe input handling, and privacy.                       |
| [Accessibility instructions](.github/instructions/accessibility.instructions.md)     | Scoped Angular accessibility guidance.                                              |

Select the named agent in a supporting client, or explicitly reference its file.
Example requests:

- "Use api-breaking-change-detector to review this DTO change against its Angular
  consumers. Report findings without editing code."
- "Use test-gap-audit for this feature and identify missing contract and
  authorization tests without changing files."
- "Review this profile form with Member Services Accessibility Expert. Separate
  source findings from browser behavior you could not verify."

The test-gap skill includes the upstream standard-library Python helper.
Python 3.10+ is optional: the skill supports manual inspection without it.
The helper's file-match ratio is not measured line coverage, and its C# and
Angular heuristics require manual confirmation. See the skill for invocation
and limitations.

These resources do not choose architecture, install application packages, or
bypass Spec Kit approvals. Browser-testing, CI hardening, and infrastructure
helpers remain deferred. The existing Spec Kit skills are unchanged.
Source revisions and license notices are included in the attribution file above.

## Repository checks

Documentation checks use markdownlint-cli2, Prettier, and markdown-link-check.
A root `.editorconfig` supplies shared editor settings. Use Node.js 22.17+ and the
approved internal npm feed configured in `.npmrc` for local work. GitHub Actions
uses public npm for public npm dependencies; private dependencies and non-npm
packages stay on approved internal feeds everywhere. Feed failures never authorize
registry fallback:

```powershell
npm ci --ignore-scripts
npm run lint
```

`npm run lint` does not rewrite files; use `npm run format` for explicit local
formatting. See [development tooling](docs/development-tooling.md) for individual
checks, scope exclusions, feed access, and the language-specific linters to add
when application projects exist.

## CI foundation

[Application CI](.github/workflows/application-ci.yml) and
[Infrastructure CI](.github/workflows/infrastructure-ci.yml) are separate,
read-only workflows. Both run for pull requests, pushes to `main`, and manual
validation. No workflow-level path filters strand required checks on docs-only
changes. Their stable job names are **Application CI result** and
**Infrastructure CI result**; a maintainer can require these checks after
observing their first hosted runs. Branch protections are not configured here.

Application CI restores the reviewed public tooling tree, runs repository lint
and tooling tests, and audits public dependencies for high/critical vulnerabilities.
Infrastructure CI independently reports Bicep-validation readiness. Missing
Angular/.NET and Bicep checks are explicitly **not implemented**. Introducing
domain files blocks the affected gate until approved executable validation is
added; no application or infrastructure projects are scaffolded by this setup.

**CD is not enabled.** No cloud authentication, resource changes, or deployment
jobs exist. Future build/test, SAST, secret scanning, coverage, contract checks,
and deployment targets/identities/environment approvals remain prerequisites,
not checks these foundation workflows have passed. See the
[approved scope](specs/001-separate-ci-pipelines/spec.md) and
[validation guide](specs/001-separate-ci-pipelines/quickstart.md).

## Technology stack

The frontend is implemented in Angular with TypeScript. The backend is implemented
in C# using .NET 11, hosted on Azure Functions and Container Apps as appropriate
to the approved design. Use Azure SQL for data and Bicep for infrastructure as code.
Record the Angular version and compatible toolchain in the implementation plan.

## Project structure

Use the following layout as the member-services application is implemented.
Directories are created when needed; this is not a list of existing components.

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

Keep application code, infrastructure definitions, tests, and documentation in
their respective directories. This project has no device or Raspberry Pi runtime
layer. Add shared libraries only when an approved feature requires reuse.
Keep cross-stack contracts language-neutral or generate language-specific clients;
Angular must not directly depend on C# implementation libraries.

Spec Kit feature artifacts belong in `specs/<feature>/`, including `spec.md`,
`plan.md`, `tasks.md`, and feature contracts. General architecture documentation
belongs in `docs/`; Spec Kit configuration and the constitution remain in
`.specify/`.

Infrastructure and application CI/CD must use separate workflow files.
Infrastructure workflows validate and deploy Bicep; application workflows build,
test, and deploy the Angular frontend and .NET 11 backend. Scope triggers to
relevant paths while accounting for shared code, tests, and build configuration.
Preserve required checks and
environment approvals, and avoid path filters that leave required checks pending.

## GitHub planning and task tracking

Each Spec Kit feature plan maps to a GitHub milestone. Each task maps to a GitHub
issue assigned to that milestone. Record the milestone URL in `plan.md` and the
issue URL alongside each task in `tasks.md`; link back to the feature spec and
plan from GitHub.

Keep scope, dependencies, and completion status aligned between the feature
artifacts and GitHub. Reuse existing milestones and issues to avoid duplicates,
and report permission or access blockers rather than claiming synchronization
succeeded. See the constitution for the full tracking requirements.
