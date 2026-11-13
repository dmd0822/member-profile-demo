---
name: api-breaking-change-detector
description: "Read-only comparison of C# API endpoints and DTOs with Angular/TypeScript consumers to detect contract drift before merging."
license: MIT
---

# API Breaking Change Detector

Use for a requested API compatibility review, DTO change audit, or frontend/backend
contract-sync check. Do not generate endpoints, regenerate clients, edit code,
or create architecture decisions as part of this review.

## Scope and discovery

Read the constitution, applicable instructions, relevant feature contracts, and
the requested change. Identify the endpoint implementation rather than assuming
controllers: inspect controller routes, Minimal API mappings, or Azure Functions
HTTP triggers and host route prefixes as applicable.

Inspect actual serialization configuration, custom converters, naming policies,
`JsonPropertyName`, ignored members, and endpoint-specific overrides. Do not
assume C# property names equal JSON field names.

For each endpoint, record method, normalized route including API version,
route/query/header parameters, request and response shapes, status codes, and
authorization expectations. Treat binding/validation behavior, JSON required
members, nullability, and default values separately: a non-nullable value type
does not by itself prove a field is required on the wire. Confirm actual runtime
settings or report uncertainty.

## Compare consumers

1. Locate Angular `HttpClient` calls, shared TypeScript contracts, and generated
   clients under the approved project layout.
2. Match by HTTP method and resolved route, accounting for base URLs, route
   groups, proxies, and parameter placeholders. Retain version differences and
   separately compare query parameters; do not discard contract-significant data.
3. Label matches as generated-client, normalized-route, or unresolved, with
   confidence and source evidence. Do not infer a pairing solely from class names.
4. Compare backend changes against consumers: removed/renamed fields, type and
   nullability changes, required inputs, status/error shapes, route changes,
   authorization changes, and serialization differences.
5. Compare consumer assumptions against the backend: missing response properties,
   stale request fields, unhandled errors, and absent required inputs.
   Determine whether unknown fields are ignored or rejected before classifying
   them as harmless.
6. For a compatibility claim, compare with the available base revision or
   approved prior contract. If no baseline exists, report current mismatch only,
   not an invented breaking change.

## Report

Provide audited endpoints and files, findings grouped by endpoint, exact
file/line references, change impact, match confidence, and suggested contract
tests. List endpoints with no consumer located and areas not inspected.
No static match is not proof that an endpoint is unused.

Do not expose real payloads, PII, tokens, or credentials in findings. This is a
source-based heuristic review, not proof of runtime compatibility, a replacement
for public API contract tests, or authorization to accept a breaking change.
Apply the constitution's major-version requirement for breaking public interfaces.
If no application or contract exists yet, report that limitation rather than
scaffolding one.

Adapted from [Awesome Copilot's API Breaking Change Detector](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/api-breaking-change-detector/SKILL.md).
See [attribution and license](../../AWESOME-COPILOT-NOTICE.md).
