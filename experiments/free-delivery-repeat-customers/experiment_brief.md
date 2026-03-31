# Experiment Brief

## Experiment Name

Free Delivery Banner For Repeat Customers

## Experiment Slug

`free-delivery-repeat-customers`

## Business Problem

Repeat customers have high browse intent but a portion of sessions do not convert, likely due to delivery cost sensitivity late in the purchase journey.

## Hypothesis

If repeat customers who have purchased at least twice in the last 90 days are shown a clear free delivery banner on eligible product and cart pages, then purchase conversion rate will increase because the banner reduces perceived delivery cost friction.

## Target Segment

Logged-in repeat customers with at least 2 completed purchases in the prior 90 days and delivery-eligible items in cart or product view sessions.

## Primary Metric

Purchase conversion rate

## Secondary Metrics

- Average order value
- Add-to-cart rate
- Checkout start rate

## Guardrail Metrics

- Gross margin per order
- Refund or cancellation rate
- Delivery subsidy cost per order

## Experiment Type

Messaging experiment

## Recommended Test Design

User-level A/B test

## Randomization Unit

User ID

## Expected Effect

1.5% to 3.0% relative lift in purchase conversion rate

## Success Criteria

Declare success if purchase conversion increases with no material deterioration in gross margin per order beyond the agreed threshold and no significant rise in refund or cancellation rate.

## Instrumentation Requirements

- Banner exposure event with user ID and session ID
- Product page view event
- Cart page view event
- Checkout start event
- Purchase event with revenue and subsidy fields
- Margin attribution field on completed orders

## Assumptions

- Repeat customers are more responsive to delivery cost messaging than first-time users.
- Margin impact can be measured at order level.
- Banner exposure can be captured consistently across supported surfaces.

## Risks

- Margin erosion if subsidy cost outweighs conversion lift
- Eligibility logic may create uneven exposure across session types
- Cross-device behavior may dilute user-level attribution

## Implementation Notes

Display the banner only where free delivery eligibility rules are clearly met to avoid misleading users.
