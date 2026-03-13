"use client";

import { useState, useCallback, useRef } from "react";
import { useApiKey } from "@/app/context/api-key-context";
import { readApiErrorMessage } from "@/lib/client/api";

interface StreamOptions {
  url: string;
  body: Record<string, unknown>;
  onComplete?: (text: string) => void;
}

export function useStreaming() {
  const { getRequestHeaders } = useApiKey();
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async ({ url, body, onComplete }: StreamOptions) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setContent("");
    let fullText = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getRequestHeaders(),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response));
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setContent(fullText);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      onComplete?.(fullText);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Stream error:", error);
        setContent(
          error instanceof Error
            ? error.message
            : "I couldn't generate that response. Add your Databricks API key in the top right and try again."
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [getRequestHeaders]);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setContent("");
    setIsStreaming(false);
  }, []);

  return { content, isStreaming, startStream, stopStream, reset };
}
