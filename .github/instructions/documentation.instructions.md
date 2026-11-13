---
description: "Accurate, audience-focused documentation with traceable decisions and no invented implementation or approval."
applyTo: "**/*.md"
---

# Documentation guidance

- Follow the constitution and preserve existing document purpose and terminology.
  Do not replace Spec Kit templates or amend governance as a side effect of writing.
- Establish the audience and reader's goal. Use the `documentation-writer` skill
  for substantial guides; small corrections do not need an outline approval loop.
- Use descriptive headings, concise prose, meaningful link text, and
  language-tagged fenced code blocks. Define unfamiliar terms.
- Separate tutorials, how-to guides, reference, and explanation where useful.
  Do not create empty documentation categories or speculative guides.
- Distinguish proposals, accepted decisions, and implemented behavior. Never
  invent setup commands, dependencies, versions, endpoints, test results,
  benchmarks, or human approvals.
- Cite repository evidence and official external references. State verification
  limitations explicitly; do not describe an unrun example as tested.
- Use synthetic data only. Do not include PII, account data, credentials, secrets,
  or sensitive payloads in documents, examples, screenshots, or research prompts.
- Keep diagrams consistent with the document's design status and source evidence.
  Describe their purpose in surrounding text; do not imply deployment from a diagram.
- General documentation belongs in `docs/`; architecture explanations in
  `docs/architecture/`; ADRs in `docs/adr/`. Use the ADR skill's single template
  and naming scheme. Feature artifacts stay in `specs/<feature>/`.
- Review affected README guidance, API contracts, configuration, usage, and
  cross-links with every change. Update inaccurate documentation in the same PR
  and identify updates in its description, or explain why none are needed.
- Check links and examples with existing tooling when available. Do not install
  new documentation tools or claim unavailable checks passed.
