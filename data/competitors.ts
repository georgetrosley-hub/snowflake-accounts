import type { Competitor } from "@/types";

export const competitorCategories = [
  "Frontier models",
  "Coding tools",
  "Enterprise search and knowledge",
  "Workflow and agent platforms",
  "Cloud incumbents",
  "Vertical specialists",
] as const;

export const competitors: Competitor[] = [
  {
    id: "openai",
    name: "OpenAI",
    category: "frontier",
    strengthAreas: ["GPT-4 deployment", "API adoption", "Microsoft relationship"],
    claudeDifferentiation: ["Governance controls", "longer context", "constitutional AI"],
    accountRiskLevel: 85,
    detectedFootprint: "API usage in engineering, Microsoft 365 integration",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    category: "frontier",
    strengthAreas: ["Office 365 bundling", "Azure integration", "enterprise sales"],
    claudeDifferentiation: ["Model choice", "data residency options", "API-first"],
    accountRiskLevel: 90,
    detectedFootprint: "Microsoft 365 enterprise agreement, Copilot pilots",
  },
  {
    id: "google",
    name: "Google / Gemini",
    category: "frontier",
    strengthAreas: ["Workspace integration", "GCP", "enterprise search"],
    claudeDifferentiation: ["Accuracy and safety", "no ad model", "research credibility"],
    accountRiskLevel: 78,
    detectedFootprint: "Workspace in some divisions, GCP data platform",
  },
  {
    id: "xai",
    name: "xAI",
    category: "frontier",
    strengthAreas: ["Grok enterprise", "compute relationships"],
    claudeDifferentiation: ["Enterprise maturity", "support", "governance"],
    accountRiskLevel: 45,
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "coding",
    strengthAreas: ["Developer adoption", "IDE integration", "Microsoft bundling"],
    claudeDifferentiation: ["Full reasoning", "documentation", "beyond code completion"],
    accountRiskLevel: 82,
    detectedFootprint: "Widespread in engineering orgs",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    strengthAreas: ["Developer preference", "multi-model", "productivity"],
    claudeDifferentiation: ["Enterprise controls", "audit", "vendor governance"],
    accountRiskLevel: 75,
    detectedFootprint: "Shadow IT adoption in platform engineering",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    strengthAreas: ["Code generation", "developer workflow"],
    claudeDifferentiation: ["Enterprise deployment", "compliance", "support"],
    accountRiskLevel: 55,
  },
  {
    id: "devin",
    name: "Devin",
    category: "coding",
    strengthAreas: ["Autonomous coding", "emerging interest"],
    claudeDifferentiation: ["Enterprise readiness", "human oversight", "security"],
    accountRiskLevel: 40,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "search",
    strengthAreas: ["Research workflows", "citation", "broad adoption"],
    claudeDifferentiation: ["Enterprise deployment", "data control", "customization"],
    accountRiskLevel: 68,
    detectedFootprint: "Individual subscriptions, research teams",
  },
  {
    id: "glean",
    name: "Glean",
    category: "search",
    strengthAreas: ["Enterprise search", "knowledge graphs", "integrations"],
    claudeDifferentiation: ["Reasoning depth", "model quality", "agent workflows"],
    accountRiskLevel: 72,
    detectedFootprint: "Enterprise search RFP in progress",
  },
  {
    id: "moveworks",
    name: "Moveworks",
    category: "search",
    strengthAreas: ["IT support", "help desk", "ticket deflection"],
    claudeDifferentiation: ["Broader use cases", "reasoning", "multi-workflow"],
    accountRiskLevel: 65,
    detectedFootprint: "IT exploring alternatives",
  },
  {
    id: "salesforce-agentforce",
    name: "Salesforce Agentforce",
    category: "workflow",
    strengthAreas: ["CRM integration", "Salesforce ecosystem", "agent builder"],
    claudeDifferentiation: ["Model quality", "vendor choice", "beyond CRM"],
    accountRiskLevel: 70,
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    category: "workflow",
    strengthAreas: ["IT workflows", "Now Platform", "enterprise footprint"],
    claudeDifferentiation: ["Specialized workflows", "model quality", "integration flexibility"],
    accountRiskLevel: 78,
    detectedFootprint: "Core IT service management",
  },
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    strengthAreas: ["Bedrock", "infrastructure", "enterprise relationships"],
    claudeDifferentiation: ["Direct Claude", "support", "roadmap control"],
    accountRiskLevel: 75,
  },
  {
    id: "databricks",
    name: "Databricks",
    category: "cloud",
    strengthAreas: ["Data platform", "Mosaic", "ML workloads"],
    claudeDifferentiation: ["General reasoning", "beyond data", "conversational AI"],
    accountRiskLevel: 68,
  },
  {
    id: "snowflake",
    name: "Snowflake",
    category: "cloud",
    strengthAreas: ["Cortex", "data cloud", "enterprise data"],
    claudeDifferentiation: ["Full model control", "reasoning", "multi-workflow"],
    accountRiskLevel: 62,
  },
  {
    id: "oracle",
    name: "Oracle",
    category: "cloud",
    strengthAreas: ["Database", "ERP", "enterprise stack"],
    claudeDifferentiation: ["Model quality", "modern architecture", "AI-first"],
    accountRiskLevel: 58,
  },
  {
    id: "ibm",
    name: "IBM",
    category: "cloud",
    strengthAreas: ["Watsonx", "legacy relationships", "regulatory"],
    claudeDifferentiation: ["Model performance", "reasoning", "innovation pace"],
    accountRiskLevel: 55,
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    category: "vertical",
    strengthAreas: ["NIM", "NeMo", "compute platform"],
    claudeDifferentiation: ["Application layer", "conversational AI", "enterprise deployment"],
    accountRiskLevel: 50,
  },
  {
    id: "harvey",
    name: "Harvey",
    category: "vertical",
    strengthAreas: ["Legal AI", "law firm adoption"],
    claudeDifferentiation: ["Enterprise breadth", "multi-department", "governance"],
    accountRiskLevel: 45,
  },
  {
    id: "cohere",
    name: "Cohere",
    category: "frontier",
    strengthAreas: ["Enterprise RAG", "embedding", "privacy"],
    claudeDifferentiation: ["Reasoning", "conversational", "full-stack AI"],
    accountRiskLevel: 48,
  },
  {
    id: "mistral",
    name: "Mistral",
    category: "frontier",
    strengthAreas: ["European footprint", "open weights", "pricing"],
    claudeDifferentiation: ["US enterprise support", "safety", "scale"],
    accountRiskLevel: 42,
  },
];

export function getCompetitorsByAccount(accountId: string): Competitor[] {
  const engineeringHeavy = ["nvidia", "salesforce", "capital-one", "morgan-stanley"];
  const knowledgeHeavy = ["comcast", "comcast-business", "jpmorgan", "pfizer"];
  const platformHeavy = ["servicenow", "salesforce", "jpmorgan", "morgan-stanley"];
  const complianceHeavy = ["jpmorgan", "pfizer", "adp", "morgan-stanley", "capital-one"];

  return competitors.map((c) => {
    let risk = c.accountRiskLevel;
    if (engineeringHeavy.includes(accountId) && ["cursor", "github-copilot"].includes(c.id)) {
      risk = Math.min(95, risk + 10);
    }
    if (knowledgeHeavy.includes(accountId) && ["perplexity", "glean", "moveworks"].includes(c.id)) {
      risk = Math.min(95, risk + 8);
    }
    if (platformHeavy.includes(accountId) && ["microsoft", "servicenow", "salesforce-agentforce", "aws"].includes(c.id)) {
      risk = Math.min(95, risk + 5);
    }
    if (complianceHeavy.includes(accountId) && ["microsoft", "ibm", "oracle"].includes(c.id)) {
      risk = Math.min(95, risk + 5);
    }
    if (accountId === "nvidia" && c.id === "nvidia") risk = 35;
    if (accountId === "salesforce" && c.id === "salesforce-agentforce") risk = 85;
    return { ...c, accountRiskLevel: risk };
  });
}
