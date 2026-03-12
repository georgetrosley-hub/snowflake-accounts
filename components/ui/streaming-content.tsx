"use client";

import { motion } from "framer-motion";
import { RefreshCw, Copy, Check } from "lucide-react";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

interface StreamingContentProps {
  content: string;
  isStreaming: boolean;
  onRegenerate?: () => void;
  className?: string;
  label?: string;
}

export function StreamingContent({
  content,
  isStreaming,
  onRegenerate,
  className,
  label,
}: StreamingContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  if (!content && !isStreaming) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-lg border border-surface-border/50 bg-surface-elevated/40",
        className
      )}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border/30">
        <div className="flex items-center gap-2">
          <ClaudeSparkle
            size={12}
            className={cn(
              "text-claude-coral/60",
              isStreaming && "animate-pulse"
            )}
          />
          <span className="text-[11px] text-text-muted">
            {label ?? "Claude"}{isStreaming ? " · generating..." : ""}
          </span>
        </div>
        {content && !isStreaming && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="rounded p-1 text-text-muted hover:bg-surface-muted/40 hover:text-text-secondary transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="rounded p-1 text-text-muted hover:bg-surface-muted/40 hover:text-text-secondary transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="px-5 py-4 text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
        {content}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-claude-coral/50 animate-pulse ml-0.5 align-text-bottom" />
        )}
      </div>
    </motion.div>
  );
}
