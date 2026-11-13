# CI Foundation Research

## Workflow separation

**Decision**: Two single-job workflows with stable result names and no
workflow-level path filters. Inspect changed paths inside a built-in Node helper.

**Rationale**: Both checks finish on documentation-only PRs. Application CI owns
root tooling once; infrastructure readiness is reported independently.

**Alternatives considered**: Running tooling twice wastes restores and external
link requests. A third reusable orchestration workflow is unnecessary at this size.

## Change selection and absent projects

**Decision**: Compare merge-base to event head with a NUL-delimited Git diff and
rename detection disabled, so cross-domain renames become a deletion plus an
addition. Manual runs evaluate tracked paths. Fail on comparison errors.

**Rationale**: Both old and new responsibilities are selected. Check available
repository tooling without manufacturing app/Bicep success; newly introduced
domain files block their gate pending approved validation.

**Alternatives considered**: Workflow path filters can strand required checks;
silently skipping newly introduced projects conceals missing validation.

## Environment-specific package retrieval

**Decision**: Keep local `.npmrc` internal; use explicit public npm arguments in
Actions. Make the existing lock portable by omitting registry-specific resolved
URLs through npm's `omit-lockfile-registry-resolved` option, retaining versions
and integrity. Validate public identities against the reviewed existing package
inventory and reject unsupported dependency sources before npm requests.

**Rationale**: A registry override alone does not override internal tarball URLs
already in a lockfile. An inventory prevents accidentally querying public npm for
an unknown private identity. Inventory/dependency changes require human review;
it is not a defense against a maintainer approving malicious workflow code.

**Alternatives considered**: Two lockfiles can drift. Runtime URL substitution
obscures the checked-in dependency policy. An implicit public fallback violates
the constitution.

**References**: [npm lockfiles](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/),
[npm configuration](https://docs.npmjs.com/cli/v11/using-npm/config#omit-lockfile-registry-resolved),
[audit disclosure](https://docs.npmjs.com/cli/v11/commands/npm-audit/).

## Security boundaries

**Decision**: `contents: read`, SHA-pinned Actions, no persisted checkout
credentials, ordinary `pull_request` rather than `pull_request_target`, and no
secrets or Azure authentication. Restore without lifecycle scripts, automatic
audit, or funding requests; audit explicitly after public-package validation.

**Rationale**: Forks do not need privileged credentials. Audit transmits package
identities and must obey the same public-package inventory policy.

**Alternatives considered**: Cloud setup or deployment placeholders add privilege
without a deployment target. Lint is not SAST or secret scanning.

**Reference**: [Secure use of Actions](https://docs.github.com/en/actions/reference/security/secure-use).

## Review

The Member Services Azure Architect supplied bounded discovery before this plan.
All implementation-method questions above are resolved. Product owner and tech
lead scope approval is recorded in the spec. No cloud design or security-scan
pass is inferred from this research.
