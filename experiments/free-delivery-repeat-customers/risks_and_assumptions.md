# Risks And Assumptions

## Key Assumptions

- Delivery cost friction is a meaningful barrier for repeat customers in the tested journeys.
- User-level randomization is feasible and stable for logged-in traffic.
- Margin and subsidy data can be joined to experiment exposure at evaluation time.

## Key Risks

- The message may create conversion lift but still reduce net profitability.
- Banner targeting may exclude meaningful traffic if eligibility logic is too narrow.
- Users who switch devices or browse while logged out may dilute treatment assignment consistency.

## Mitigations

- enforce gross margin and subsidy guardrails
- validate event instrumentation before launch
- run a short QA phase for exposure logging and eligibility logic
