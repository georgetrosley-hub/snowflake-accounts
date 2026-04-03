"use client";

import { cn } from "@/lib/utils";

interface ClaudeLogoIconProps {
  className?: string;
  size?: number;
}

/** Claude sparkle-style icon for UI branding */
export function ClaudeSparkle({ className, size = 20 }: ClaudeLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-claude-coral", className)}
      aria-hidden
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
