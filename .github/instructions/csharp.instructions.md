---
description: "Scoped C#/.NET 11 implementation and testing conventions without prescribing architecture or dependencies."
applyTo: "src/backend/**/*.cs,src/backend/**/*.csproj,src/shared/**/*.cs,src/shared/**/*.csproj,tests/**/*.cs,tests/**/*.csproj"
---

# C# development

- Follow the constitution, approved spec and tasks, `.editorconfig`, and existing
  conventions. Use the approved .NET 11 SDK and its compatible language version;
  never select "latest" or change toolchain settings implicitly.
- Use PascalCase for types and public members, camelCase for locals, and existing
  private-field conventions. Prefer file-scoped namespaces where consistent.
- Keep visibility minimal and changes focused. Reuse helpers; do not mandate
  repositories, DDD, CQRS, or an ORM without an approved design.
- Respect nullable reference types. Validate external input with appropriate
  guards; avoid blanket null-forgiving operators and redundant defensive checks.
- Use async end-to-end for I/O, propagate cancellation, and dispose owned
  resources. Avoid blocking waits, `async void` outside event handlers, and
  fire-and-forget work. Add retries only when transient failure and idempotency
  justify them.
- Use constructor injection and appropriate service lifetimes. Prefer standard
  framework capabilities over new packages.
- Use specific exceptions and consistent API errors with correlation IDs. Do not
  swallow failures, expose stack traces, or log PII, credentials, or payloads.
- Preserve Entra ID, managed identities, member-level authorization, private
  data access, and parameterized queries. Never trust frontend-only validation.
- Derive tests from acceptance criteria and observe failure before implementation.
  Bug fixes require a failing regression test. Follow existing test frameworks
  and assertion styles; keep tests under `tests/` with synthetic fixtures.
- Preserve public API contract tests and at least 80% business-logic line
  coverage. Verify public-interface compatibility and major-version breaking
  changes; do not edit generated clients by hand.
- Document public contracts and non-obvious rationale; avoid comments that merely
  restate code. Update affected README, configuration, and API guidance.
- Run existing targeted build/test commands. Do not install global tools or
  introduce dependencies without internal-feed, license, and vulnerability checks.

Adapted from [Awesome Copilot's C# instructions](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/instructions/csharp.instructions.md).
See [attribution and license](../AWESOME-COPILOT-NOTICE.md).
