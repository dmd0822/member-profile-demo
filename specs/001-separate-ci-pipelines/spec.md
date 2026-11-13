# Feature Specification: Separate CI Foundation

**Feature Branch**: `dave-microsoft-separate-ci-pipelines`

**Created**: 2026-11-13

**Status**: Approved by the user as product owner and tech lead on 2026-11-13.

**Input**: User description: "Before we start with planning I want to set up CI/CD workflows. I want to separate Code from infrastructure." Follow-up: "PR is merged lets continue with building CI and CD pipelines."

Confirmed scope: "CI foundation with separate application and infrastructure workflows; no deployments until projects and approvals exist (Recommended)."

This specification serves contributors and reviewers who need trustworthy,
separate validation results before application and infrastructure projects exist.
Continuous integration (CI) checks changes; continuous delivery/deployment (CD)
is deferred. Requirements below describe proposed behavior, not existing pipelines.

## Clarifications

### Session 2026-11-13

- The user approved the CI-foundation scope as both product owner and tech lead
  and authorized planning and implementation. Deployment remains out of scope.
- No critical ambiguities remain after the scope and registry clarifications.
  Application runtime, scale, and deployment design are intentionally deferred.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Receive Separate, Truthful Validation Results (Priority: P1)

As a contributor, I want application and infrastructure validation to have
separate responsibilities so reviewers can identify what was checked, what
failed, and what cannot yet be checked.

**Why this priority**: Useful CI must run the repository's existing checks
without presenting absent projects as successfully built or tested.

**Independent Test**: Submit representative changes for each validation domain
and inspect their results. Existing repository tooling runs, failures remain
visible, and absent project checks are explicitly reported.

**Acceptance Scenarios**:

1. **Given** a change affecting only application responsibilities, **When** CI evaluates it, **Then** application validation is selected independently of infrastructure validation and absent application projects are reported as not implemented.
2. **Given** a change affecting only infrastructure responsibilities, **When** CI evaluates it, **Then** infrastructure validation is selected independently of application validation and absent infrastructure definitions are reported as not implemented.
3. **Given** changes to shared contracts, tests, dependency declarations, or validation configuration, **When** CI evaluates them, **Then** every affected domain runs its available checks; a cross-domain change selects both domains.
4. **Given** a documentation-only pull request, **When** CI completes, **Then** repository documentation checks run and required checks reach a terminal result rather than remaining pending because no workflow started.
5. **Given** an applicable repository-tooling check, **When** it fails or cannot execute, **Then** its result identifies failure or blockage and does not report success.

---

### User Story 2 - Validate Without Exposing Packages or Privileges (Priority: P2)

As a maintainer, I want dependency retrieval and validation permissions to respect
the execution environment so CI does not expose private packages, secrets, or
cloud resources.

**Why this priority**: Separating validation is useful only if it preserves
dependency-policy and security boundaries.

**Independent Test**: Evaluate local and GitHub Actions dependency retrieval,
including an unavailable feed and an untrusted pull request, using synthetic
package identities and no real credentials.

**Acceptance Scenarios**:

1. **Given** local npm use, **When** dependencies are requested, **Then** retrieval uses only the approved internal npm feed and failure does not cause public-registry fallback.
2. **Given** public npm dependencies in GitHub Actions, **When** retrieval occurs, **Then** it uses the public npm registry explicitly, without relying on or changing the local registry policy.
3. **Given** a private dependency or a non-npm package, **When** retrieval is needed in either environment, **Then** only an approved internal feed is eligible; unavailable access blocks retrieval without sending private package names, contents, or credentials to a public registry.
4. **Given** an untrusted pull request, **When** validation runs, **Then** it receives no secrets, privileged write access, or cloud access; checks that would require unavailable access report blockage rather than success.

---

### User Story 3 - Understand Readiness Without Enabling Deployment (Priority: P3)

As a reviewer, I want documentation and results to distinguish the CI foundation
from future full validation and deployment so I can assess readiness without
mistaking scaffolding for a releasable system.

**Why this priority**: Explicit limitations prevent premature deployment and
keep future activation subject to approved scope and governance.

**Independent Test**: Compare contributor guidance and CI results with the
repository's actual capabilities, then inspect every available invocation route
for an active deployment capability.

**Acceptance Scenarios**:

1. **Given** no application projects, infrastructure definitions, environments, or Azure targets, **When** any CI invocation occurs, **Then** no deployment, resource mutation, or cloud authentication occurs and no placeholder claims successful CD.
2. **Given** a reviewer consulting repository guidance, **When** they assess readiness, **Then** they can identify existing tooling checks, unavailable project and security checks, and prerequisites for future activation.
3. **Given** the foundation's tooling checks pass, **When** readiness is reported, **Then** that result does not claim full build, application-test, security-scan, or constitutional compliance and does not waive required human reviews.

---

### Edge Cases

- A change spans both domains or affects shared validation configuration: both responsible domains must be selected.
- A renamed or deleted file affects validation responsibility: selection must account for the affected former responsibility as well as the new one.
- A change affects only documentation or feature specifications: applicable tooling checks must run without leaving required checks pending.
- A feed is unreachable, rejects access, or cannot serve a dependency: retrieval stops with an explicit failure or blockage; no alternate registry is tried.
- A dependency lock references a registry inconsistent with the execution environment: retrieval must respect the environment policy or stop, never silently cross the boundary.
- A private dependency is introduced in an untrusted pull request: validation must not expose its identity or credentials publicly to obtain a passing result.
- A future project appears without approved validation capabilities: report the unmet prerequisites; neither silently omit its checks nor invent successful results.
- A link checker cannot reach a referenced destination: report the check failure, not a clean documentation result.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: CI MUST separate application and infrastructure validation into distinct workflows with independently identifiable responsibilities and results, consistent with the repository's established separation of application code under `src/` and infrastructure under `infra/`.
- **FR-002**: Each domain MUST evaluate relevant changes, including shared code or contracts, tests, dependency declarations and lockfiles, and configuration affecting its checks. Changes affecting both domains MUST select both. Selection MUST account for additions, modifications, renames, and deletions.
- **FR-003**: Documentation-only pull requests MUST run applicable repository-tooling checks. All required checks MUST reach a terminal result, including explicit non-applicability where appropriate, rather than remain pending due to change selection.
- **FR-004**: CI MUST actually execute the existing `npm run lint` and `npm run test:tooling` checks for applicable repository changes. Their results MUST distinguish successful execution from failure or inability to execute; formatting checks MUST NOT rewrite files.
- **FR-005**: Results MUST identify unavailable application build/test and infrastructure-validation capabilities as "not implemented" with the missing prerequisite. An applicable unavailable check MUST NOT be represented as passed or as harmlessly non-applicable. Successful tooling checks MUST NOT imply these capabilities exist.
- **FR-006**: Local npm retrieval MUST explicitly use `https://packagefeedproxy.microsoft.io/npm/`; GitHub Actions retrieval of public npm dependencies MUST explicitly use `https://registry.npmjs.org/`. Each environment MUST preserve the other's policy rather than making one global registry choice.
- **FR-007**: Private dependencies and non-npm packages MUST use approved internal feeds in every environment. Feed failures MUST stop retrieval without fallback. Private package names, credentials, and contents MUST NOT reach the public registry, including through lockfile references or error reporting.
- **FR-008**: Validation MUST use only the permissions needed for its checks. Untrusted pull requests MUST receive no secrets, privileged write access, or cloud access; missing access MUST be reported without weakening these restrictions. Credentials MUST NOT be committed or exposed in configuration, logs, or results.
- **FR-009**: No deployment path MUST be active in this foundation, regardless of invocation route. It MUST NOT authenticate to cloud targets, mutate cloud resources, or include fake CD placeholders or deployment-success reports.
- **FR-010**: Contributor documentation and affected README guidance MUST match delivered capabilities in the same change. They MUST describe validation responsibilities, change selection, registry differences, failure/blockage meanings, and unavailable checks, without implying existing application projects or working deployment targets.
- **FR-011**: Documentation MUST state that future full CI requires actual application and infrastructure projects, approved validation requirements, and executable checks. Future CD additionally requires approved deployment scope, targets, environments, identities and permissions, and required environment approvals. This foundation MUST NOT activate those capabilities automatically when files appear.
- **FR-012**: The foundation MUST preserve obligations for full build, tests, static application security testing (SAST), secret scanning, dependency scanning, and human review. Reports MUST identify unimplemented or blocked obligations, not substitute linting or tooling tests for them. New dependencies MUST retain license and vulnerability review; this specification grants no exception or security approval.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: For representative application-only, infrastructure-only, shared, test, configuration, rename, and deletion changes, 100% of affected validation responsibilities are selected and separately identifiable (FR-001–FR-002).
- **SC-002**: For documentation-only changes, 100% of applicable existing tooling checks execute and zero required checks remain pending solely because of change selection (FR-003–FR-004).
- **SC-003**: In every evaluated missing-project, failed-check, and unavailable-access case, reviewers can distinguish executed checks from failed, blocked, non-applicable, and not-implemented checks; zero unavailable checks are presented as successful (FR-004–FR-005, FR-012).
- **SC-004**: Across local, hosted, feed-failure, private-dependency, and mismatched-lockfile cases, 100% of dependency requests comply with the applicable environment policy or stop; zero fallbacks or disclosures to an unauthorized registry occur (FR-006–FR-007).
- **SC-005**: Across trusted and untrusted invocation cases, zero deployment operations occur; untrusted validation receives zero secrets, privileged write permissions, or cloud access (FR-008–FR-009).
- **SC-006**: A reviewer can identify all current checks, unavailable capabilities, and future activation prerequisites from contributor guidance and validation results, with zero claims of deployment readiness or waived security/review obligations (FR-010–FR-012).

## Assumptions

- Baseline evidence is the [root README](../../README.md), [root tooling package](../../package.json), [development tooling guide](../../docs/development-tooling.md), and [constitution](../../.specify/memory/constitution.md). The repository currently has no `src/`, `infra/`, application build/test projects, environments, Azure targets, or existing workflows. Root tooling tests are not application tests.
- The established future stack is Angular and .NET 11 for application work and Bicep for infrastructure. This specification neither selects an Angular version nor creates projects or their checks.
- Amendment [PR #4](https://github.com/dmd0822/member-profile-demo/pull/4) is verified merged. The user explicitly approved the amendment as tech lead and security champion. T001 reconciles stale proposed/adoption metadata and related guidance with that merged decision before implementation.
- The user separately approved this feature specification as product owner and tech lead on 2026-11-13 and authorized planning and implementation. Amendment approval and feature-spec approval are distinct.
- Required-check configuration and approved feed access are prerequisites to delivering the stated outcomes. Missing permissions or unavailable services must be surfaced, not bypassed. Tooling-only CI does not satisfy the constitution's full CI requirement; any governance exception requires separate review and approval.
- **Out of scope**: application or infrastructure scaffolding; application business-logic coverage measurements; choosing deployment destinations or environments; cloud provisioning or authentication; release publication; active CD, including manual deployment paths; application architecture planning; new constitutional policy changes; and granting approvals or branch-protection exceptions. The user authorized this tooling feature's implementation planning; reconciling merged amendment metadata does not expand policy.
