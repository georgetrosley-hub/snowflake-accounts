"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Send, Sparkles, Square, Trash2, X } from "lucide-react";
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

interface SnowflakeIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SnowflakeIntelligencePanel({
  isOpen,
  onClose,
}: SnowflakeIntelligencePanelProps) {
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
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 sm:bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-surface shadow-2xl sm:max-w-[480px] sm:border-l sm:border-surface-border/40 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-surface-border/40 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-text-primary">Snowflake Intelligence</p>
                  <p className="truncate text-[10px] text-text-muted">Claude · territory and platform</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsApiKeyOpen(true)}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors",
                    hasApiKey && isReady
                      ? "text-accent hover:bg-accent/10"
                      : "text-amber-200/90 hover:bg-amber-500/10"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <KeyRound className="h-3 w-3" strokeWidth={2} />
                    Key
                  </span>
                </button>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setStreamingContent("");
                    }}
                    className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted/40 hover:text-text-secondary"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 && !streamingContent && (
                <div className="rounded-xl border border-surface-border/40 bg-surface-elevated/30 px-4 py-8 text-center">
                  <SnowflakeLogoIcon size={32} className="mx-auto mb-3 opacity-90" />
                  <p className="text-[14px] font-semibold text-text-primary">Ask Snowflake Intelligence</p>
                  <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-text-muted">
                    Territory narrative, Snowflake Intelligence positioning, Cortex and governance.
                  </p>
                  {!hasApiKey && isReady && (
                    <p className="mt-3 text-[11px] text-amber-200/80">Add your Claude API key to start.</p>
                  )}
                  <div className="mt-6 space-y-2 text-left">
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
                        className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-3 py-2.5 text-left text-[11px] text-text-muted transition-colors hover:border-accent/20 hover:text-text-secondary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                      <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.75} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[88%] rounded-lg px-3 py-2 text-[12px] leading-relaxed",
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
                <div className="flex gap-2 justify-start">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <Sparkles className="h-3 w-3 animate-pulse text-accent" strokeWidth={1.75} />
                  </div>
                  <div className="max-w-[88%] rounded-lg bg-surface-elevated/60 px-3 py-2 text-[12px] text-text-secondary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
                      {streamingContent}
                    </ReactMarkdown>
                    <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-accent/50 align-text-bottom" />
                  </div>
                </div>
              )}

              {isStreaming && !streamingContent && (
                <div className="flex gap-2 justify-start">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <Sparkles className="h-3 w-3 animate-pulse text-accent" strokeWidth={1.75} />
                  </div>
                  <div className="rounded-lg bg-surface-elevated/60 px-3 py-2">
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/40" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/40" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/40" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-surface-border/40 px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Snowflake Intelligence…"
                  rows={1}
                  className="min-h-[40px] flex-1 resize-none rounded-lg border border-surface-border/50 bg-surface-elevated/40 px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/60 focus:border-accent/30 focus:outline-none"
                  style={{ maxHeight: "100px" }}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = `${Math.min(t.scrollHeight, 100)}px`;
                  }}
                />
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={stopStreaming}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted/60 text-text-muted transition-colors hover:bg-surface-muted"
                  >
                    <Square className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
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
          </motion.div>

          {isApiKeyOpen && (
            <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 py-10 sm:py-24">
              <div className="w-full max-w-md rounded-xl border border-surface-border/50 bg-surface-elevated shadow-2xl">
                <div className="flex items-center justify-between border-b border-surface-border/40 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <SnowflakeLogoIcon size={24} className="shrink-0 opacity-90" />
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">Anthropic API key</p>
                      <p className="mt-1 text-[11px] text-text-muted">
                        Browser calls to Claude, or set <code className="text-[10px]">ANTHROPIC_API_KEY</code> on the server.
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
                    <label
                      htmlFor="snowflake-intelligence-api-key-input"
                      className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted"
                    >
                      Claude API key
                    </label>
                    <input
                      id="snowflake-intelligence-api-key-input"
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
        </>
      )}
    </AnimatePresence>
  );
}
