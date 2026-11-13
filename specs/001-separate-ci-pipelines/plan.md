# Implementation Plan: Separate CI Foundation

**Branch**: `dave-microsoft-separate-ci-pipelines` | **Date**: 2026-11-13 | **Spec**: [Approved specification](spec.md)

**Input**: `specs/001-separate-ci-pipelines/spec.md`

**GitHub Milestone**: <https://github.com/dmd0822/member-profile-demo/milestone/1>

## Summary

Create separate, read-only application and infrastructure CI workflows. Both
start for pull requests, pushes to main, and manual validation, without
workflow-level path filters. Each has one unconditional, uniquely named result
job, avoiding an extra orchestration layer and skipped required checks.

Application CI owns the existing repository formatting, documentation, tooling
tests, and public-package vulnerability audit. Infrastructure CI reports Bicep
readiness separately. Neither workflow deploys or authenticates to Azure.
Missing application/Bicep checks are reported as not implemented, not successful.
Changes introducing runtime code or infrastructure fail their domain's gate
until actual approved build/validation commands are supplied.

## Technical Context

**Language/Version**: Existing JavaScript ES modules and Node.js 22.17+; Actions
uses the Node.js 22 release line. Angular and .NET 11 projects are absent; no
Angular version or runtime toolchain is selected by this tooling feature.

**Primary Dependencies**: Existing root npm tooling only. Node built-in
`node:test`, assertions, filesystem, and child-process APIs. Checkout/setup-node
Actions are pinned to verified commit SHAs. No new npm dependencies.

**Storage**: None; only GitHub job summaries and ordinary check logs.

**Testing**: Focused Node tests under `tests/unit/tooling/`, followed by existing
repository checks. Actual Actions execution remains a separate validation step.

**Target Platform**: GitHub-hosted Ubuntu runners; local Windows validation.

**Project Type**: Repository CI tooling, not an application scaffold.

**Performance Goals**: Run existing tooling once per event, not once per domain.
No application load or latency claims apply.

**Constraints**: Public npm in Actions only; internal npm locally; no secrets,
write tokens, cloud identities, deployment jobs, or new public API contracts.

**Scale/Scope**: Two workflows, one shared helper, one public-package inventory,
focused tests, and directly affected documentation/configuration.

## Constitution Check

Pre-research and post-design review use the same scoped findings:

| Principle                 | Result                 | Evidence / applicability                                                                                                                                                         |
| ------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Spec before code       | Pass                   | User approved spec as PO and tech lead; no open clarification markers.                                                                                                           |
| II. Security and identity | Pass                   | Read-only token, no persisted checkout credentials, secrets, or cloud access; no service identity introduced.                                                                    |
| III. Data protection      | Pass                   | Synthetic tests only; generic package-policy errors; no member data.                                                                                                             |
| IV. Test-first quality    | Pass by design         | Observe focused acceptance tests fail before helper/workflow implementation. No business logic or public APIs introduced; business coverage/API contract targets are not waived. |
| V. Observability          | Pass for tooling scope | Explicit check outcomes and job summaries; no member state changes or Application Insights runtime introduced.                                                                   |
| VI. Simplicity            | Pass                   | Two single-job workflows and built-in Node helper; no reusable-workflow framework or speculative projects.                                                                       |
| VII. Responsible AI       | Pass / not applicable  | No member-facing AI feature.                                                                                                                                                     |
| VIII. Documentation       | Pass by design         | Synchronize adopted registry policy and document actual capabilities, limitations, and future activation.                                                                        |

Dependency policy follows merged [PR #4](https://github.com/dmd0822/member-profile-demo/pull/4);
reconcile its stale proposal metadata before implementation. Preserve approved
internal feeds for private/non-npm packages, lock integrity, and license reviews.

Full application builds/tests, business coverage, public API contracts, SAST,
secret scanning, Bicep validation, and deployment approvals do not exist yet.
This plan does not claim that tooling CI satisfies full release CI or approve an
exception to those obligations. These remain explicit activation prerequisites.
Infrastructure-affecting changes require review; no infrastructure is deployed.

## Project Structure

### Documentation (this feature)

```text
specs/001-separate-ci-pipelines/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  checklists/requirements.md
  tasks.md
```

### Source Code (repository root)

```text
.github/
  workflows/application-ci.yml
  workflows/infrastructure-ci.yml
  scripts/ci-foundation.mjs
  ci/public-npm-packages.json
tests/unit/tooling/ci-foundation.test.mjs
docs/development-tooling.md
```

**Structure Decision**: CI support stays under `.github/`, tests under `tests/`.
No `src/`, `infra/`, application scaffolds, or internal-tool API contract directory
is created.

## Complexity Tracking

No constitutional exceptions are requested. Application runtime and release
requirements remain unavailable rather than being represented as passed.
