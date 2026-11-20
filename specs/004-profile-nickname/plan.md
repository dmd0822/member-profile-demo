# Implementation Plan: Profile Nickname

**Branch**: `dave-microsoft-profile-nickname` (assigned checkout) | **Date**:
2026-11-20 | **Spec**: [Profile nickname](spec.md)

**Input**: `specs/004-profile-nickname/spec.md`. Spec Kit resolves the feature
identifier as `004-profile-nickname`; this is not the physical branch name.

**GitHub Milestone**: [004 Profile nickname](https://github.com/dmd0822/member-profile-demo/milestone/4).
The milestone links the specification and plan. Task issues are created or
reused in the later tasks phase, not by this plan.

**Status**: Proposed design. Dave Davis (@dave-microsoft), acting as product
owner and tech lead, approved the spec for planning on 2026-11-20. Design,
security and privacy reviews remain open. This plan does not authorize
implementation, infrastructure changes or deployment.

## Summary

Propose an optional member-managed nickname on the existing member profile.
The verified owner may add, change or clear it; the owner and entitled staff
see it on profile views. It remains separate from the profile name and is not
an identifier. Reuse the proposed 002 profile, authorization, conditional
write and atomic audit boundaries instead of introducing a separate service.

The Angular and .NET foundation exists, but the member profile journeys, API,
database and hosting described in [002](../002-member-profile-demo/plan.md)
are proposed and unimplemented. This feature depends on those journeys and
must not be treated as an independently deployable patch to an existing API.

## Technical Context

**Language/Version**: Angular 22.2.5, Angular CLI/build 22.2.6, TypeScript
6.0.3, Node.js 24.22.3 and RxJS 7.8.2; C# targeting .NET 11 with SDK
11.0.100. See the [003 foundation plan](../003-initial-app-projects/plan.md)
for the reviewed baseline and its limitations.

**Primary Dependencies**: Reuse the existing Angular and .NET foundation and
the 002 dependencies if they are separately approved. No new dependency is
proposed by this feature. Package additions remain subject to feed, license,
vulnerability and compatibility review.

**Storage**: Proposed optional Unicode value on the 002 Azure SQL member
profile. Exact bounds, characters, normalization and migration approach require
review; no silent truncation. No new cloud resource is identified.

**Testing**: Acceptance-derived Angular unit, .NET unit/integration and public
API contract tests outside `src/`. Write tests and observe behavioral failure
before implementation. SQL-provider tests are needed for conditional writes
and atomic audit; unit doubles alone cannot prove transaction behavior.

**Target Platform**: Browser frontend and future Azure-hosted backend; hosting,
private SQL and identity environment are not provisioned or approved by this
plan.

**Project Type**: One Angular frontend and the existing .NET backend boundary.

**Performance Goals**: The constitutional API p95 target is under 300 ms at
the product-owner-agreed expected peak workload. The workload and measurement
basis are not yet agreed; no performance result is claimed.

**Constraints**: Synthetic data only; private data-service access, approved US
residency, encryption, verified ownership, staff entitlement, accessible
controls, privacy-safe telemetry and audit. Nickname values are not logged,
traced, placed in audit events or used in AI prompts.

**Scale/Scope**: One optional profile value and its own member/staff profile
views. Staff editing, nickname search, enrollment collection and external
sharing are excluded. Capacity, retention and production rollout assumptions
are not selected.

## Constitution Check

The following assessments cover planning only, before research and after the
proposed design. Passing them does not represent implemented controls.

<!-- prettier-ignore -->
| Principle or constraint | Before Phase 0 | After Phase 1 | Evidence and remaining gate |
| --- | --- | --- | --- |
| I. Spec before code | Pass | Pass | Named PO/tech lead approval in [spec](spec.md); no open clarification marker. Reconcile the 002 contact-only rule before implementation. |
| II. Security and identity | Pass for planning | Pass for planning | Reuse proposed verified ownership and workforce entitlement. Tech lead/security review remains required. |
| III. Data protection/privacy | Pass for planning | Pass for planning | Nickname is sensitive; private, encrypted US data and safe telemetry are required. Classification and privacy review remain open. |
| IV. Test-first quality | Pass for planning | Pass for planning | Fail-first acceptance tests, public endpoint contracts and at least 80% business-logic line coverage are required; none are claimed. |
| V. Observability/audit | Pass for planning | Pass for planning | Proposed nickname mutation and value-free audit commit together; failures are reported safely. Review and SQL validation remain required. |
| VI. Simplicity/maintainability | Pass | Pass | Reuse the profile model and versioned API; no new service. Contract compatibility and any major-version need require review. |
| VII. Responsible AI | Not applicable | Not applicable | No member-facing AI behavior is proposed; nickname values must not enter AI prompts. |
| VIII. Documentation current | Pass | Pass for planning artifacts | Related 002 specs, contracts, backlog, issues and delivered docs must be reconciled in approved subsequent work. |
| Stack, dependencies and infrastructure | Pass for planning | Pass for planning | 003 baseline and constitutional stack retained; no dependency, cloud resource or deployment is introduced. |
| Performance and tracking | Pass for planning | Pass for planning | Peak workload is a validation gate. Milestone is recorded; later tasks require linked issues. |

### Approval and sequencing gates

1. Reconcile the approved-for-planning nickname exception with 002 FR-007,
   data model, contracts, UI flows, quickstart and T008/T009 plus their linked
   issues. Review affected 002 planning and delivery documents, including
   documentation and acceptance evidence. Update tracking in the same approved
   work; do not silently change the already-reviewed 002 scope.
2. Obtain product, design, security and privacy decisions on input limits,
   allowed characters and normalization. Tech lead and security champion review
   API compatibility, ownership, conditional writes and atomic audit; the
   privacy owner reviews classification, access and telemetry. Record actual
   decisions before implementation.
3. Complete the applicable 002 foundational profile, identity, authorization,
   audit and semantic UI prerequisites, and obtain explicit implementation
   authorization. The 003 foundation alone is not a member profile service.
4. Review the existing CodeQL configuration conflict: the [PR 71 CodeQL SAST
   upload](https://github.com/dmd0822/member-profile-demo/actions/runs/44773821246/job/136418184478)
   failed because default CodeQL setup was enabled. Required CI, secret scanning
   and enforcement remain subject to actual verification; do not disable
   security checks to make the feature pass.
5. Before environment-dependent or performance validation, obtain approved
   environment access and agree the peak workload and basis. No provisioning
   or deployment is authorized here.

## Project Structure

### Documentation

```text
specs/004-profile-nickname/
  spec.md
  plan.md
  research.md
  data-model.md
  contracts/profile-nickname.md
  quickstart.md
  checklists/requirements.md
```

`tasks.md` and corresponding issue links belong to the subsequent tasks phase.

### Proposed source and tests

```text
src/frontend/src/app/     Existing frontend; future member and staff profile views
src/backend/              Existing backend; future profile model, API and service
tests/unit/               Frontend and backend acceptance-derived unit tests
tests/integration/        SQL and audit integration tests
tests/contract/           Public API contract tests
```

The profile paths named in the [002 plan](../002-member-profile-demo/plan.md)
are future targets, not existing implementations. Reuse them after approval;
do not create a new runtime, shared library or infrastructure module merely
for this field.

## Phase 0: Research

The [research record](research.md) compares extending the proposed profile
with a separate resource and deferral. It distinguishes proposed decisions
from human approvals and records deferred input-policy decisions.

## Phase 1: Design and validation

The [data model](data-model.md) and [profile contract](contracts/profile-nickname.md)
describe the proposed nullable field, input presence and clearing semantics,
authorization, audit, concurrency and compatibility concerns. They do not
replace the 002 contracts until the cross-feature reconciliation is reviewed.
The [quickstart](quickstart.md) is a future validation guide, not evidence that
the profile is implemented or the scenarios were executed.

| Requirement    | Proposed validation                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| FR-001, FR-004 | Add, replace, clear, whitespace-only and return-visit cases; omitted input preserves the value.                         |
| FR-002, FR-005 | Own-profile and entitled-staff views; deny unverified, cross-member and unauthorized staff access.                      |
| FR-003         | Verify nickname-only changes leave other fields unchanged; explicitly edited nickname and contact fields save together. |
| FR-006, FR-008 | Test stale writes, atomic audit rollback, safe errors and absence of nickname values in audit, logs and traces.         |
| FR-007         | Exercise labels, instructions, errors, focus and outcomes with keyboard and assistive technology.                       |

## Complexity Tracking

No constitutional exception is proposed. Unresolved approvals and environment
prerequisites are gates, not waivers.
