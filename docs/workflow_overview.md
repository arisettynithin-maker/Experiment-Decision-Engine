# Workflow Overview

## Main Workflow File

`workflows/agentic_experimentation_decision_engine.json`

This is the importable n8n workflow that orchestrates the full decision engine.

## End-To-End Runtime

### 1. Intake And Context Initialization

- `Receive Experiment Request` accepts a `POST` request.
- `Standardize Input Payload` safely reads webhook body fields.
- `Initialize Experiment Context` creates the experiment ID, slug, and iteration state.

### 2. Brief Generation

- `Generate Experiment Brief (AI)` converts the raw idea into a structured experiment brief.
- `Validate & Structure Brief` parses the model output, applies a fallback if parsing fails, and checks for missing required information.

### 3. Clarification Branch

- `Check Missing Information` decides whether the brief is reviewable.
- If critical information is missing, `Generate Clarification Questions (AI)` returns up to three focused follow-up questions.
- `Extract Clarification Questions` applies a deterministic fallback set if parsing fails.
- `Check If Clarifications Provided` either:
  - returns `awaiting_clarification`, or
  - merges the answers back into the request and rebuilds the brief.

### 4. Brief Rebuild

- `Merge Clarifications Into Brief` enriches the prompt context with the answers.
- `Rebuild Experiment Brief (AI)` regenerates the structured brief.
- `Validate Updated Brief` rejoins the main analysis flow.

### 5. Design Review

- `Evaluate Experiment Design (AI)` reviews the brief as a senior experimentation analyst would.
- `Extract Review Insights` parses the output and appends deterministic blockers such as missing primary metric or missing randomization unit.

### 6. Deterministic Scoring

- `Compute Experiment Readiness Score` turns the review into a readiness model.
- Dimensions include hypothesis clarity, measurement readiness, instrumentation readiness, impact potential, feasibility, and risk.

### 7. Practical Experiment Metrics

- `Estimate Experiment Metrics` calculates baseline rate, uplift, approximate sample size, and estimated duration when baseline inputs are available.

### 8. Decision

- `Generate Experiment Decision (AI)` issues one governed recommendation.
- `Log Decision & Iteration History` appends the result to `iteration_history`.
- `Check Launch Readiness` routes the workflow based on the recommendation.

### 9. Approval And Refinement

If the result is `Ready to Launch`:

- `Check Approval Status` waits for reviewer action.
- `Request Human Approval` returns `awaiting_approval` when no decision is supplied.
- `Check If Changes Requested` and `Check If Rejected` handle `changes_requested` and `reject`.
- `Finalize Approval Status` normalizes the approval result.

If the result is not ready:

- `Check Iteration Limit` prevents endless looping.
- `Improve Experiment Design (AI)` proposes an improved brief.
- `Update Brief & Increment Iteration` applies the changes and loops back to review.

### 10. Documentation Output

- `Generate Experiment Documentation (AI)` produces markdown and JSON artifact content.
- `Prepare Artifact Outputs` exposes the final bundle and artifact paths.
- `Return Final Experiment Package` returns the final payload to the caller.

## Supported Test Scenarios

The workflow has been structured for these runtime scenarios:

1. Complete experiment request flows through review, scoring, decision, approval, documentation, and final response.
2. Incomplete request returns clarification questions.
3. Clarified request rebuilds the brief and continues through the main flow.
4. `reviewer_action = approve` finalizes successfully.
5. `reviewer_action = changes_requested` enters the refinement loop and increments `iteration_number`.
6. `reviewer_action = reject` finalizes with a rejected status.
7. `max_iterations` stops infinite refinement loops safely.

## Example Inputs

Use the JSON payloads in [`examples/`](../examples) to test the workflow from n8n webhook mode.

