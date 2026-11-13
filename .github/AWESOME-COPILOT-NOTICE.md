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

Local adaptations align these resources with the project constitution, Spec Kit
approval gates, existing tools, privacy requirements, and a single ADR format.
Model pins and obsolete tool lists were removed. The architecture and
documentation instruction files are project-specific guidance.

Implementation/review adaptations remove automatic package installation and
unapproved architecture choices, preserve .NET 11 and Spec Kit gates, narrow
instruction scopes, and explicitly separate heuristic audits from measured
coverage and runtime verification. API discovery also covers Minimal APIs and
Azure Functions when present. The optional coverage-map script is vendored
unchanged; its limitations are documented in the adapted test-gap skill.

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
