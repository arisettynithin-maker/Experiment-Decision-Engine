# Architecture

## Overview

Agentic Experimentation Decision Engine is a governed n8n workflow that turns raw experiment ideas into structured experiment packages. It combines AI reasoning with deterministic review logic so the output is explainable, testable, and suitable for internal decision support.

The workflow is built around a single experiment context that moves through intake, clarification, review, scoring, decision, approval, refinement, and documentation stages.

## System Layers

### Intake Layer

Purpose:

- receive the experiment request through a webhook
- standardize the payload shape
- create stable metadata such as `experiment_id`, `experiment_slug`, `submitted_at`, and `iteration_number`

Key nodes:

- `Receive Experiment Request`
- `Standardize Input Payload`
- `Initialize Experiment Context`

### Clarification Layer

Purpose:

- generate a structured experiment brief from a raw idea
- detect whether critical fields are missing
- return targeted clarification questions instead of guessing
- rebuild the brief when clarifications are provided

Key nodes:

- `Generate Experiment Brief (AI)`
- `Validate & Structure Brief`
- `Check Missing Information`
- `Generate Clarification Questions (AI)`
- `Return Clarification Request`
- `Merge Clarifications Into Brief`
- `Rebuild Experiment Brief (AI)`
- `Validate Updated Brief`

### Analysis Layer

Purpose:

- review the experiment design through an analytics lens
- score the experiment using deterministic criteria
- estimate practical experiment metrics from baseline assumptions

Key nodes:

- `Evaluate Experiment Design (AI)`
- `Extract Review Insights`
- `Compute Experiment Readiness Score`
- `Estimate Experiment Metrics`

This layer is where the project moves beyond generic AI summarization. The design review focuses on testability, measurement quality, instrumentation readiness, guardrails, and bias risk. The scoring step then converts that review into a deterministic readiness model.

### Decision Layer

Purpose:

- combine the structured brief, design review, readiness score, and stats summary
- issue one governed recommendation
- maintain an iteration history for traceability

Key nodes:

- `Generate Experiment Decision (AI)`
- `Log Decision & Iteration History`
- `Check Launch Readiness`

Allowed recommendations:

- `Ready to Launch`
- `Needs Revision`
- `Not Recommended Yet`

### Governance Layer

Purpose:

- route launch-ready experiments to explicit approval
- route non-ready experiments into the refinement loop
- support `approve`, `changes_requested`, and `reject` actions
- stop looping after the configured maximum iteration count

Key nodes:

- `Check Approval Status`
- `Request Human Approval`
- `Check If Changes Requested`
- `Check If Rejected`
- `Check Iteration Limit`
- `Improve Experiment Design (AI)`
- `Update Brief & Increment Iteration`
- `Finalize Approval Status`

## Decision Flow

The runtime decision flow works like this:

1. A webhook request enters the workflow.
2. The AI intake step produces a structured brief.
3. If the brief is incomplete, the workflow returns clarification questions.
4. If clarification answers are supplied, the brief is rebuilt and revalidated.
5. The design review evaluates experiment quality and adds blockers.
6. The readiness score converts the review into deterministic control logic.
7. The decision step issues one final recommendation.
8. If the result is not ready, the workflow checks the iteration limit.
9. If another iteration is allowed, the refinement step improves the brief and loops back into review.
10. If the recommendation is launch-ready, the workflow checks for reviewer action.
11. The reviewer can approve, reject, or request changes.
12. Once finalized, the documentation step prepares markdown and JSON artifact outputs.

## Why The Governance Matters

The project is designed to model experimentation as a governed business process:

- AI does not bypass measurement discipline.
- Missing details are surfaced rather than invented.
- Refinement is explicit and bounded.
- Human approval is preserved.
- Outputs are structured for auditability and repository storage.

That combination is what makes the project relevant for analytics and decision-support roles rather than reading like a generic AI automation demo.

