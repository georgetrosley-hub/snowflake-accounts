import type {
  SimulationEvent,
  EventType,
  PriorityLevel,
  Agent,
  ApprovalRequest,
  OrgNode,
} from "@/types";
import { accounts } from "@/data/accounts";

type EventTemplate = {
  type: EventType;
  agentName: string;
  priority: PriorityLevel;
  title: string;
  explanation: string;
  recommendedAction?: string;
  operationalPhrase?: string;
};

const EVENT_TEMPLATES: Record<string, EventTemplate[]> = {
  jnj: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Clinical Data Sciences evaluating unified trial analytics platform. Snowflake in the mix.", recommendedAction: "Engage Clinical Data leadership", operationalPhrase: "opportunity detected in clinical data" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "VP Clinical Data Sciences interested in pilot for trial analytics with Unity Catalog.", recommendedAction: "Prepare pilot proposal", operationalPhrase: "champion identified in clinical data" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "high", title: "Competitive pressure elevated", explanation: "Snowflake Cortex and data warehouse evaluation in progress.", recommendedAction: "Differentiate on Lakehouse and Mosaic AI", operationalPhrase: "competitive pressure elevated" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "Quality review recommended", explanation: "Quality and Legal want governance narrative before pilot.", recommendedAction: "Package Unity Catalog and audit story", operationalPhrase: "quality review recommended" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "RWE and R&D could benefit from unified platform.", recommendedAction: "Map R&D and regulatory leadership", operationalPhrase: "expansion path identified" },
  ],
  merck: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "R&D Data Platform wants to consolidate discovery and preclinical data.", recommendedAction: "Engage R&D Data Platform", operationalPhrase: "opportunity detected in R&D data" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "Director R&D Data Platform interested in data lake and Mosaic AI pilot.", recommendedAction: "Draft pilot scope", operationalPhrase: "champion identified" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "medium", title: "Competitive pressure", explanation: "Palantir Foundry in some R&D workflows. Land with additive use case.", recommendedAction: "Position as additive, not displacement", operationalPhrase: "competitive pressure" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "IP and data residency review", explanation: "Security wants IP protection and data residency clarity.", recommendedAction: "Prepare deployment narrative", operationalPhrase: "security review recommended" },
  ],
  bms: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Clinical Dev Ops evaluating trial data platform. Snowflake comparison in parallel.", recommendedAction: "Engage Clinical Dev Ops", operationalPhrase: "opportunity detected in clinical ops" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "VP Clinical Dev Ops interested in Databricks for trial analytics.", recommendedAction: "Win on architecture and time-to-value", operationalPhrase: "champion identified" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "high", title: "Competitive pressure elevated", explanation: "Snowflake evaluation for data warehouse. Need to land clinical analytics first.", recommendedAction: "Differentiate Lakehouse vs warehouse", operationalPhrase: "competitive pressure elevated" },
  ],
  pfizer: [
    { type: "research_signal", agentName: "Research Agent", priority: "medium", title: "Opportunity detected", explanation: "Medical Affairs exploring regulated document workflows.", recommendedAction: "Engage Medical Affairs" },
    { type: "legal_review", agentName: "Legal and Procurement Agent", priority: "high", title: "Legal review recommended", explanation: "GxP and FDA validation considerations for AI-assisted workflows.", recommendedAction: "Prepare regulatory package", operationalPhrase: "legal review recommended" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "Compliance review recommended", explanation: "Data residency and audit requirements need mapping.", recommendedAction: "Document compliance requirements", operationalPhrase: "compliance review recommended" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "Clinical trial documentation and submission prep could benefit.", recommendedAction: "Map clinical operations", operationalPhrase: "expansion path identified" },
  ],
  sanofi: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Vaccines Data wants to unify analytics for R&D and manufacturing.", recommendedAction: "Engage Vaccines Data leadership", operationalPhrase: "opportunity detected in vaccines" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "Head of Data & Analytics, Vaccines interested in unified platform.", recommendedAction: "Prepare EU deployment path", operationalPhrase: "champion identified" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "EU data residency review", explanation: "EU data residency and GDPR compliance required.", recommendedAction: "Document DPA and deployment options", operationalPhrase: "data residency review" },
  ],
};

const APPROVAL_TEMPLATES: Record<string, { title: string; reason: string; agent: string; impact: string; risk: "low" | "medium" | "high" }[]> = {
  jnj: [
    { title: "Launch trial analytics pilot with Clinical Data Sciences", reason: "Champion aligned; Quality review in progress.", agent: "Human Oversight Agent", impact: "$2.2M land, path to expansion", risk: "medium" },
    { title: "Package governance narrative for Quality and Legal", reason: "Required before pilot approval.", agent: "Human Oversight Agent", impact: "Unblocks pilot timeline", risk: "low" },
    { title: "Build executive brief for CDO", reason: "Executive alignment needed for Snowflake comparison.", agent: "Human Oversight Agent", impact: "Moves decision forward", risk: "low" },
  ],
  merck: [
    { title: "Launch R&D data lake pilot", reason: "Champion aligned; additive use case.", agent: "Human Oversight Agent", impact: "$1.9M land, path to expansion", risk: "medium" },
    { title: "Schedule security and IP review", reason: "Required before pilot.", agent: "Human Oversight Agent", impact: "Unblocks pilot", risk: "low" },
  ],
  bms: [
    { title: "Launch clinical trial analytics pilot", reason: "Clinical Dev Ops interested. Snowflake in parallel.", agent: "Human Oversight Agent", impact: "$1.6M land, path to expansion", risk: "medium" },
    { title: "Prepare Veeva integration design", reason: "Key for Clinical Dev Ops.", agent: "Human Oversight Agent", impact: "Accelerates pilot", risk: "low" },
  ],
  pfizer: [
    { title: "Run Medical Affairs knowledge pilot", reason: "Regulated document workflows pilot.", agent: "Human Oversight Agent", impact: "$2M land, path to expansion", risk: "medium" },
    { title: "Initiate Legal and Quality review", reason: "GxP and IP considerations.", agent: "Human Oversight Agent", impact: "Unblocks deployment", risk: "medium" },
  ],
  sanofi: [
    { title: "Launch Vaccines data platform pilot", reason: "Champion aligned. EU residency required.", agent: "Human Oversight Agent", impact: "$1.5M land, path to expansion", risk: "medium" },
    { title: "Complete EU data residency and DPA review", reason: "Legal and DPO sign-off required.", agent: "Human Oversight Agent", impact: "Unblocks pilot", risk: "low" },
  ],
  default: [
    { title: "Launch pilot", reason: "Champion aligned; pilot scope defined.", agent: "Human Oversight Agent", impact: "Unblocks expansion path", risk: "medium" },
    { title: "Schedule security architecture review", reason: "Required before pilot approval.", agent: "Human Oversight Agent", impact: "Unblocks timeline", risk: "low" },
  ],
};

let eventId = 0;
let approvalId = 0;

function getEventTemplates(accountId: string): EventTemplate[] {
  return EVENT_TEMPLATES[accountId] ?? EVENT_TEMPLATES.jnj;
}

function getApprovalTemplates(accountId: string) {
  return APPROVAL_TEMPLATES[accountId] ?? APPROVAL_TEMPLATES.default;
}

function deterministicIndex(seed: number, max: number): number {
  return Math.floor(((seed * 9301 + 49297) % 233280) / 233280 * max);
}

export function generateEvent(accountId: string, tick: number): SimulationEvent | null {
  const templates = getEventTemplates(accountId);
  const idx = deterministicIndex(tick, templates.length);
  const t = templates[idx];
  if (!t) return null;
  eventId++;
  return {
    id: `evt-${eventId}`,
    timestamp: new Date(),
    agentName: t.agentName,
    priority: t.priority,
    type: t.type,
    title: t.title,
    explanation: t.explanation,
    recommendedAction: t.recommendedAction,
    operationalPhrase: t.operationalPhrase,
  };
}

export function generateApprovalRequest(accountId: string, tick: number): ApprovalRequest | null {
  const templates = getApprovalTemplates(accountId);
  const idx = deterministicIndex(tick + 1000, templates.length);
  const t = templates[idx];
  if (!t) return null;
  approvalId++;
  return {
    id: `apr-${approvalId}`,
    title: t.title,
    reason: t.reason,
    requestingAgent: t.agent,
    estimatedImpact: t.impact,
    riskLevel: t.risk,
    timestamp: new Date(),
    status: "pending",
  };
}

export function buildOrgNodes(accountId: string): OrgNode[] {
  const account = accounts.find((a) => a.id === accountId);
  if (!account) return [];

  const baseNodes: OrgNode[] = [
    { id: "rnd", name: "R&D", useCase: "Drug discovery, computational chemistry", buyingLikelihood: 72, arrPotential: account.estimatedExpansionValue * 0.25, status: "identified", recommendedNextStep: "Map R&D Data Platform", },
    { id: "clinical", name: "Clinical Ops", useCase: "Trial analytics, site performance", buyingLikelihood: 78, arrPotential: account.estimatedExpansionValue * 0.3, status: "engaged", recommendedNextStep: "Pilot design", },
    { id: "regulatory", name: "Regulatory", useCase: "Submission prep, document workflows", buyingLikelihood: 65, arrPotential: account.estimatedExpansionValue * 0.15, status: "latent", recommendedNextStep: "Discover use cases", },
    { id: "medical", name: "Medical Affairs", useCase: "HCP engagement, knowledge retrieval", buyingLikelihood: 70, arrPotential: account.estimatedExpansionValue * 0.2, status: "identified", recommendedNextStep: "Pilot scope", },
    { id: "manufacturing", name: "Manufacturing", useCase: "Quality, supply chain analytics", buyingLikelihood: 60, arrPotential: account.estimatedExpansionValue * 0.1, status: "latent", recommendedNextStep: "Map data needs", },
  ];

  return baseNodes;
}

export function buildAgents(): Agent[] {
  return [
    { id: "territory", name: "Territory Intelligence Agent", role: "Market and timing signals", status: "idle", confidenceScore: 82, priority: "medium", lastActionAt: new Date() },
    { id: "research", name: "Research Agent", role: "Champion and opportunity detection", status: "idle", confidenceScore: 85, priority: "high", lastActionAt: new Date() },
    { id: "competitive", name: "Competitive Strategy Agent", role: "Competitive positioning", status: "idle", confidenceScore: 78, priority: "medium", lastActionAt: new Date() },
    { id: "technical", name: "Technical Architecture Agent", role: "Integration and deployment", status: "idle", confidenceScore: 80, priority: "medium", lastActionAt: new Date() },
    { id: "security", name: "Security and Compliance Agent", role: "Security and compliance", status: "idle", confidenceScore: 88, priority: "high", lastActionAt: new Date() },
    { id: "executive", name: "Executive Narrative Agent", role: "Executive storytelling", status: "idle", confidenceScore: 75, priority: "medium", lastActionAt: new Date() },
    { id: "expansion", name: "Expansion Strategy Agent", role: "Expansion opportunities", status: "idle", confidenceScore: 77, priority: "medium", lastActionAt: new Date() },
    { id: "oversight", name: "Human Oversight Agent", role: "Approval recommendations", status: "idle", confidenceScore: 90, priority: "critical", lastActionAt: new Date() },
  ];
}
