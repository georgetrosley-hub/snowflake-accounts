import OpenAI from "openai";
import type { NextRequest } from "next/server";

const MISSING_API_KEY_MESSAGE =
  "Databricks API key missing. Add it from the API Key button in the top right or set DATABRICKS_API_KEY on the server.";

export function createDatabricksClient(req: NextRequest) {
  const apiKey =
    req.headers.get("x-databricks-api-key")?.trim() ||
    process.env.DATABRICKS_API_KEY;

  if (!apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE);
  }

  const baseURL = process.env.DATABRICKS_OPENAI_BASE_URL;
  if (!baseURL) {
    throw new Error(
      "DATABRICKS_OPENAI_BASE_URL not set. Set it to your workspace URL, e.g. https://<workspace>.cloud.databricks.com/serving-endpoints/<endpoint>/openai/v1"
    );
  }

  return new OpenAI({
    apiKey,
    baseURL,
  });
}

export const DEFAULT_MODEL =
  process.env.DATABRICKS_MODEL || "databricks-meta-llama-3-1-70b-instruct";

export function getDatabricksErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to contact Databricks model.";
}

export function getDatabricksErrorStatus(error: unknown) {
  const message = getDatabricksErrorMessage(error).toLowerCase();

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
