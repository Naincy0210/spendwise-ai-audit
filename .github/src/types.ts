export type PlanType = 'free' | 'individual' | 'pro' | 'max' | 'team' | 'business' | 'enterprise' | 'api-direct';

export interface ToolPlan {
  name: string;
  pricePerUser: number;
  minUsers?: number;
  maxUsers?: number;
}

export interface ToolPricing {
  id: string;
  name: string;
  plans: Record<PlanType, ToolPlan | null>;
  alternatives?: string[];
  description: string;
}

export interface UserToolInput {
  toolId: string;
  plan: PlanType;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  tools: UserToolInput[];
}

export interface AuditRecommendation {
  toolId: string;
  currentPlan: PlanType;
  recommendedPlan: PlanType;
  recommendedAction: string;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  totalCurrentMonthlySpend: number;
  totalPotentialMonthlySavings: number;
  totalPotentialAnnualSavings: number;
  recommendations: AuditRecommendation[];
  aiSummary?: string;
  createdAt: string;
}

export interface Lead {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}
