export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type EventType =
  | "research_signal"
  | "champion_identified"
  | "competitor_detected"
  | "architecture_recommendation"
  | "security_blocker"
  | "procurement_friction"
  | "legal_review"
  | "expansion_path"
  | "executive_narrative"
  | "deal_stage_advanced"
  | "approval_required";

export interface SimulationEvent {
  id: string;
  timestamp: Date;
  agentName: string;
  priority: PriorityLevel;
  type: EventType;
  title: string;
  explanation: string;
  recommendedAction?: string;
  /** Calm operational phrasing for display */
  operationalPhrase?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "analyzing" | "recommending" | "awaiting_approval";
  confidenceScore: number;
  priority: PriorityLevel;
  lastActionAt: Date;
  activeRecommendation?: string;
}

export interface OrgNode {
  id: string;
  name: string;
  useCase: string;
  buyingLikelihood: number;
  arrPotential: number;
  status: "latent" | "identified" | "engaged" | "pilot" | "deployed";
  recommendedNextStep: string;
}

export interface Competitor {
  id: string;
  name: string;
  category: "frontier" | "coding" | "search" | "workflow" | "cloud" | "vertical";
  strengthAreas: string[];
  claudeDifferentiation: string[];
  accountRiskLevel: number;
  detectedFootprint?: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  reason: string;
  requestingAgent: string;
  estimatedImpact: string;
  riskLevel: "low" | "medium" | "high";
  timestamp: Date;
  status: "pending" | "approved" | "rejected" | "modified";
}

export interface Account {
  id: string;
  name: string;
  /** Total Addressable Market in $M (e.g. 50 = $50M TAM). Optional; show "N/A" when missing/zero. */
  tam?: number;
  employeeCount: number;
  developerPopulation: number;
  aiMaturityScore: number;
  securitySensitivity: number;
  complianceComplexity: number;
  competitivePressure: number;
  existingVendorFootprint: string[];
  executiveSponsors: string[];
  firstWedge: string;
  estimatedLandValue: number;
  estimatedExpansionValue: number;
  topBlockers: string[];
  topExpansionPaths: string[];
}

export type SignalSourceType =
  | "call"
  | "crm"
  | "document"
  | "market"
  | "relationship";

export interface AccountSignal {
  id: string;
  title: string;
  summary: string;
  priority: PriorityLevel;
  confidence: number;
  owner: string;
  impact: string;
  recommendedAction: string;
  sourceType: SignalSourceType;
  sourceLabel: string;
  sourceFreshness: string;
  disposition: "watch" | "validated" | "challenged";
}

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  team: string;
  stance: "champion" | "ally" | "neutral" | "blocker" | "executive";
  influence: "high" | "medium" | "low";
  relationshipStrength: number;
  nextStep: string;
  note: string;
  lastTouch: string;
  proofNeeded: string;
  recentMoment: string;
  risk: string;
}

export interface ExecutionItem {
  id: string;
  title: string;
  phase: string;
  owner: string;
  status: "in_progress" | "ready" | "blocked" | "complete";
  dueLabel: string;
  detail: string;
  decisionRequired?: boolean;
  decisionStatus?: "pending" | "approved" | "deferred";
  checkpoint: string;
  lastUpdated: string;
  blockerDetail?: string;
}

export interface WorkspaceDraft {
  dealThesis: string;
  winTheme: string;
  thisWeekFocus: string;
  operatorNotes: string;
  /** CRM-style deal header fields (lightweight) */
  opportunityName: string;
  /** Annual Contract Value in USD (not TCV). Store as string for easy editing. */
  acvUsd: string;
  /** Contract term in months (e.g., 12/24/36). Store as string for easy editing. */
  termMonths: string;
  /** Forecast category (Salesforce-style) */
  forecastCategory: "Pipeline" | "Best Case" | "Commit" | "Closed Won" | "Closed Lost";
}

export interface AccountUpdate {
  id: string;
  createdAt: string;
  author: string;
  title: string;
  note: string;
  tag: "call" | "internal" | "risk" | "next_step" | "exec";
}

export type DealStage =
  | "signal_detection"
  | "champion_identified"
  | "pov_selected"
  | "pilot_design"
  | "security_review"
  | "legal_review"
  | "procurement"
  | "executive_alignment"
  | "initial_deployment"
  | "expansion_phase_1"
  | "expansion_phase_2";

export interface DealStageInfo {
  stage: DealStage;
  label: string;
  completed: boolean;
  current: boolean;
  confidence: number;
  blockers: string[];
  projectedArr: number;
}

export type CompetitorCategory =
  | "frontier"
  | "coding"
  | "search"
  | "workflow"
  | "cloud"
  | "vertical";
