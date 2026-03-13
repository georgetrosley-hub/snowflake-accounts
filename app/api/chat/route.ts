import { NextRequest } from "next/server";
import { CHAT_SYSTEM_PROMPT, buildAccountContext } from "@/lib/prompts/base";
import {
  createDatabricksClient,
  DEFAULT_MODEL,
  getDatabricksErrorMessage,
  getDatabricksErrorStatus,
} from "@/lib/server/databricks";

export async function POST(req: NextRequest) {
  try {
    const client = createDatabricksClient(req);
    const { messages, account, competitors, section } = await req.json();

    const accountContext = account
      ? buildAccountContext(account, competitors)
      : "";

    const systemPrompt = `${CHAT_SYSTEM_PROMPT}

${accountContext ? `\n## Current Account Context\n${accountContext}` : ""}
${section ? `\nThe seller is currently viewing the "${section}" section of the platform.` : ""}`;

    const messagesWithSystem = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      })),
    ];

    const stream = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      messages: messagesWithSystem,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: getDatabricksErrorMessage(error) }),
      {
        status: getDatabricksErrorStatus(error),
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
