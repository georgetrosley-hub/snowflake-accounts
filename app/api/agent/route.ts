import { NextRequest, NextResponse } from "next/server";
import { buildAccountContext } from "@/lib/prompts/base";
import { AGENT_PROMPTS } from "@/lib/prompts/agents";
import {
  createAnthropicClient,
  DEFAULT_MODEL,
  getAnthropicErrorMessage,
  getAnthropicErrorStatus,
} from "@/lib/server/anthropic";

export async function POST(req: NextRequest) {
  try {
    const client = createAnthropicClient(req);
    const { agentName, account, competitors } = await req.json();

    const agentPrompt =
      AGENT_PROMPTS[agentName] ?? AGENT_PROMPTS["Research Agent"];
    const accountContext = buildAccountContext(account, competitors);

    const response = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 512,
      system: agentPrompt,
      messages: [
        {
          role: "user",
          content: `Analyze the following account and generate a single intelligence signal.\n\n${accountContext}\n\nRespond with a JSON object containing: { "title": "...", "explanation": "...", "recommendedAction": "...", "priority": "low|medium|high|critical", "type": "research_signal|champion_identified|competitor_detected|architecture_recommendation|security_blocker|procurement_friction|legal_review|expansion_path|executive_narrative|deal_stage_advanced" }`,
        },
      ],
    });

    const text =
      response.content
        ?.filter((c) => c.type === "text")
        .map((c) => (c as { text: string }).text)
        .join("") ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      } catch (parseError) {
        throw parseError;
      }
    }

    return NextResponse.json({
      title: "Analysis complete",
      explanation: text.slice(0, 200),
      recommendedAction: "Review the analysis",
      priority: "medium",
      type: "research_signal",
    });
  } catch (error) {
    console.error("Agent API error:", error);
    return NextResponse.json(
      { error: getAnthropicErrorMessage(error) },
      { status: getAnthropicErrorStatus(error) }
    );
  }
}
