# Proposed Contract: Profile Nickname

**Status**: Proposed delta to the [002 API contract](../../002-member-profile-demo/contracts/api-v1.md)
and [UI flows](../../002-member-profile-demo/contracts/ui-flows.md). Neither
the baseline nor this delta is implemented or approved for delivery.

## Profile reads

- The verified member's own profile detail and an entitled staff profile detail
  include `nickname`, a string when set and null when absent, alongside the
  existing profile name. The member sees only their own linked profile.
- Staff profile search retains its existing fields and criteria; it does not
  search by or display nickname. If needed, use separate detail and search
  projections so the existing search response shape is preserved.
- An unverified member, a different member, or an account without staff
  entitlement cannot use these views to obtain another member's nickname.
  Follow 002 safe error and no-store requirements.

## Member update

The proposed `PATCH /api/v1/me/profile` continues to require a verified link
and the current profile `If-Match` value. No caller-supplied profile identity
establishes ownership. For the proposed nickname update:

| `nickname` input       | Meaning                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| Omitted                | No nickname change; an otherwise valid contact-only update retains it. |
| Null                   | Clear the nickname.                                                    |
| Whitespace-only string | Clear the nickname.                                                    |
| Valid nonblank string  | Set the nickname, subject to reviewed input rules.                     |

One request may update the nickname and explicitly edited permitted contact
fields together. Fields not submitted remain unchanged. Validate the entire
request and commit all supplied changes together; an invalid field must not
cause a partial update. Unknown fields, wrong types and values outside
reviewed limits are rejected without echoing values. Staff create/update and
enrollment inputs do not accept nickname. Exact bounds, permitted characters,
normalization and no-op behavior remain human review gates.

The existing 002 conditional-write proposal uses `428` for a missing
precondition and `412` for a stale version. A successful update returns the
updated profile and version only after the change and required value-free
audit event commit together. On audit or persistence failure, do not report
success. On uncertain acknowledgment, read current state before retrying.
Safe failures include a correlation reference and no profile value or stack
trace.

## Compatibility and review

The 002 proposal lists exact response properties and rejects unknown request
properties. A new response property may break strict consumers, and an older
server can reject nickname writes. Review both directions, deployment ordering
and whether versioning is needed; no compatibility or rollout is assumed.
Reconcile 002 FR-007, model, UI, contract and linked task issues before
implementation. Public routes require contract tests.

## Interaction

Use an optional, visibly labeled field with instructions and accessible text
errors. The owner can add, change and clear it; accessible status feedback
distinguishes success, failure and conflict. Staff see it alongside the
existing name but do not edit it. Nickname is rendered as text, not markup.
