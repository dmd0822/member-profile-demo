# Feature Specification: Profile Nickname

**Feature Branch**: `dave-microsoft-profile-nickname`

**Created**: 2026-11-20

**Status**: Draft; product owner and tech lead review required

**Input**: User description: "I have been asked by the business to allow the user to add a nickname to their profile."

The user clarified that the nickname should appear on the member's profile for
both the member and authorized staff. This specification proposes a change to
the [member profile demo](../002-member-profile-demo/spec.md); it does not
describe implemented functionality or authorize implementation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage My Nickname (Priority: P1)

As a verified member, I want to add, change, or remove an optional nickname on
my profile so that it reflects how I wish to be known.

**Why this priority**: Adding a nickname and keeping it current are the core
member benefit.

**Independent Test**: Using a verified synthetic member profile, add a nickname,
revisit the profile, change it, and remove it.

**Acceptance Scenarios**:

1. **Given** a verified member whose profile has no nickname, **When** they add and save one, **Then** the nickname appears on their profile and remains visible when they return.
2. **Given** a profile with a nickname, **When** its verified member saves a different nickname, **Then** the new nickname appears in place of the previous nickname.
3. **Given** a profile with a nickname, **When** its verified member clears and saves the nickname, **Then** the profile has no nickname and its other fields remain unchanged.
4. **Given** an optional nickname is absent, **When** the member views their profile, **Then** the profile remains usable and no nickname is required.
5. **Given** a nickname change fails without a concurrent change, **When** the member is notified, **Then** the previous saved nickname remains unchanged and the failure is not presented as success.
6. **Given** a profile is changed after the member opened it, **When** the member attempts to save a nickname based on the older profile, **Then** the conflicting change is not overwritten and the member is informed.
7. **Given** a nickname change succeeds, **When** its audit event is reviewed, **Then** it records the required operation and outcome without the nickname value.
8. **Given** the required audit event cannot be recorded, **When** the member attempts a nickname change, **Then** the change is not committed and the failure is reported.
9. **Given** a member uses a keyboard or assistive technology, **When** they manage their nickname, **Then** the field, instructions, errors, and save outcome are accessible without relying on color alone.
10. **Given** a member adds or changes a nickname, **When** the profile is saved, **Then** the existing name, sign-in identity, verified association, and other profile fields remain unchanged.
11. **Given** a nickname is added or changed using synthetic data, **When** audit events, logs, and traces are inspected, **Then** they do not contain the nickname value.

### User Story 2 - View a Member's Nickname (Priority: P2)

As authorized staff, I want to see a member's nickname on their profile so that
I can recognize the name the member chose.

**Why this priority**: Staff need the same profile information without expanding
who can access a member's record.

**Independent Test**: Using synthetic profiles with and without nicknames, view
each profile as authorized staff and attempt access without staff entitlement.

**Acceptance Scenarios**:

1. **Given** a member has saved a nickname, **When** authorized staff view that member's profile, **Then** they can see the saved nickname alongside the existing name.
2. **Given** a member has not saved a nickname, **When** authorized staff view the profile, **Then** no nickname is shown.
3. **Given** an account without staff entitlement, **When** it attempts to view another member's profile, **Then** neither the nickname nor the other profile details are disclosed.
4. **Given** an unverified member or a member attempting to change another member's profile, **When** they attempt to update a nickname, **Then** the change is denied.

### Edge Cases

- A member clearing a nickname leaves it absent; whitespace-only input is
  treated as clearing it.
- If a save fails, including because of a conflicting update or an unavailable
  required audit record, the saved profile is not silently overwritten.
- A member cannot view or change another member's nickname, and an unverified
  member cannot edit a profile.
- Members may choose the same nickname; a nickname does not establish identity
  or ownership.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A verified member MUST be able to add, change, and clear the optional nickname on their own linked profile.
- **FR-002**: The member and authorized staff viewing that profile MUST see its saved nickname when present; when absent, the profile MUST remain usable without requiring one.
- **FR-003**: The nickname MUST be distinct from the existing profile name. Changing it MUST NOT change the profile name, sign-in identity, verified association, or other profile fields.
- **FR-004**: A saved nickname MUST persist for subsequent profile views. Clearing it, including by submitting only whitespace, MUST leave no nickname.
- **FR-005**: The existing member ownership, verification, and staff-entitlement boundaries MUST apply to nickname reads and changes. An account without access to a profile MUST NOT obtain its nickname.
- **FR-006**: Nickname changes MUST follow the existing profile requirements for privacy-safe audit, error reporting, and protection against conflicting updates. A change MUST NOT be reported as successful if its required audit event or save fails.
- **FR-007**: The nickname field and its instructions, errors, and save outcome MUST be accessible by keyboard and available to assistive technology without relying on color alone.
- **FR-008**: Nickname values MUST be treated as sensitive profile data and MUST NOT appear in audit events, logs, traces, or AI prompts. Test fixtures MUST NOT identify real people; demo examples and test data MUST remain synthetic.

### Key Entities

- **Member profile**: The existing member record, with an optional nickname separate from its existing name.
- **Nickname**: A member-selected profile value visible to its verified owner and authorized staff. It is not a unique identifier.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In all specified add, change, clear, and return-visit scenarios, the member sees the correct saved nickname or its absence.
- **SC-002**: In all specified staff-view and unauthorized-access scenarios, authorized staff see the saved nickname when present and unauthorized accounts receive no profile information.
- **SC-003**: In every specified failed-save and conflicting-update scenario, no unsuccessful change is shown as saved and no newer saved profile is overwritten.
- **SC-004**: The nickname management journey can be completed using a keyboard, with its label, errors, and outcome available to assistive technology.

## Assumptions

- The nickname is optional, separate from the profile name, and may be updated
  or removed by the verified member. Staff can view it, but staff editing is
  outside this request.
- Nicknames are shown on member and authorized staff profile views, not
  substituted for the existing name elsewhere. Nickname search, enrollment
  collection, and external sharing are outside this request.
- The member profile demo is a synthetic-data proposal, not an implemented
  profile service. Its verified-member and authorized-staff profile journeys
  are prerequisites for this feature.
- This draft proposes an exception to the existing demo's contact-only member
  editing rule in [FR-007](../002-member-profile-demo/spec.md). Product owner
  and tech lead review must resolve the change before implementation; affected
  demo requirements, proposed contracts, backlog, and linked issues must be
  reconciled as part of approved subsequent work.
- Nickname length, permitted characters, and any normalization require
  product, design, security, and privacy review before implementation; no
  silent truncation is permitted.
- The existing demo's design, security, and privacy approvals remain pending.
  Approval of this draft is not assumed, and no deployment is authorized.
