import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildAccountContext } from "@/lib/prompts/base";
import { AGENT_PROMPTS } from "@/lib/prompts/agents";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { agentName, account, competitors } = await req.json();

    const agentPrompt =
      AGENT_PROMPTS[agentName] ?? AGENT_PROMPTS["Research Agent"];
    const accountContext = buildAccountContext(account, competitors);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
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
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
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
      { error: "Failed to process agent request" },
      { status: 500 }
    );
  }
}
