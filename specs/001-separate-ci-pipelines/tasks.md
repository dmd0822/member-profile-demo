# Tasks: Separate CI Foundation

**Input**: [Approved spec](spec.md), [plan](plan.md), [research](research.md),
[internal data model](data-model.md), and [validation guide](quickstart.md).

**GitHub Milestone**: <https://github.com/dmd0822/member-profile-demo/milestone/1>

**Tests**: Acceptance-based tests fail before implementation, as required by the
constitution. No runtime projects, public APIs, or deployment contracts exist.

## Phase 1: Setup

- [x] T001 Reconcile adopted registry metadata in `.specify/memory/constitution.md` and registry guidance in `README.md`, `docs/development-tooling.md`, and `.github/copilot-instructions.md`, following merged PR #4 without expanding policy. [Issue](https://github.com/dmd0822/member-profile-demo/issues/7).

## Phase 2: Foundational

- [x] T002 Write and observe failing acceptance tests in `tests/unit/tooling/ci-foundation.test.mjs` for routing, rename/deletion, Git failures, missing capabilities, registry/source rejection, and workflow invocation boundaries (FR-001 through FR-009, FR-012). Depends on T001. [Issue](https://github.com/dmd0822/member-profile-demo/issues/5).

## Phase 3: User Story 1 - Separate Truthful Validation (P1)

**Goal**: Distinct stable CI results with explicit unavailable capabilities.

**Independent test**: Classify synthetic domain changes; inspect both workflow
triggers and read-only permissions; exercise failed comparisons and missing checks.

- [x] T003 [US1] Implement `.github/workflows/application-ci.yml`, `.github/workflows/infrastructure-ci.yml`, and routing/reporting in `.github/scripts/ci-foundation.mjs`; execute existing tooling once and block changes needing unavailable project validation (FR-001 through FR-005, FR-008, FR-009). Depends on T002; execution integrates T004. [Issue](https://github.com/dmd0822/member-profile-demo/issues/6).

## Phase 4: User Story 2 - Registry and Privilege Boundaries (P2)

**Goal**: Explicit environment-specific retrieval without fallback or exposure.

**Independent test**: Validate synthetic unknown names, aliases, URL sources,
registry-specific locks, and allowed locked public identities without networking.

- [x] T004 [US2] Implement package-policy checks in `.github/scripts/ci-foundation.mjs`, public inventory in `.github/ci/public-npm-packages.json`, and portable `.npmrc`/`package-lock.json`; preserve versions/integrity, disable restore scripts, and stop before public requests on rejection (FR-006 through FR-008, FR-012). Depends on T002; sequential with T003 because they share a helper. [Issue](https://github.com/dmd0822/member-profile-demo/issues/8).

## Phase 5: User Story 3 - Readiness Without Deployment (P3)

**Goal**: Accurate current capabilities and explicit future activation requirements.

**Independent test**: Compare guidance and reported statuses with implemented
commands; verify no deployment or cloud-authentication route exists.

- [x] T005 [US3] Update `README.md`, `docs/development-tooling.md`, and `specs/001-separate-ci-pipelines/quickstart.md` with actual workflow names, triggers, validation commands, missing checks, required-check setup, and deferred CD prerequisites (FR-010 through FR-012). Depends on T003 and T004. [Issue](https://github.com/dmd0822/member-profile-demo/issues/10).

## Phase 6: Polish and Cross-Cutting Validation

- [ ] T006 Run focused tests, existing tooling, YAML semantics, registry-portability checks, and convergence; record actual evidence and unresolved hosted validation in `specs/001-separate-ci-pipelines/tasks.md` and `quickstart.md`. Depends on T003, T004, and T005. [Issue](https://github.com/dmd0822/member-profile-demo/issues/9).

## Dependencies and Execution Order

T001 -> T002 -> T003 / T004 -> T005 -> T006.
T003 and T004 have the same prerequisite but share a helper and are implemented
sequentially. No task is marked parallel-safe merely because it appears nearby.
US1 routing can be tested independently of US2 dependency retrieval. US3 describes
both delivered stories and therefore follows them.

## Parallel Examples

Within US1, independent synthetic path cases can run through Node's test runner.
Within US2, independent package-policy cases can run without network access.
Within US3, review the README and tooling guide together against the same behavior.
No separate implementation workers or speculative workstreams are needed.

## Implementation Strategy

Complete governance reconciliation and observe red tests first. Deliver US1's
minimal separated checks, integrate US2 before executing any restore, then
document US3 and validate. No deployment occurs at any checkpoint. Track hosted
execution and branch-protection setup as unresolved until actually observed.

## Validation Evidence and Blockers

- T002: initial focused test execution failed because the helper did not exist.
  Workspace/lock-alias rejection cases subsequently failed before their guard
  fixes. The final focused suite passes all eight tests; the combined tooling
  suite passes all twelve.
- T003/T004: the infrastructure entrypoint succeeds without cloud access. The
  application entrypoint restores 77 packages through local internal npm and
  passes tooling tests, Markdown lint, formatting, and external/local link checks.
- Lock comparison against the pre-change tree verifies that only the 77
  registry-specific `resolved` fields were removed; versions and integrity are
  unchanged. The real manifest/lock passes the public-package policy check.
- Both workflow YAML documents parse with the existing `js-yaml` dependency;
  event sets, main push branch, job shape, and permissions were checked.
  `actionlint` is unavailable; parsing/unit checks are not a claim it ran.
- T006 remains open: the local approved-feed audit initially failed DNS and then
  returned HTTP 429 on a bounded recheck. No public-registry fallback was used.
  The application entrypoint correctly fails instead of claiming audit success.
- Hosted Actions execution, Node.js 22 runner behavior, public-registry retrieval,
  fork permissions, and required-check configuration have not been observed.
  Local commands ran on the available Node.js 26 runtime; no Node.js 22 result is
  claimed. No deployment or branch-protection changes occurred.

## Phase 7: Convergence

- [ ] T007 Verify hosted terminal checks, Node.js 22 execution, public-registry resolution, domain/rename/deletion selection, fail-closed missing capabilities, and fork permissions; record actual run evidence in `specs/001-separate-ci-pipelines/quickstart.md` per SC-001 through SC-005 and T006 (partial, HIGH). Depends on T003, T004, and T005; unblocks T006. [Issue](https://github.com/dmd0822/member-profile-demo/issues/11).
- [ ] T008 Obtain and record an actual local vulnerability-audit result through the approved internal feed in `specs/001-separate-ci-pipelines/quickstart.md` when its DNS/rate-limit blocker clears, without public fallback or weakening checks, per FR-012, SC-003, and T006 (partial, MEDIUM). Depends on T004; unblocks T006. [Issue](https://github.com/dmd0822/member-profile-demo/issues/12).

Post-convergence local recheck: Markdown lint and formatting passed; the link
checker reported zero failed links but its Node.js 26 process did not exit after
the results. The owned validation process was stopped, not recorded as a passing
final `npm run lint` exit. The earlier application-entrypoint run did finish lint
before failing audit. T006/T007 must verify real terminal outcomes; no Node.js 22
hosted result is inferred from this local behavior. Syntax and diff checks pass.
