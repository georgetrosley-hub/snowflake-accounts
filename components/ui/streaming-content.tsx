"use client";

import { motion } from "framer-motion";
import { RefreshCw, Copy, Check } from "lucide-react";
import { DatabricksLogoIcon } from "@/components/ui/databricks-logo";
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border/30 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <DatabricksLogoIcon
            size={12}
            className={cn(
              "text-accent/60",
              isStreaming && "animate-pulse"
            )}
          />
          <span className="truncate text-[11px] text-text-muted">
            {label ?? "Databricks AI"}{isStreaming ? " · generating..." : ""}
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
      <div className="whitespace-pre-wrap px-4 py-4 text-[13px] leading-relaxed text-text-secondary sm:px-5">
        {content}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-accent/50 animate-pulse ml-0.5 align-text-bottom" />
        )}
      </div>
    </motion.div>
  );
}
