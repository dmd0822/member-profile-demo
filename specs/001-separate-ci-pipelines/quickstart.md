# CI Foundation Validation

These validation scenarios distinguish local evidence from hosted checks that
have not yet run.

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

After publishing the workflows, inspect real Actions runs for documentation-only,
shared/configuration, synthetic application-only and infrastructure-only changes,
and cross-domain renames/deletions. Do not merge synthetic project fixtures.

Expected: both named checks start and finish; tooling runs once; affected absent
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

The focused acceptance suite was observed failing before implementation and now
passes eight tests; the combined tooling suite passes twelve. Local lint,
formatting, link checks, workflow YAML parsing, and internal-feed restore passed.
Lock comparison confirmed unchanged versions/integrity.

The local approved-feed audit is blocked: initial DNS failure followed by HTTP
429 on a bounded recheck. The application CI entrypoint reports failure for this
condition, without falling back to public npm. Hosted execution and public npm
retrieval remain unverified. Local evidence uses available Node.js 26, not the
Node.js 22 runner configured by the workflows. See [task evidence](tasks.md).

A final local lint recheck reported zero broken links but its link-check process
lingered after printing results and was stopped. That invocation is not a passing
exit; hosted terminal behavior remains part of the outstanding validation.
