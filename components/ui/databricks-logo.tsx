"use client";

import { cn } from "@/lib/utils";

interface DatabricksLogoIconProps {
  className?: string;
  size?: number;
}

export function DatabricksLogoIcon({ className, size = 20 }: DatabricksLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
    >
      <path
        d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"
        fill="currentColor"
      />
    </svg>
  );
}

interface DatabricksWordmarkProps {
  className?: string;
}

export function DatabricksWordmark({ className }: DatabricksWordmarkProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DatabricksLogoIcon size={16} />
      <span className="text-[13px] font-semibold tracking-tight text-text-primary">
        Databricks
      </span>
    </div>
  );
}
