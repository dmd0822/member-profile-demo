---
description: "Scoped member-services secure coding guidance for Angular, C# APIs, shared contracts, and tests."
applyTo: "src/frontend/**/*.ts,src/frontend/**/*.html,src/backend/**/*.cs,src/backend/**/*.json,src/shared/**/*,tests/**/*"
---

# Member-services security

- Apply the constitution's Entra ID and managed identity requirements. Do not
  implement local password storage, custom token issuers, API-key authentication,
  or credential-bearing connection strings.
- Validate authentication and required token properties using supported identity
  libraries and approved configuration. Fail closed; do not weaken validation
  to make tests or local development pass.
- Enforce authorization and member ownership server-side for every protected
  operation. Client route guards and supplied member IDs are not authorization.
  Test unauthorized access and cross-member read/update attempts.
- Bind requests to explicit allowed fields; prevent mass assignment of privileged
  properties. Validate type, size, range, and format at trusted boundaries.
- Use parameterized SQL and safe framework serialization. Never construct SQL,
  shell commands, or file paths directly from untrusted input.
- Prefer Angular text interpolation. Do not bypass Angular sanitization for
  untrusted content; justify any raw HTML requirement and review it explicitly.
- Validate outbound destinations and redirects when user input can influence
  them. Do not permit arbitrary URLs or filesystem traversal.
- Restrict CORS to approved origins. Apply CSRF protection when authentication
  uses ambient credentials; do not assume one authentication transport in advance.
  Keep tokens and sensitive data out of URLs and unsafe browser storage.
- Use HTTPS/TLS 1.2+, private data-service endpoints, resource-scoped least
  privilege, and approved US regions. Unavoidable secrets belong in Key Vault.
- Preserve structured security/audit events and correlation IDs without logging
  PII, account data, tokens, or request/response payloads. Safe error responses
  must not expose stack traces or internal details.
- Use synthetic fixtures only. Do not disable authorization, validation, or
  scanning to satisfy a test. Keep license, vulnerability, SAST, and secret
  scanning requirements intact; instructions are not substitutes for scanners.
- Raise identity, privacy, authorization, and public-contract changes for the
  constitution's required review. Do not self-approve or deploy such changes.

Adapted from [Awesome Copilot's Security and OWASP instructions](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/instructions/security-and-owasp.instructions.md).
See [attribution and license](../AWESOME-COPILOT-NOTICE.md).
