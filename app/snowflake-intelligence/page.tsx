"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Send, Sparkles, Square, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useApiKey } from "@/app/context/api-key-context";
import { cn } from "@/lib/utils";
import { readApiErrorMessage } from "@/lib/client/api";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SnowflakeIntelligencePage() {
  const { hasApiKey, getRequestHeaders, apiKey, setApiKey, clearApiKey, isReady } = useApiKey();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [draftApiKey, setDraftApiKey] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isApiKeyOpen) {
      setDraftApiKey(apiKey);
    }
  }, [isApiKeyOpen, apiKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    const controller = new AbortController();
    abortRef.current = controller;
    let fullText = "";

    try {
      const response = await fetch("/api/snowflake-intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getRequestHeaders(),
        },
        body: JSON.stringify({ messages: newMessages }),
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
                setStreamingContent(fullText);
              }
            } catch {
              // skip
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
      setStreamingContent("");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "Could not reach Claude. Add your Anthropic API key and try again.",
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, isStreaming, getRequestHeaders]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    if (streamingContent) {
      setMessages((prev) => [...prev, { role: "assistant", content: streamingContent }]);
      setStreamingContent("");
    }
    setIsStreaming(false);
  }, [streamingContent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const md = {
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1 className="mt-2 text-[14px] font-semibold text-text-primary" {...props} />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2 className="mt-2 text-[13px] font-semibold text-text-primary" {...props} />
    ),
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-2 text-[13px] font-medium text-text-primary" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p className="mt-1.5 first:mt-0 text-[13px] leading-relaxed text-text-secondary" {...props} />
    ),
    strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-text-primary" {...props} />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul className="mt-1.5 list-disc space-y-1 pl-4" {...props} />
    ),
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
      <ol className="mt-1.5 list-decimal space-y-1 pl-4" {...props} />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li className="text-[13px] leading-relaxed text-text-secondary" {...props} />
    ),
    a: (props: React.ComponentPropsWithoutRef<"a">) => (
      <a
        {...props}
        target="_blank"
        rel="noreferrer"
        className="text-accent/90 underline decoration-accent/40 underline-offset-2 hover:text-accent"
      />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code className="rounded bg-surface-muted/50 px-1 py-0.5 text-[12px] text-text-primary" {...props} />
    ),
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface text-text-primary">
      <header className="shrink-0 border-b border-surface-border/40 bg-surface-elevated/20 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Map
            </Link>
            <div className="h-4 w-px shrink-0 bg-surface-border/60" aria-hidden />
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[14px] font-semibold text-text-primary">Snowflake Intelligence</h1>
                <p className="truncate text-[11px] text-text-muted">Claude-powered territory and platform assistant</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsApiKeyOpen(true)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors",
              hasApiKey && isReady
                ? "border-accent/25 bg-accent/[0.06] text-accent"
                : "border-amber-500/30 bg-amber-500/[0.08] text-amber-200/90"
            )}
          >
            <KeyRound className="h-3.5 w-3.5" strokeWidth={2} />
            {hasApiKey && isReady ? "API key" : "Add Claude key"}
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && !streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-surface-border/40 bg-surface-elevated/30 px-6 py-10 text-center"
            >
              <SnowflakeLogoIcon size={40} className="mx-auto mb-4 opacity-90" />
              <p className="text-[15px] font-semibold text-text-primary">Ask Snowflake Intelligence</p>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-text-muted">
                Territory narrative, Snowflake Intelligence positioning, Cortex and governance — powered by your Anthropic API key.
              </p>
              {!hasApiKey && isReady && (
                <p className="mt-4 text-[12px] text-amber-200/80">
                  Add your Claude API key above to start.
                </p>
              )}
              <div className="mt-8 space-y-2 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">Try</p>
                {[
                  "How do I position Snowflake Intelligence vs. a generic LLM chatbot?",
                  "Give me a 3-bullet territory prioritization framework for expansion accounts.",
                  "What proof points matter for Cortex Analyst in a bank?",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setInput(s);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-3 py-2.5 text-left text-[12px] text-text-muted transition-colors hover:border-accent/20 hover:text-text-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                  <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed sm:max-w-[80%]",
                  msg.role === "user"
                    ? "bg-accent/12 text-text-primary"
                    : "bg-surface-elevated/60 text-text-secondary"
                )}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {isStreaming && streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" strokeWidth={1.75} />
              </div>
              <div className="max-w-[88%] rounded-xl bg-surface-elevated/60 px-3.5 py-2.5 text-[13px] text-text-secondary sm:max-w-[80%]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                  {streamingContent}
                </ReactMarkdown>
                <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-accent/50 align-text-bottom" />
              </div>
            </div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" strokeWidth={1.75} />
              </div>
              <div className="rounded-xl bg-surface-elevated/60 px-3.5 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/40" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/40" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/40" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-surface-border/40 bg-surface-elevated/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setStreamingContent("");
              }}
              className="mb-0.5 rounded-md p-2 text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary"
              aria-label="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Snowflake Intelligence…"
            rows={1}
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-surface-border/50 bg-surface-elevated/40 px-3 py-3 text-[13px] text-text-primary placeholder:text-text-muted/60 focus:border-accent/30 focus:outline-none"
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = "auto";
              t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
            }}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted/60 text-text-muted transition-colors hover:bg-surface-muted"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim()}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                input.trim()
                  ? "bg-accent/90 text-white hover:bg-accent"
                  : "bg-surface-muted/40 text-text-muted/40"
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {isApiKeyOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 py-10 sm:py-24">
          <div className="w-full max-w-md rounded-xl border border-surface-border/50 bg-surface-elevated shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <SnowflakeLogoIcon size={24} className="shrink-0 opacity-90" />
                <div>
                  <p className="text-[13px] font-medium text-text-primary">Anthropic API key</p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    Used only from your browser to call Claude. Or set <code className="text-[10px]">ANTHROPIC_API_KEY</code> on the server.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyOpen(false)}
                className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="space-y-2">
                <label htmlFor="si-api-key" className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Claude API key
                </label>
                <input
                  id="si-api-key"
                  type="password"
                  value={draftApiKey}
                  onChange={(e) => setDraftApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full rounded-lg border border-surface-border/50 bg-surface px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/60 focus:border-accent/30 focus:outline-none"
                />
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    clearApiKey();
                    setDraftApiKey("");
                  }}
                  className="text-[11px] text-text-muted hover:text-text-secondary"
                >
                  Clear saved key
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyOpen(false)}
                    className="rounded-md px-3 py-2 text-[11px] text-text-secondary hover:bg-surface-muted/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey(draftApiKey);
                      setIsApiKeyOpen(false);
                    }}
                    disabled={!draftApiKey.trim()}
                    className={cn(
                      "rounded-md px-3 py-2 text-[11px] font-medium",
                      draftApiKey.trim()
                        ? "bg-accent/90 text-white hover:bg-accent"
                        : "bg-surface-muted/50 text-text-muted"
                    )}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
