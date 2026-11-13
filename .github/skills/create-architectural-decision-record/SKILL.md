---
name: create-architectural-decision-record
description: "Create a proposed ADR for a specific architecture decision, documenting alternatives, evidence, consequences, and human review status."
license: MIT
---

# Create Architectural Decision Record

Use when the user requests an ADR or asks to record a specific architecture
decision. Do not create speculative ADRs for every discussion.

## Workflow

1. Read the constitution, architecture instructions, relevant spec, and existing
   ADRs. Identify the decision, context, alternatives, and review roles.
   Ask for missing material information; never invent approval or requirements.
2. Search `docs/adr/` for the same decision. Update an existing proposed record
   when appropriate instead of creating duplicates.
3. For a new record, choose the next unused four-digit number and save it as
   `docs/adr/adr-NNNN-title-slug.md`. Check for a filename collision before writing.
   Create the directory only when an ADR is actually requested.
4. Use the template below, retaining meaningful trade-offs and evidence.
   Replace placeholders with known information or explicit unresolved questions.
5. Default to `Proposed`. Change status only on explicit instruction supported by
   recorded human review. An accepted ADR is not permission to bypass spec,
   security, constitutional amendment, or implementation gates.
6. Preserve accepted decisions as history. Use a new linked ADR for a changed
   decision, updating supersession metadata only when authorized.

## Template

```markdown
---
title: "ADR-NNNN: Decision title"
status: Proposed
date: YYYY-MM-DD
review_roles: []
approval_reference: ""
supersedes: ""
superseded_by: ""
---

# ADR-NNNN: Decision title

## Context

Problem, relevant requirements, constraints, and decision drivers.
Link the applicable spec and related decisions.

## Decision

Proposed choice and rationale. Identify assumptions and unresolved questions.

## Alternatives considered

Viable options, including the simplest alternative, with benefits, drawbacks,
and reasons for not recommending each.

## Consequences

Positive and negative effects, risks, operational implications, and cost drivers.

## Constitution check

Assess each constitutional principle as pass, fail, or proposed exception with
evidence. Record required reviews. An exception is not an approval; when an
implementation plan exists, track exceptions in its Complexity Tracking section.

## Validation and review

Evidence supporting the decision, validation still needed, review roles, and
links to actual approval records when available. Do not claim approval by default.

## References

Related specs, ADRs, official documentation, and supporting evidence.
```

Keep records concise and human-readable; coded bullet identifiers are not
required. Never include member PII, credentials, or confidential external data.

Adapted from [Awesome Copilot's ADR skill](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/create-architectural-decision-record/SKILL.md).
See [attribution and license](../../AWESOME-COPILOT-NOTICE.md).
