import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";

const MISSING_API_KEY_MESSAGE =
  "Claude API key missing. Add it from the API Key button in the top right or set ANTHROPIC_API_KEY on the server.";

export function createAnthropicClient(req: NextRequest) {
  const apiKey =
    req.headers.get("x-api-key")?.trim() ||
    process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE);
  }

  return new Anthropic({ apiKey });
}

export const DEFAULT_MODEL = "claude-sonnet-4-20250514";

export function getAnthropicErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Failed to contact Claude.";
}

export function getAnthropicErrorStatus(error: unknown) {
  const message = getAnthropicErrorMessage(error).toLowerCase();
  if (
    message.includes("api key missing") ||
    message.includes("authentication") ||
    message.includes("unauthorized") ||
    message.includes("invalid") ||
    message.includes("401")
  ) {
    return 400;
  }
  return 500;
}
