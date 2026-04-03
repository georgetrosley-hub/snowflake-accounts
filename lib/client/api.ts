"use client";

export async function readApiErrorMessage(
  response: Response,
  fallback = `Request failed with ${response.status}`
) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}
