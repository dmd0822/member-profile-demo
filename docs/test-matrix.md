# Project test matrix

**Status:** Draft for review. This matrix is a project-wide reference, not an
approved feature specification, execution authorization, or release approval.
Its baseline reflects repository commit `dd28b5868c3e69a1380763ed392fc613e216b985`;
reassess it against current evidence before execution.

The suggested repository location is `docs/test-matrix.md`; relative links
assume that location.

## Scope and baseline

The matrix covers the [CI foundation (001)](../specs/001-separate-ci-pipelines/spec.md),
the [initial application projects (003)](../specs/003-initial-app-projects/spec.md),
and the [member-profile demo (002)](../specs/002-member-profile-demo/spec.md).
The [constitution](../.specify/memory/constitution.md) and
[QA guidance](../.github/instructions/qa.instructions.md) remain authoritative.

The current application is an Angular shell and a host-neutral .NET library.
Existing tests cover the shell, project boundaries, and repository tooling;
there is no member API, persistence, or member-domain behavior yet. The 003
foundation is implemented within its approved scope, but some validation
remains blocked. The 002 specification is approved for planning only; its
design, security, and privacy reviews remain open. Its
[plan](../specs/002-member-profile-demo/plan.md),
[API contract](../specs/002-member-profile-demo/contracts/api-v1.md), and
[UI flows](../specs/002-member-profile-demo/contracts/ui-flows.md) are proposed.

The [README](../README.md) records earlier local foundation and tooling results.
It also records an HTTP 429 blocking the latest integrated npm audit, no
verified 003 hosted CI run, and unverified security-control enforcement. Those
historical results are not fresh evidence for this matrix.

### Reading the matrix

- **Trace:** `001`, `002`, and `003` identify the feature specification; `FR`,
  `NFR`, `SC`, and `US` identify its requirement, nonfunctional requirement,
  success criterion, and user story.
- **Priority:** `P0` proposes the highest attention for privacy, authorization,
  or data-integrity risks; `P1` covers other release risks; `P2` is additional
  proposed resilience coverage. These are test priorities, not changes to
  specification story priorities or an approved defect-severity policy.
- **Owner / target:** `U / ?` means owner **unassigned** and execution target
  **unresolved**. Replace both for each scenario before authorizing execution.
- **Coverage:** `Existing` identifies a corresponding test in the repository;
  `Partial` identifies only part of the stated evidence; `Proposed` means the
  scenario has not been implemented. Existing coverage is not a passing result.
- **Execution:** `Not run` means not run while drafting this matrix; `Blocked`
  means it cannot yet be executed as described. Future results must distinguish
  passed, failed, blocked, and not run, with dated evidence. No scenario below
  is claimed to have passed in this review.
- **Evidence:** Existing test links identify coverage only. Other evidence is
  expected and missing until an authorized run or review records it.

The matrix maps every 001 and 003 functional requirement, and every 002
functional requirement plus NFR-001, to at least one initial scenario. It does
not yet enumerate every acceptance-criterion permutation or prove coverage.

## Existing foundation and CI

The 003 scenarios describe the initial foundation's scope. Its restrictions on
member behavior are not a permanent ban on separately approved 002 work.

<!-- prettier-ignore -->
| ID | Trace | Priority / risk | Setup and action | Expected outcome | Level / method | Owner / target | Coverage | Execution | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FND-001 | 003 FR-001-003, FR-006, FR-009 | P1 / misplaced projects | Inspect the initial source and infrastructure layout. | Exactly one frontend and one backend have distinct responsibilities; runtime and infrastructure files stay in their respective roots; the foundation adds no member behavior. | Layout / automated | U / ? | Existing | Not run | [Boundary tests](../tests/unit/foundation/project-boundaries.test.mjs); result and revision. |
| FND-002 | 003 FR-004-005 | P1 / invalid test or sharing boundary | Inspect test categories, shared code, and frontend references, including negative fixture cases. | Tests remain outside source in approved categories; no unjustified shared library or frontend dependency on backend implementation is introduced. | Layout / automated | U / ? | Existing | Not run | [Test-boundary tests](../tests/unit/foundation/test-boundaries.test.mjs); result and revision. |
| FND-003 | 003 FR-007, FR-009 | P1 / empty foundation checks | Exercise the current frontend shell and backend boundary suites. | The neutral shell renders its heading; the backend targets the approved framework and preserves its project-reference boundaries. | Unit / automated | U / ? | Existing | Not run | [Frontend test](../tests/unit/frontend/app-shell.spec.ts) and [backend tests](../tests/unit/backend/FoundationBoundaryTests.cs); discovered counts and results. |
| FND-004 | 003 FR-007, SC-003 | P1 / false-green builds | Independently build and run each application's tests; include a controlled failing assertion and nonzero discovery checks. | Both projects build and test independently; a real failing assertion causes a failing result and an empty suite is not reported as successful. | Build and test / automated | U / ? | Partial | Not run | Independent build/test results, discovered counts, and controlled-failure evidence; current setup is described in the [README](../README.md). |
| CI-001 | 001 FR-001-002, FR-004, SC-001 | P1 / missed validation | Classify synthetic application, infrastructure, shared, test, configuration, rename, and deletion changes. | Every affected domain is selected independently, including both old and new responsibilities for renames. | CI selection / automated | U / ? | Existing | Not run | [CI selection tests](../tests/unit/tooling/ci-foundation.test.mjs); scenario-by-scenario selection results. |
| CI-002 | 001 FR-003-004, SC-002 | P1 / pending or unnecessary checks | Submit a synthetic documentation-only change through the applicable validation path. | No npm command runs for the change; applicable checks reach a truthful terminal result rather than remaining pending. | CI / automated | U / ? | Partial | Not run | [Local docs-only test](../tests/unit/tooling/ci-foundation.test.mjs) plus separately obtained hosted check results. |
| CI-003 | 001 FR-006-008, SC-004 | P0 / dependency disclosure | Use synthetic public/private package metadata and an unavailable approved feed in local and hosted-policy cases. | Public npm dependencies use the environment's approved registry; private and non-npm dependencies use approved internal feeds; failures stop without fallback or disclosure to public npm. | Policy / automated | U / ? | Partial | Not run | [Registry and policy tests](../tests/unit/tooling/ci-foundation.test.mjs); sanitized request and failure assertions. |
| CI-004 | 001 FR-005, FR-009, FR-011 | P1 / false deployment readiness | Select synthetic application and infrastructure changes with required validation unavailable; inspect CI invocation paths. | Missing applicable validation is reported as blocked or not implemented, never passed; no deployment or cloud authentication is implied. | CI readiness / automated and review | U / ? | Partial | Not run | [Readiness and workflow tests](../tests/unit/tooling/ci-foundation.test.mjs); hosted results when authorized. |
| CI-005 | 001 FR-012; 003 FR-007 | P1 / missing security gates | Review required build, test, SAST, secret-scan, and dependency-scan results and their enforcement for an applicable change. | Unavailable or unenforced controls are visible as blockers, not passes; required checks and human review remain in place. | CI and administration / manual review | U / ? | Partial | Blocked | Hosted run and authorized repository-admin verification; latest integrated npm audit was documented as blocked by HTTP 429. |
| CI-006 | 001 FR-008-009, SC-005 | P0 / untrusted access | Review workflow permissions and an authorized synthetic untrusted pull-request validation. | Untrusted validation receives no secrets, privileged write access, or cloud access; permissions are limited to the applicable checks and no deployment occurs. | Workflow and hosted CI / automated and manual | U / ? | Partial | Blocked | [Workflow tests](../tests/unit/tooling/ci-foundation.test.mjs) and separately authorized hosted permission evidence. |
| DOC-001 | 001 FR-010-011; 003 FR-008 | P1 / misleading guidance | Review contributor guidance against the delivered projects, CI responsibilities, registries, and future validation and deployment prerequisites. | Guidance matches implemented behavior and clearly identifies blocked capabilities and prerequisites for future validation and deployment. | Documentation / manual review | U / ? | Proposed | Not run | Reviewed [README](../README.md), [tooling guide](development-tooling.md), and identified corrections. |

## Proposed member-profile demo

All scenarios in this section are **proposed and blocked**: the corresponding
member behavior is not implemented, required design/security/privacy decisions
are pending, and test targets have not been approved. Method and infrastructure
choices below are proposals unless the specification or constitution requires
them. Each scenario requires separately authorized execution.

<!-- prettier-ignore -->
| ID | Trace | Priority / risk | Setup and action | Expected outcome | Level / method | Owner / target | Coverage | Execution | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP-001 | 002 US1; FR-001-002 | P0 / identity | Attempt sign-in with valid, invalid, expired, and previously used email codes; attempt protected access with invalid credentials. | A valid member can sign in; invalid, expired, or reused codes do not authenticate; invalid credentials do not expose protected data. | Provider journey and API authorization / manual and automated | U / ? | Proposed | Blocked | Sanitized outcome for each case; no codes or tokens. |
| MP-002 | 002 US1; FR-003 | P1 / incomplete enrollment | Submit all five required fields, then omit each field in a separate attempt. | A complete submission is recorded pending verification; every missing field is identified and the incomplete submission is rejected. | Component and integration / automated | U / ? | Proposed | Blocked | Per-field validation and pending/no-commit assertions. |
| MP-003 | 002 US1-US2; FR-002-003, FR-005; SC-002 | P0 / disclosure before verification | Give member A a pending enrollment; have member B access it. Attempt profile edits and claims using only a matching email or number. | A can see only their own submission and cannot edit a profile; B sees no details; matching identifiers alone grant no link, access, or confirmation that a profile exists. | Authorization integration and journey / automated | U / ? | Proposed | Blocked | Denial, non-disclosure, and unchanged-link assertions. |
| MP-004 | 002 US2; FR-004, FR-006; SC-001 | P0 / incorrect linking | Entitled staff verify one pending enrollment against an existing unlinked profile and another by creating a profile. | Each applicant gains access only to the correct profile; the new profile gets a unique member number; verification is identified as simulated. | Integration and journey / automated and UAT | U / ? | Proposed | Blocked | Both verification paths, access, and uniqueness assertions. |
| MP-005 | 002 US2, US6; FR-002, FR-005-006; SC-002 | P0 / unauthorized staff action | Attempt a link to a profile already linked to another verified account; have a nonstaff account attempt verification, search, and profile update. | The conflicting link is refused; nonstaff actions are denied without disclosure or mutation. | Authorization integration / automated | U / ? | Proposed | Blocked | Denial, non-disclosure, and unchanged-state assertions. |
| MP-006 | 002 US3; FR-007-008 | P1 / incorrect self-service | A verified member views their profile and active and ended memberships, updates each allowed contact field, attempts restricted edits, and signs in again. | All five profile fields and membership history are visible; allowed changes save; name, date of birth, and membership are not directly editable; sign-in email and the verified association remain unchanged. | Component, service, and journey / automated | U / ? | Proposed | Blocked | Per-field, restricted-edit, identity, and link assertions. |
| MP-007 | 002 US3, US8; FR-002, FR-007, FR-012; SC-002 | P0 / cross-member access | Members A and B have separate profiles, memberships, and requests; A attempts to read or change B's data. | B's details and request outcomes are not disclosed, and no unauthorized mutation succeeds. | API authorization / automated | U / ? | Proposed | Blocked | Server-side denial, non-disclosure, and unchanged-state assertions. |
| MP-008 | 002 US6; FR-006, FR-008; SC-004 | P1 / staff maintenance | Entitled staff create and update profiles with associated synthetic memberships, then search by member number, membership number, name, and contact email. | Generated member numbers are unique, authorized edits save, and each supported search returns matching profiles without changing identity associations. | Service and UI / automated and UAT | U / ? | Proposed | Blocked | Search-category, field-update, uniqueness, and identity assertions. |
| MP-009 | 002 US7; FR-009-010; SC-004, SC-006 | P1 / membership history | Add multiple memberships; test a missing start date, absent end date, equal start/end dates, an end before the start, and an ended membership. | Each record has a unique number, type, status, and start date; optional and equal end dates are accepted; missing start or earlier end is rejected; ended records retain numbers and dates. `Demo type A`, `Demo type B`, `Demo active`, and `Demo ended` are labeled demo-only. | Rules, SQL integration, and UI / automated | U / ? | Proposed | Blocked | Date-boundary, uniqueness, label, and history assertions. |
| MP-010 | 002 US8; FR-011-012, FR-016; SC-006 | P1 / misleading handoff | Submit a request for an owned membership; have staff locate it; exercise a simulated handoff failure. | Submission does not change membership; the handoff is labeled simulated; failure does not imply an external review or approval. | Service and journey / automated and manual | U / ? | Proposed | Blocked | Request-state, simulated-label, failure, and unchanged-membership assertions. |
| MP-011 | 002 US8; FR-012-013; SC-003 | P0 / unreviewed change | Staff record a simulated approval; the member views it; staff then explicitly apply the approved change. | Approval alone does not change membership; only successful explicit application updates it and marks the request applied. | Integration and journey / automated and UAT | U / ? | Proposed | Blocked | Approval-to-application sequence and before/after state assertions. |
| MP-012 | 002 US8; FR-013; SC-003 | P0 / rejected change applied | Attempt to apply a submitted request, record rejection, and attempt application again. | Neither attempt changes membership; rejection is visible to the owning member and cannot be applied. | Service and API integration / automated | U / ? | Proposed | Blocked | Denial, visible outcome, and unchanged-membership assertions. |
| MP-013 | 002 US4, US8; FR-016; SC-003 | P0 / partial or false success | Inject a known noncommitting review-recording failure and a separate membership-update failure. | Failures are reported safely; failed application leaves the request approved but not applied and the membership unchanged. Errors provide a reference without member data or stack traces. | Fault integration and UI / automated and manual | U / ? | Proposed | Blocked | Sanitized error/reference and request/membership state assertions. |
| MP-014 | 002 US4; FR-014; SC-005 | P0 / missing audit | Perform each state-changing operation and representative failed attempts while audit recording is available. | Every successful change has an audit event with opaque actor reference, operation or changed field names, time, and outcome; failed attempts are recorded when available; events contain no profile values. | Audit integration / automated | U / ? | Proposed | Blocked | Mutation-to-audit inventory and field/outcome/redaction assertions. |
| MP-015 | 002 US4, US8; FR-014, FR-016; SC-005 | P0 / unaudited mutation | In an approved isolated environment, inject a known precommit audit-write failure for representative changes, including request application. | No successful unaudited change is committed; failure is reported; failed application leaves the request approved and membership unchanged. | Real-SQL fault integration / automated | U / ? | Proposed | Blocked | Sanitized database, audit, and failure assertions; no assumed failure audit when unavailable. |
| MP-016 | 002 US2, US6-US7; FR-005-006, FR-009; SC-004 | P0 / conflicting links or numbers | In an approved isolated SQL environment, race conflicting profile links and exercise generated-number collisions using a reviewed method. | A conflicting link grants no access; member numbers and membership numbers remain unique in their respective categories. Race arbitration and collision handling remain proposed design details. | Real-SQL concurrency integration / automated | U / ? | Proposed | Blocked | Sanitized race outcomes, final link state, and uniqueness assertions. |
| MP-017 | 002 US8; FR-013, FR-016; SC-003 | P2 / concurrency and uncertain outcomes | Propose concurrent or repeated application, a competing membership edit, cancellation, and a lost acknowledgment. | Specified failed updates remain unchanged and are not reported applied. Retry, duplicate-application, and stale-write expectations require design review before becoming assertions. | Resilience integration / automated and manual | U / ? | Proposed | Blocked | Reviewed expected behavior, sanitized attempt timeline, and final-state assertions. |
| MP-018 | 002 FR-001-002, FR-016; constitution IV, VI | P1 / contract drift | After contract review, exercise every delivered public method with authorized and unauthorized callers, valid and invalid inputs, and foreign resources. | Methods, routes, versions, inputs, outputs, headers, statuses, and error schemas match the approved contract; errors are safe and referenced; breaking public changes use a new major version. | API contract / automated | U / ? | Proposed | Blocked | Reviewed endpoint inventory, positive/negative contract results, and compatibility comparison. |
| MP-019 | 002 US4; FR-015; SC-005-006; constitution II-III, V | P0 / privacy or exposed data service | Review synthetic-data handling and, in an approved target, inspect data-service and telemetry protections. | Logs and traces contain no personal or account data, codes, tokens, or request/response payloads. Data is encrypted at rest and in transit, privately accessed, and stored in approved US regions; identity and telemetry controls follow the constitution. | Privacy and configuration review / automated and manual | U / ? | Proposed | Blocked | Sanitized redaction results and reviewed encryption, region, access, identity, and telemetry evidence. |
| MP-020 | 002 US5; FR-017; SC-007 | P1 / inaccessible journeys | Complete member and staff flows with keyboard and screen reader, including validation failures and hosted code paste; supplement with automated checks. | Controls are operable with visible focus; labels, instructions, and text errors are available to assistive technology; errors do not rely on color; code paste works. | Accessibility UI / automated and manual | U / ? | Proposed | Blocked | Per-flow observations and sanitized reports with browser and assistive-technology versions. |
| MP-021 | 002 NFR-001; SC-008 | P1 / peak latency | After product-owner agreement, exercise the agreed synthetic workload with ramp-up, peak steady state, and ramp-down. | At agreed peak, API p95 is under 300 ms and at least 95% of requests complete in under 300 ms. | API load / automated | U / ? | Proposed | Blocked | Approved workload and basis, environment, volumes, duration, measurement boundary, latency distribution, throughput, and errors. |
| MP-022 | 002 US1-US8; SC-001, SC-006 | P1 / incomplete demo | Reviewers demonstrate all eight stories using isolated synthetic data, including existing-profile and new-profile verification. | Each story meets its acceptance criteria; reviewers can distinguish synthetic data and simulated handoffs from production processes. | End-to-end and UAT / manual | U / ? | Proposed | Blocked | Sanitized per-story outcomes, reviewer decisions, and defect dispositions. |

## Prerequisites, evidence, and gates

### Test data and environments

- Use generated synthetic identities and records that do not identify real
  people. As needed, provision separate pending and verified members, another
  member, entitled staff, and nonstaff actors in an authorized isolated target.
- Agree on identity and data setup, collision-safe run identifiers, isolation,
  retention, reset, and cleanup for both success and failure. Preserve required
  audit evidence according to the reviewed retention rules.
- Never put personal information, real account data, credentials, codes, tokens,
  or sensitive payloads in fixtures, logs, traces, screenshots, or reports.
  Audit records must not contain profile values. Do not weaken authorization,
  identity, validation, or scans to enable testing.
- SQL integration evidence must exercise the real SQL boundary in a separately
  approved isolated environment; a database mock cannot prove transactions or
  constraints. No environment, cloud resource, or deployment is authorized by
  this document.

### Entry and execution

- Record the applicable design, security, and privacy decisions before 002
  implementation. Obtain separate authorization for each test activity, its
  scope and target, and required environment, identity, data, and tooling
  approvals before execution.
- Derive tests from acceptance criteria and observe a behavioral assertion fail
  before implementation. Missing tools, feeds, compilation, or environments
  are blockers, not valid fail-first evidence.
- Agree on the browser and assistive-technology matrix. WCAG 2.2 AA is a
  **proposed review baseline**, not an accepted conformance claim.
- The product owner must agree on expected peak workload and its basis before
  performance validation. Stress and soak tests, their durations, and their
  thresholds are additional proposals requiring review.
- Use fast checks for early feedback. Required premerge contract, integration,
  build, test, SAST, secret, and dependency checks cannot be replaced by
  scheduled or postmerge suites.

### Proposed exit criteria

- All applicable required scenarios pass with recorded, sanitized evidence;
  demonstrate the eight 002 stories and disposition defects and residual risks.
- Contract-test every delivered public API endpoint and measure at least 80%
  line coverage on business logic. Neither applies to nonexistent endpoints or
  business logic in the current foundation.
- At the agreed peak workload, demonstrate API p95 under 300 ms and at least
  95% of requests under 300 ms. An unknown workload or unrun measurement is not
  a pass.
- Required CI checks and at least one approving PR review are complete, and
  applicable human and environment approvals are recorded. Blocked, failed, and
  unrun checks are not passing checks.

### Evidence and unresolved decisions

For each future result, record the scenario ID, revision, date, approved target,
test method, assertion outcomes, sanitized artifacts, owner, and cleanup
outcome. For defects, record impact and severity, sanitized reproduction,
expected versus actual behavior, environment/version, owner, retest criteria,
and regression coverage.

Owners, execution targets, data-retention rules, browser and assistive
technology combinations, and the peak workload remain unresolved. The 002
identity, API, SQL, and concurrency design and required security/privacy
decisions remain under review. Existing 003 hosted CI and repository security
enforcement require verification; the previously rate-limited audit requires a
new authorized result.

Production deployment, recovery objectives, rollback/restore procedures, and
runtime AI behavior are outside the current demo scope. Add release-recovery or
AI scenarios only when those capabilities and their approval criteria are
separately defined.
