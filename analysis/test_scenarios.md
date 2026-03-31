# Sample Test Scenarios

## Scenario 1: Free Delivery Banner For Repeat Customers

Raw idea:

`Test a free delivery banner for repeat customers.`

Expected workflow behavior:

- intake agent structures brief
- identifies likely repeat-customer targeting and purchase conversion outcome
- review agent flags need for a clear exposure rule and guardrail on margin
- decision likely returns `Needs Revision` in iteration 1 if guardrails are missing
- refinement agent adds guardrails and success criteria
- final recommendation can move to `Ready to Launch`

Expected final decision:

`Ready to Launch`

## Scenario 2: Urgency Messaging Improves Purchase Conversion

Raw idea:

`Check whether urgency messaging improves purchase conversion.`

Expected workflow behavior:

- review agent flags risk of misleading messaging
- asks whether urgency is real inventory scarcity or synthetic urgency
- guardrail needed for refund rate or customer support complaints
- if instrumentation for message exposure is missing, decision should remain `Needs Revision`

Expected final decision:

`Needs Revision`

## Scenario 3: New Onboarding Flow Improves Activation

Raw idea:

`Test whether a new onboarding flow improves activation.`

Expected workflow behavior:

- follow-up agent asks what activation means
- asks for target user cohort and randomization unit
- design review checks for event-level instrumentation across onboarding steps
- if activation is undefined, decision should be `Needs Revision`

Expected final decision:

`Needs Revision`

## Scenario 4: Homepage Redesign With No Metric Definition

Raw idea:

`Launch a redesigned homepage and see if it works better.`

Expected workflow behavior:

- intake agent creates skeletal brief
- follow-up agent requests metric definition and audience
- design review flags weak hypothesis and unclear success criteria
- after max iterations, if no measurable metric is provided, system returns `Not Recommended Yet`

Expected final decision:

`Not Recommended Yet`
