# member-profile-demo

This project uses Spec Kit. The authoritative project constitution is
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).

Repository-wide guidance for GitHub Copilot is in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md).

## Technology stack

The frontend is implemented in Angular with TypeScript. The backend is implemented
in C# using .NET 11, hosted on Azure Functions and Container Apps as appropriate
to the approved design. Use Azure SQL for data and Bicep for infrastructure as code.
Record the Angular version and compatible toolchain in the implementation plan.

## Project structure

Use the following layout as the member-services application is implemented.
Directories are created when needed; this is not a list of existing components.

```text
src/                 Application code only
  frontend/          Angular frontend (TypeScript)
    src/app/
      components/    Reusable UI components
      pages/         Routed member-facing views
      services/      API clients and frontend application services
  backend/           .NET 11 backend (C#), member APIs, and Azure-hosted services
    Models/          Backend domain and data models
    Services/        Business logic and application services
    Api/             HTTP endpoints, request handling, and middleware
  shared/            Shared API contracts, member schemas, and reusable libraries
tests/               Unit, integration, and public API contract tests
  unit/              Isolated frontend and backend logic tests
  integration/       Service and data-access integration tests
  contract/          Public API request and response contract tests
infra/               Bicep infrastructure as code, modules, and deployment parameters only
docs/                Architecture docs, ADRs, architecture plans, and diagrams
specs/               Spec Kit feature specs, implementation plans, tasks, and contracts
.github/workflows/   Separate infrastructure and application CI/CD workflows
```

Keep application code, infrastructure definitions, tests, and documentation in
their respective directories. This project has no device or Raspberry Pi runtime
layer. Add shared libraries only when an approved feature requires reuse.
Keep cross-stack contracts language-neutral or generate language-specific clients;
Angular must not directly depend on C# implementation libraries.

Spec Kit feature artifacts belong in `specs/<feature>/`, including `spec.md`,
`plan.md`, `tasks.md`, and feature contracts. General architecture documentation
belongs in `docs/`; Spec Kit configuration and the constitution remain in
`.specify/`.

Infrastructure and application CI/CD must use separate workflow files.
Infrastructure workflows validate and deploy Bicep; application workflows build,
test, and deploy the Angular frontend and .NET 11 backend. Scope triggers to
relevant paths while accounting for shared code, tests, and build configuration.
Preserve required checks and
environment approvals, and avoid path filters that leave required checks pending.

## GitHub planning and task tracking

Each Spec Kit feature plan maps to a GitHub milestone. Each task maps to a GitHub
issue assigned to that milestone. Record the milestone URL in `plan.md` and the
issue URL alongside each task in `tasks.md`; link back to the feature spec and
plan from GitHub.

Keep scope, dependencies, and completion status aligned between the feature
artifacts and GitHub. Reuse existing milestones and issues to avoid duplicates,
and report permission or access blockers rather than claiming synchronization
succeeded. See the constitution for the full tracking requirements.