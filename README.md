# member-profile-demo

This project uses Spec Kit. The authoritative project constitution is
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).

Repository-wide guidance for GitHub Copilot is in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md).

## Project structure

Use the following layout as the member-services application is implemented.
Directories are created when needed; this is not a list of existing components.

```text
src/                 Application code only
  cloud/             Azure-hosted member APIs, Functions, and Container Apps services
  shared/            Shared API contracts, member schemas, and reusable libraries
tests/               Unit, integration, and public API contract tests
infra/               Bicep infrastructure as code, modules, and deployment parameters only
docs/                Architecture docs, ADRs, architecture plans, and diagrams
specs/               Spec Kit feature specs, implementation plans, tasks, and contracts
.github/workflows/   Separate infrastructure and application CI/CD workflows
```

Keep application code, infrastructure definitions, tests, and documentation in
their respective directories. This project has no device or Raspberry Pi runtime
layer. Add shared libraries only when an approved feature requires reuse.

Spec Kit feature artifacts belong in `specs/<feature>/`, including `spec.md`,
`plan.md`, `tasks.md`, and feature contracts. General architecture documentation
belongs in `docs/`; Spec Kit configuration and the constitution remain in
`.specify/`.

Infrastructure and application CI/CD must use separate workflow files.
Infrastructure workflows validate and deploy Bicep; application workflows build,
test, and deploy services. Scope triggers to relevant paths while accounting for
shared code, tests, and build configuration. Preserve required checks and
environment approvals, and avoid path filters that leave required checks pending.