"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { OrgNodeCard } from "@/components/ui/org-node-card";
import type { OrgNode } from "@/types";

interface OrgExpansionMapProps {
  nodes: OrgNode[];
}

interface NodePosition {
  x: number;
  y: number;
}

const departmentOrder = [
  "Engineering",
  "Platform Engineering",
  "Security",
  "IT",
  "Finance",
  "Legal",
  "Operations",
  "Customer Support",
  "Product",
  "Data / AI",
  "Executive Leadership",
] as const;

const defaultUseCases: Record<(typeof departmentOrder)[number], string> = {
  Engineering: "Code generation and review",
  "Platform Engineering": "Internal tooling and docs",
  Security: "Policy and compliance review",
  IT: "Help desk and provisioning",
  Finance: "Excel and reporting automation",
  Legal: "Contract and document review",
  Operations: "Process documentation",
  "Customer Support": "Ticket handling and knowledge",
  Product: "PRD and spec generation",
  "Data / AI": "Model and data workflows",
  "Executive Leadership": "Strategic synthesis and reporting",
};

const nodePositions: Record<(typeof departmentOrder)[number], NodePosition> = {
  Engineering: { x: 18, y: 18 },
  "Platform Engineering": { x: 50, y: 10 },
  Security: { x: 82, y: 18 },
  IT: { x: 16, y: 44 },
  Finance: { x: 34, y: 60 },
  Legal: { x: 50, y: 72 },
  Operations: { x: 66, y: 60 },
  "Customer Support": { x: 84, y: 44 },
  Product: { x: 26, y: 84 },
  "Data / AI": { x: 74, y: 84 },
  "Executive Leadership": { x: 50, y: 42 },
};

const connections: Array<[(typeof departmentOrder)[number], (typeof departmentOrder)[number]]> = [
  ["Engineering", "Platform Engineering"],
  ["Platform Engineering", "Security"],
  ["Security", "IT"],
  ["IT", "Operations"],
  ["Operations", "Customer Support"],
  ["Customer Support", "Product"],
  ["Product", "Data / AI"],
  ["Data / AI", "Engineering"],
  ["Finance", "Legal"],
  ["Legal", "Operations"],
  ["Platform Engineering", "Executive Leadership"],
  ["Finance", "Executive Leadership"],
  ["Product", "Executive Leadership"],
  ["Data / AI", "Executive Leadership"],
  ["Customer Support", "Executive Leadership"],
  ["Security", "Executive Leadership"],
];

export function OrgExpansionMap({ nodes }: OrgExpansionMapProps) {
  const normalizedNodes: OrgNode[] = departmentOrder.map((name) => {
    const existing = nodes.find((node) => node.name === name);
    if (existing) return existing;
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name,
      useCase: defaultUseCases[name],
      buyingLikelihood: 50,
      arrPotential: 0,
      status: "latent",
      recommendedNextStep: "Map stakeholders",
    };
  });

  const activeCount = normalizedNodes.filter(
    (n) => n.status === "pilot" || n.status === "deployed" || n.status === "engaged"
  ).length;

  const totalPotential = normalizedNodes.reduce((sum, node) => sum + node.arrPotential, 0);
  const activeNodes = normalizedNodes.filter(
    (n) => n.status === "engaged" || n.status === "pilot" || n.status === "deployed"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-10"
    >
      <div className="flex items-end justify-between gap-6">
        <SectionHeader
          title="Org expansion map"
          subtitle={`${activeCount} departments active · $${totalPotential.toFixed(2)}M ARR potential`}
        />
        {activeNodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-[46ch] text-right text-[12px] text-accent-muted"
          >
            {activeNodes.map((n) => n.name).join(" · ")}
          </motion.div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-accent-subtle/40 bg-gradient-to-br from-surface-elevated/85 via-surface/75 to-surface-elevated/85 p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(196,181,154,0.17),transparent_45%),radial-gradient(circle_at_18%_18%,rgba(154,143,122,0.09),transparent_35%),radial-gradient(circle_at_86%_84%,rgba(154,143,122,0.08),transparent_30%)]" />

        <div className="relative h-[760px] min-w-[940px]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="org-link-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(154,143,122,0.18)" />
                <stop offset="50%" stopColor="rgba(196,181,154,0.5)" />
                <stop offset="100%" stopColor="rgba(154,143,122,0.18)" />
              </linearGradient>
            </defs>

            {connections.map(([from, to], idx) => {
              const start = nodePositions[from];
              const end = nodePositions[to];
              const isActivated =
                activeNodes.some((n) => n.name === from) || activeNodes.some((n) => n.name === to);

              return (
                <motion.path
                  key={`${from}-${to}`}
                  d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - 7} ${end.x} ${end.y}`}
                  fill="none"
                  stroke="url(#org-link-gradient)"
                  strokeWidth={isActivated ? 0.48 : 0.25}
                  strokeOpacity={isActivated ? 1 : 0.52}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: isActivated ? [0.55, 1, 0.55] : [0.2, 0.45, 0.2],
                  }}
                  transition={{
                    pathLength: { duration: 1.15, delay: idx * 0.05, ease: "easeOut" },
                    opacity: {
                      duration: isActivated ? 2.2 : 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              );
            })}
          </svg>

          {normalizedNodes.map((node, i) => {
            const position = nodePositions[node.name as (typeof departmentOrder)[number]];
            return (
              <motion.div
                key={node.id}
                className="absolute w-[248px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
              >
                <OrgNodeCard node={node} index={i} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
