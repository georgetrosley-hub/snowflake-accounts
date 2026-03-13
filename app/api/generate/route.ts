import { NextRequest } from "next/server";
import { buildAccountContext } from "@/lib/prompts/base";
import { CONTENT_PROMPTS } from "@/lib/prompts/content";
import {
  createDatabricksClient,
  DEFAULT_MODEL,
  getDatabricksErrorMessage,
  getDatabricksErrorStatus,
} from "@/lib/server/databricks";

export async function POST(req: NextRequest) {
  try {
    const client = createDatabricksClient(req);
    const { type, account, competitors, context } = await req.json();

    const contentPrompt = CONTENT_PROMPTS[type] ?? CONTENT_PROMPTS.strategy_assessment;
    const accountContext = buildAccountContext(account, competitors);

    const userMessage = context
      ? `${accountContext}\n\n## Additional Context\n${context}`
      : accountContext;

    const stream = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      messages: [
        { role: "system", content: contentPrompt },
        { role: "user", content: userMessage },
      ],
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
    console.error("Generate API error:", error);
    return new Response(
      JSON.stringify({ error: getDatabricksErrorMessage(error) }),
      {
        status: getDatabricksErrorStatus(error),
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
