---
name: documentation-writer
description: "Create audience-focused tutorials, how-to guides, reference, and explanation using Diataxis, with an approved outline for substantial new documents."
license: MIT
---

# Documentation Writer

Use for substantial documentation authoring or restructuring, not routine code
changes or small wording corrections. Follow the
[Diataxis framework](https://diataxis.fr/) to separate four reader needs:

- Tutorial: guided learning toward a concrete outcome.
- How-to guide: steps to accomplish a specific task.
- Reference: precise facts about interfaces, options, or behavior.
- Explanation: context, rationale, concepts, and trade-offs.

## Workflow

1. Read the constitution, documentation instructions, relevant repository
   evidence, and existing documentation. Determine document type, audience, goal,
   scope, and exclusions. Ask only for information not already established.
2. Propose a concise outline for a substantial new document or restructuring.
   Await user approval before drafting the full document. For a small correction
   within an existing document, preserve its structure without a new approval loop.
3. Gather evidence from approved specs, contracts, accepted ADRs, and source code
   where available. Official external documentation may be consulted using
   available tools; cite it without sending private repository material,
   member data, or secrets to external services.
4. Write clear, direct Markdown using consistent vocabulary and progressive
   disclosure. Keep examples minimal, synthetic, and relevant to the reader.
5. Check claims, links, examples, and affected README guidance. Use only existing
   verification tooling and report anything unverified instead of claiming success.

## Accuracy and boundaries

- Clearly distinguish proposed architecture, accepted decisions, and implemented
  behavior. Do not describe a proposed component as deployed or operational.
- Never invent versions, endpoints, setup commands, performance results, or
  human approvals. Label unresolved questions and illustrative examples.
- Keep general guides and architecture explanations in `docs/`. Keep Spec Kit
  feature artifacts in `specs/<feature>/`; do not create substitute specs or plans.
- Use the ADR skill for decision records rather than duplicating its template.
- Creating documentation does not authorize application code, dependencies,
  infrastructure changes, deployment, or advancement through Spec Kit gates.

Adapted from [Awesome Copilot's Documentation Writer](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/documentation-writer/SKILL.md).
See [attribution and license](../../AWESOME-COPILOT-NOTICE.md).
