import type { Agent } from "@/types";

export const agentDefinitions: Omit<Agent, "lastActionAt" | "activeRecommendation">[] = [
  {
    id: "territory",
    name: "Territory Intelligence Agent",
    role: "Account and market analysis",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "research",
    name: "Research Agent",
    role: "Signal detection and champion mapping",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "competitive",
    name: "Competitive Strategy Agent",
    role: "Competitor footprint and positioning",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "technical",
    name: "Technical Architecture Agent",
    role: "Integration and deployment design",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "security",
    name: "Security and Compliance Agent",
    role: "Security review and compliance mapping",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "legal",
    name: "Legal and Procurement Agent",
    role: "Legal review and procurement path",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "executive",
    name: "Executive Narrative Agent",
    role: "Executive storytelling and business case",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "expansion",
    name: "Expansion Strategy Agent",
    role: "Land and expand path planning",
    status: "analyzing",
    confidenceScore: 0,
    priority: "medium",
  },
  {
    id: "oversight",
    name: "Human Oversight Agent",
    role: "Approval gate and decision coordination",
    status: "idle",
    confidenceScore: 0,
    priority: "high",
  },
];

export function createInitialAgents(): Agent[] {
  return [];
}
