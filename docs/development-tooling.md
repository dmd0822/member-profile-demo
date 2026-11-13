# Development tooling

The root npm package contains repository checks only. It does not scaffold the
Angular frontend, .NET backend, infrastructure, or application pipelines.

## Setup

Use Node.js 22.17 or newer and npm. The repository's `.npmrc` selects the approved
internal feed, `https://packagefeedproxy.microsoft.io/npm/`. Obtain any required
feed access through the organization's approved process; never commit credentials
or substitute a public registry when access fails.

From the repository root, restore the pinned dependency tree:

```powershell
npm ci --ignore-scripts
```

The package lock records exact dependency versions and integrity values.
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

Use the check-only commands in CI when an approved runner and internal-feed
authentication are configured. This change does not add a workflow or assume
that a public GitHub-hosted runner can reach the internal feed. Required build,
test, security, and approval checks remain separate.

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
