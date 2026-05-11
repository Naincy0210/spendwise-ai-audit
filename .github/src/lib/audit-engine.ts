import { AuditInput, AuditRecommendation, AuditResult, PlanType } from '../types';
import { PRICING_DATA } from './pricing-data';

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: AuditRecommendation[] = [];
  let totalCurrentMonthlySpend = 0;

  // Process each tool
  input.tools.forEach(toolInput => {
    totalCurrentMonthlySpend += toolInput.monthlySpend;
    const toolPricing = PRICING_DATA[toolInput.toolId];
    if (!toolPricing) return;

    let rec: AuditRecommendation | null = null;

    // 1. Check for Plan Overkill (e.g. Team for 1 person)
    if (toolInput.seats < 3 && (toolInput.plan === 'team' || toolInput.plan === 'business' || toolInput.plan === 'enterprise')) {
      const betterPlan: PlanType = toolPricing.plans.pro ? 'pro' : (toolPricing.plans.individual ? 'individual' : 'free');
      const betterPlanPrice = toolPricing.plans[betterPlan]?.pricePerUser || 0;
      const potentialMonthlySpend = betterPlanPrice * toolInput.seats;
      const savings = toolInput.monthlySpend - potentialMonthlySpend;

      if (savings > 0) {
        rec = {
          toolId: toolInput.toolId,
          currentPlan: toolInput.plan,
          recommendedPlan: betterPlan,
          recommendedAction: `Downgrade to ${toolPricing.plans[betterPlan]?.name}`,
          monthlySavings: savings,
          reason: `${toolPricing.plans[toolInput.plan]?.name} plan for ${toolInput.seats} seats is inefficient. Switching to ${toolPricing.plans[betterPlan]?.name} saves $${savings.toFixed(0)}/mo.`
        };
      }
    }

    // 2. Check for Credex Arbitrage (Enterprise savings)
    if (toolInput.plan === 'enterprise' || toolInput.monthlySpend > 500) {
      const credexSavings = toolInput.monthlySpend * 0.35; // 35% discount via Credex
      if (!rec || credexSavings > rec.monthlySavings) {
        rec = {
          toolId: toolInput.toolId,
          currentPlan: toolInput.plan,
          recommendedPlan: toolInput.plan,
          recommendedAction: 'Move to Credex Credits',
          monthlySavings: credexSavings,
          reason: `High-spend enterprise accounts qualify for 35% discount through the Credex inventory pool.`
        };
      }
    }

    // 3. Multi-Tool Redundancy (Cursor vs Copilot)
    const hasCursor = input.tools.some(t => t.toolId === 'cursor');
    const hasCopilot = input.tools.some(t => t.toolId === 'copilot');
    
    if (toolInput.toolId === 'copilot' && hasCursor) {
      rec = {
        toolId: toolInput.toolId,
        currentPlan: toolInput.plan,
        recommendedPlan: 'free',
        recommendedAction: 'Consolidate to Cursor',
        monthlySavings: toolInput.monthlySpend,
        reason: 'Using both Cursor and Copilot is redundant. Cursor includes high-quality IDE-level AI that replaces the need for a separate Copilot subscription.'
      };
    }

    if (rec) {
      recommendations.push(rec);
    }
  });

  const totalPotentialMonthlySavings = recommendations.reduce((acc, r) => acc + r.monthlySavings, 0);

  return {
    id: crypto.randomUUID(),
    totalCurrentMonthlySpend,
    totalPotentialMonthlySavings,
    totalPotentialAnnualSavings: totalPotentialMonthlySavings * 12,
    recommendations,
    createdAt: new Date().toISOString(),
  };
}
