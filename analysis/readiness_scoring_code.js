/**
 * n8n Code node helper for deterministic experiment readiness scoring.
 *
 * Expected input fields on $json:
 * - structured_brief
 * - review_assessment
 *
 * This node intentionally keeps scoring simple and explainable.
 */

const brief = $json.structured_brief || {};
const review = $json.review_assessment || {};
const blockers = Array.isArray(review.blockers) ? review.blockers : [];

function scoreFromReview(reviewDimension, fallback = 2) {
  return Number(reviewDimension?.score || fallback);
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

const hypothesisClarity = scoreFromReview(review.hypothesis_testability, hasValue(brief.hypothesis) ? 3 : 1);
const measurementReadiness = scoreFromReview(review.metric_quality, hasValue(brief.primary_metric) ? 3 : 1);
const instrumentationReadiness = scoreFromReview(
  review.instrumentation_readiness,
  hasValue(brief.instrumentation_requirements) ? 3 : 1
);
const businessImpactPotential = hasValue(brief.expected_effect) ? 4 : 2;
const feasibility =
  hasValue(brief.randomization_unit) && hasValue(brief.experiment_type) && hasValue(brief.target_segment) ? 4 : 2;

let riskLevel = 2;
const riskCount = Array.isArray(review.bias_and_confounding_risks) ? review.bias_and_confounding_risks.length : 0;

if (riskCount >= 4) riskLevel = 5;
else if (riskCount >= 3) riskLevel = 4;
else if (riskCount >= 2) riskLevel = 3;

if ((brief.risks || []).length >= 4) {
  riskLevel = Math.max(riskLevel, 4);
}

const criticalBlockers = blockers.filter((b) => b.severity === "critical");
const mediumBlockers = blockers.filter((b) => b.severity === "medium");

const readinessScore =
  hypothesisClarity +
  measurementReadiness +
  instrumentationReadiness +
  businessImpactPotential +
  feasibility +
  (5 - riskLevel);

let scoreBand = "borderline";
if (readinessScore >= 22) scoreBand = "strong";
else if (readinessScore < 15) scoreBand = "weak";

let suggestedRecommendation = "Needs Revision";
if (criticalBlockers.length > 0 || readinessScore < 15) {
  suggestedRecommendation = "Not Recommended Yet";
} else if (readinessScore >= 22 && mediumBlockers.length === 0) {
  suggestedRecommendation = "Ready to Launch";
}

return [
  {
    json: {
      dimensions: {
        hypothesis_clarity: hypothesisClarity,
        measurement_readiness: measurementReadiness,
        instrumentation_readiness: instrumentationReadiness,
        business_impact_potential: businessImpactPotential,
        feasibility: feasibility,
        risk_level: riskLevel
      },
      blocker_counts: {
        critical: criticalBlockers.length,
        medium: mediumBlockers.length,
        total: blockers.length
      },
      readiness_score: readinessScore,
      score_band: scoreBand,
      suggested_recommendation: suggestedRecommendation,
      reasoning: [
        `Readiness score calculated as ${readinessScore} using six explainable dimensions.`,
        criticalBlockers.length
          ? `${criticalBlockers.length} critical blocker(s) prevent launch readiness.`
          : "No critical blockers detected.",
        mediumBlockers.length
          ? `${mediumBlockers.length} medium blocker(s) indicate revision work is still needed.`
          : "No medium blockers detected."
      ]
    }
  }
];
