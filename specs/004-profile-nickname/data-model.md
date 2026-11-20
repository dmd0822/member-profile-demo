# Proposed Data Model: Profile Nickname

**Status**: Proposal for human review, not a migration or an accepted schema.
This is a delta to the [002 member profile model](../002-member-profile-demo/data-model.md),
which must be reconciled before implementation.

## Member profile

| Field                                                  | Proposed invariant                                                                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Nickname                                               | Optional nullable Unicode string; absent is represented by null. Nonblank values are member-selected and need not be unique. |
| Existing name, contact fields and identity association | Separate from nickname and unchanged by a nickname-only update.                                                              |
| Profile version                                        | The existing proposed row version covers nickname and other profile updates.                                                 |

The value is sensitive profile data. It is not an identifier, a sign-in name,
a membership attribute, a staff-editable field or an enrollment field.
Previously created profiles, if any exist when this is implemented, must
remain valid without a nickname.

## Transitions and validation

| Input on member update                      | Proposed result                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| Nickname omitted                            | Existing nickname remains unchanged.                                      |
| Null or whitespace-only string              | Nickname becomes absent.                                                  |
| Valid nonblank string                       | Nickname is set to the supplied value, subject to reviewed normalization. |
| Wrong type or value outside reviewed limits | No change; report a safe field error without the value.                   |

Exact length, allowed characters, Unicode normalization and no-op behavior
need product, design, security and privacy review before implementation.
Do not silently truncate. No nickname uniqueness or matching policy is implied.
A single profile save may update the nickname and explicitly edited permitted
contact fields together; all other profile fields remain unchanged.

## Authorization and consistency

Only a verified member may update their own linked profile. The owner and
entitled staff can read the nickname on profile views. Staff editing and
nickname search are outside scope. Resolve ownership server-side.

Compare the supplied profile version in the write. A stale write does not
overwrite a newer profile. Successful nickname changes and their value-free
audit event commit together; failure to record required audit rolls back the
change. Failed attempts are audited when recording is available. If commit
acknowledgment is uncertain, read the current state before retrying.

No real member data belongs in fixtures, logs, traces, audit events or AI
prompts. Use synthetic, non-identifying data for validation.
