---
description: "Scoped accessibility guidance for Angular templates, styles, components, and frontend tests."
applyTo: "src/frontend/**/*.html,src/frontend/**/*.ts,src/frontend/**/*.css,src/frontend/**/*.scss,tests/**/frontend/**/*.ts,tests/**/frontend/**/*.html"
---

# Angular accessibility

- Follow the feature's approved accessibility criteria. Where none are recorded,
  use WCAG 2.2 AA to identify review risks without claiming an approved conformance
  target or legal certification.
- Prefer native semantic controls, landmarks, and a logical heading hierarchy.
  Use ARIA only to express semantics missing from native HTML.
- Give controls accessible names matching visible labels. Associate instructions
  and validation errors programmatically; do not rely on placeholders or color.
- Keep forms understandable: appropriate input types and autocomplete, preserved
  input on failure, actionable errors, and predictable submission behavior.
- Support keyboard-only use with logical tab order and visible, unobscured focus.
  Avoid positive tabindex. Manage and restore focus for dialogs and route changes
  using existing Angular patterns, not ad hoc global DOM manipulation.
- Announce meaningful asynchronous results and status changes appropriately.
  Do not overuse assertive live regions or move focus for every update.
- Preserve zoom, reflow, user text spacing, adequate contrast, and non-color
  status cues. Honor reduced motion and provide alternatives to dragging or
  precision-dependent interactions. Review target sizing and applicable exceptions.
- Provide useful image alternatives; hide decorative images from assistive
  technology. Include text explanations for complex diagrams or graphics.
- Preserve paste, autofill, and accessible authentication. Do not change identity
  policy or add cognitive challenges as a UI convenience.
- Use existing approved checks with keyboard and screen-reader verification
  where available. Automated scans alone do not establish conformance; report
  unverified browser behavior and missing assistive technology explicitly.
- Add acceptance-based regression tests for authorized fixes before changing
  behavior. Do not install accessibility libraries or automation tooling without
  approval, internal-feed access, and license/vulnerability checks.

Adapted from [Awesome Copilot's accessibility instructions](https://github.com/github/awesome-copilot/blob/222eba62d518c27317e917c92e3ec1a7e6729455/instructions/a11y.instructions.md).
See [attribution and license](../AWESOME-COPILOT-NOTICE.md).
