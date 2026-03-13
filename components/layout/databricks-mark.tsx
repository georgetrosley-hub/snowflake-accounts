"use client";

interface DatabricksMarkProps {
  subtitle?: string;
  compact?: boolean;
}

export function DatabricksMark({
  subtitle = "Lakehouse Platform for Life Sciences",
  compact = false,
}: DatabricksMarkProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-7 w-7 grid-cols-2 grid-rows-2 gap-1">
        <span className="rounded-[2px] bg-accent/80 shadow-[0_0_0_1px_rgba(255,54,33,0.2)]" />
        <span className="rounded-[2px] bg-databricks-teal/80" />
        <span className="rounded-[2px] bg-databricks-teal/80" />
        <span className="rounded-[2px] bg-accent/60 shadow-[0_0_0_1px_rgba(255,54,33,0.15)]" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold tracking-tight text-text-primary">
          Databricks
        </p>
        {!compact && <p className="mt-0.5 text-[11px] text-text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
