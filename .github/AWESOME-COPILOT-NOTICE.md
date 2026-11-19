# Awesome Copilot attribution

The following repository customizations are adapted from
[github/awesome-copilot](https://github.com/github/awesome-copilot) at revision
`222eba62d518c27317e917c92e3ec1a7e6729455`:

| Local file                                             | Upstream source                                                                                                                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `agents/azure-principal-architect.agent.md`            | [Azure Principal Architect](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/agents/azure-principal-architect.agent.md)                       |
| `agents/technical-writer.agent.md`                     | [SE: Technical Writer](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/agents/se-technical-writer.agent.md)                                  |
| `skills/create-architectural-decision-record/SKILL.md` | [Create Architectural Decision Record](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/create-architectural-decision-record/SKILL.md) |
| `skills/documentation-writer/SKILL.md`                 | [Documentation Writer](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/documentation-writer/SKILL.md)                                 |
| `agents/csharp-expert.agent.md`                        | [C# Expert](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/agents/CSharpExpert.agent.md)                                                    |
| `agents/accessibility-expert.agent.md`                 | [Accessibility Expert](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/agents/accessibility.agent.md)                                        |
| `skills/api-breaking-change-detector/SKILL.md`         | [API Breaking Change Detector](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/api-breaking-change-detector/SKILL.md)                 |
| `skills/test-gap-audit/SKILL.md`                       | [Test Gap Audit](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/test-gap-audit/SKILL.md)                                             |
| `skills/test-gap-audit/scripts/coverage_map.py`        | [Coverage-map helper](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/skills/test-gap-audit/scripts/coverage_map.py)                         |
| `instructions/csharp.instructions.md`                  | [C# instructions](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/instructions/csharp.instructions.md)                                       |
| `instructions/security.instructions.md`                | [Security and OWASP instructions](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/instructions/security-and-owasp.instructions.md)           |
| `instructions/accessibility.instructions.md`           | [Accessibility instructions](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/instructions/a11y.instructions.md)                              |

The planning agent is adapted from the separately verified upstream revision
`dc0083dbe22133bfa7ce3500dee85e187e0cd47a`:

| Local file                 | Upstream source                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agents/planning.agent.md` | [Plan Mode - Strategic Planning & Architecture](https://github.com/github/awesome-copilot/blob/dc0083dbe22133bfa7ce3500dee85e187e0cd47a/agents/plan.agent.md) |

Local adaptations align these resources with the project constitution, Spec Kit
approval gates, existing tools, privacy requirements, and a single ADR format.
Model pins and obsolete tool lists were removed. The architecture and
documentation instruction files are project-specific guidance.

The planning adaptation retains collaborative repository exploration,
requirements clarification, alternatives, dependencies, risks, and test-strategy
discussion. It removes client-specific tool assumptions and keeps formal planning
and task artifacts in the existing Spec Kit workflows. It adds explicit human
review and no-implementation boundaries rather than a parallel planning system.
The source file and MIT license were inspected at the pinned revision above.

Implementation/review adaptations remove automatic package installation and
unapproved architecture choices, preserve .NET 11 and Spec Kit gates, narrow
instruction scopes, and explicitly separate heuristic audits from measured
coverage and runtime verification. API discovery also covers Minimal APIs and
Azure Functions when present. The optional coverage-map script is vendored
unchanged; its limitations are documented in the adapted test-gap skill.

## QA adaptations at revision 1683f50e94c9fd489191f73d7c8f7e2bd871bd0c

The following additions are adapted separately from
[github/awesome-copilot](https://github.com/github/awesome-copilot) at revision
`1683f50e94c9fd489191f73d7c8f7e2bd871bd0c`; the earlier adaptations retain the
revision recorded above:

| Local file                        | Upstream source                                                                                                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agents/test-strategist.agent.md` | [QA agent](https://github.com/github/awesome-copilot/blob/1683f50e94c9fd489191f73d7c8f7e2bd871bd0c/agents/qa-subagent.agent.md)                                                     |
| `instructions/qa.instructions.md` | [QA Engineering Best Practices](https://github.com/github/awesome-copilot/blob/1683f50e94c9fd489191f73d7c8f7e2bd871bd0c/instructions/qa-engineering-best-practices.instructions.md) |

These adaptations make the agent planning-only by default, remove client-specific
tool lists, and narrow QA instructions to tests and feature test plans. They
preserve constitutional test-first and coverage requirements, Spec Kit authority,
human approval gates, synthetic-data privacy, and truthful execution evidence.
Risk-based levels replace fixed pyramid ratios; real authorized isolated
integration boundaries complement unit mocks. Load and security execution require
separate authorization. Playwright, AI Team QA, and Quality Playbook are not added.

The [upstream LICENSE at this revision](https://github.com/github/awesome-copilot/blob/1683f50e94c9fd489191f73d7c8f7e2bd871bd0c/LICENSE)
was inspected and contains the same MIT notice preserved below.

## Upstream license

MIT License

Copyright GitHub, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
