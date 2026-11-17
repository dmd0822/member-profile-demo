# Development tooling

The root npm package provides repository checks and foundation-boundary tests.
The repository also contains an Angular frontend and a host-neutral .NET 11
backend class library, each with independent build/test commands. This is only a
neutral application foundation: it adds no member behavior, API, identity,
persistence, hosting runtime, or deployment.

## Setup

Use Node.js 22.17 or newer and npm. The repository's `.npmrc` selects the approved
internal feed, `https://packagefeedproxy.microsoft.io/npm/`. Obtain any required
feed access through the organization's approved process; never commit credentials
or substitute a public registry when local access fails. GitHub Actions uses
`https://registry.npmjs.org/` explicitly for public npm dependencies, as adopted in
constitution v2.3.0. Private dependencies and non-npm packages use approved internal
feeds in every environment; their names and credentials must not reach public npm.
The Angular project separately pins Node.js 24.22.3 and declares Node 24.15
through pre-25 as its supported engine range.

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

The Angular project has its own lockfile. For local frontend dependency retrieval,
select the approved internal registry explicitly:

```powershell
npm --prefix src/frontend ci --ignore-scripts --audit=false --fund=false --registry=https://packagefeedproxy.microsoft.io/npm/
```

Private package identities and credentials must not be sent to public npm. In
GitHub Actions, public npm is used only for the reviewed public dependency set;
private npm packages and non-npm dependencies remain on approved internal feeds.
Do not retry a failed request through another registry.

The tool versions are deliberately pinned rather than following the newest
release tags. Newer Markdown-linter and link-checker dependency trees introduced
audit findings during setup. The current baseline avoids those trees, and npm
overrides pin `link-check` within the link checker's supported range and patched
same-major `js-yaml` and `markdown-it` releases. Reassess these pins during updates;
do not remove them or upgrade blindly without rerunning the audit and checks.

## Checks

| Command                   | Purpose                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run lint`            | Run Markdown linting, formatting verification, and link checking.                            |
| `npm run lint:markdown`   | Check Markdown structure with markdownlint-cli2.                                             |
| `npm run format:check`    | Verify supported files with Prettier without modifying them.                                 |
| `npm run lint:links`      | Check local and external Markdown links. Network access is required for external links.      |
| `npm run test:tooling`    | Test CI routing/package policy and link handling, including a synthetic local HTTP redirect. |
| `npm run test:foundation` | Test initial-project counts, source/test boundaries, and prohibited foundation content.      |
| `npm run format`          | Explicitly rewrite supported files with Prettier during local development.                   |

Root `npm run lint` is repository-documentation/tooling lint. Angular lint is a
separate frontend command:

```powershell
npm --prefix src/frontend run lint
```

The Angular ESLint flat config is `src/frontend/eslint.config.mjs`; it enables
the Angular ESLint recommended TypeScript and template rules, including
template-accessibility rules. `.github/scripts/ci-foundation.mjs` requires this
config and invokes frontend lint for selected application changes. The frontend
lock is checked against `.github/ci/public-npm-packages.json`; its
`minimatch` 11.0.1 override is scoped only to
`@typescript-eslint/typescript-estree`. These lint rules do not replace browser
or assistive-technology accessibility verification.

## Application project commands

Run the frontend independently from the backend. Its package scripts define
`lint`, `build`, and non-watch `test`; the Angular test builder discovers specs under
`tests/unit/frontend/`, outside `src/`. The production build includes application
source, not the external test files.

```powershell
npm --prefix src/frontend run lint
npm --prefix src/frontend run build
npm --prefix src/frontend run test
```

Frontend lint, build, and test passed locally; the test run discovered one test
file containing one test.

The backend is a `net11.0` class library. `NuGet.Config` selects
`https://packagefeedproxy.microsoft.io/nuget/v3/index.json` as its sole package
source. Its external MSTest project is under
`tests/unit/backend/` and contains three foundation-boundary tests; it is not a
second runtime application. Restore through the approved internal NuGet source,
then build and test independently:

```powershell
dotnet restore tests/unit/backend/MemberProfile.Backend.Tests.csproj --configfile NuGet.Config
dotnet build src/backend/MemberProfile.Backend.csproj --configuration Release --no-restore
dotnet test tests/unit/backend/MemberProfile.Backend.Tests.csproj --configuration Release --no-restore
```

The test command must discover the nonempty MSTest suite. These tests enforce
framework, project-reference, and external-test boundaries; they are not
business-logic coverage. There are no public endpoints, so endpoint contract
tests do not yet apply. Business-logic coverage is N/A, not 100%.

## Dependency and formatting checks

The application validation helper selects the registry by environment and
audits the Angular dependency tree. Locally, use only the approved internal npm
feed:

```powershell
npm --prefix src/frontend audit --audit-level=high --registry=https://packagefeedproxy.microsoft.io/npm/
```

The prior isolated internal-feed audit reported zero vulnerabilities. The
latest integrated validation run stopped when the approved internal feed's
audit endpoint returned HTTP 429; the latest run is blocked, not a pass. Do not
switch local dependency auditing to public npm. The NuGet vulnerability check
used the approved source and returned a successful machine-readable report
with no vulnerable-package entries:

```powershell
dotnet list tests/unit/backend/MemberProfile.Backend.Tests.csproj package --vulnerable --include-transitive --format json --configfile NuGet.Config --no-restore
```

The helper parses the JSON explicitly and fails closed on malformed or
unexpected output. It does not treat an unparseable response as a clean audit.
Both backend formatting checks passed locally:

```powershell
dotnet format src/backend/MemberProfile.Backend.csproj --verify-no-changes --no-restore
dotnet format tests/unit/backend/MemberProfile.Backend.Tests.csproj --verify-no-changes --no-restore
```

The tooling regression suite passed 23/23 tests and the foundation suite passed
8/8. Backend formatting verification and tests passed; the backend suite
discovered three tests. These local checks do not imply that the latest
integrated run fully passed: its npm audit was blocked by HTTP 429. No hosted CI
run or deployment occurred. Do not extrapolate local results to GitHub Actions.

## CI workflows and package policy

| Workflow                                  | Stable result job        | Current responsibility                                                                                                |
| ----------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/application-ci.yml`    | Application CI result    | Configure CodeQL and select tooling plus Angular/.NET validation, dependency checks, and formatting by changed paths. |
| `.github/workflows/infrastructure-ci.yml` | Infrastructure CI result | Report Bicep readiness and block affected infrastructure lacking executable validation.                               |

The application workflow includes a CodeQL job using SHA-pinned
`github/codeql-action` v3.39.3 (commit
`9418214df1f2c4b8128c770156c409013b07d6b9`) to analyze
`javascript-typescript` and `csharp`, with `build-mode: none` and
`security-extended`. This records the configured job only; hosted CodeQL
analysis and required-result enforcement have not been verified.

Both workflows use GitHub-hosted Ubuntu with SHA-pinned checkout/setup-node
Actions and checkout credential persistence disabled. The application
workflow-level permission is `contents: read`; its CodeQL job additionally has
`security-events: write`. The infrastructure workflow uses Node.js 22 and
read-only repository access. Neither workflow receives cloud identities or
deployment credentials. They run on every pull request, push to `main`, and
manual dispatch; dispatch validates only.

`.github/scripts/ci-foundation.mjs` compares event revisions against their merge
base. Rename detection is disabled so both deleted and added paths are considered.
A failed comparison fails the job instead of silently selecting nothing. Manual
runs evaluate tracked paths. Runtime code selects application validation; Bicep
selects infrastructure; shared contracts, tests, and common configuration select
both. Workflow-specific configuration selects its own domain. Repository
formatting, documentation checks, and tooling tests run once in application CI
only for changes under `src/`, `tests/unit/`, `.github/scripts/`, `.github/ci/`,
the application workflow, or root non-Markdown configuration files (excluding
`LICENSE`). Documentation-only, infrastructure-only, and isolated integration or
contract-test changes skip npm restore, lint/link checks, tooling tests, and audit.
Domain-readiness checks remain active, so missing project validation still blocks
relevant domain changes. Documentation checks remain available locally through
`npm run lint`. No workflow path filters leave the result jobs pending.

For selected application changes, CI invokes the Angular install/lint/audit/
build/test commands, restores the MSTest project using `NuGet.Config`, runs
the NuGet vulnerability check, verifies .NET formatting, builds the backend,
and runs its external tests. The NuGet response is parsed as JSON and malformed
or incomplete output fails closed. Bicep validation remains **not implemented**.

The security gate remains **blocked** pending repository-admin verification
and hosted CI on this branch. The CodeQL job is configured, but repository
settings and security endpoints were inaccessible or returned 404, so CodeQL
enforcement, GitHub secret scanning, and push protection are unverified. Do not
claim these controls are enabled or treat the configured job as hosted evidence.
Selected application-source changes fail closed until the required controls are
verified. Do not substitute an unreviewed scanner or package source.
Documentation-only changes do not establish application readiness. No hosted
CI run or deployment occurred.

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

The 2026-11-16 hosted scenario matrix verified both stable result jobs against
the candidate link-check shutdown fix; it does not prove that fix is merged.
The prior local approved-feed audit evidence applies to the root tooling
dependency tree, not the Angular project, and predates the latest integrated
run. The latest approved internal-feed npm audit request returned HTTP 429;
there is no passing result for that run. T007/T008 validation is fulfilled for
the separate CI foundation, while T006 awaits reviewed integration of the
link-check shutdown fix and evidence documentation.
See the [validation evidence](../specs/001-separate-ci-pipelines/quickstart.md#current-evidence).
A maintainer can configure required checks separately. Read-only inspection found
`main` unprotected (`protected: false`); no branch-protection change is authorized
by this milestone. Milestone 1 remains open, and deployment is not enabled.
Future CD needs an approved deployment spec, real projects/Bicep,
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

The candidate shutdown fix destroys Node's HTTP and HTTPS global agents in a
CLI-only `finally` block after awaiting the link results. This releases sockets
retained by redirects so the process can exit naturally after completed checks.
It preserves errors and exit codes: it does not force `process.exit`, ignore
links, or change timeouts or link policy. The synthetic local-HTTP regression
failed with `ETIMEDOUT` after five seconds before the fix despite reporting zero
failed links, then passed with the fix. Final reviewed integration is pending.

## Scope and conventions

Markdown linting and link checking cover repository Markdown, including README,
documentation, Copilot customizations, and feature artifacts as they are added.
Exclude `**/node_modules/**`, Spec Kit's `.specify` templates, and imported
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

## Additional language-specific tooling

The Angular project now has a lint command and flat ESLint configuration.
Backend CI formatting verification is configured; other language-specific
checks remain future work:

| Area                 | Current state and possible follow-up                                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular / TypeScript | Angular ESLint TypeScript/template and template-accessibility rules, build, and external Vitest/jsdom tests are configured. This is not browser accessibility verification. |
| C# / .NET 11         | SDK builds and `dotnet format --verify-no-changes` run for both projects. Additional agreed style rules may be considered with review.                                      |
| Bicep                | No infrastructure project exists; CLI lint/validation remains unimplemented.                                                                                                |
| GitHub Actions       | actionlint is not configured. The CodeQL job is configured, but enforcement, hosted analysis, secret scanning, and push protection are unverified.                          |
| CSS / SCSS           | Stylelint is not configured; do not select a stylesheet approach or install it speculatively.                                                                               |

Use existing approved feeds, review licenses and vulnerabilities, and record
toolchain compatibility in the relevant feature plan. Project builds/tests and
formatting do not replace contract tests when public endpoints are introduced,
business-logic coverage when business logic exists, SAST, secret scanning,
accessibility verification, or human approval. API latency and browser or
accessibility conformance remain unmeasured/not applicable to this foundation.
