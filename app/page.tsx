"use client";

import Link from "next/link";
import TerritoryIntelligenceMap from "@/components/territory-intelligence-map";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[200] flex justify-end gap-2 p-3">
        <Link
          href="/gtm"
          className="pointer-events-auto rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-slate-50"
        >
          GTM Command Center →
        </Link>
      </div>
      <TerritoryIntelligenceMap />
    </div>
  );
}
