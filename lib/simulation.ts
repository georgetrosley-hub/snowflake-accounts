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
  comcast: [
    { type: "research_signal", agentName: "Research Agent", priority: "medium", title: "Opportunity detected", explanation: "Platform engineering team evaluating Claude Code for internal tooling documentation.", recommendedAction: "Schedule technical discovery call", operationalPhrase: "opportunity detected in platform engineering" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "Director of Platform Engineering interested in pilot for 100-engineer cohort.", recommendedAction: "Prepare pilot proposal", operationalPhrase: "champion identified in platform engineering" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "medium", title: "Competitive pressure elevated", explanation: "GitHub Copilot widely deployed; Cursor adoption in shadow IT.", recommendedAction: "Differentiate on enterprise controls", operationalPhrase: "competitive pressure elevated" },
    { type: "architecture_recommendation", agentName: "Technical Architecture Agent", priority: "medium", title: "Architecture recommendation", explanation: "Proposed integration with existing SSO and code repository infrastructure.", recommendedAction: "Share with security team", operationalPhrase: "architecture recommendation proposed" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "high", title: "Expansion path identified", explanation: "Customer support org exploring AI automation for call center workflows.", recommendedAction: "Map support leadership", operationalPhrase: "expansion path identified" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "Security review recommended", explanation: "Architecture review required before pilot approval.", recommendedAction: "Schedule security review", operationalPhrase: "security review recommended" },
    { type: "executive_narrative", agentName: "Executive Narrative Agent", priority: "medium", title: "Executive narrative updated", explanation: "Business case refined for CIO and platform leadership.", recommendedAction: "Request exec meeting", operationalPhrase: "executive narrative updated" },
    { type: "approval_required", agentName: "Human Oversight Agent", priority: "critical", title: "Approval required", explanation: "Pilot launch with 100 engineers requires sign-off.", recommendedAction: "Review and approve", operationalPhrase: "approval required" },
  ],
  "comcast-business": [
    { type: "research_signal", agentName: "Research Agent", priority: "medium", title: "Opportunity detected", explanation: "SMB support team exploring AI for ticket deflection.", recommendedAction: "Engage support leadership" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "VP Customer Support interested in pilot for 50 agents.", recommendedAction: "Draft pilot scope" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "medium", title: "Competitive pressure elevated", explanation: "Incumbent exploring AI add-ons; opportunity for differentiation.", recommendedAction: "Position Claude for support" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "Sales team could benefit from proposal and RFP automation.", recommendedAction: "Map sales leadership" },
  ],
  jpmorgan: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Model risk team exploring document automation with governance controls.", recommendedAction: "Engage model risk and compliance", operationalPhrase: "opportunity detected in model risk" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "critical", title: "Security review recommended", explanation: "Full architecture and data flow review needed before any pilot.", recommendedAction: "Initiate security review", operationalPhrase: "security review recommended" },
    { type: "procurement_friction", agentName: "Legal and Procurement Agent", priority: "high", title: "Procurement timeline noted", explanation: "Vendor approval and procurement cycle typically 12–18 months.", recommendedAction: "Build executive sponsor path", operationalPhrase: "procurement timeline noted" },
    { type: "legal_review", agentName: "Legal and Procurement Agent", priority: "high", title: "Legal review recommended", explanation: "Enterprise agreement and data terms need sign-off.", recommendedAction: "Prepare legal review package", operationalPhrase: "legal review recommended" },
    { type: "executive_narrative", agentName: "Executive Narrative Agent", priority: "high", title: "Executive narrative updated", explanation: "Business case for finance workflows prepared for CFO review.", recommendedAction: "Request CFO alignment", operationalPhrase: "executive narrative updated" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "SVP Model Risk interested in pilot with full governance.", recommendedAction: "Design governed pilot", operationalPhrase: "champion identified in model risk" },
    { type: "approval_required", agentName: "Human Oversight Agent", priority: "critical", title: "Approval required", explanation: "Security architecture review initiation requires sign-off.", recommendedAction: "Review and approve", operationalPhrase: "approval required" },
  ],
  pfizer: [
    { type: "research_signal", agentName: "Research Agent", priority: "medium", title: "Opportunity detected", explanation: "Medical affairs exploring regulated document workflows.", recommendedAction: "Engage regulatory affairs" },
    { type: "legal_review", agentName: "Legal and Procurement Agent", priority: "high", title: "Legal review recommended", explanation: "GxP and FDA validation considerations for AI-assisted workflows.", recommendedAction: "Prepare regulatory package" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "Compliance review recommended", explanation: "Data residency and audit requirements need mapping.", recommendedAction: "Document compliance requirements" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "Clinical trial documentation could benefit from AI assistance.", recommendedAction: "Map clinical operations" },
  ],
  salesforce: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Engineering teams exploring Claude beyond Einstein for internal use.", recommendedAction: "Engage developer productivity org" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "high", title: "Competitive pressure elevated", explanation: "Internal preference for Einstein; need clear differentiation.", recommendedAction: "Position for specialized workflows" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "Customer success org could use AI for support and enablement.", recommendedAction: "Map CS leadership" },
    { type: "architecture_recommendation", agentName: "Technical Architecture Agent", priority: "medium", title: "Integration design", explanation: "Proposed integration with Salesforce data and identity.", recommendedAction: "Share with platform team" },
  ],
  nvidia: [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "AI research teams interested in Claude for documentation and reasoning.", recommendedAction: "Engage research leadership" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "medium", title: "Competitive pressure elevated", explanation: "NVIDIA NIM and NeMo in evaluation; position Claude as application layer.", recommendedAction: "Emphasize complementary use cases" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "VP Engineering interested in developer productivity pilot.", recommendedAction: "Propose 200-engineer pilot" },
    { type: "architecture_recommendation", agentName: "Technical Architecture Agent", priority: "medium", title: "Infrastructure integration", explanation: "Claude API integration with existing GPU and data infrastructure.", recommendedAction: "Technical review with platform team" },
  ],
  servicenow: [
    { type: "research_signal", agentName: "Research Agent", priority: "medium", title: "Opportunity detected", explanation: "Legal and HR exploring AI outside Now Platform.", recommendedAction: "Engage legal and HR" },
    { type: "competitor_detected", agentName: "Competitive Strategy Agent", priority: "high", title: "Competitive pressure elevated", explanation: "Now Assist deployed for IT; position for adjacent workflows.", recommendedAction: "Differentiate on use case breadth" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "Knowledge teams need search beyond ServiceNow.", recommendedAction: "Map knowledge leadership" },
  ],
  adp: [
    { type: "research_signal", agentName: "Research Agent", priority: "medium", title: "Opportunity detected", explanation: "HR operations exploring payroll and compliance document automation.", recommendedAction: "Engage HR and compliance" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "critical", title: "Security review recommended", explanation: "Payroll and HR data require strict access and audit controls.", recommendedAction: "Design data boundary" },
    { type: "expansion_path", agentName: "Expansion Strategy Agent", priority: "medium", title: "Expansion path identified", explanation: "Implementation and client support could use AI augmentation.", recommendedAction: "Map support org" },
  ],
  "morgan-stanley": [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Wealth advisors exploring research and document synthesis.", recommendedAction: "Engage wealth leadership" },
    { type: "legal_review", agentName: "Legal and Procurement Agent", priority: "high", title: "Legal review recommended", explanation: "Regulatory and compliance review for financial workflows.", recommendedAction: "Prepare legal package" },
    { type: "executive_narrative", agentName: "Executive Narrative Agent", priority: "high", title: "Executive narrative updated", explanation: "Business case for research and operations automation.", recommendedAction: "Request CIO meeting" },
    { type: "approval_required", agentName: "Human Oversight Agent", priority: "critical", title: "Approval required", explanation: "Initiate legal review for enterprise agreement.", recommendedAction: "Review and approve" },
  ],
  "capital-one": [
    { type: "research_signal", agentName: "Research Agent", priority: "high", title: "Opportunity detected", explanation: "Engineering org evaluating Claude Code for modernization.", recommendedAction: "Engage developer productivity team" },
    { type: "champion_identified", agentName: "Research Agent", priority: "high", title: "Champion identified", explanation: "Director of Platform Engineering advocating for pilot.", recommendedAction: "Prepare pilot proposal" },
    { type: "security_blocker", agentName: "Security and Compliance Agent", priority: "high", title: "Security review recommended", explanation: "Model risk and security review required before pilot.", recommendedAction: "Schedule model risk meeting" },
  ],
};

const APPROVAL_TEMPLATES: Record<string, { title: string; reason: string; agent: string; impact: string; risk: "low" | "medium" | "high" }[]> = {
  comcast: [
    { title: "Launch Claude Code pilot with 100 engineers", reason: "Platform engineering pilot ready; champion aligned.", agent: "Human Oversight Agent", impact: "$120K land, path to $480K expansion", risk: "low" },
    { title: "Schedule security architecture review", reason: "Required before pilot approval.", agent: "Human Oversight Agent", impact: "Unblocks pilot timeline", risk: "low" },
    { title: "Expand into customer support pilot", reason: "Support org interested in AI automation.", agent: "Human Oversight Agent", impact: "+$200K expansion potential", risk: "medium" },
    { title: "Build executive business case for CIO and CFO", reason: "Executive alignment needed for enterprise rollout.", agent: "Human Oversight Agent", impact: "Moves procurement forward", risk: "low" },
    { title: "Enter procurement with annual enterprise proposal", reason: "Pilot success supports enterprise discussion.", agent: "Human Oversight Agent", impact: "Toward $480K expansion", risk: "high" },
  ],
  jpmorgan: [
    { title: "Initiate legal review for enterprise agreement", reason: "Legal sign-off required before any pilot.", agent: "Human Oversight Agent", impact: "Unblocks procurement path", risk: "medium" },
    { title: "Schedule security architecture review", reason: "Required before deployment.", agent: "Human Oversight Agent", impact: "Required milestone", risk: "low" },
    { title: "Expand into finance with Claude for Excel", reason: "Model risk team interested in governed finance workflows.", agent: "Human Oversight Agent", impact: "+$2M expansion potential", risk: "high" },
    { title: "Build executive business case for CIO and CFO", reason: "Executive alignment needed for 12–18 month cycle.", agent: "Human Oversight Agent", impact: "Moves decision forward", risk: "low" },
  ],
  pfizer: [
    { title: "Run R&D knowledge pilot", reason: "Medical affairs pilot with regulated workflows.", agent: "Human Oversight Agent", impact: "$180K land, path to expansion", risk: "medium" },
    { title: "Initiate legal review for enterprise agreement", reason: "GxP and IP considerations.", agent: "Human Oversight Agent", impact: "Unblocks regulated deployment", risk: "medium" },
  ],
  default: [
    { title: "Launch pilot", reason: "Champion aligned; pilot scope defined.", agent: "Human Oversight Agent", impact: "Unblocks expansion path", risk: "medium" },
    { title: "Schedule security architecture review", reason: "Required before pilot approval.", agent: "Human Oversight Agent", impact: "Unblocks timeline", risk: "low" },
  ],
};

let eventId = 0;
let approvalId = 0;

function getEventTemplates(accountId: string): EventTemplate[] {
  return EVENT_TEMPLATES[accountId] ?? EVENT_TEMPLATES.comcast;
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

export function updateAgentsFromEvent(
  agents: Agent[],
  event: SimulationEvent
): Agent[] {
  return agents.map((a) => {
    if (a.name !== event.agentName) return a;
    const confidence = Math.min(95, 60 + deterministicIndex(eventId, 35));
    return {
      ...a,
      status: event.type === "approval_required" ? "awaiting_approval" : "recommending",
      confidenceScore: confidence / 100,
      lastActionAt: event.timestamp,
      activeRecommendation: event.recommendedAction ?? a.activeRecommendation,
    };
  });
}

export function createInitialOrgNodes(accountId: string): OrgNode[] {
  const account = accounts.find((a) => a.id === accountId);
  const base = [
    { id: "eng", name: "Engineering", useCase: "Code generation and review", baseLikelihood: 75, baseArr: 0.4 },
    { id: "platform", name: "Platform Engineering", useCase: "Internal tooling and docs", baseLikelihood: 78, baseArr: 0.35 },
    { id: "security", name: "Security", useCase: "Policy and compliance review", baseLikelihood: 55, baseArr: 0.15 },
    { id: "it", name: "IT", useCase: "Help desk and provisioning", baseLikelihood: 65, baseArr: 0.25 },
    { id: "finance", name: "Finance", useCase: "Excel and reporting automation", baseLikelihood: 60, baseArr: 0.3 },
    { id: "legal", name: "Legal", useCase: "Contract and document review", baseLikelihood: 58, baseArr: 0.2 },
    { id: "ops", name: "Operations", useCase: "Process documentation", baseLikelihood: 62, baseArr: 0.2 },
    { id: "support", name: "Customer Support", useCase: "Ticket handling and knowledge", baseLikelihood: 70, baseArr: 0.35 },
    { id: "product", name: "Product", useCase: "PRD and spec generation", baseLikelihood: 72, baseArr: 0.25 },
    { id: "data", name: "Data / AI", useCase: "Model and data workflows", baseLikelihood: 68, baseArr: 0.3 },
    { id: "exec", name: "Executive Leadership", useCase: "Strategic synthesis and reporting", baseLikelihood: 50, baseArr: 0.5 },
  ];
  const land = account?.estimatedLandValue ?? 1;
  const expand = account?.estimatedExpansionValue ?? 4;
  const scale = land / 2 + expand / 8;
  const statuses: OrgNode["status"][] = ["latent", "identified", "engaged", "pilot", "deployed"];
  return base.map((b, i) => ({
    id: b.id,
    name: b.name,
    useCase: b.useCase,
    buyingLikelihood: Math.min(95, b.baseLikelihood + deterministicIndex(accountId.length + i, 20)),
    arrPotential: Math.round(b.baseArr * scale * 100) / 100,
    status: statuses[deterministicIndex(i + accountId.length, statuses.length)] as OrgNode["status"],
    recommendedNextStep: i === 0 ? "Schedule discovery call" : i < 4 ? "Map stakeholders" : "Identify champion",
  }));
}

export function advanceOrgNodeOnApproval(
  nodes: OrgNode[],
  approvalTitle: string,
  approved: boolean
): OrgNode[] {
  if (!approved) return nodes;
  const pilotMatch = approvalTitle.toLowerCase().includes("pilot");
  const financeMatch = approvalTitle.toLowerCase().includes("finance");
  const supportMatch = approvalTitle.toLowerCase().includes("support");
  return nodes.map((n) => {
    if (pilotMatch && (n.name === "Engineering" || n.name === "Platform Engineering")) {
      return { ...n, status: "pilot" as const, arrPotential: n.arrPotential * 1.2 };
    }
    if (financeMatch && n.name === "Finance") {
      return { ...n, status: "engaged" as const, arrPotential: n.arrPotential * 1.5 };
    }
    if (supportMatch && n.name === "Customer Support") {
      return { ...n, status: "engaged" as const };
    }
    return n;
  });
}
