# Feature Specification: Initial Application Projects

**Feature Branch**: `dave-microsoft-initial-app-structure`

**Created**: 2026-11-16

**Status**: Spec and proposed project design approved by the user as product owner and tech lead on 2026-11-16. The user confirmed T001 review completion; implementation is authorized.

**Approval scope**: The initial 2026-11-16 approval, "I am acting as product owner and tech lead and approve both specs for planning", covers planning for 002 Member Profile Demo and 003 Initial Application Projects. The user later approved the proposed 003 project/toolchain design, requested implementation, and explicitly confirmed T001's required reviews complete, including reviewed package/SDK pins and feed configuration. This authorizes scoped implementation; it does not authorize deployment or expand the approved feature scope.

**Input**: User description: "Create a spec for the initial application set, how the source code will be structure. Initial front end and backend projects"

This feature defines the initial frontend and backend project boundaries and
where application code, shared contracts, tests, and infrastructure belong.
It establishes a starting point for the member-profile application without
implementing member-facing behavior or selecting undecided hosting services.
The [constitution](../../.specify/memory/constitution.md), [repository
guidance](../../README.md), and [proposed architecture
overview](../../docs/architecture/member-profile-overview.md) provide the
authoritative constraints and context.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Find the Initial Application Projects (Priority: P1)

As a contributor, I want one clearly identified frontend project and one
backend project so I can find the right place to add application capabilities.

**Why this priority**: A consistent starting structure prevents application
code from being scattered across unrelated repository areas.

**Independent Test**: Review the two project roots and classify the source
responsibilities in each without relying on unimplemented member features.

**Acceptance Scenarios**:

1. **Given** a contributor opening the repository, **When** they locate the
   initial application projects, **Then** they find one frontend project under
   `src/frontend/` and one backend project under `src/backend/`.
2. **Given** a contributor adding user-interface code or backend/API code,
   **When** they place the source in the appropriate project, **Then** the
   frontend and backend responsibilities remain separate.
3. **Given** a contributor reviewing the application set, **When** they check
   for additional runtime projects, **Then** no unrequested application,
   device, or Raspberry Pi runtime is part of this initial set.

---

### User Story 2 - Place Tests and Shared Contracts Consistently (Priority: P2)

As a contributor, I want tests and genuinely shared contracts kept outside
application implementation projects so that each project can be validated
independently and the frontend does not depend on backend implementation code.

**Why this priority**: Clear ownership keeps project boundaries understandable
as the application grows.

**Independent Test**: Classify representative frontend, backend, shared
contract, unit, integration, and public API contract files against the agreed
repository layout.

**Acceptance Scenarios**:

1. **Given** a unit, integration, or public API contract test, **When** it is
   added, **Then** it is located under the corresponding `tests/` category and
   not inside `src/`.
2. **Given** a contract or reusable library needed by both application
   projects, **When** it is approved for sharing, **Then** it is placed under
   `src/shared/` and is language-neutral or has generated language-specific
   clients.
3. **Given** no approved cross-project reuse requirement, **When** the initial
   projects are created, **Then** no speculative shared library is introduced.
4. **Given** the frontend consumes a backend contract, **When** that contract
   is used, **Then** the frontend does not depend directly on backend
   implementation libraries.

---

### Edge Cases

- A source file could plausibly belong to more than one project: its runtime
  responsibility determines its owning project; cross-project contracts go in
  `src/shared/` only when reuse is required.
- A proposed shared library has no current consumer in both projects: it is
  deferred rather than added speculatively.
- A member-profile feature is added while establishing the projects: its
  behavior remains governed by the separately reviewed member-profile feature
  specification.
- A hosting or deployment decision is needed to make an implementation choice:
  the open decision remains open; this feature does not select Functions,
  Container Apps, frontend hosting, or deployment targets.
- Application code, tests, documentation, or Bicep definitions are proposed
  under the wrong repository area: the change is moved to the established
  boundary or is not accepted.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The initial application set MUST contain one frontend project and
  one backend project, using the technology stack already established by the
  project constitution. This requirement MUST NOT be interpreted as approval
  for additional runtime projects.
- **FR-002**: Frontend application source MUST be organized under
  `src/frontend/`; reusable UI components, routed pages, and frontend services
  MUST have distinct locations under `src/frontend/src/app/`.
- **FR-003**: Backend application source MUST be organized under
  `src/backend/`; API handling, business services, and backend models MUST
  have distinct locations under the corresponding `Api/`, `Services/`, and
  `Models/` areas.
- **FR-004**: Unit, integration, and public API contract tests MUST remain
  outside `src/`, under the corresponding `tests/unit/`,
  `tests/integration/`, and `tests/contract/` areas.
- **FR-005**: Code MUST be shared through `src/shared/` only when an approved
  feature requires cross-project reuse. Shared cross-stack contracts MUST be
  language-neutral or support generated language-specific clients; the
  frontend MUST NOT directly depend on backend implementation libraries.
- **FR-006**: Infrastructure definitions MUST remain separate from application
  code under `infra/`. This feature MUST NOT provision resources or activate
  deployment.
- **FR-007**: Each initial application project MUST be independently buildable
  and testable, and applicable application CI MUST report its available build
  and test results truthfully. The initial project set MUST NOT claim business
  logic coverage where no business logic exists.
- **FR-008**: Contributor documentation MUST describe the delivered project
  boundaries and any implemented setup, build, and test entry points. It MUST
  not describe undecided hosting or deployment as an accepted design.
- **FR-009**: This feature MUST NOT implement enrollment, profile management,
  membership behavior, identity flows, production data access, or production
  deployment. Those capabilities require their own approved scope and reviews.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can identify exactly one initial frontend project and
  one initial backend project, with 100% of application source classified under
  the appropriate project root (FR-001–FR-003).
- **SC-002**: 100% of unit, integration, and public API contract tests are
  located outside application source and under their matching test category
  (FR-004).
- **SC-003**: Both initial projects can be built and their available tests run
  independently; CI reports each applicable result without marking an
  unexecuted check as passed (FR-007).
- **SC-004**: No frontend source depends directly on backend implementation
  libraries, and no shared library is introduced without an approved
  cross-project reuse need (FR-005).
- **SC-005**: Review finds zero application runtime files in `infra/` and zero
  infrastructure definitions in either application project (FR-006).
- **SC-006**: Contributors can identify the project roots and implemented
  setup/build/test entry points from repository guidance, with no hosting or
  deployment option presented as accepted (FR-008–FR-009).

## Assumptions

- The constitution's Angular/TypeScript frontend and C#/.NET 11 backend stack
  and the repository structure in `README.md` are established constraints, not
  new technology selections by this feature.
- The frontend and backend project roots are the only initial application
  runtime projects. Test projects and shared contract assets are supporting
  code, not additional runtime applications.
- The complete member-profile demo behavior is specified separately in
  [Member Profile Demo](../002-member-profile-demo/spec.md); this feature
  establishes its project foundation only.
- API hosting, frontend hosting, identity-provider configuration, database
  implementation details, and deployment targets remain undecided as recorded
  in the [architecture design review](../../docs/architecture/design-review.md).
- Product owner and tech lead specification approval for planning, design
  approval, implementation authorization, and confirmation that T001's required
  reviews are complete were recorded on 2026-11-16 above. Deployment and the
  separate demo's hosting and identity designs remain unapproved.

**Out of scope**: Member-facing or staff-facing application behavior; selecting
hosting services, frameworks beyond the constitutional stack, or API contracts;
adding speculative shared libraries; application feature implementation;
infrastructure provisioning; and deployment.
