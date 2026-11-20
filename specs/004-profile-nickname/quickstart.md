# Quickstart: Future Nickname Validation

This is a proposed validation guide, not evidence of an implemented profile
service or executed test. Read the [plan](plan.md), [model](data-model.md) and
[contract](contracts/profile-nickname.md) first.

## Prerequisites

- Obtain the design, security, privacy, input-policy and implementation
  approvals described in the plan; reconcile 002 requirements and tracking.
- Establish the approved member-profile, identity, staff entitlement, audit and
  accessible UI prerequisites. The existing 003 project foundation alone is
  insufficient.
- Use synthetic, non-identifying data and approved test access. Do not copy
  nickname values into audit events, logs, traces, AI prompts or test reports
  that contain identifying information.
- Before environment or load validation, obtain separate access approval and
  agree the peak workload. This guide authorizes no provisioning or deployment.

## Validation sequence

1. Write tests from all [acceptance scenarios](spec.md) and the reviewed API
   contract; run them and retain the expected behavioral failures before
   implementing the feature. Missing SDKs, feeds or services are blockers,
   not fail-first evidence.
2. Verify add, change, clear, whitespace-only clear and revisit; omitted input
   retains the old value. Check that nickname-only updates do not alter name,
   sign-in identity, link or other profile fields, and that explicitly edited
   nickname and contact fields can be saved together.
3. Verify member and staff profile visibility, no nickname when absent,
   cross-member and unverified denial, nonstaff denial and staff-write
   rejection. Test the reviewed search projection and strict-client contract.
4. Test current, missing and stale profile versions; combined and invalid inputs;
   audit-insert and transaction failures; and readback after an uncertain
   acknowledgment. An invalid field must not partially save a combined update.
   Validate atomic rollback with the actual SQL provider.
5. Inspect safe errors and audit, logs and traces for value leakage. Exercise
   labels, instructions, errors, focus and save outcomes using keyboard and
   assistive technology; automated checks alone are not conformance evidence.
6. Run reviewed frontend/backend build and test commands, public route contract
   suites, coverage and required security checks. Record actual commands and
   results during implementation; at least 80% business-logic line coverage is
   required.
7. With an approved environment and agreed workload, evaluate the constitutional
   API p95 target under 300 ms. Do not invent a workload or a passing result.

There are no verified nickname-specific setup, seed, migration, run or test
commands yet. The [002 validation guide](../002-member-profile-demo/quickstart.md)
contains future demo scenarios and must be reconciled with this feature before
delivery.
