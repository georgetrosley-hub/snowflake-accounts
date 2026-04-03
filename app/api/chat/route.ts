import { NextRequest } from "next/server";
import { CHAT_SYSTEM_PROMPT, buildAccountContext } from "@/lib/prompts/base";
import {
  createAnthropicClient,
  DEFAULT_MODEL,
  getAnthropicErrorMessage,
  getAnthropicErrorStatus,
} from "@/lib/server/anthropic";

export async function POST(req: NextRequest) {
  try {
    const client = createAnthropicClient(req);
    const { messages, account, competitors, section } = await req.json();

    const accountContext = account
      ? buildAccountContext(account, competitors)
      : "";

    const systemPrompt = `${CHAT_SYSTEM_PROMPT}

${accountContext ? `\n## Current Account Context\n${accountContext}` : ""}
${section ? `\nThe seller is currently viewing the "${section}" section of the platform.` : ""}`;

    const anthropicMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })
    );

    const stream = await client.messages.stream({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text ?? "";
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
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
      JSON.stringify({ error: getAnthropicErrorMessage(error) }),
      {
        status: getAnthropicErrorStatus(error),
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
