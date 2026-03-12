"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  Network,
  Crosshair,
  Shield,
  Calendar,
  CheckSquare,
  FileText,
} from "lucide-react";

const sections = [
  { id: "command", label: "Command Center", icon: LayoutDashboard },
  { id: "feed", label: "Agent Activity", icon: Activity },
  { id: "approval", label: "Approval Queue", icon: CheckSquare },
  { id: "competitive", label: "Competitive Landscape", icon: Crosshair },
  { id: "architecture", label: "Architecture", icon: Shield },
  { id: "org", label: "Org Expansion Map", icon: Network },
  { id: "timeline", label: "Deal Timeline", icon: Calendar },
  { id: "narrative", label: "Executive Narrative", icon: FileText },
] as const;

export type SectionId = (typeof sections)[number]["id"];

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-surface-border/60 bg-surface-elevated/50">
      <div className="border-b border-surface-border/50 px-5 py-5">
        <h1 className="text-[13px] font-medium tracking-tight text-text-primary">
          Claude Enterprise
        </h1>
        <p className="mt-0.5 text-[11px] text-text-muted">Expansion Engine</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] transition-colors duration-200",
              activeSection === id
                ? "bg-accent/8 text-accent-muted"
                : "text-text-muted hover:bg-surface-muted/50 hover:text-text-secondary"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
            {label}
          </button>
        ))}
      </nav>
      <div className="border-t border-surface-border/50 px-5 py-4">
        <p className="text-[12px] text-text-secondary">George Trosley</p>
        <p className="text-[11px] text-text-muted">Enterprise AE</p>
      </div>
    </aside>
  );
}
