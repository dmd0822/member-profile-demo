# member-profile-demo

This project uses Spec Kit. The authoritative project constitution is
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).

Repository-wide guidance for GitHub Copilot is in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md).

## Architecture and documentation toolkit

The repository includes a focused starter set adapted from Awesome Copilot:

| Resource                                                                                             | Purpose                                                                                              |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Member Services Planning Agent](.github/agents/planning.agent.md)                                   | Collaborative requirements and repository exploration, alternatives, risks, and handoff to Spec Kit. |
| [Member Services Azure Architect](.github/agents/azure-principal-architect.agent.md)                 | Requirements discovery, Azure trade-offs, and design review without application code or deployment.  |
| [Member Services Technical Writer](.github/agents/technical-writer.agent.md)                         | Accurate architecture explanations, developer guides, and API documentation.                         |
| [Create Architectural Decision Record](.github/skills/create-architectural-decision-record/SKILL.md) | Record one proposed decision, alternatives, consequences, and review evidence.                       |
| [Documentation Writer](.github/skills/documentation-writer/SKILL.md)                                 | Audience-focused tutorials, how-to guides, reference, and explanation.                               |
| [Architecture instructions](.github/instructions/architecture.instructions.md)                       | Constitution-first discovery and decision boundaries.                                                |
| [Documentation instructions](.github/instructions/documentation.instructions.md)                     | Documentation accuracy, consistency, privacy, and maintenance.                                       |

In a Copilot client that supports repository custom agents, select **Member
Services Planning Agent** for collaborative exploration before formal planning,
**Member Services Azure Architect** for design discussions, or **Member Services
Technical Writer** for documentation. Ask for the named skill when recording a decision
or writing a substantial guide. Availability and discovery depend on the client;
if a resource is not listed, refresh the session or explicitly reference its
file. Do not assume that installing these files configures any MCP server.

Example requests:

- "Use Member Services Planning Agent to explore this request and the relevant
  repository context. Clarify unknowns, compare alternatives, and identify
  dependencies, risks, acceptance-test strategy, and human decisions before
  handing off to Spec Kit. Do not implement or assume approval."
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

The planning agent supports exploration and review inputs; it does not replace
`/speckit-plan` or `/speckit-tasks`. Those remain the authoritative workflows for
implementation plans and tasks in `specs/<feature>/`, used only when requested
and applicable review gates are satisfied. No parallel `/plan/` or
`.copilot-tracking/` workflow is introduced. The agent does not implement
application code, install application dependencies, deploy, or self-approve.

The current member-profile design is a proposal and is maintained in the
[architecture overview](docs/architecture/member-profile-overview.md) and
[design review](docs/architecture/design-review.md), with Azure hosting and
data details in the [infrastructure design](docs/architecture/azure-infrastructure.md).
These documents separate confirmed requirements from open decisions; none
represents an approved or implemented system.

The [initial demo specification](specs/002-member-profile-demo/spec.md) and
[initial application projects specification](specs/003-initial-app-projects/spec.md)
received product owner and tech lead approval for planning on 2026-11-16.
On 2026-11-16, the user also approved the initial-project design and authorized
scoped implementation. The user subsequently confirmed T001's required design,
security, and dependency reviews complete, including reviewed pins and feed
configuration. The member-demo design remains proposed; infrastructure changes
and deployment are not authorized.

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

The root commands `npm run test:tooling`, `npm run test:foundation`,
`npm run lint`, and `npm run format:check` cover repository tooling, foundation
boundaries, Markdown, formatting, and links; `npm run format` rewrites supported
files. They do not replace the Angular/.NET project commands or required security
checks. See [development tooling](docs/development-tooling.md) for the actual
project commands, feed selection, and check boundaries.

## CI foundation

[Application CI](.github/workflows/application-ci.yml) and
[Infrastructure CI](.github/workflows/infrastructure-ci.yml) are separate
workflows with scoped permissions. The CodeQL job has `security-events: write`;
the application validation job uses read-only repository access. Both workflows
run for pull requests, pushes to `main`, and manual validation. No workflow-level
path filters strand required checks on docs-only changes. Their stable job names are **Application CI result** and
**Infrastructure CI result**. The hosted scenario matrix and T007/T008 evidence
refer to the separate CI foundation feature (001), not a hosted run of the
Angular/.NET application projects. For feature 003, no hosted CI run occurred;
T006 in feature 001 still awaits reviewed integration of its link-check fix and
evidence documentation. Milestone 1 remains open.
A maintainer can configure required checks separately; read-only inspection found
`main` unprotected (`protected: false`). No protection changes are authorized here.

For application changes, the helper selects Angular lint/build/test and .NET
build/test checks, dependency vulnerability checks, and .NET formatting
verification. Repository tooling checks and the public-tooling audit are
selected for their configured path scope. The helper also verifies package identities before retrieval and
uses the explicitly selected registry: the approved internal npm feed locally
and public npm in GitHub Actions for reviewed public packages. Non-npm
dependencies use the approved internal NuGet source. Feed failures do not fall
back to another source.

The application workflow contains a CodeQL job pinned to
`github/codeql-action` v3.39.3 (commit
`9418214df1f2c4b8128c770156c409013b07d6b9`) for JavaScript/TypeScript and C#,
using `build-mode: none` and `security-extended`. This is workflow
configuration, not proof that hosted analysis or required-result enforcement
is active. Repository-admin settings were inaccessible or returned 404, and no
hosted CI run on this branch was verified. CodeQL enforcement, GitHub secret
scanning, and push protection therefore remain **unverified**; the security
gate is blocked pending repository-admin verification and hosted CI on this
branch. Do not describe those controls as enabled.

Local validation passed the tooling suite (23/23), foundation suite (8/8),
Angular lint/build/test (one test file, one test), and backend format checks and
tests (three tests). The NuGet vulnerability command returned a successful
machine-readable report with no vulnerable-package entries. A prior isolated
internal-feed npm audit reported zero vulnerabilities, but the latest
integrated run was stopped when the approved internal feed returned HTTP 429
from its audit endpoint. That latest run is not a full pass; do not switch the
local audit to public npm. These are local results, not hosted CI results. No
hosted CI run or deployment occurred.

Infrastructure CI independently reports Bicep-validation readiness; Bicep
validation is not implemented. **CD is not enabled.** No cloud authentication,
resource changes, or deployment jobs exist. There is no business logic or public
API in this foundation, so business-logic coverage is not applicable and
public-endpoint contract tests do not yet apply. API latency and browser or
accessibility conformance have not been measured. See the
[approved scope](specs/001-separate-ci-pipelines/spec.md) and
[validation guide](specs/001-separate-ci-pipelines/quickstart.md).

## Technology stack

The initial foundation now contains an Angular 22/TypeScript frontend and a
host-neutral .NET 11 backend class library. The frontend is a neutral shell; the
backend has no API endpoints, business logic, persistence, or hosting runtime.
The test projects are outside `src/`: Angular tests are under
`tests/unit/frontend/`, and the external MSTest project under
`tests/unit/backend/` contains three foundation-boundary tests. The production
Angular build excludes tests. The broader member-profile design—including Azure
hosting, Azure SQL, and Bicep—remains separate from this implemented foundation;
no hosting choice or deployment is implied.

## Project structure

The current foundation is intentionally small. The responsibility directories
are ownership boundaries, not implemented member features:

```text
src/
  frontend/                           Angular workspace and neutral shell
  backend/                            .NET 11 class library (no host or API)
tests/unit/
  frontend/                           Angular/Vitest tests, outside src/
  backend/                            External MSTest foundation-boundary tests
  foundation/                         Node-native layout/boundary tests
  tooling/                            CI and repository-tooling tests
docs/                                 General documentation
specs/                                Feature specifications, plans, and tasks
.github/workflows/                    Separate application and infrastructure CI
```

Keep application code, infrastructure definitions, tests, and documentation in
their respective directories. This project has no device or Raspberry Pi runtime
layer. No shared library, integration/contract test project, Bicep project, or
deployment exists in this foundation. Add them only when an approved feature
requires them. Keep cross-stack contracts language-neutral or generate
language-specific clients; Angular must not directly depend on C# implementation
libraries.

Spec Kit feature artifacts belong in `specs/<feature>/`, including `spec.md`,
`plan.md`, `tasks.md`, and feature contracts. General architecture documentation
belongs in `docs/`; Spec Kit configuration and the constitution remain in
`.specify/`.

Keep infrastructure and application workflows separate. Application CI selects
Angular lint/build/test, .NET build/test, dependency/format checks, and a
configured CodeQL job for project changes. Application-source changes remain blocked until repository-admin
verification confirms CodeQL enforcement, secret scanning, and push protection,
and hosted CI on this branch is verified. Infrastructure validation and
deployment are not implemented.
Deployment workflows, cloud identities, targets, and environment approvals remain
future prerequisites. Preserve required checks and avoid path filters that leave
required checks pending.

## GitHub planning and task tracking

Each Spec Kit feature plan maps to a GitHub milestone. Each task maps to a GitHub
issue assigned to that milestone. Record the milestone URL in `plan.md` and the
issue URL alongside each task in `tasks.md`; link back to the feature spec and
plan from GitHub.

Keep scope, dependencies, and completion status aligned between the feature
artifacts and GitHub. Reuse existing milestones and issues to avoid duplicates,
and report permission or access blockers rather than claiming synchronization
succeeded. See the constitution for the full tracking requirements.

The current feature backlog is organized as follows:

| Feature                          | Plan and tasks                                                                                     | GitHub milestone                                                               | Delivery boundary                                                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001 Separate CI foundation       | [Plan](specs/001-separate-ci-pipelines/plan.md), [tasks](specs/001-separate-ci-pipelines/tasks.md) | [CI foundation](https://github.com/dmd0822/member-profile-demo/milestone/1)    | T007/T008 validation verified; T006 awaits reviewed fix/evidence integration; milestone open                                                                            |
| 003 Initial application projects | [Plan](specs/003-initial-app-projects/plan.md), [tasks](specs/003-initial-app-projects/tasks.md)   | [Initial projects](https://github.com/dmd0822/member-profile-demo/milestone/2) | Local tooling/foundation/frontend/backend checks pass; latest npm audit blocked by HTTP 429; CodeQL enforcement and secret controls unverified; no hosted CI/deployment |
| 002 Member profile demo          | [Plan](specs/002-member-profile-demo/plan.md), [tasks](specs/002-member-profile-demo/tasks.md)     | [Member demo](https://github.com/dmd0822/member-profile-demo/milestone/3)      | Complete eight-story synthetic demo after the foundation and required design/security reviews                                                                           |

Plan 003 before implementing dependent 002 work; do not duplicate initial
scaffolding in the demo. Each task links its issue and states its prerequisites.
Remaining implementation tasks stay open, with applicable human review gates
explicit. No due dates, deployment schedule, or production-readiness claim is
implied.
