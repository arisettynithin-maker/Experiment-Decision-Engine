# LinkedIn Post Draft

I built a new portfolio project called **Agentic Experimentation Decision Engine**.

It is an **n8n-based experimentation governance workflow** that turns raw business ideas into structured experiment briefs, reviews them like a product analytics team would, applies deterministic readiness scoring, routes them through human approval, and generates auditable outputs.

What I wanted to show with this project:

- experimentation is more than just an A/B test calculator
- AI can help structure decision workflows, not just generate text
- strong analytics systems need governance, feedback loops, and explicit approval paths

The workflow includes:

- experiment intake through webhook
- clarification handling for incomplete requests
- AI-based experiment brief generation
- design review focused on metrics, instrumentation, randomization, and bias risk
- deterministic readiness scoring in n8n `Code` nodes
- practical stats estimation
- one final recommendation: `Ready to Launch`, `Needs Revision`, or `Not Recommended Yet`
- human-in-the-loop approval with `approve`, `changes_requested`, and `reject`
- bounded refinement loops with iteration history
- markdown and JSON artifact generation

Why I think this project matters:

Most portfolio projects in analytics show reporting, dashboards, or one-off analysis. I wanted to build something that looks more like an internal operating system for experimentation quality.

This project sits at the intersection of:

- product analytics
- experimentation governance
- workflow automation
- decision support systems
- AI-enabled analytics operations

If you work in product analytics, BI, experimentation, decision science, or AI workflow design, I’d be glad to compare notes.

