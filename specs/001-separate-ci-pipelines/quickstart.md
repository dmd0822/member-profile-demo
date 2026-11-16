# CI Foundation Validation

These validation scenarios distinguish historical evidence, verified candidate-fix
validation, and outstanding reviewed integration.

## Local prerequisites

Use Node.js 22.17+ and the internal npm registry configured by `.npmrc`.
No Azure credentials or application SDKs are needed.

```powershell
node --test tests/unit/tooling/ci-foundation.test.mjs
npm ci --ignore-scripts --audit=false --fund=false
npm run test:tooling
npm run lint
npm audit --audit-level=high
```

Expected: focused tests cover path selection, failed comparisons, missing
capabilities, and dependency-policy rejection; existing tooling checks execute.
An unreachable external Markdown link is a failure, not an ignored success.

## Hosted scenarios

T007's completed validation inspected real Actions runs for documentation-only,
shared/configuration, synthetic application-only and infrastructure-only changes,
and cross-domain renames/deletions. For repeat validation, do not merge synthetic
project fixtures.

Expected: both named checks start and finish; documentation-only changes skip
npm entirely, while source/unit-test or supporting configuration changes run
tooling once; affected absent
project validation blocks rather than claiming success. Unknown synthetic
package identities stop before public requests without printing their names.

The stable result jobs are **Application CI result** and
**Infrastructure CI result**. Do not select unrelated workflow status names
when configuring required checks.

Manual workflow dispatch is validation only, not a deployment route. Confirm
that fork PRs have no secrets, cloud authentication, or write permissions.

## Limitations

Repository permissions are needed to configure required check names. Do not
change branch protections or claim they are configured as part of local tests.
Future app/Bicep checks and CD activation need approved projects, targets,
identities, executable validation, and environment approvals.

## Current evidence

**2026-11-16 status:** T007 hosted validation and T008 local approved-feed audit
are fulfilled. T006 remains open pending final reviewed integration of the
link-check shutdown fix and these evidence documents, with one approving review
and passing CI before merge. Milestone 1 is not closed. Issue statuses will be
synchronized by the parent after these updates; this documentation update makes
no GitHub mutations and does not rerun checks.

### Local validation and audit

Local validation used Node.js 26.13.0 / npm 11.20.0. The focused CI-foundation
suite passed 9/9. The full tooling suite passed 13 tests before the new regression
and 14/14 after it. An approved internal-feed restore of 77 packages succeeded
without lifecycle scripts, automatic audit, or funding requests.

Both YAML workflows parsed using existing `js-yaml`, and triggers/read-only
semantics were verified. The portable manifest/lock passed
`validatePublicPackages` for 77 unchanged pinned packages. The manifest, lock,
registry configuration, and workflows remain unchanged. `actionlint` was
unavailable; it did not run.

The actual local command below completed with exit 0 and
`found 0 vulnerabilities`:

```powershell
npm audit --audit-level=high --registry=https://packagefeedproxy.microsoft.io/npm/ --fetch-retries=0 --fetch-timeout=30000
```

A later JSON-capture attempt returned HTTP 429. This does not undo the actual
successful result required by T008, but feed rate limits can recur. No fallback
or policy weakening occurred. See the persisted
[T008 audit evidence](https://github.com/dmd0822/member-profile-demo/issues/12#issuecomment-6925869490).

Local and hosted validation reproduced the link checker hanging after reporting
zero failed links. A synthetic local-HTTP redirect regression failed before the
fix with `ETIMEDOUT` after five seconds despite reporting zero failures. The
candidate fix destroys Node's HTTP and HTTPS global agents in a CLI-only
`finally` block after awaited link results, preserving errors and exit codes.
It does not force `process.exit`, ignore links, or change timeouts or link policy.
The regression then passed, and `npm run lint` exited 0 naturally: 43 Markdown
files with zero errors, Prettier passed, and 43 files with zero failed links.
Final reviewed integration remains pending.

### Verified hosted scenario matrix

All 16 jobs below completed with the expected outcomes on 2026-11-16.
Logs and summaries, not conclusions alone, verified domain selection and checks.
Each run used the `pull_request` event from fork
`dave-microsoft/member-profile-demo-ci-validation`, Node.js 22.23.4 / npm 10.9.9,
`Contents: read`, `Metadata: read`, and `Secret source: None`. Checkout credentials
were not persisted; no cloud authentication or deployment occurred.

The linked Application and Infrastructure jobs have the exact stable names
**Application CI result** and **Infrastructure CI result**, respectively.
“Selected” below refers to domain validation; a successful job never means an
absent application or Bicep check passed.

- **Docs (#58)** — head `e31d6401df68be4f3985dde345a38340a0293abe`;
  neither domain selected.
  [Application: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934248539),
  zero npm commands;
  [infrastructure: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934248517),
  not applicable.
- **Configuration (#59)** — head `4478f7ef98293213541384b49e332916032503a4`;
  both domains selected.
  [Application: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934263828),
  restore 77 public packages, 14 tests, lint, audit 0 vulnerabilities;
  [infrastructure: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934263835),
  Bicep not implemented.
- **App-only (#60)** — head `9dc1027ece79c8fffbe8daf3077f758e56f4746a`;
  application selected.
  [Application: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934274237),
  missing app checks;
  [infrastructure: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934274169),
  unselected/not applicable.
- **Infra-only (#61)** — head `5bfe5f7b3bfc6a4b75d3f3a69fc64dac30cc1e6f`;
  infrastructure selected.
  [Application: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934288928),
  unselected, zero npm commands;
  [infrastructure: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934288854),
  missing Bicep checks.
- **Shared (#62)** — head `e3d8199a696a9675d1bd2932dbeeca93508cfcb4`;
  both domains selected.
  [Application: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934301045),
  missing app checks;
  [infrastructure: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934301046),
  Bicep explicitly not implemented.
- **Cross-domain rename (#63)** — head `b3e273da6e19b90f2255330a1ce01b9506f85c0f`;
  both domains selected.
  [Application: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934314874),
  missing app checks;
  [infrastructure: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934314861),
  missing Bicep checks.
- **Last app-file deletion (#64)** — head `afefc5481d785f1902a70c9b7aa3be95c294f51e`;
  application selected.
  [Application: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934321563),
  missing app checks;
  [infrastructure: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934321486),
  unselected/not applicable.
- **Package-policy rejection (#65)** — head `cd61a839a2effb868793e571fef5ccbcebf847ab`;
  both domains selected.
  [Application: expected failure](https://github.com/dmd0822/member-profile-demo/actions/runs/43934331653),
  generic rejection before npm, no synthetic identity in logs;
  [infrastructure: success](https://github.com/dmd0822/member-profile-demo/actions/runs/43934331640),
  Bicep not implemented.

The rename moved `src/backend/ci-validation.json` to `infra/ci-validation.json`;
the deletion removed the last `src/backend` fixture. Configuration application
HTTP logs explicitly show `registry.npmjs.org` GET 200 and bulk-advisory POST 200,
with no internal-feed requests. See the persisted
[T007 hosted evidence](https://github.com/dmd0822/member-profile-demo/issues/11#issuecomment-6926095561).

All matrix runs used temporary bases containing the candidate socket fix so each
diff isolated its scenario. The fixed base was
`424f27aaa1db239222c381f01fcfa1921034e393`; rename/deletion used the fixture-bearing
fixed base `d458d44e0d6b04f6cd85f9b3d1f79dae22c0c502`.
These runs validate the candidate fix, not its merge to `main`.
Initial pure docs, infrastructure, and package-policy cases also behaved as
expected against unchanged `main`. Five hanging original application runs were
**cancelled**, not passes; the original configuration run hung at zero failed
links until cancelled, corroborating the shutdown bug.

Approved cleanup closed synthetic PRs #58–#65 **without merge** and deleted all
eight fork head branches and all three upstream temporary base branches.
The fork still exists with only its default `main` branch; it was not deleted.
No synthetic fixtures remain in the worktree or `main`.

Read-only inspection found `main` unprotected (`protected: false`).
No protection changes occurred, and these results do not mean required checks
are configured. Maintainer configuration is not authorized by this milestone.
Application build/test, Bicep validation, SAST, and secret scanning remain
**not implemented**; CD remains disabled. See [task status](tasks.md).

## Historical evidence

The following checkpoints preserve earlier results and limitations. The current
validation above supersedes their T007/T008 gaps, not their historical outcomes.

At the earlier implementation checkpoint, the focused acceptance suite was
observed failing before implementation and then passed eight tests; the combined
tooling suite passed twelve. Local lint, formatting, link checks, workflow YAML
parsing, and internal-feed restore passed. Lock comparison confirmed unchanged
versions/integrity. These are historical results, not checks rerun by this update.

At the later T009 checkpoint on 2026-11-16, two regressions failed before the
latency fix, then all 13 combined tooling tests passed, including a docs-only
entrypoint invocation without package files. Markdown lint, formatting, and diff
checks passed then; no full external-link or audit rerun was claimed.

**Historical partial hosted evidence — verified read-only on 2026-11-16**:
[Application CI](https://github.com/dmd0822/member-profile-demo/actions/runs/43913848561)
and [Infrastructure CI](https://github.com/dmd0822/member-profile-demo/actions/runs/43913848563)
are completed/successful `main` push runs at commit
`459188c3fa60c47b90c27fd8f351aca145dc54d8`. The **Application CI result** and
**Infrastructure CI result** jobs respectively completed successfully. This
verifies terminal jobs for those runs, not T007's full hosted scenario matrix,
Node.js 22 runtime behavior, public-registry retrieval, fork permissions, or
required-check configuration. T007 remained open at that checkpoint.

The local approved-feed audit was blocked: initial DNS failure followed by HTTP
429 on a bounded recheck. The application CI entrypoint reports failure for this
condition, without falling back to public npm. Successful hosted terminal jobs
did not clear that local audit blocker: T008 and dependent T006 remained open then.
Public npm retrieval was unverified at that checkpoint. Historical local
evidence uses available Node.js 26, not the Node.js 22 runner configured by the
workflows. See [task evidence](tasks.md).

An earlier local lint recheck reported zero broken links but its link-check process
lingered after printing results and was stopped. That invocation is not a passing
exit; the partial hosted evidence at that checkpoint did not change that local
outcome or complete the then-remaining hosted validation.
