# Development tooling

The root npm package contains repository checks only. It does not scaffold the
Angular frontend, .NET backend, or infrastructure. The CI foundation executes
repository checks but does not build applications or deploy resources.

## Setup

Use Node.js 22.17 or newer and npm. The repository's `.npmrc` selects the approved
internal feed, `https://packagefeedproxy.microsoft.io/npm/`. Obtain any required
feed access through the organization's approved process; never commit credentials
or substitute a public registry when local access fails. GitHub Actions uses
`https://registry.npmjs.org/` explicitly for public npm dependencies, as adopted in
constitution v2.3.0. Private dependencies and non-npm packages use approved internal
feeds in every environment; their names and credentials must not reach public npm.

From the repository root, restore the pinned dependency tree:

```powershell
npm ci --ignore-scripts
```

The package lock records exact dependency versions and integrity values.
The `.npmrc` option `omit-lockfile-registry-resolved=true` keeps registry-specific
tarball URLs out of the lock so npm resolves the same pinned tree through the
explicitly selected registry. Do not remove integrity values or check in internal
tarball URLs; a registry override alone cannot override URLs already in a lock.

Dependencies must pass license and vulnerability review before changes are
accepted. Use `npm audit` against the internal registry; report an unsupported or
unavailable audit service as a blocked check, not a clean result.

The tool versions are deliberately pinned rather than following the newest
release tags. Newer Markdown-linter and link-checker dependency trees introduced
audit findings during setup. The current baseline avoids those trees, and npm
overrides pin `link-check` within the link checker's supported range and patched
same-major `js-yaml` and `markdown-it` releases. Reassess these pins during updates;
do not remove them or upgrade blindly without rerunning the audit and checks.

## Checks

| Command                 | Purpose                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `npm run lint`          | Run Markdown linting, formatting verification, and link checking.                       |
| `npm run lint:markdown` | Check Markdown structure with markdownlint-cli2.                                        |
| `npm run format:check`  | Verify supported files with Prettier without modifying them.                            |
| `npm run lint:links`    | Check local and external Markdown links. Network access is required for external links. |
| `npm run test:tooling`  | Run focused tests for local link resolution and anchor failures without network access. |
| `npm run format`        | Explicitly rewrite supported files with Prettier during local development.              |

Use check-only commands in CI. Required application build/test, SAST, secret
scanning, business coverage, public API contracts, and human approvals remain
separate; repository tooling does not satisfy those obligations.

## CI workflows and package policy

| Workflow                                  | Stable result job        | Current responsibility                                                                                  |
| ----------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `.github/workflows/application-ci.yml`    | Application CI result    | Restore public tooling, run `npm run test:tooling`, `npm run lint`, and `npm audit --audit-level=high`. |
| `.github/workflows/infrastructure-ci.yml` | Infrastructure CI result | Report Bicep readiness and block affected infrastructure lacking executable validation.                 |

Both use Node.js 22 on GitHub-hosted Ubuntu with SHA-pinned checkout/setup-node
Actions, `contents: read`, and checkout credential persistence disabled. Neither
receives secrets, write permissions, or cloud identities. They run on every pull
request, push to `main`, and manual dispatch; dispatch validates only.

`.github/scripts/ci-foundation.mjs` compares event revisions against their merge
base. Rename detection is disabled so both deleted and added paths are considered.
A failed comparison fails the job instead of silently selecting nothing. Manual
runs evaluate tracked paths. Runtime code selects application validation; Bicep
selects infrastructure; shared contracts, tests, and common configuration select
both. Workflow-specific configuration selects its own domain. Repository
formatting, documentation checks, and tooling tests run once in application CI,
including on documentation-only changes. No workflow path filters leave these
result jobs pending.

Angular/.NET build/test and Bicep validation currently report **not implemented**,
with prerequisites. An affected domain containing runtime/infrastructure files
fails until approved executable checks are added. Removing the last domain file
still selects and blocks its unavailable validation. An unrelated docs-only
change can pass the actual foundation checks without claiming missing checks
passed. SAST and secret scanning are not implemented by these workflows.

Before any npm retrieval or audit, the helper validates manifest and locked
dependency identities against `.github/ci/public-npm-packages.json`, the public
inventory of the existing tooling tree. Unknown identities, aliases, URL/Git/file
sources, missing integrity, registry-specific resolved URLs, and inconsistent
direct dependency declarations stop retrieval with a generic error. Inventory
changes require human public/private classification review together with the
normal license and vulnerability review. Do not copy private names into the
inventory. It guards accidental dependency disclosure, not malicious code
approved by a maintainer.

Actions explicitly passes `--registry=https://registry.npmjs.org/`. Local
execution passes the internal registry instead; no global/local registry is
rewritten. Restores use `--ignore-scripts --audit=false --fund=false`, followed by
an explicit audit after policy validation. Failures are not retried through
another feed. Private/non-npm dependency support requires approved internal-feed
access and is not activated on untrusted runners by this foundation.

After hosted runs exist, a maintainer can configure the two stable result jobs
as required checks. This change does not configure branch protection or enable
deployment. Future CD needs an approved deployment spec, real projects/Bicep,
targets, environments, least-privilege identities, required validation/security
checks, and environment approvals. No deployment route activates merely because
project files appear. See the [validation guide](../specs/001-separate-ci-pipelines/quickstart.md).

Link checking requests the URLs found in Markdown; it does not upload documents
or source code. Do not put credentials, PII, or confidential query parameters in
links. A rate limit, authentication failure, timeout, or unreachable host is a
failed check that needs investigation, not an accepted success status.
HTTP reachability does not prove that an external page's fragment exists.

The link-check wrapper uses the linter's shared file globs and exclusions and
Node's built-in glob support. It also checks hidden `.github` documentation,
resolves local links from each document's directory, and returns a failing exit
code for broken links or request errors.

## Scope and conventions

Markdown linting and link checking cover repository Markdown, including README,
documentation, Copilot customizations, and feature artifacts as they are added.
Exclude `node_modules`, Spec Kit's `.specify` templates, and imported
`speckit-*` skills from these checks to avoid treating upstream template syntax
as authored project documentation. The linter and link checker share these
patterns in `.markdownlint-cli2.cjs`; keep formatting exclusions aligned.

Prettier owns formatting for supported TypeScript, HTML, styles, JSON, YAML, and
Markdown files. Markdownlint checks structure; its line-length rule is disabled
so it does not conflict with preserved prose wrapping or tables. The vendored
Python audit helper and generated/build output are not formatted. Do not
reformat or modify generated clients manually.

The root `.editorconfig` defines UTF-8, LF line endings, a final newline,
two-space indentation by default, and four spaces for C# and Python.
Markdown permits trailing spaces for deliberate hard line breaks.
The root `.gitattributes` also keeps text checkouts on LF so Windows Git
settings do not reintroduce formatting failures.

## Add language-specific checks with the projects

Do not install speculative application dependencies or select an Angular version
through this tooling package. Add the following when the relevant approved
projects and files exist:

| Area                 | Tooling and configuration                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular / TypeScript | ESLint, typescript-eslint type-aware rules, and angular-eslint matched to the chosen Angular major. Include inline/external templates and accessibility rules.                                    |
| C# / .NET 11         | Built-in SDK/Roslyn analyzers, central `.editorconfig` severities and `Directory.Build.props`, nullable checks, and `dotnet format --verify-no-changes`. Enable agreed style rules during builds. |
| Bicep                | Built-in CLI linter with `bicepconfig.json`; preserve separate infrastructure validation and deployment.                                                                                          |
| GitHub Actions       | actionlint for workflow semantics and supported script checks. Do not replace required security scans with it.                                                                                    |
| CSS / SCSS           | Stylelint with a configuration matching the approved stylesheet approach; leave formatting to Prettier.                                                                                           |

Use existing approved feeds, review licenses and vulnerabilities, and record
toolchain compatibility in the relevant feature plan. Linting does not replace
contract tests, business-logic coverage, SAST, secret scanning, dependency
scanning, accessibility verification, or human approval.
