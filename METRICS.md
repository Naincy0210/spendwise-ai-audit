# METRICS.md

## North Star Metric
**Audit-to-Lead Conversion Rate**: The percentage of users who complete an audit and then either provide their email or book a Credex consultation. This measures the tool's effectiveness as a lead-generation asset.

## Driving Metrics
1. **Virality Coefficient (k)**: Number of new audits initiated via a shared unique URL. Since "AI Overspend" is a common pain point, social proof is our primary growth vector.
2. **Savings Intensity**: The average potential monthly savings identified per audit. If this is high (> $300), the tool's value proposition is validated.
3. **Time-to-Value (TTV)**: Time taken from landing to seeing the first "Cost Optimization" recommendation. Goal is < 90 seconds.

## Instrumentation
- **Vercel Analytics / Google Analytics**: Track landing page drop-off.
- **PostHog/Mixpanel**: Track form completion rates per tool (identify if some tools have confusing plans).
- **Firestore Metadata**: Track how many unique shareable URLs are generated.

## Pivot Trigger
If the **Lead Capture rate** drop below 5% for audits showing > $500/mo savings, it indicates that users don't find the "Credits" solution (Credex) credible or the "Audit" logic defensible. We would pivot to a "Pure Benchmarking" play or a "Browser Extension" that automates the audit via seat usage tracking.
