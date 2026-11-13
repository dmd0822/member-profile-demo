# CI Foundation Data Model

No persisted application entities or member data are introduced.

| Internal value           | Fields                                             | Rules                                                                                                          |
| ------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Change selection         | Application, infrastructure, tooling applicability | Evaluate both sides of renames/deletions; Git failures do not mean no changes.                                 |
| Domain capability        | Implemented, not implemented, blocked              | Tooling success never upgrades absent app/Bicep capabilities.                                                  |
| Public package inventory | Public npm package names                           | Existing reviewed public tree only; unknown identities or non-registry sources block before network retrieval. |
| Dependency lock          | Exact versions, integrity, dependency edges        | Registry-independent; do not remove integrity or silently switch registries after failure.                     |

Outputs are logs, exit codes, and GitHub job summaries, not public API contracts.
No contract directory is needed for these internal build scripts.
