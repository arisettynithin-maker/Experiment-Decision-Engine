/**
 * n8n Code node helper for practical experimentation metrics.
 *
 * Expected input fields on $json:
 * - baseline_conversions
 * - baseline_visitors
 * - variant_conversions
 * - variant_visitors
 * - expected_relative_lift
 * - alpha (optional, default 0.05)
 * - power (optional, default 0.8)
 * - daily_eligible_traffic
 * - guardrail_thresholds (optional object)
 * - observed_guardrails (optional object)
 */

function rate(conversions, visitors) {
  return visitors > 0 ? conversions / visitors : 0;
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function zCritical(alpha = 0.05) {
  return alpha === 0.1 ? 1.64 : 1.96;
}

function zPower(power = 0.8) {
  if (power >= 0.9) return 1.28;
  if (power >= 0.85) return 1.04;
  return 0.84;
}

function absoluteLift(baselineRate, variantRate) {
  return variantRate - baselineRate;
}

function relativeLift(baselineRate, variantRate) {
  if (baselineRate === 0) return 0;
  return (variantRate - baselineRate) / baselineRate;
}

function standardError(baselineRate, baselineVisitors, variantRate, variantVisitors) {
  if (!baselineVisitors || !variantVisitors) return null;
  return Math.sqrt(
    (baselineRate * (1 - baselineRate)) / baselineVisitors +
    (variantRate * (1 - variantRate)) / variantVisitors
  );
}

function confidenceIntervalDiff(diff, se, alpha = 0.05) {
  if (se === null) return null;
  const z = zCritical(alpha);
  return {
    lower: diff - z * se,
    upper: diff + z * se
  };
}

function zScore(diff, se) {
  if (!se || se === 0) return null;
  return diff / se;
}

function significanceSummary(z) {
  if (z === null) return "Insufficient sample or variance to summarize significance.";
  const absZ = Math.abs(z);
  if (absZ >= 1.96) return "Result is directionally significant at approximately the 95% confidence level.";
  if (absZ >= 1.64) return "Result is borderline significant at approximately the 90% confidence level.";
  return "Result is not statistically convincing yet based on this rough approximation.";
}

function approximateSampleSize(baselineRate, expectedRelativeLift, alpha = 0.05, power = 0.8) {
  if (!baselineRate || !expectedRelativeLift) return null;
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + expectedRelativeLift);
  const delta = Math.abs(p2 - p1);
  if (delta === 0) return null;
  const pooled = (p1 + p2) / 2;
  const za = zCritical(alpha);
  const zb = zPower(power);
  const numerator =
    Math.pow(za * Math.sqrt(2 * pooled * (1 - pooled)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  return Math.ceil(numerator / Math.pow(delta, 2));
}

function estimateDurationDays(sampleSizePerVariant, dailyEligibleTraffic) {
  if (!sampleSizePerVariant || !dailyEligibleTraffic) return null;
  const dailyPerVariant = dailyEligibleTraffic / 2;
  if (dailyPerVariant <= 0) return null;
  return Math.ceil(sampleSizePerVariant / dailyPerVariant);
}

function detectGuardrailBreaches(thresholds = {}, observed = {}) {
  const breaches = [];

  for (const metric of Object.keys(thresholds)) {
    const rule = thresholds[metric];
    const value = observed[metric];
    if (value === undefined || value === null) continue;

    if (rule.type === "max" && value > rule.value) {
      breaches.push(`${metric} breached maximum threshold: observed ${value}, allowed ${rule.value}`);
    }

    if (rule.type === "min" && value < rule.value) {
      breaches.push(`${metric} breached minimum threshold: observed ${value}, allowed ${rule.value}`);
    }
  }

  return breaches;
}

const baselineConversions = Number($json.baseline_conversions || 0);
const baselineVisitors = Number($json.baseline_visitors || 0);
const variantConversions = Number($json.variant_conversions || 0);
const variantVisitors = Number($json.variant_visitors || 0);
const expectedRelativeLiftInput = Number($json.expected_relative_lift || 0);
const alpha = Number($json.alpha || 0.05);
const power = Number($json.power || 0.8);
const dailyEligibleTraffic = Number($json.daily_eligible_traffic || 0);

const baselineRate = rate(baselineConversions, baselineVisitors);
const variantRate = rate(variantConversions, variantVisitors);
const absLift = absoluteLift(baselineRate, variantRate);
const relLift = relativeLift(baselineRate, variantRate);
const se = standardError(baselineRate, baselineVisitors, variantRate, variantVisitors);
const ci = confidenceIntervalDiff(absLift, se, alpha);
const z = zScore(absLift, se);
const sampleSizePerVariant = approximateSampleSize(baselineRate, expectedRelativeLiftInput, alpha, power);
const estimatedDays = estimateDurationDays(sampleSizePerVariant, dailyEligibleTraffic);
const guardrailBreaches = detectGuardrailBreaches($json.guardrail_thresholds, $json.observed_guardrails);

return [
  {
    json: {
      baseline_rate: round(baselineRate, 4),
      variant_rate: round(variantRate, 4),
      absolute_uplift: round(absLift, 4),
      relative_lift: round(relLift, 4),
      confidence_interval_95: ci
        ? {
            lower: round(ci.lower, 4),
            upper: round(ci.upper, 4)
          }
        : null,
      z_score_approx: z !== null ? round(z, 3) : null,
      significance_summary: significanceSummary(z),
      sample_size_per_variant_approx: sampleSizePerVariant,
      estimated_test_duration_days: estimatedDays,
      guardrail_breaches: guardrailBreaches,
      interpretation: {
        baseline_vs_variant: `Baseline conversion is ${round(baselineRate * 100, 2)}% and variant conversion is ${round(variantRate * 100, 2)}%.`,
        uplift_summary: `Observed absolute uplift is ${round(absLift * 100, 2)} percentage points and relative lift is ${round(relLift * 100, 2)}%.`,
        launch_risk_note: guardrailBreaches.length
          ? "One or more guardrails are breached and should be resolved before launch."
          : "No guardrail breaches were detected in the supplied metrics."
      }
    }
  }
];
