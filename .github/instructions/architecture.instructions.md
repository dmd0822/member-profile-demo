---
description: "Constitution-first architecture discovery, decision records, and design review before implementation planning."
applyTo: "docs/architecture/**/*.md,docs/adr/**/*.md,specs/**/*.md"
---

# Architecture guidance

- Read `.specify/memory/constitution.md` first. Preserve its stack, identity,
  privacy, test-first, observability, and deployment constraints.
- Explore needs and constraints before recommending a solution. Separate facts,
  assumptions, open questions, and decisions requiring human approval.
- Do not invent scale, availability, recovery, cost, compliance, or latency
  requirements. Evaluate the constitutional latency target against the agreed
  peak load, not a fabricated workload.
- Compare viable alternatives and their trade-offs, including the simplest
  approach. Do not mandate DDD, microservices, messaging, caching, or new
  frameworks without an approved need and written justification.
- Use official sources for service-specific claims and record verification
  limitations. Never transmit PII, secrets, or private repository material to
  external research services.
- Address security, reliability, performance efficiency, cost optimization,
  and operational excellence proportionately to the decision.
- General architecture explanations belong in `docs/architecture/`; ADRs belong
  in `docs/adr/` and follow the `create-architectural-decision-record` skill.
  Feature specs, contracts, plans, and tasks remain in `specs/<feature>/`.
- Label diagrams and prose as proposed, accepted, or implemented. Do not turn
  a recommendation into an accepted decision without recorded human review.
- Discovery can precede implementation planning. It does not replace an approved
  spec or authorize code, scaffolding, dependencies, infrastructure, deployment,
  or automatic execution of the next Spec Kit step.
- Link relevant specs and decisions rather than copying requirements into
  competing sources of truth. Keep the plan's Constitution Check and Complexity
  Tracking aligned when a plan is later requested.
- Document unresolved blockers and required reviews at handoff. Constitutional
  exceptions and amendments retain their existing approval requirements.
