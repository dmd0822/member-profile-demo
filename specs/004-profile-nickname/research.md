# Research: Profile Nickname

**Status**: Planning proposal, not approved design or implementation. The
[specification](spec.md) is approved for planning; the underlying
[002 design](../002-member-profile-demo/plan.md) remains subject to review.

## Profile representation and write boundary

**Proposed decision**: Add an optional Unicode nickname to the proposed member
profile and extend its existing member update and owner/staff profile reads.
Keep the profile's version and same-transaction audit boundary.

**Rationale**: The value belongs to the existing profile, has the same owner,
privacy and concurrency boundaries, and does not justify another service or
data store. The underlying profile is not yet implemented.

**Alternatives considered**: A separate nickname resource isolates its contract
but adds routes and tests while retaining profile authorization and audit needs.
Deferring the feature until 002 is built avoids immediate contract changes but
delays the member benefit. Human review may select either alternative.

## Input and display

**Proposed decision**: An omitted nickname leaves it unchanged; null or a
whitespace-only string clears it; a valid nonblank string sets it. Render it
as plain text alongside the existing name on authorized profile views. The
user clarified that explicitly edited nickname and contact fields can be saved
together; other fields must remain unchanged.

**Rationale**: The spec requires an optional, clearable field and protects
other profile data. Presence-aware inputs avoid confusing an omitted field with
an intentional clear.

**Alternatives considered**: A dedicated clear action or separate resource can
make intent explicit but adds interface surface. Separate nickname and contact
submissions were considered but do not match the user's clarified preference
for one save. Length, permitted characters, nonblank normalization and no-op
behavior are not decided here; product, design, security and privacy review
them before implementation. Never silently truncate.

## Contract and privacy

**Proposed decision**: Member and entitled-staff profile reads include the
nullable nickname; staff search remains on its current fields and criteria.
Separate the search result projection from profile detail if needed. Staff
create/edit and enrollment inputs do not accept nickname.

**Rationale**: This limits the field to requested profile views and avoids
introducing staff editing, nickname search or collection during enrollment.
Ownership and staff authorization remain server-enforced.

**Alternatives considered**: Exposing the nickname in every search result is
simpler if the same DTO is reused, but expands its presentation beyond the
requested profile views and needs privacy review. Separate summary and detail
projections add a contract distinction but preserve the old search fields.

The existing proposed `ProfileView` has an exact field list, and unknown
request fields are rejected. Adding a response property can affect strict
consumers; an old server may reject a new write. Review client compatibility,
rollout and whether a new major API version is necessary before implementation.
No deployed API or verified compatibility is assumed.

## Concurrency, audit and infrastructure

**Proposed decision**: Reuse the proposed profile ETag/conditional write and
atomic mutation/audit transaction. Log only approved operation metadata, never
the nickname. If a save acknowledgment is uncertain, read current state before
retrying; do not claim either success or rollback without evidence.

**Alternatives considered**: A separate nickname version or asynchronous audit
could isolate components but adds complexity and does not satisfy the existing
atomic-audit design without additional mechanisms. No nickname-specific cloud
resource is identified. Existing hosting, private SQL and identity decisions
remain separate prerequisites.

## Evidence and outstanding decisions

The [002 data model](../002-member-profile-demo/data-model.md),
[API proposal](../002-member-profile-demo/contracts/api-v1.md) and
[UI proposal](../002-member-profile-demo/contracts/ui-flows.md) describe
unimplemented baseline designs. This assessment did not inspect deployed Azure
resources or external service documentation. Input-policy, schema, security,
privacy and compatibility reviews remain open; the agreed workload is required
before performance validation. No approval is inferred from this research.
