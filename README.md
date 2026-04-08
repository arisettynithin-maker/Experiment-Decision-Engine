# Experiment Decision Engine

Workflow-based experimentation intake and governance system built in n8n to standardise experiment review, readiness scoring, approval flow, and auditable decision output.

<img width="1593" height="406" alt="Experiment Decision Engine workflow" src="https://github.com/user-attachments/assets/5a3aa3a5-c90b-46b7-9cc9-4a943cc535c4" />

## Project Overview

This project treats experimentation as an operating system rather than a one-off test request. It packages intake, design review, deterministic scoring, approval, and documentation into a governed workflow that can be reused by analytics, product, and experimentation teams.

It is a strong example of practical automation applied to decision support, with AI used as an assistive layer rather than an uncontrolled replacement for structured review.

## Business Problem

Experiment requests often arrive in an inconsistent format:

- ideas come through Slack, docs, or stakeholder messages
- hypotheses are under-defined
- test design quality varies
- readiness checks are manual
- audit trails are weak or missing

That slows down experimentation and creates governance risk.

## Solution / Approach

This repository implements a workflow engine that:

- captures experiment requests through a webhook
- converts raw requests into structured briefs
- identifies missing information and asks clarifying questions
- runs AI-assisted design review
- applies deterministic readiness scoring
- estimates practical experiment metrics
- routes decisions through human approval
- generates structured markdown and JSON outputs for traceability

The result is a repeatable experimentation process with stronger controls and clearer documentation.

## Tech Stack

- n8n
- JavaScript in n8n `Code` nodes
- OpenAI-compatible API calls
- JSON schemas
- Markdown and JSON output generation

## Key Features

- Structured experiment intake
- Clarification loop for incomplete requests
- AI-assisted design review
- Deterministic readiness scoring
- Sample size and duration estimation
- Human-in-the-loop approval
- Governed recommendation states
- Audit-friendly output generation

## Outputs / Workflow Assets

This repository includes:

- importable workflow JSON in `workflows/`
- architecture and environment docs in `docs/`
- prompt templates in `prompts/`
- schemas in `schemas/`
- examples and output samples in `examples/` and `outputs/`

Start here:

- [docs/architecture.md](docs/architecture.md)
- [docs/workflow_overview.md](docs/workflow_overview.md)
- [docs/environment_variables.md](docs/environment_variables.md)

## Business Impact / Why It Matters

This project matters because it moves experimentation closer to a governed decision process:

- reduces ambiguity in experiment intake
- improves consistency in review quality
- creates a clearer approval and revision path
- keeps AI inside a controlled operating model
- produces documentation that is reusable and auditable

It positions analytics and experimentation work as operational infrastructure, not just analysis.

## Repository Structure

```text
.
├── README.md
├── workflows/
│   └── agentic_experimentation_decision_engine.json
├── docs/
│   ├── architecture.md
│   ├── environment_variables.md
│   ├── linkedin_post.md
│   └── workflow_overview.md
├── prompts/
├── schemas/
├── examples/
├── outputs/
├── analysis/
└── experiments/
```

## How to Run

1. Import `workflows/agentic_experimentation_decision_engine.json` into n8n.
2. Configure the required environment variables described in [docs/environment_variables.md](docs/environment_variables.md).
3. Use the webhook from the intake step to submit sample experiment requests.
4. Review the generated recommendation, approval path, and output artifacts.

## Future Improvements

- connect output storage directly to a governed knowledge base
- add richer performance analytics for experiment backlog management
- integrate approval routing with team collaboration tools
- add a lightweight UI layer for non-technical users
