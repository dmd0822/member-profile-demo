# Implementation Plan: Initial Application Projects

**Branch**: `dave-microsoft-milestone-2` (assigned checkout) | **Date**: 2026-11-16 | **Spec**: [Initial Application Projects](spec.md)

**Input**: Feature specification from `specs/003-initial-app-projects/spec.md`.
Explicit Spec Kit target: `003-initial-app-projects`; setup reports the feature
identifier as its branch, not the physical checkout branch above.

**GitHub Milestone**: [003 Initial application projects](https://github.com/dmd0822/member-profile-demo/milestone/2).
The milestone links the spec, plan, and [task backlog](tasks.md). Each task has a
corresponding issue; implementation completion remains outstanding.

**Status**: The user acting as product owner and tech lead approved the proposed
project/tooling design and authorized scoped implementation on 2026-11-16.
T001 reviews are complete by explicit user confirmation. The Angular and .NET
foundations, external tests, and build/test CI implementation are in the
worktree. Angular ESLint, CodeQL workflow configuration, dependency checks, and
.NET formatting checks are implemented. The tooling suite passed 23/23, the
foundation suite 8/8, frontend lint/build/test passed (one test file, one test),
and backend formatting/tests passed (three tests). The NuGet vulnerability
command returned a successful machine-readable report with no vulnerable
packages. A prior isolated internal npm audit reported zero vulnerabilities,
but the latest integrated run stopped at HTTP 429 from the approved feed's audit
endpoint. Hosted CI and repository-admin security settings remain unverified;
the security gate is blocked pending admin verification and hosted CI on this
branch. Deployment remains disabled.

## Summary

Establish one Angular/TypeScript frontend project and one C#/.NET 11 backend
foundation with independent builds and meaningful foundation tests. Preserve
the repository's source, test, infrastructure, and documentation boundaries.
Applicable application CI now runs independent builds/tests, dependency checks,
Angular lint, and .NET formatting verification. The workflow also configures a
CodeQL SAST job. Application-source changes remain blocked pending
repository-admin verification of required CodeQL enforcement, secret scanning,
and push protection, plus hosted CI on this branch.

The approved pins are Angular 22.2.5, Angular CLI/build 22.2.6,
compiler-cli 22.2.5, Node.js 24.22.3, TypeScript 6.0.3, RxJS 7.8.2,
Vitest 4.1.12, jsdom 31.0.0, tslib 2.9.1, zone.js 0.16.3, and .NET SDK
11.0.100. The backend targets `net11.0`; MSTest framework/adapter are pinned
to 4.5.3. External test discovery and execution pass locally. The frontend npm
audit in the latest integrated run is blocked by an internal-feed HTTP 429; an
earlier isolated npm audit reported zero vulnerabilities. The local NuGet
vulnerability command returned a successful machine-readable report with no
vulnerable-package entries.
No Functions,
Container Apps, frontend hosting, business endpoint, identity flow, database
access, shared library, audit worker, infrastructure, or deployment is selected.
The proposed demo architecture remains separate and unapproved.

See [research](research.md) for evidence, alternatives, and review gates, and
the [quickstart](quickstart.md) for implemented validation entrypoints and
current limitations.

## Technical Context

**Language/Version**: Angular 22.2.5 / matching CLI and build 22.2.6;
TypeScript 6.0.3; Node.js 24.22.3; RxJS 7.8.2. Backend C# targets `net11.0`
with .NET SDK 11.0.100 and its compatible default language version. The SDK is
pinned in root `global.json`; the frontend lock passed the public-package
inventory and portable-lock checks.

**Primary Dependencies**: Angular and its matching CLI/build tooling. Proposed
Angular-default Vitest/jsdom; proposed .NET SDK MSTest template tooling.
No new production backend package, ORM, identity SDK, HTTP server framework,
cloud SDK, state library, or component library is needed by this foundation.
Every introduced direct/transitive dependency requires license, vulnerability,
source, and compatibility review before introduction.

**Storage**: N/A; no persistence or data access. Azure SQL remains the
constitutional constraint for later approved persistence work.

**Testing**: Node's native runner covers repository foundation and CI-policy
acceptance tests; Angular CLI/Vitest/jsdom discovers the external neutral
root-shell test; the MSTest project checks backend project/assembly boundaries.
All test files and setup remain under `tests/`. The local Angular suite
discovered one test and MSTest discovered three; both passed. No empty,
always-true, or invented business tests; zero discovered required tests fail.

**Target Platform**: Browser frontend; host-neutral .NET backend assembly.
Azure hosting remains undecided. The backend has no listener, route, deployment
image, Functions binding, or operational service in this feature.

**Project Type**: One frontend application project and one backend foundation
project; a backend test project is supporting validation, not another runtime.
Later approved hosting work adapts the same backend boundary rather than
silently adding a third application project.

**Performance Goals**: N/A for this foundation: no API behavior or agreed peak
load. The constitutional p95 API target below 300 ms remains binding when an
API and expected peak load are agreed; no benchmark or throughput is invented.

**Constraints**: Tests outside `src/`; no speculative sharing or domain
behavior; independent build/test without cloud access; fail-closed dependency
policy; truthful CI; same-PR documentation accuracy; deployment disabled.
Local npm uses the approved internal registry. GitHub Actions uses public npm
only for reviewed public identities. Non-npm/private dependencies use approved
internal feeds everywhere; missing access blocks retrieval without fallback.

**Scale/Scope**: US1 and US2 only; FR-001–FR-009 and SC-001–SC-006. No member
count, availability target, recovery target, regional deployment, or load
assumption is needed to classify and validate project boundaries.

## Constitution Check

Pre-research evaluation and post-design recheck use constitution v2.3.0.
“Pass” below means the bounded planning design respects the principle, not
that executable implementation checks or pending human reviews have passed.

| Principle                            | Before Phase 0        | After Phase 1         | Evidence and implementation gate                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Spec Before Code                  | Pass                  | Pass                  | Spec records PO/tech lead planning approval, design approval, implementation authorization, and explicit T001 review completion on 2026-11-16; no open functional clarification markers.                                                                                                                                              |
| II. Security and Identity by Default | Pass                  | Pass                  | No service, identity flow, credential, or resource created. Later services retain Entra ID, managed identity, Key Vault for unavoidable secrets, private data access, and resource-scoped least privilege. Do not expose an unauthenticated sample API. Security review applies before affected behavior is added.                    |
| III. Data Protection and Privacy     | Pass                  | Pass                  | No member data, fixtures containing PII, persistence, logs, or external payloads. Future data classification, encryption at rest/TLS 1.2+, and approved US residency remain mandatory; no production readiness claimed.                                                                                                               |
| IV. Test-First Quality               | Pass                  | Pass                  | Foundation acceptance tests fail before scaffolding/CI changes. Real shell/configuration assertions replace template placeholders. Business-logic coverage is N/A, not 100%; later business logic requires >=80% line coverage and every public endpoint requires contract tests.                                                     |
| V. Observability and Auditability    | Pass                  | Pass                  | No state-changing business operation or running service exists. Do not add a telemetry resource/SDK merely for scaffolding. Application Insights structured logs/traces/metrics with Entra ingestion/local auth disabled, safe correlation IDs, and who/what/when/outcome audits remain prerequisites for later operational behavior. |
| VI. Simplicity and Maintainability   | Pass                  | Pass                  | Exactly two application boundaries; no shared library, extra worker, service framework, or hosting selection. Test-framework justification and alternatives are written here and in research; the user confirmed the required review complete. No public interface exists to version yet.                                             |
| VII. Responsible AI                  | Pass (not applicable) | Pass (not applicable) | The application foundation uses no AI. AI-assisted authorship is not a member-facing AI capability. Future applicable AI use still requires review/fallback, versioned prompts/model/evaluations, enabled safety filters, and permission-aware grounding.                                                                             |
| VIII. Documentation Stays Current    | Pass                  | Pass                  | README and development-tooling guidance were reviewed; README links the current feature backlog. Future project/CI implementation must update affected setup, structure, test, and configuration documentation in the same PR, not present these proposed commands as existing.                                                       |

Additional constraints: constitutional stack preserved; Bicep-only future IaC;
no dependency introduced without checks; no package feed fallback; no deployment.
GitHub milestone and task issue links are recorded in the feature artifacts.
Required CI and at least one approving PR review remain mandatory; no self-approval.

### Planning and implementation gates

1. **Planning authority satisfied**: target spec is approved for planning.
   Functional clarification assessment asked zero questions; missing hosting
   and demo identity choices are explicitly excluded, not hidden ambiguities.
2. **Design review approved**: the user acting as product owner and tech lead
   approved the host-neutral backend shape, Angular toolchain, and test-framework
   approach on 2026-11-16. External test discovery and execution pass locally;
   CI dependency checks and the CodeQL workflow job are implemented, but the
   latest integrated npm audit is rate-limited. Hosted CodeQL enforcement,
   secret scanning, and push protection remain unverified; the security gate is
   blocked pending repository-admin verification and hosted CI on this branch.
   The separate architect's demo review is not duplicated or presumed complete.
3. **Package/toolchain review recorded**: on 2026-11-16, the user confirmed
   T001's required design, security, and dependency reviews complete, including
   reviewed pins and feed configuration. The reproducible metadata checks are
   summarized in [research](research.md); the user attestation is the approval
   record for review evidence not reproduced in this workspace. Keep registry
   selection explicit and fail closed. Use the reviewed Node.js 24.22.3 and
   .NET SDK 11.0.100 pins rather than the host's Node 26.13.0.
4. **Backlog gate**: review the generated [tasks](tasks.md), synchronized
   milestone/issues, and consistency analysis. T001 is complete by explicit
   user confirmation; remaining tasks must follow their documented
   dependencies.
5. **Implementation and PR gates remain**: observed fail-first tests, complete
   executable CI/security checks, same-PR documentation, and required human
   review. The CodeQL job is configured, but hosted analysis and enforcement,
   secret scanning, push protection, hosted CI on this branch, and an unblocked
   latest frontend audit remain outstanding. No deployment route is authorized.

The approved design and T001 review gate are recorded complete. Failure or
absence of an applicable executable or toolchain check still stops that
activity rather than being recorded as a passing check.

## Project Structure

### Documentation (this feature)

```text
specs/003-initial-app-projects/
  spec.md                    # Existing; approval writer owns changes
  checklists/requirements.md # Existing; approval writer owns changes
  plan.md                    # This proposed design
  research.md                # Phase 0 decisions, sources, alternatives
  quickstart.md              # Implemented validation guide and evidence
```

No domain entities, persistence model, public API, or cross-stack contract is
introduced; `data-model.md` and `contracts/` are not applicable and are not
created. Contributor build/test entrypoints are documented in the quickstart,
not promoted into fabricated API contracts. The companion `tasks.md` is the
separate task-generation workflow output, not a Phase 1 design artifact.

### Source Code (repository root)

The following is the current implemented layout; the responsibility areas
remain boundaries, not permission to add unapproved features:

```text
src/
  frontend/                  # One Angular workspace/application
    package.json             # Application dependencies separate from root tooling
    package-lock.json        # Reviewed portable exact dependency lock
    angular.json
    src/app/
      components/            # Reusable UI responsibility
      pages/                 # Routed-view responsibility; no member page yet
      services/              # Frontend-service responsibility; no API client yet
  backend/                    # One host-neutral net11.0 foundation
    MemberProfile.Backend.csproj
    Api/                     # Future HTTP-handling responsibility, no endpoint
    Services/                # Future business-service responsibility, no logic
    Models/                  # Future backend-model responsibility, no member model
tests/
  unit/
    foundation/              # Executable layout and project-boundary assertions
    frontend/                # Root-shell tests and test-only setup/configuration
    backend/
      MemberProfile.Backend.Tests.csproj
.github/
  scripts/ci-foundation.mjs  # Select and run application checks
  workflows/
    application-ci.yml       # Run read-only application checks
    infrastructure-ci.yml    # Preserve separate infrastructure gate
```

**Structure Decision**: Follow README/FR-002/FR-003 responsibility locations.
Record empty responsibility areas without creating dummy business classes or
routes solely to fill folders. Keep root npm tooling independent; use a
separate frontend manifest/lock rather than introducing npm workspaces.
Do not create `src/shared/` without an approved reuse requirement, or `infra/`,
`tests/integration/`, or `tests/contract/` without actual corresponding work.
The latter locations remain reserved by FR-004–FR-006, not deleted conventions.
Do not colocate Angular-generated tests under `src/`; configure discovery and
TypeScript test inclusion for `tests/unit/frontend/`. The pinned builder
discovered and executed the external suite locally. A future regression is a
design blocker, not permission to weaken the layout or silently select another
framework.

## Phase 0: Research Outcome

[Research](research.md) resolves implementation-method unknowns into bounded
decisions: compatible frontend versions, host-neutral backend, default test
tooling, separate dependency trees, fail-closed CI activation, and absence of
domain contracts/data models. Exact pins and human review were confirmed for
T001. Implementation verified local test discovery and the portable frontend
lock against the reviewed public package inventory. The latest integrated
internal npm audit was rate-limited, despite an earlier isolated
zero-vulnerability audit. The CodeQL workflow is configured, but admin
verification of enforcement/secret controls and hosted CI on this branch remain
outstanding. No implementation evidence expands the approved scope.

## Phase 1: Design and Validation

### Independent project validation

- Frontend build uses only the frontend workspace. Tests assert a neutral,
  semantic root shell and test discovery outside `src/`; there are no member
  pages, profile forms, identity controls, or backend calls. Do not retain
  framework-template branding tests as evidence of business coverage.
- Backend build targets the single `net11.0` foundation. Its external MSTest
  project asserts meaningful foundation constraints such as evaluated target
  framework, forbidden project/dependency references, and separation of
  application and test inputs. No HTTP host or fake service method is added to
  make tests exist.
- Native Node acceptance checks cover both project roots, required responsibility
  locations, no extra runtime projects, no direct frontend/backend implementation
  references, no speculative sharing, test categories, and source/IaC isolation.
  Keep all checks outside `src/`.
- Planned scripts and explicit-path .NET commands are in the quickstart. Each
  must propagate build/test/restore failures. A missing project/tool, empty test
  discovery, unsupported configuration, or inaccessible feed is failure/blocked,
  never a passing “available tests” check.

### Application CI activation

Current implementation: `.github/scripts/ci-foundation.mjs` validates project
files and the nested frontend lock before retrieval, then runs the Angular
install/lint/audit/build/test sequence and the approved-feed .NET restore,
vulnerability, formatting, build, and test checks. It requires nonzero test
discovery and propagates command failures. The root test suite exercises
selection, deletion/rename behavior, dependency policy, and failure handling.
The Angular flat config is required, and the locked public package identities
are validated against `.github/ci/public-npm-packages.json`; the narrowly scoped
`minimatch` 11.0.1 override applies only to
`@typescript-eslint/typescript-estree`.

The application workflow uses the reviewed Node.js 24.22.3 and .NET SDK
11.0.100 pins, pinned Actions, checkout credentials disabled, and no
workflow-level path filters. Its workflow-level permission is `contents: read`;
the CodeQL job additionally has `security-events: write`. Stable result names,
fail-closed revision comparison, manual dispatch, deletion/rename handling,
explicit registry selection, and separation from infrastructure CI are
preserved. The app project's public package identities are checked before
public npm retrieval; unknown identities or non-portable lock entries fail
closed. Local package retrieval and audit use the approved internal npm feed;
GitHub Actions uses public npm only for reviewed public package identities.
NuGet configuration clears other sources and uses only the approved internal
feed.

The tooling suite passed 23/23, the foundation suite 8/8, and frontend lint,
build, and test passed locally with one test file and one test. Backend
formatting checks and three tests passed. The NuGet vulnerability command
returned a successful machine-readable report with no vulnerable-package
entries. A prior isolated internal npm audit reported zero vulnerabilities;
the latest integrated run returned HTTP 429 from the approved feed's audit
endpoint and is not a pass. No hosted CI run occurred, so CI runner access to
internal NuGet and the hosted workflow's complete behavior remain unverified.

The workflow configures CodeQL SAST with `github/codeql-action` v3.39.3 at
commit `9418214df1f2c4b8128c770156c409013b07d6b9`, analyzing
`javascript-typescript` and `csharp` with `build-mode: none` and
`security-extended`. This is configuration evidence only. Hosted analysis,
required-result enforcement, GitHub secret scanning, and push protection are
unverified: settings endpoints were inaccessible or returned 404, and `gh`
lacks the `admin:repo_hook` scope needed for CodeQL setup. The helper fails
selected application-source changes pending repository-admin verification and
hosted CI on this branch. Do not claim security controls are enabled, use an
unapproved registry/scanner, or weaken the gate. Deployment remains disabled.

### Acceptance and success-criteria traceability

Write and observe acceptance tests fail before the corresponding scaffold or
CI implementation. Assert actual files/results, not only documentation text.

| Story / requirements | Success criteria | Planned acceptance evidence                                                                                                                                                                                                                                                                           |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US1; FR-001–FR-003   | SC-001           | Identify exactly two application project roots; classify every application source file; check separate frontend components/pages/services and backend Api/Services/Models responsibility locations. Negative case: extra runtime or misplaced source is rejected.                                     |
| US2; FR-004          | SC-002           | Enumerate tests and test-only setup; none under `src/`; unit/integration/contract tests use corresponding categories. Deliberately misplaced fixtures fail validation. Do not create empty integration/contract suites.                                                                               |
| US2; FR-005          | SC-004           | No shared library without approved reuse; no frontend reference to backend implementation. Negative fixtures cover direct project/package/source references and a speculative shared library.                                                                                                         |
| US1/US2; FR-006      | SC-005           | Source/IaC boundary checks reject runtime files in `infra/` and Bicep under application roots; no resources or deployment introduced.                                                                                                                                                                 |
| US1/US2; FR-007      | SC-003           | Independent frontend build and nonzero discovered shell tests; independent backend build and nonzero discovered foundation tests. CI scenario tests exercise selected checks, deletion/config/test changes, failed commands, unavailable tools/feeds, zero tests, and truthful not-applicable states. |
| US1/US2; FR-008      | SC-006           | Contributor review follows delivered setup/build/test guidance from a clean authorized environment; exact entrypoints and outcomes match implementation. Planned commands are not represented as current until verified.                                                                              |
| US1/US2; FR-009      | SC-006           | Review project/dependency inventory and shell to confirm zero enrollment/profile/membership/identity/database behavior, extra runtimes, hosting selections, or deployment activation.                                                                                                                 |

Security/privacy negative cases here concern package disclosure, credentials,
boundaries, and unintended endpoints, not invented login functionality.
Unauthorized/cross-member and API failure/contract tests belong to 002 once its
design is reviewed. Minimal shell semantics need applicable accessibility review;
DOM emulation does not prove browser or screen-reader conformance. No API latency,
business-logic coverage, or production-readiness result is claimed.

### Dependencies and sequencing

Design/test-tooling review and exact-version/feed checks precede package
introduction. Fail-first structural/shell/CI-policy tests precede the matching
implementation; project source and CI activation must land together rather
than knowingly leaving a broken domain gate. Independent frontend/backend
validation can be separate checks but must aggregate truthfully. Documentation
updates and negative-path evidence precede acceptance.

002 must reuse this foundation rather than scaffold duplicate projects.
Its identity, domain model, hosting, public API, audit topology, and expected
peak-load decisions do not become approved through 003. A need to select one
of those designs requires the appropriate separate review/scope, not expansion
of this foundation.

## Complexity Tracking

No constitutional exception is requested. Proposed test tooling is justified
under principle VI, not exempted from human review or dependency policy.
Absent business APIs/data/AI make their behavior-specific checks inapplicable,
not waived. Remaining implementation gates are explicitly incomplete work,
not approved exceptions.

| Violation     | Why Needed | Simpler Alternative Rejected Because |
| ------------- | ---------- | ------------------------------------ |
| None proposed | N/A        | N/A                                  |
