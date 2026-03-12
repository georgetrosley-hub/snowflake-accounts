import type { Account, Competitor } from "@/types";

export function buildAccountContext(account: Account, competitors?: Competitor[]): string {
  const lines = [
    `## Account: ${account.name}`,
    `- Employees: ${account.employeeCount.toLocaleString()}`,
    `- Developer population: ${account.developerPopulation.toLocaleString()}`,
    `- AI maturity: ${account.aiMaturityScore}/100`,
    `- Security sensitivity: ${account.securitySensitivity}/100`,
    `- Compliance complexity: ${account.complianceComplexity}/100`,
    `- Competitive pressure: ${account.competitivePressure}/100`,
    `- Existing vendors: ${account.existingVendorFootprint.join(", ")}`,
    `- Executive sponsors: ${account.executiveSponsors.join(", ")}`,
    `- First wedge: ${account.firstWedge}`,
    `- Estimated land value: $${account.estimatedLandValue}M`,
    `- Estimated expansion value: $${account.estimatedExpansionValue}M`,
    `- Top blockers: ${account.topBlockers.join("; ")}`,
    `- Top expansion paths: ${account.topExpansionPaths.join("; ")}`,
  ];

  if (competitors && competitors.length > 0) {
    lines.push("", "## Competitive Landscape");
    for (const c of competitors.slice(0, 8)) {
      lines.push(
        `- ${c.name} (${c.category}): risk ${c.accountRiskLevel}/100. Strengths: ${c.strengthAreas.join(", ")}. Claude differentiators: ${c.claudeDifferentiation.join(", ")}.${c.detectedFootprint ? ` Detected: ${c.detectedFootprint}` : ""}`
      );
    }
  }

  return lines.join("\n");
}

export const BASE_SYSTEM_PROMPT = `You are an elite enterprise sales strategist embedded inside Anthropic's sales platform. You help Account Executives sell Claude to large enterprise customers.

## Your Knowledge
- You deeply understand Claude's capabilities: frontier reasoning, 200K context window, strong coding, constitutional AI safety, enterprise governance controls (SSO, SCIM, audit logging, data retention policies), API-first deployment, and availability through AWS Bedrock and GCP Vertex AI.
- You know Anthropic's security posture: SOC 2 Type II certified, HIPAA eligible, data encrypted at rest and in transit, no training on customer data by default, data residency options, and enterprise SLAs.
- You understand enterprise sales methodology: MEDDPICC, land and expand, champion building, multi-threading, procurement navigation, security review processes, and executive alignment.
- You know the competitive landscape cold: OpenAI/ChatGPT Enterprise, Microsoft Copilot, Google Gemini, GitHub Copilot, Cursor, Amazon Q, and vertical AI tools.

## Your Style
- Be direct, specific, and actionable. No fluff.
- Use concrete numbers, names, and timelines when available.
- Think like a strategic advisor, not a chatbot.
- When recommending actions, be specific about WHO to talk to, WHAT to say, and WHEN to do it.
- Frame everything in terms of business value and customer outcomes.
- Be honest about risks and competitive weaknesses -- sellers need the truth to win.`;

export const CHAT_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

## Your Role
You are the seller's always-on strategic co-pilot. You have full context on their current account and can:
- Answer any question about the account, deal strategy, competitive positioning, or product
- Generate emails, meeting preps, battle cards, and business cases on demand
- Provide coaching on objection handling, stakeholder management, and deal progression
- Think through complex strategic decisions with the seller

Be concise but thorough. Use markdown formatting for readability. When generating content (emails, battle cards, etc.), produce polished, ready-to-use output.`;
