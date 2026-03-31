# Suggested Environment Variables And Credentials

## Environment Variables

These are practical suggestions. Use only the ones needed for your final build.

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
OPENAI_BASE_URL=https://api.openai.com/v1

GITHUB_OWNER=your-github-username
GITHUB_REPO=agentic-experimentation-decision-engine
GITHUB_BRANCH=main
GITHUB_BASE_PATH=experiments

N8N_PUBLIC_BASE_URL=https://your-n8n-instance.example.com
EXPERIMENT_MAX_ITERATIONS=3
DEFAULT_ALPHA=0.05
DEFAULT_POWER=0.8
DEFAULT_CONFIDENCE_LEVEL=0.95

REVIEWER_EMAIL=reviewer@example.com
SLACK_APPROVAL_CHANNEL=
```

## n8n Credentials

### 1. LLM Provider Credential

Use one of:

- native OpenAI credential in n8n
- `HTTP Request` node with bearer token auth

### 2. GitHub Credential

Use for:

- writing artifact files
- optionally opening pull requests

### 3. Email Or Slack Credential

Use if you want:

- reviewer notifications
- approval requests
- changes-requested feedback capture

### 4. Webhook Security

If using public webhooks:

- validate request source
- include a simple shared secret or auth layer
- avoid exposing raw governance routes without authentication

## Practical Note

If your n8n version does not support strict structured output from the model node, use:

1. strong prompt instructions requiring JSON only
2. a `Code` validation node after each agent call
3. optional retry routing if parsing fails
