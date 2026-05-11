import * as GenAI from "@google/genai";
import { AuditResult } from "../types";

// @ts-ignore
const ai = new (GenAI.GoogleGenerativeAI || (GenAI as any).default?.GoogleGenerativeAI)({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generatePersonalizedSummary(result: AuditResult, teamSize: number, useCase: string): Promise<string> {
  const model = (ai as any).getGenerativeModel({ model: "gemini-1.5-flash" });

  const toolBreakdown = result.recommendations
    .map(r => `- ${r.toolId}: ${r.recommendedAction} (Save $${r.monthlySavings.toFixed(0)}/mo)`)
    .join('\n');

  const prompt = `
    Analyze this AI spend audit result for a team of ${teamSize} developers:
    Current Monthly Spend: $${result.totalCurrentMonthlySpend}
    Potential Monthly Savings: $${result.totalPotentialMonthlySavings}
    Tool Breakdown:
    ${toolBreakdown || 'Stack is already efficient.'}

    Primary Use Case: ${useCase}

    You are a world-class startup finance consultant. 
    Provide a brief (max 100 words) personalized summary emphasizing why these changes matter for their specific use case.
    Be professional, urgent, and specific.
    If savings are > $500, explicitly recommend a Credex consultation.
    If savings are < $100, commend them on a lean stack.
  `;

  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return `Your team is currently spending $${result.totalCurrentMonthlySpend} on AI tools. We identified $${result.totalPotentialMonthlySavings} in potential monthly savings by optimizing your tool mix and plan selection. Implementing these changes could save your team $${result.totalPotentialAnnualSavings} annually.`;
  }
}
