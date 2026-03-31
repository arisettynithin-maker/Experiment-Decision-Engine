# Agentic Experimentation Decision Engine

An n8n workflow for experiment intake, analytical review, readiness scoring, human approval, and governed documentation output.

<img width="1593" height="406" alt="Screenshot 2026-03-31 at 9 02 32 PM" src="https://github.com/user-attachments/assets/5a3aa3a5-c90b-46b7-9cc9-4a943cc535c4" />


## Business Problem

Experiment ideas often arrive as loose requests in Slack threads, planning docs, or stakeholder messages. Teams then lose time translating those ideas into measurable briefs, checking whether the design is actually testable, and documenting the decision process in a way that is reusable and auditable.

This project packages that process into a single workflow. Instead of treating experimentation like a one-off A/B test setup task, it treats it as a governed operating process with structured inputs, deterministic controls, review loops, and explicit approval states.

## What The Workflow Does

The workflow accepts a raw experiment request through a webhook and moves it through these stages:

1. Standardizes the incoming request and creates experiment metadata.
2. Uses an AI intake step to convert the raw idea into a structured experiment brief.
3. Detects missing information and, when needed, returns targeted clarification questions.
4. Rebuilds the brief once clarifications are supplied.
5. Runs an AI design review focused on testability, metrics, randomization, instrumentation, and bias risk.
6. Applies deterministic readiness scoring in n8n `Code` nodes.
7. Estimates practical experiment metrics such as baseline rate, lift, sample size, and duration.
8. Produces a governed recommendation: `Ready to Launch`, `Needs Revision`, or `Not Recommended Yet`.
9. Routes the result through human approval with `approve`, `changes_requested`, and `reject` actions.
10. Runs a refinement loop when changes are needed, up to a controlled iteration limit.
11. Generates auditable markdown and JSON outputs for downstream storage or repo write-back.

## Architecture Overview

The implementation is organized into five layers:

- Intake layer: receives the request, normalizes fields, and initializes experiment context.
- Clarification layer: asks focused follow-up questions and rebuilds incomplete briefs.
- Analysis layer: evaluates design quality, applies deterministic scoring, and estimates experiment metrics.
- Decision layer: issues one final governed recommendation and logs iteration history.
- Governance and output layer: handles approval, rejection, iteration limits, and documentation output.

See [docs/architecture.md](docs/architecture.md) and [docs/workflow_overview.md](docs/workflow_overview.md) for the full breakdown.

## Key Features

- AI-assisted experiment brief generation from raw business requests
- Clarification flow for incomplete briefs
- Senior-style design review focused on measurement and experimentation quality
- Deterministic readiness scoring as a control layer over AI reasoning
- Practical experiment metric estimation inside n8n `Code` nodes
- Human-in-the-loop approval and rejection handling
- Iterative refinement loop with auditable iteration history
- Structured documentation output for governance and traceability
- Importable n8n workflow JSON with runtime-safe branching

## Feedback Loop And Governance

The project is intentionally not a chatbot demo. The workflow includes explicit governance controls:

- Missing information does not get guessed. It is returned as clarification work.
- AI recommendations do not act alone. Deterministic scoring remains a control layer.
- Non-ready experiments do not silently fail. They enter a bounded refinement loop.
- Finalization still requires a human approval signal.
- Every iteration is logged so the decision trail stays explainable.

This makes the project more representative of a real internal experimentation workflow than a simple A/B testing helper.

## Technologies Used

- n8n
- OpenAI-compatible chat completion API via `HTTP Request` nodes
- JavaScript in n8n `Code` nodes
- JSON-first structured outputs
- Git/GitHub for public repo presentation and audit-friendly artifacts

## Repository Structure

```text
.
├── README.md
├── LICENSE
├── .gitignore
├── workflows/
│   └── agentic_experimentation_decision_engine.json
├── docs/
│   ├── architecture.md
│   ├── workflow_overview.md
│   └── linkedin_post.md
├── prompts/
│   ├── intake_agent_prompt.md
│   ├── clarification_agent_prompt.md
│   ├── design_review_agent_prompt.md
│   ├── decision_agent_prompt.md
│   ├── refinement_agent_prompt.md
│   └── documentation_agent_prompt.md
├── examples/
│   ├── sample_request_complete.json
│   ├── sample_request_clarification.json
│   ├── sample_request_approval.json
│   ├── sample_request_changes_requested.json
│   └── sample_request_reject.json
├── outputs/
│   └── sample_final_output.json
├── analysis/
│   ├── experiment_stats_code.js
│   └── readiness_scoring_code.js
├── schemas/
│   ├── decision.schema.json
│   ├── design_review.schema.json
│   ├── documentation.schema.json
│   ├── follow_up.schema.json
│   ├── intake_brief.schema.json
│   └── refinement.schema.json
└── experiments/
    └── free-delivery-repeat-customers/
```

## How To Test The Workflow

1. Import [workflows/agentic_experimentation_decision_engine.json](workflows/agentic_experimentation_decision_engine.json) into n8n.
2. Set environment variables for `OPENAI_API_KEY`, and optionally `OPENAI_BASE_URL` and `OPENAI_MODEL`.
3. Activate test mode in n8n and copy the webhook URL from `Receive Experiment Request`.
4. Send a `POST` request with a JSON body matching one of the samples in [`examples/`](examples).
5. Re-run the webhook with clarification answers or reviewer actions when the workflow returns `awaiting_clarification` or `awaiting_approval`.

## Sample Webhook Payloads

- Complete request: [examples/sample_request_complete.json](examples/sample_request_complete.json)
- Clarification-required request: [examples/sample_request_clarification.json](examples/sample_request_clarification.json)
- Approval callback: [examples/sample_request_approval.json](examples/sample_request_approval.json)
- Changes-requested callback: [examples/sample_request_changes_requested.json](examples/sample_request_changes_requested.json)
- Reject callback: [examples/sample_request_reject.json](examples/sample_request_reject.json)

## Example Output

- Final output example: [outputs/sample_final_output.json](outputs/sample_final_output.json)
- Example artifact bundle: [experiments/free-delivery-repeat-customers/structured_output.json](experiments/free-delivery-repeat-customers/structured_output.json)

## Why This Project Is Relevant

This repository is relevant for analytics, product, BI, experimentation, and AI workflow roles because it demonstrates:

- translating ambiguous business requests into structured analytical artifacts
- designing operational workflows rather than isolated analyses
- combining deterministic logic with AI-generated reasoning
- managing approval, auditability, and governance in workflow systems
- building experimentation support tooling that looks like an internal operating system, not a toy demo

## Future Improvements

- Add a real screenshot export of the n8n canvas
- Add schema validation nodes before downstream routing
- Persist experiment records in a backing database instead of webhook-only state
- Add GitHub write-back nodes for automated artifact commits
- Add Slack or email approval UX on top of the reviewer webhook contract

