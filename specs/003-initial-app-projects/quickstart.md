# Validate the initial application foundation

## Status and purpose

This is a validation how-to for contributors and reviewers of 003 Initial
Application Projects, limited to US1/US2, FR-001–FR-009, and SC-001–SC-006.
Local tooling, foundation, Angular lint/build/test, and backend format/test
checks passed. The latest integrated internal npm audit returned HTTP 429; the
CodeQL workflow is configured, but hosted enforcement and secret controls are
unverified. The security gate remains blocked pending repository-admin
verification and hosted CI on this branch. This is not a guide to running the
member-profile demo.

The user approved the project/tooling design, authorized scoped implementation,
and confirmed T001's reviews complete on 2026-11-16. T002's boundary test has
been written and run before scaffolding; its two expected failures show that
the application roots and responsibility directories were initially absent.
The Angular and .NET foundation projects and build/test entry points now exist.
External test discovery and execution pass locally; hosted CI and security-gate
acceptance remain pending. Deployment is disabled.

The foundation lets contributors locate and validate one frontend and one
backend without requiring the other application or cloud services. It adds no
member behavior, enrollment, profile management, authentication, database flow,
API behavior, or deployment.

## 1. Approved baseline and remaining validations

The T001 design, dependency, and security reviews are complete by explicit user
confirmation. The approved implementation pins are:

- Angular 22.2.5; Angular CLI/build 22.2.6; compiler-cli 22.2.5.
- Node.js 24.22.3; TypeScript 6.0.3; RxJS 7.8.2.
- Vitest 4.1.12; jsdom 31.0.0; tslib 2.9.1; zone.js 0.16.3.
- .NET SDK 11.0.100; target framework `net11.0`; MSTest framework/adapter
  4.5.3.
- Approved internal NuGet source:
  `https://packagefeedproxy.microsoft.io/nuget/v3/index.json`.

The Angular project lockfile and approved internal NuGet source are present.
A prior isolated internal npm audit reported zero vulnerabilities, but the
latest integrated run stopped when the approved internal feed's audit endpoint
returned HTTP 429. That latest run is blocked, not a pass. The local NuGet
vulnerability command returned a successful machine-readable report with no
vulnerable-package entries. No hosted CI result is available. Never fall back
to nuget.org or another registry.

The [Angular compatibility table](https://angular.dev/reference/versions) was
verified on 2026-11-16. The Node archive checksum was verified; pinned versions
and compatibility evidence alone do not prove build or test behavior. The
independent Angular and .NET builds and their nonempty external test suites
passed locally. The latest integrated frontend audit is blocked by an
internal-feed HTTP 429; hosted CI was not run.

## 2. Establish fail-first acceptance checks

T002 wrote acceptance checks before scaffolding and ran them against the absent
foundation. Two project-root/responsibility checks failed as expected; two
empty-boundary checks passed. A missing tool is a prerequisite failure, not
evidence that an acceptance assertion failed.

Node-native acceptance checks live under `tests/unit/foundation/` and are
exposed through the root `npm run test:foundation` script. They assert project
counts, source/test boundaries, forbidden references, and the absence of
speculative shared libraries, business endpoints, extra runtimes, and
infrastructure.

Use temporary synthetic negative fixtures or isolated changes, never real
member data. Include a passing control and verify that each prohibited case
fails for the intended reason; remove the negative fixture afterward.

The external MSTest project contains three meaningful foundation-boundary tests
for `net11.0`, project/dependency references, and external test placement. Its
three tests passed locally. A deliberately incorrect framework expectation
previously failed as intended before it was corrected. Do not substitute a
dummy passing test or fabricated coverage.

## 3. Check project and test ownership

The implemented foundation has these responsibilities:

| Location                                                | Implemented responsibility                                                               |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/frontend/`                                         | One Angular workspace with independent build/test scripts.                               |
| `src/frontend/src/app/components/`                      | Reusable UI component location; no member behavior in this feature.                      |
| `src/frontend/src/app/pages/`                           | Reserved ownership for routed views, not implemented member flows.                       |
| `src/frontend/src/app/services/`                        | Frontend service ownership, not speculative API clients.                                 |
| `src/backend/MemberProfile.Backend.csproj`              | One host-neutral `Microsoft.NET.Sdk` class library targeting `net11.0`.                  |
| `src/backend/Api/`, `Services/`, `Models/`              | Distinct backend responsibility areas; no endpoints, business services, or entities.     |
| `tests/unit/frontend/`                                  | External Angular tests; production output excludes these test files.                     |
| `tests/unit/backend/MemberProfile.Backend.Tests.csproj` | External MSTest project with three foundation-boundary tests; not a runtime application. |
| `tests/unit/foundation/`                                | Node-native project and boundary acceptance checks.                                      |

The backend includes no server, ASP.NET hosting, member logic, or additional
runtime project. Neither application needs the other running to build or test.

Angular's Vitest/jsdom tooling uses the CLI builder and points to
`tests/unit/frontend/`. The command discovered and passed one external test
locally; the initial mismatched-heading assertion failed as intended before the
shell was corrected. Production output excludes test files. Do not move tests
under `src/`.

No persistence, entities, or interfaces are required, so this scope creates no
data-model or contract artifacts. Do not create `src/shared/`,
`tests/integration/`, `tests/contract/`, or `infra/` without an applicable approved
need. Their layout rules still apply if a later feature needs them. In
particular, Angular must not reference C# implementation libraries.

## 4. Validate each project independently

These commands are configured in the current checkout. Run them from the
repository root in PowerShell. A configured command is not evidence that it
passed: only results called out below are recorded. Stop on any nonzero exit
code. Tests must have nonzero discovery; a successful process with no tests is
not acceptance evidence.

### Frontend

Restore from the approved internal npm feed only. GitHub Actions uses the public
registry only for reviewed public package identities; private packages and
credentials must not be sent there. No registry fallback is allowed.

```powershell
npm --prefix src/frontend ci --ignore-scripts --audit=false --fund=false --registry=https://packagefeedproxy.microsoft.io/npm/
```

Angular ESLint lint, build, and test passed locally. The test command
discovered one test file containing one test; its initial acceptance assertion
failed as intended before the shell heading was corrected:

```powershell
npm --prefix src/frontend run lint
npm --prefix src/frontend run build
npm --prefix src/frontend run test
```

The prior isolated internal-feed audit reported zero vulnerabilities. The
latest integrated validation run stopped when the approved internal feed's
audit endpoint returned HTTP 429; this latest result is blocked, not passed.
Do not switch the local dependency audit to public npm:

```powershell
npm --prefix src/frontend audit --audit-level=high --registry=https://packagefeedproxy.microsoft.io/npm/
```

The Angular test configuration points to `tests/unit/frontend/`, outside
`src/`, and the production build configuration compiles the application entry
point rather than including those tests. External discovery and test-failure
propagation were demonstrated locally; no hosted CI result is implied.

### Backend

Restore through the explicitly configured approved internal NuGet source in
`NuGet.Config`; never add nuget.org or another fallback. The backend build
passed locally. The external MSTest project discovered and passed three
foundation-boundary tests. A deliberately incorrect framework expectation
previously failed as intended before it was corrected.

```powershell
dotnet restore tests/unit/backend/MemberProfile.Backend.Tests.csproj --configfile NuGet.Config
dotnet build src/backend/MemberProfile.Backend.csproj --configuration Release --no-restore
dotnet test tests/unit/backend/MemberProfile.Backend.Tests.csproj --configuration Release --no-restore
```

The test command must discover the three MSTest boundary tests. It runs without
the frontend, cloud credentials, database, or running service.

### Dependency and formatting checks

The local NuGet vulnerability command uses the approved source from
`NuGet.Config`; the JSON output is parsed explicitly and malformed or
unexpected output fails closed. It returned a successful machine-readable
report with no vulnerable-package entries:

```powershell
dotnet list tests/unit/backend/MemberProfile.Backend.Tests.csproj package --vulnerable --include-transitive --format json --configfile NuGet.Config --no-restore
```

Both backend formatting checks passed locally:

```powershell
dotnet format src/backend/MemberProfile.Backend.csproj --verify-no-changes --no-restore
dotnet format tests/unit/backend/MemberProfile.Backend.Tests.csproj --verify-no-changes --no-restore
```

Backend formatting verification and tests passed locally, with three tests
discovered. These are local results, not hosted CI results. No hosted CI run
occurred.

### Foundation acceptance

The current root foundation entry point is:

```powershell
npm run test:foundation
```

All eight foundation boundary tests passed after the projects were added. The
separate `npm run test:tooling` suite covers CI/tooling behavior and passed
23/23 tests. Neither suite is application business-logic coverage.

## 5. Exercise the acceptance scenarios

Record command exit codes, test discovery counts, and assertions when each
scenario is executed. The status column distinguishes evidence already recorded
from acceptance work still pending; it does not mark the feature complete.

| Scenario                    | Evidence recorded so far                                                                                           | Remaining validation                                         | Trace                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| Locate the initial projects | One Angular project and one .NET class library; eight foundation tests and both independent builds passed locally. | Hosted CI was not run.                                       | US1; FR-001–FR-003; SC-001              |
| Keep tests external         | One Angular test and three external MSTest tests passed; the Angular production build excludes tests.              | Hosted CI was not run.                                       | US2; FR-004; SC-002                     |
| Keep projects independent   | Angular build/test and .NET build/test passed locally without cloud services.                                      | Hosted CI was not run; frontend dependency audit is blocked. | US1/US2; FR-007; SC-003                 |
| Prevent speculative sharing | Foundation tests pass; no shared library or frontend reference to backend implementation exists.                   | No additional validation outstanding locally.                | US2; FR-005; SC-004                     |
| Separate infrastructure     | No infrastructure project or deployment path exists; foundation boundary tests pass.                               | Hosted Bicep validation remains unimplemented.               | US1/US2; FR-006; SC-005                 |
| Keep guidance truthful      | Repository Markdown lint, formatting, and link checking passed locally.                                            | Hosted CI was not run.                                       | US1/US2; FR-008–FR-009; SC-006          |
| Reject feature creep        | The Angular shell and host-neutral backend add no member endpoint, behavior, identity, persistence, or deployment. | No additional validation outstanding locally.                | US1/US2; FR-001, FR-009; SC-001, SC-006 |

## 6. CI behavior and remaining gates

The application workflow configures a CodeQL job and selects frontend and
backend validation through `.github/scripts/ci-foundation.mjs`. For selected
application changes the helper requires the Angular ESLint config, validates
package identities, retrieves the frontend dependencies through the
environment-selected registry, runs frontend lint/audit/build/test, restores
the MSTest project using `NuGet.Config`, runs the NuGet vulnerability check,
verifies formatting for both backend projects, then builds and tests the
backend. A missing/failed check or zero discovered tests fails the helper.
NuGet audit output is parsed as JSON and malformed or incomplete output fails
closed. The Angular lock is validated against
`.github/ci/public-npm-packages.json`; the `minimatch` 11.0.1 override is
scoped only to `@typescript-eslint/typescript-estree`.

The frontend audit uses the approved internal npm feed locally and the selected
public registry in GitHub Actions only for reviewed public packages. Private
dependencies and non-npm dependencies require their approved internal feeds.
Failures stop retrieval; no fallback is permitted.

The CodeQL job pins `github/codeql-action` v3.39.3 at commit
`9418214df1f2c4b8128c770156c409013b07d6b9` and analyzes
`javascript-typescript` and `csharp` using `build-mode: none` and
`security-extended`. This is workflow configuration only, not verified hosted
analysis or required-result enforcement. GitHub security-settings endpoints
were inaccessible or returned 404, and `gh` lacks `admin:repo_hook` scope for
CodeQL setup. CodeQL enforcement, secret scanning, and push protection remain
unverified; the security gate is **blocked** pending repository-admin
verification and hosted CI on this branch. Do not describe the controls as
enabled or substitute an unreviewed scanner or package source.

No hosted CI run or deployment occurred. Preserve the stable **Application CI
result** and **Infrastructure CI result** jobs, keep the workflows separate,
and do not treat a local result or documentation-only CI result as application
readiness. Bicep validation remains unimplemented and deployment remains
disabled.

## 7. Record limits and hand off

The root validation entry points are `npm run test:tooling`,
`npm run test:foundation`, `npm run lint:markdown`, `npm run format:check`, and
`npm run lint:links`; frontend lint is `npm --prefix src/frontend run lint`.
The tooling suite passed 23 tests; the foundation suite passed eight tests; the
Angular lint/build/test passed, with one test file and one test; and the backend
format/test checks passed with three tests. Markdown lint, formatting
verification, and link checking passed locally; link checking found zero failed
links across 44 Markdown files. The latest integrated npm audit
returned HTTP 429, while a prior isolated internal-feed audit reported zero
vulnerabilities. The NuGet vulnerability command returned a successful
machine-readable report with no vulnerable-package entries. The latest
integrated run is not a full pass. No hosted CI run or deployment occurred.

Record these limits explicitly:

- **API latency:** no API behavior or expected peak load exists in this
  foundation. Latency is not applicable and has not been measured; do not
  invent a benchmark.
- **Coverage:** business-logic coverage is not applicable because this foundation
  has no business logic; do not report 100%. The future minimum 80% business-logic
  coverage and public-endpoint contract-test gates remain in force.
- **Accessibility:** shell checks and jsdom tests do not validate real-browser
  or screen-reader behavior. Browser/accessibility conformance is unmeasured and
  not applicable to this neutral shell; no conformance claim is made.
- **Design:** no hosting, identity, persistence, or deployment option is accepted
  by this guide. Demo design review belongs to the separate architecture work.

If a prerequisite, approved feed, exact pin, or test-discovery mechanism is
missing, stop the affected validation and report it as blocked. In particular,
the HTTP 429 npm audit and unverified hosted security controls are not passing
checks. Do not replace them with a dummy check, a public-registry local audit,
an unapproved package source, or a claim of success.

## Sources and companion artifacts

- [Initial Application Projects specification](spec.md): scope and acceptance.
- [Feature implementation plan](plan.md): companion design and scope record for
  the initial project foundation.
- [Feature research](research.md): source evidence and proposed design rationale.
- [Authoritative constitution](../../.specify/memory/constitution.md): quality,
  dependency, layout, and approval requirements.
- [Repository contributor guidance](../../README.md): current repository context.
- [CI foundation validation guide](../001-separate-ci-pipelines/quickstart.md):
  separate CI-foundation scope and evidence limitations.
