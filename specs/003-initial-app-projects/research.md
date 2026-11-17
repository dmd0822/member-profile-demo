# Research: Initial Application Projects

**Date**: 2026-11-16

**Status**: The user approved the project/tooling design, authorized scoped
implementation, and confirmed T001 review completion on 2026-11-16. Audience:
contributors and human reviewers. This explanation supports the [plan](plan.md);
it is not an additional task backlog.

## Evidence and clarification assessment

The spec records the user's PO/tech lead planning and design approvals and
scoped implementation authorization. The constitution v2.3.0, README project
layout, repository instructions, documentation guidance, and existing
application CI are the governing evidence.

Read-only `/speckit-clarify` assessment asked and answered **zero** questions.
No critical ambiguities detected worth formal clarification. The spec/checklist
were not edited by this design phase; the existing checklist reads 16/16 checked.
Its checks are requirements-quality assertions, not evidence of working projects.

| Clarification category            | Assessment                                                                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functional scope and behavior     | Clear: contributor project boundaries, not member behavior.                                                                                                                         |
| Domain and data model             | Clear: no domain entities, persistence, identity association, or data scale in this feature.                                                                                        |
| Interaction and UX flow           | Clear: project discovery and file placement; no member workflow.                                                                                                                    |
| Non-functional quality attributes | Clear within scope: independent checks and constitutional controls. API latency/load, operational availability, and business coverage are inapplicable to a non-service foundation. |
| Integration and dependencies      | Deferred to design: compatible versions, testing, dependency feeds, and CI activation below; no external business integration.                                                      |
| Edge cases and failures           | Clear: misplaced source/tests/IaC, unjustified sharing, extra runtimes, and scope expansion are rejected.                                                                           |
| Constraints and tradeoffs         | Clear: constitutional stack and no hosting/deployment choice; implementation methods assessed below.                                                                                |
| Terminology and consistency       | Clear: application projects versus supporting tests/contracts.                                                                                                                      |
| Completion signals                | Clear: FR-001–FR-009 and SC-001–SC-006; no unrun check represented as passed.                                                                                                       |
| Miscellaneous/placeholders        | Clear: no functional clarification markers; excluded demo decisions remain excluded.                                                                                                |

Proceed with a bounded proposed design, not another functional question round.
Deferred implementation choices require review/verification before adoption;
they are not permission to override a spec constraint.

## Decision 1: Compatible Angular planning baseline

**Decision (approved for implementation)**: Angular 22.2.5 with matching
Angular CLI/build 22.2.6, Node.js 24.22.3, TypeScript 6.0.3, and RxJS 7.8.2.

**Rationale**: The official compatibility table retrieved on 2026-11-16 lists
Angular 22 with Node `^22.22.3 || ^24.15.0 || ^26.0.0`,
TypeScript `>=6.0.0 <6.1.0`, and RxJS `^6.5.3 || ^7.4.0`.
The pinned versions are compatible with that published matrix. The same
reference notes Angular and CLI major versions are synchronized after v9.
Node.js 24.22.3 is within the reviewed compatible 24.x range and avoids an
unconstrained “24.15+” that accidentally permits incompatible future majors.
Its official Windows x64 archive checksum was verified before local use.

**Alternatives considered**:

- Angular 21 with its documented TypeScript range: viable, but no existing
  application or migration constraint requires the older baseline.
- Angular 22 on compatible Node 22 or 26: documented alternatives, not selected
  by this proposal. Generic Node 22 in current CI is insufficient to guarantee
  the minimum compatible patch; align to the proposed reviewed 24.x pin.
- Reuse root tooling's Node >=22.17 declaration as the application contract:
  rejected because it permits versions outside Angular 22's matrix.

**Review/verification gate**: The user confirmed the exact pins and required
dependency/security reviews complete on 2026-11-16. The final lock still must
be validated against this reviewed inventory and audited through the approved
internal feed before package installation.

Official source: [Angular version compatibility](https://angular.dev/reference/versions).

## Decision 2: Host-neutral backend foundation

**Decision (approved for implementation)**: One `Microsoft.NET.Sdk` class-library project targeting
`net11.0` under `src/backend/`, with future `Api/`, `Services/`, and `Models/`
responsibility locations. No sample business class, server, endpoint, database
context, Functions worker, container, or extra application runtime.

**Rationale**: A buildable backend foundation does not require a hosting
decision or exposed behavior. The .NET SDK target-framework documentation
lists `.NET 11` / `net11.0`; its `global.json` guidance requires a full SDK
version rather than a wildcard. This is a backend project, not a running API
or a cross-project shared library. Later approved host work can adapt this
same boundary. This choice intentionally does not promise that arbitrary
future hosting needs will require no project changes.

**Alternatives considered**:

- ASP.NET Core web/minimal API template: supplies a listener and often sample
  endpoints, selecting an unnecessary application-hosting shape now.
- Functions isolated-worker project: binds the initial shape and dependencies
  to a hosting option the spec keeps open.
- Console application or custom no-op host: creates executable behavior without
  a requirement and risks implying an approved service.
- Folder-only backend: simplest on disk but cannot satisfy independent build
  and test outcomes.

**Review/verification gate**: The user approved the non-executable foundation
and confirmed the full SDK pin 11.0.100 and internal-feed review. Compilation
and exact source behavior still require executable validation.

Official sources: [Target frameworks](https://learn.microsoft.com/en-us/dotnet/standard/frameworks)
and [global.json](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json).

## Decision 3: Default testing tools with real foundation assertions

**Decision (approved for implementation)**: Use Angular CLI's default Vitest/jsdom integration
where compatible with external test placement; use the SDK MSTest template for
backend foundation tests. Reuse Node's native runner for repository/CI-policy
acceptance checks. All test code and test setup stay under `tests/`.

**Rationale and framework justification**: There is no existing application
test framework to preserve. Angular's official testing guide identifies
Vitest/jsdom as defaults, avoiding a separate runner integration and browser
download for basic shell assertions. Microsoft documents `dotnet new mstest`
and `dotnet test` as a supported C# testing route; it is not a constitutional
mandate or proof of .NET 11 package compatibility. MSTest provides independently
executable C# validation without introducing a production framework.

Meaningful initial assertions include:

- Frontend: the neutral root shell renders its agreed semantic heading;
  test discovery includes external tests and excludes source/generated output.
- Backend: evaluated target framework and assembly/project inputs match the
  foundation boundary; forbidden cross-project/package references are absent;
  test files are not compiled into the application assembly.
- Repository: exactly two application boundaries; source/test/IaC separation;
  no speculative shared library, extra runtime, or member/HTTP sample behavior.
- CI: actual required checks execute and failures propagate; missing/zero tests,
  dependency-policy failures, deleted projects, and unavailable feeds do not
  report success.

These are project-foundation tests, not manufactured business logic.
Coverage of nonexistent business logic is N/A, not 100% or an empty passing
suite. The >=80% business-logic requirement and public-endpoint contract tests
apply when approved behavior exists. Do not add fake methods merely to collect
coverage. DOM emulation also does not prove browser/accessibility conformance.

**Alternatives considered**:

- Karma/Jasmine: Angular documents continued support, but choosing the legacy
  runner for a new workspace adds browser management without an existing need.
- Standalone Vitest configuration/custom builders: unnecessary integration
  before proving the default builder's layout support.
- xUnit/NUnit: valid candidates but no existing tests require them; MSTest is
  the proposed SDK-template route, still requiring human review.
- Node checks only: useful for layout and CI but insufficient on their own to
  demonstrate the frontend's rendering/test integration or .NET test setup.
- Always-true template tests or no discovered tests: rejected; they do not
  satisfy FR-007 or truthful CI.

**Review/verification gate**: Angular CLI's documented include paths are
relative to project source root. Its configuration supports test inclusion
and test TypeScript configuration, but documentation alone does not establish
that this repository's external `tests/unit/frontend/` paths work on the pinned
version. Validate discovery, compilation, import resolution, execution, and
exclusion from production output before acceptance. Keep test-only setup and
providers out of `src/`. If unsupported, stop for a reviewed compatible approach;
do not colocate tests or introduce another builder automatically.

The user confirmed review of the proposed MSTest tooling and .NET 11
compatibility. Verify exact external test discovery and execution before
acceptance. Native-runner checks should not become an alternative planning
workflow.

Official sources: [Angular unit testing](https://angular.dev/guide/testing),
[Angular test command](https://angular.dev/cli/test),
[Angular workspace configuration](https://angular.dev/reference/configs/workspace-config),
and [C# with MSTest](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-csharp-with-mstest).

## Decision 4: Separate dependency trees and fail-closed feeds

**Decision (approved for implementation)**: Retain the root package as repository tooling, add a
separate frontend manifest/portable lock only during authorized implementation,
and explicitly validate that tree before hosted retrieval. Do not introduce npm
workspaces. Configure approved internal non-npm sources before .NET retrieval.

**Rationale**: Existing `package.json` is tooling only.
`.github/scripts/ci-foundation.mjs` rejects manifest workspaces and unknown
identities and checks integrity/portable lock requirements.
`.npmrc` selects the internal npm registry and omits registry-resolved lock URLs.
The future frontend must not bypass these disclosure controls merely because
its packages are in a different directory.

**Alternatives considered**: A single root workspace or merged tooling/application
package would require a wider dependency-policy change and couple independent
validation; public npm locally or public non-npm fallback violates the
constitution. An unvalidated second lock on Actions risks disclosing private
package identities.

**Review/verification gate**: Classify all direct/transitive identities as public
or private through human review before populating a public inventory. Actions
may retrieve only reviewed public npm identities from public npm. Local npm,
private packages, and non-npm packages retain their required internal feeds.
Unknown identity, inaccessible audit service, missing credentials, unacceptable
license/vulnerability results, or feed failure blocks introduction. The
approved NuGet endpoint is
`https://packagefeedproxy.microsoft.io/nuget/v3/index.json`; it will be the
only source in repository configuration. Verify runner access before relying
on CI restores. Review any necessary package lifecycle script before enabling it.

Repository sources: [Constitution](../../.specify/memory/constitution.md),
[dependency tooling](../../docs/development-tooling.md),
[CI helper](../../.github/scripts/ci-foundation.mjs), and
[public tooling inventory](../../.github/ci/public-npm-packages.json).

## Decision 5: Activate CI with projects, not after them

**Decision (approved for implementation)**: Extend the existing application gate in the same future
change as project introduction. Provide executable independent build/tests,
truthful result aggregation, and regression tests; preserve separate
infrastructure validation and no deployment.

**Rationale**: `readiness()` currently returns `implemented: false`; affected
`src/` or non-tooling test files fail. The current workflow uses generic Node 22
and does not install a .NET SDK. These are intentional foundation limits, not
already-working application checks. New projects alone would leave CI red.

**Alternatives considered**: Set an unconditional implemented flag, skip missing
checks, loosen path selection, or suppress the readiness failure: rejected as
false success. Add a separate all-new CI platform: unnecessary scope. Activate
deployment after builds: expressly excluded.

**Review/verification gate**: Preserve stable result names and all-event workflow
activation; account for deletions/renames, shared/config/test changes, manual
runs, and fail-closed revision comparison. Verify nonzero test discovery and
failure propagation. Unknown/missing/blocked tools or scans must never become
“passed.” Keep least privilege and no cloud credentials. Add approved
language-specific validation when those files exist; review new linter packages
under the same dependency rules. The current workflow configures CodeQL, but
hosted analysis and enforcement, secret scanning, and push protection remain
unverified; the security gate stays blocked pending repository-admin
verification and hosted CI on this branch.

Repository sources: [Application workflow](../../.github/workflows/application-ci.yml),
[infrastructure workflow](../../.github/workflows/infrastructure-ci.yml),
[CI helper](../../.github/scripts/ci-foundation.mjs), and
[tooling guidance](../../docs/development-tooling.md).

## Decision 6: No domain model, shared contract, or infrastructure artifact

**Decision**: `data-model.md` and `contracts/` are inapplicable to this
contributor-only foundation and are not created. Do not create `src/shared/`,
integration/contract suites, or `infra/` without an approved concrete use.

**Rationale**: FR-005 requires real approved reuse; FR-006 and FR-009 prohibit
scope creep. There are no domain entities, persistence, external interface, or
public endpoints in 003. Internal build/test entrypoints belong in the
quickstart. Member models, API contracts, authentication/authorization,
telemetry/audit delivery, and hosting decisions belong to separately reviewed
feature work.

**Alternatives considered**: Empty API schemas, speculative shared DTOs, an
invented business model, or a runnable sample endpoint merely to exercise
contract tests would manufacture requirements.

The [architecture overview](../../docs/architecture/member-profile-overview.md),
[design review](../../docs/architecture/design-review.md), and
[infrastructure proposal](../../docs/architecture/azure-infrastructure.md)
were read as proposed context. Even where their tables call a direction
“selected,” their review status is proposed. They neither approve hosting for
003 nor authorize a third runtime/audit worker. No accepted ADR was present in
`docs/adr/` at inventory time. The separate architect owns the demo review.

## Source verification and limits

Official external pages cited for Angular compatibility/testing/configuration,
.NET target frameworks/SDK pinning, and MSTest were fetched successfully on
2026-11-16. Only public documentation URLs were requested; no repository source,
member data, credentials, or private package identities were submitted.
These sources support the claims above but are mutable and do not replace
review of exact pinned releases.

On 2026-11-16, the user approved the proposed baseline for validation and
approved the preconfigured internal NuGet source. Both internal npm and NuGet
service endpoints returned HTTP 200. The installed .NET SDK is 11.0.100 and
reports up to date, while the installed Node.js 26.13.0 is outside the
reviewed 24.x range. The NuGet source is
`https://packagefeedproxy.microsoft.io/nuget/v3/index.json`; CI runner access
has not yet been validated.

The internal NuGet search lists MSTest.TestFramework and MSTest.TestAdapter
4.5.3. Their registration metadata reports MIT licensing, and the internal
vulnerability index (updated 2026-11-14) contains no direct advisory entries
for either package ID. The SDK template dry-run identified the expected project
files but not package references. These package metadata checks do not establish
the template's exact dependency set or evaluate transitive packages; no NuGet
restore or package download was performed.

A disposable lock-only npm resolution through the approved internal feed
completed for candidate Angular 22.2.5, CLI/build 22.2.6, compiler-cli 22.2.5,
TypeScript 6.0.3, RxJS 7.8.2, Vitest 4.1.12, jsdom 31.0.0, tslib 2.9.1, and
zone.js 0.16.3. The subsequent `npm audit --audit-level=high` exited 0 and
reported zero vulnerabilities for that candidate graph. No package tarballs
were downloaded, and the temporary files were removed. Metadata checked for
`@angular/core`, `@angular/cli`, `@angular/build`, `@angular/compiler-cli`,
TypeScript, RxJS, Vitest, jsdom, tslib, and zone.js reported MIT for the Angular,
Vitest, jsdom, and zone.js packages, Apache-2.0 for TypeScript and RxJS, and
0BSD for tslib. This is not a reviewed license inventory for every package in
the lock. These candidates and results do not replace review of the final
manifest/lock or the additional linter and scanner dependencies.

At design time, no application scaffolding, application dependency manifests,
NuGet restore, compilation, external-test discovery, hosted CI run, browser
test, deployment, or performance measurement had occurred. Since then, scoped
implementation has added the Angular and host-neutral .NET projects, external
tests, and application CI commands. The Angular ESLint flat config is required
by the helper, which invokes frontend lint. Its nested lock is checked against
`.github/ci/public-npm-packages.json`, with a `minimatch` 11.0.1 override scoped
to `@typescript-eslint/typescript-estree`.

The tooling suite passed 23/23 tests; the foundation suite passed 8/8. Angular
lint/build/test passed locally with one test file and one test. Backend
formatting verification and tests passed with three tests. The NuGet
vulnerability command returned a successful machine-readable report with no
vulnerable-package entries. A prior isolated internal npm audit reported zero
vulnerabilities, but the latest integrated run stopped when the approved
internal feed's audit endpoint returned HTTP 429; that run is blocked and not a
full pass. Do not switch local dependency auditing to public npm.

The workflow configures CodeQL using `github/codeql-action` v3.39.3 at commit
`9418214df1f2c4b8128c770156c409013b07d6b9`, analyzing
`javascript-typescript` and `csharp` with `build-mode: none` and
`security-extended`. This is configuration evidence only. Hosted analysis,
required-result enforcement, secret scanning, and push protection remain
unverified; settings endpoints were inaccessible or returned 404, and `gh`
lacks `admin:repo_hook` scope for CodeQL setup. The security gate remains blocked pending repository-admin verification and
hosted CI on this branch. Markdown lint, formatting, and link checking passed
locally; link checking found zero failed links across 44 Markdown files. No
hosted CI run, deployment, business logic, or API performance measurement
occurred. Deployment remains disabled. T001 review approval remains the user's
explicit 2026-11-16 confirmation described above; these implementation checks
do not expand that approval or the feature scope.
