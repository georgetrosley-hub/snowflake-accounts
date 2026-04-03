"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { SectionHeader } from "@/components/ui/section-header";
import {
  computeTCO,
  computeBusinessValue,
  getDynamicInsight,
  formatCurrency,
  type LegacyInputs,
  type SnowflakeInputs,
  type TCOResults,
  DEFAULT_LEGACY,
  DEFAULT_SNOWFLAKE,
  PHARMA_LEGACY,
  PHARMA_SNOWFLAKE,
  FINANCIAL_LEGACY,
  FINANCIAL_SNOWFLAKE,
  DIGITAL_LEGACY,
  DIGITAL_SNOWFLAKE,
} from "@/lib/roi-tco-calculations";
import {
  Calculator,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  Percent,
  Clock,
  Layers,
  Lightbulb,
  Building2,
  Briefcase,
  Sparkles,
} from "lucide-react";

const chartGrid = "rgb(var(--surface-divider))";
const chartTick = "rgb(var(--text-muted))";
const chartTooltipBg = "rgb(var(--surface-elevated))";
const chartTooltipBorder = "1px solid rgb(var(--surface-border))";
const accent = "rgb(var(--accent))";
const legacyColor = "rgb(148, 163, 184)";
const snowflakeColor = "rgb(41, 181, 232)";

function InputRow({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 10000,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <label className="text-[12px] text-text-secondary">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-28 rounded-md border border-surface-border bg-surface-elevated px-2 py-1.5 text-right text-[13px] tabular-nums text-text-primary outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        />
        {suffix && <span className="text-[11px] text-text-faint">{suffix}</span>}
      </div>
    </div>
  );
}

type TabId = "tco" | "businessValue";

export function EnterpriseRoiTco() {
  const [legacy, setLegacy] = useState<LegacyInputs>({ ...DEFAULT_LEGACY });
  const [snowflake, setSnowflake] = useState<SnowflakeInputs>({ ...DEFAULT_SNOWFLAKE });
  const [activeTab, setActiveTab] = useState<TabId>("tco");
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  const tco = useMemo(() => computeTCO(legacy, snowflake), [legacy, snowflake]);
  const businessValue = useMemo(
    () => computeBusinessValue(legacy, snowflake, tco),
    [legacy, snowflake, tco]
  );
  const insight = useMemo(() => getDynamicInsight(tco, legacy, snowflake), [tco, legacy, snowflake]);

  const chartDataTCO = useMemo(
    () => [
      { name: "Year 1", legacy: tco.legacyY1, snowflake: tco.snowflakeY1 },
      { name: "Year 2", legacy: tco.legacyY2, snowflake: tco.snowflakeY2 },
      { name: "Year 3", legacy: tco.legacyY3, snowflake: tco.snowflakeY3 },
    ],
    [tco]
  );

  const waterfallData = useMemo(() => {
    const admin = tco.adminReduction3y;
    const tools = tco.toolConsolidation3y;
    const scale = tco.costOfScaleLegacy - tco.costOfScaleSnowflake;
    const other = tco.netSavings - admin - tools - scale;
    return [
      { name: "Admin / ops reduction", value: admin, fill: "rgb(41, 181, 232)" },
      { name: "Tool consolidation", value: tools, fill: "rgb(56, 189, 248)" },
      { name: "Cost of scale", value: scale, fill: "rgb(100, 116, 139)" },
      { name: "Other", value: other, fill: "rgb(148, 163, 184)" },
    ].filter((d) => d.value > 0);
  }, [tco]);

  const growthLineData = useMemo(
    () => [
      { year: "Y1", legacy: tco.legacyY1, snowflake: tco.snowflakeY1 },
      { year: "Y2", legacy: tco.legacyY2, snowflake: tco.snowflakeY2 },
      { year: "Y3", legacy: tco.legacyY3, snowflake: tco.snowflakeY3 },
    ],
    [tco]
  );

  const applyPreset = (l: LegacyInputs, s: SnowflakeInputs) => {
    setLegacy({ ...l });
    setSnowflake({ ...s });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 sm:space-y-10"
    >
      <SectionHeader
        title="Enterprise Data Platform ROI / TCO Model"
        subtitle="Compare legacy data stack vs Snowflake over 3 years. Simplify the data estate, consolidate fragmented tooling, and align spend to actual usage."
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-surface-border/60 bg-surface-elevated/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("tco")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium transition-colors ${
            activeTab === "tco"
              ? "bg-surface-muted text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <Calculator className="h-4 w-4" />
          TCO comparison
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("businessValue")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium transition-colors ${
            activeTab === "businessValue"
              ? "bg-surface-muted text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          Business value ROI
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
        {/* Left: inputs */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/50 p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-faint">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(DEFAULT_LEGACY, DEFAULT_SNOWFLAKE)}
                className="rounded-md border border-surface-border bg-surface-muted/40 px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                Typical enterprise
              </button>
              <button
                type="button"
                onClick={() => applyPreset(PHARMA_LEGACY, PHARMA_SNOWFLAKE)}
                className="rounded-md border border-surface-border bg-surface-muted/40 px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                Pharma
              </button>
              <button
                type="button"
                onClick={() => applyPreset(FINANCIAL_LEGACY, FINANCIAL_SNOWFLAKE)}
                className="rounded-md border border-surface-border bg-surface-muted/40 px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                Financial services
              </button>
              <button
                type="button"
                onClick={() => applyPreset(DIGITAL_LEGACY, DIGITAL_SNOWFLAKE)}
                className="rounded-md border border-surface-border bg-surface-muted/40 px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                Digital native
              </button>
            </div>
            <button
              type="button"
              onClick={() => applyPreset(DEFAULT_LEGACY, DEFAULT_SNOWFLAKE)}
              className="mt-3 flex items-center gap-2 text-[12px] text-accent hover:text-accent/90"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to typical
            </button>
          </div>

          <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/50 p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-faint">
              Quick inputs
            </p>
            <div className="space-y-0 divide-y divide-surface-border/40">
              <div className="py-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[12px] text-text-secondary">Snowflake Y1 consumption</label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={snowflake.year1Consumption}
                    onChange={(e) => setSnowflake((p) => ({ ...p, year1Consumption: Number(e.target.value) || 0 }))}
                    className="w-28 rounded-md border border-surface-border bg-surface-elevated px-2 py-1.5 text-right text-[13px] tabular-nums text-text-primary outline-none focus:border-accent/50"
                  />
                </div>
                <input
                  type="range"
                  min={200000}
                  max={3000000}
                  step={100000}
                  value={snowflake.year1Consumption}
                  onChange={(e) => setSnowflake((p) => ({ ...p, year1Consumption: Number(e.target.value) }))}
                  className="mt-1.5 h-1.5 w-full appearance-none rounded-full bg-surface-muted accent-accent"
                />
              </div>
              <div className="py-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[12px] text-text-secondary">Snowflake growth rate</label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    step={1}
                    value={snowflake.consumptionGrowthRatePct}
                    onChange={(e) => setSnowflake((p) => ({ ...p, consumptionGrowthRatePct: Number(e.target.value) || 0 }))}
                    className="w-16 rounded-md border border-surface-border bg-surface-elevated px-2 py-1.5 text-right text-[13px] tabular-nums text-text-primary outline-none focus:border-accent/50"
                  />
                  <span className="text-[11px] text-text-faint">%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={snowflake.consumptionGrowthRatePct}
                  onChange={(e) => setSnowflake((p) => ({ ...p, consumptionGrowthRatePct: Number(e.target.value) }))}
                  className="mt-1.5 h-1.5 w-full appearance-none rounded-full bg-surface-muted accent-accent"
                />
              </div>
              <div className="py-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[12px] text-text-secondary">Legacy cost growth rate</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    value={legacy.annualGrowthRatePct}
                    onChange={(e) => setLegacy((p) => ({ ...p, annualGrowthRatePct: Number(e.target.value) || 0 }))}
                    className="w-16 rounded-md border border-surface-border bg-surface-elevated px-2 py-1.5 text-right text-[13px] tabular-nums text-text-primary outline-none focus:border-accent/50"
                  />
                  <span className="text-[11px] text-text-faint">%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={2}
                  value={legacy.annualGrowthRatePct}
                  onChange={(e) => setLegacy((p) => ({ ...p, annualGrowthRatePct: Number(e.target.value) }))}
                  className="mt-1.5 h-1.5 w-full appearance-none rounded-full bg-surface-muted accent-accent"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAssumptionsOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl border border-surface-border/60 bg-surface-elevated/50 px-4 py-3 text-left text-[13px] text-text-secondary transition-colors hover:bg-surface-muted/30"
          >
            <span className="font-medium text-text-primary">Assumptions</span>
            {assumptionsOpen ? (
              <ChevronDown className="h-4 w-4 text-text-faint" />
            ) : (
              <ChevronRight className="h-4 w-4 text-text-faint" />
            )}
          </button>

          <AnimatePresence>
            {assumptionsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 rounded-xl border border-surface-border/60 bg-surface-elevated/40 p-4">
                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-faint">
                      Legacy stack
                    </p>
                    <div className="space-y-0 divide-y divide-surface-border/40">
                      <InputRow
                        label="Warehouse license"
                        value={legacy.warehouseLicense}
                        onChange={(v) => setLegacy((p) => ({ ...p, warehouseLicense: v }))}
                      />
                      <InputRow
                        label="Infrastructure / hardware"
                        value={legacy.infrastructure}
                        onChange={(v) => setLegacy((p) => ({ ...p, infrastructure: v }))}
                      />
                      <InputRow
                        label="Storage"
                        value={legacy.storage}
                        onChange={(v) => setLegacy((p) => ({ ...p, storage: v }))}
                      />
                      <InputRow
                        label="DBA / operations"
                        value={legacy.dbaOperations}
                        onChange={(v) => setLegacy((p) => ({ ...p, dbaOperations: v }))}
                      />
                      <InputRow
                        label="ETL / pipeline tools"
                        value={legacy.etlTools}
                        onChange={(v) => setLegacy((p) => ({ ...p, etlTools: v }))}
                      />
                      <InputRow
                        label="BI / analytics overlap"
                        value={legacy.biOverlap}
                        onChange={(v) => setLegacy((p) => ({ ...p, biOverlap: v }))}
                      />
                      <InputRow
                        label="Data sharing / integration"
                        value={legacy.dataSharingIntegration}
                        onChange={(v) => setLegacy((p) => ({ ...p, dataSharingIntegration: v }))}
                      />
                      <InputRow
                        label="AI / ML infrastructure"
                        value={legacy.aiMlInfra}
                        onChange={(v) => setLegacy((p) => ({ ...p, aiMlInfra: v }))}
                      />
                      <InputRow
                        label="Performance tuning / upgrades"
                        value={legacy.performanceTuning}
                        onChange={(v) => setLegacy((p) => ({ ...p, performanceTuning: v }))}
                      />
                      <InputRow
                        label="Annual growth rate"
                        value={legacy.annualGrowthRatePct}
                        onChange={(v) => setLegacy((p) => ({ ...p, annualGrowthRatePct: v }))}
                        max={50}
                        step={1}
                        suffix="%"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-faint">
                      Snowflake
                    </p>
                    <div className="space-y-0 divide-y divide-surface-border/40">
                      <InputRow
                        label="Year 1 consumption"
                        value={snowflake.year1Consumption}
                        onChange={(v) => setSnowflake((p) => ({ ...p, year1Consumption: v }))}
                      />
                      <InputRow
                        label="Consumption growth rate"
                        value={snowflake.consumptionGrowthRatePct}
                        onChange={(v) => setSnowflake((p) => ({ ...p, consumptionGrowthRatePct: v }))}
                        max={80}
                        step={1}
                        suffix="%"
                      />
                      <InputRow
                        label="Storage"
                        value={snowflake.storage}
                        onChange={(v) => setSnowflake((p) => ({ ...p, storage: v }))}
                      />
                      <InputRow
                        label="Admin / operations"
                        value={snowflake.adminOperations}
                        onChange={(v) => setSnowflake((p) => ({ ...p, adminOperations: v }))}
                      />
                      <InputRow
                        label="Migration / implementation (Y1)"
                        value={snowflake.migrationImplementationY1}
                        onChange={(v) => setSnowflake((p) => ({ ...p, migrationImplementationY1: v }))}
                      />
                      <InputRow
                        label="AI expansion"
                        value={snowflake.aiExpansion}
                        onChange={(v) => setSnowflake((p) => ({ ...p, aiExpansion: v }))}
                      />
                      <InputRow
                        label="App / data sharing expansion"
                        value={snowflake.appSharingExpansion}
                        onChange={(v) => setSnowflake((p) => ({ ...p, appSharingExpansion: v }))}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Right: results */}
        <div className="min-w-0 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "tco" ? (
              <motion.div
                key="tco"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Executive summary cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/60 px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
                      3-year savings
                    </p>
                    <p
                      className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${
                        tco.netSavings >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatCurrency(tco.netSavings)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/60 px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
                      ROI
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-text-primary">
                      {tco.roiPct >= 0 ? `${tco.roiPct.toFixed(0)}%` : `${tco.roiPct.toFixed(0)}%`}
                    </p>
                  </div>
                  <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/60 px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
                      Payback
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-text-primary">
                      {tco.paybackMonths <= 36 ? `${tco.paybackMonths} mo` : ">36 mo"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/60 px-4 py-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
                      Tools consolidated
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-accent">
                      {tco.toolsConsolidatedCount}
                    </p>
                  </div>
                </div>

                {/* Stacked bar: 3-year TCO */}
                <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/40 p-4">
                  <p className="mb-3 text-[12px] font-medium text-text-secondary">
                    Three-year TCO — Legacy vs Snowflake
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataTCO} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 2" stroke={chartGrid} vertical={false} strokeOpacity={0.5} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartTick }} axisLine={false} tickLine={false} />
                        <YAxis
                          tick={{ fontSize: 10, fill: chartTick }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `$${v / 1e6}M`}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartTooltipBg,
                            border: chartTooltipBorder,
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontSize: 12,
                          }}
                          formatter={(value: number) => [formatCurrency(value), ""]}
                          labelFormatter={(l) => l}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: 11 }}
                          formatter={(v) => (v === "legacy" ? "Legacy stack" : "Snowflake")}
                        />
                        <Bar dataKey="legacy" name="legacy" fill={legacyColor} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="snowflake" name="snowflake" fill={snowflakeColor} radius={[0, 0, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Waterfall / savings drivers */}
                  <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/40 p-4">
                    <p className="mb-3 text-[12px] font-medium text-text-secondary">
                      Where savings come from
                    </p>
                    {waterfallData.length > 0 ? (
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={waterfallData}
                            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="2 2" stroke={chartGrid} horizontal={false} strokeOpacity={0.5} />
                            <XAxis type="number" tickFormatter={(v) => `$${v / 1e6}M`} tick={{ fontSize: 10, fill: chartTick }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: chartTick }} width={100} axisLine={false} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: chartTooltipBg, border: chartTooltipBorder, borderRadius: "8px" }}
                              formatter={(value: number) => [formatCurrency(value), ""]}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {waterfallData.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="py-8 text-center text-[13px] text-text-muted">
                        Adjust inputs to see savings drivers. When Snowflake TCO is lower, savings from admin, tools, and scale appear here.
                      </p>
                    )}
                  </div>

                  {/* Line: cost growth */}
                  <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/40 p-4">
                    <p className="mb-3 text-[12px] font-medium text-text-secondary">
                      Cost trajectory — Legacy vs Snowflake
                    </p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthLineData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="2 2" stroke={chartGrid} vertical={false} strokeOpacity={0.5} />
                          <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartTick }} axisLine={false} tickLine={false} />
                          <YAxis
                            tick={{ fontSize: 10, fill: chartTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${v / 1e6}M`}
                            width={40}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: chartTooltipBg, border: chartTooltipBorder, borderRadius: "8px" }}
                            formatter={(value: number) => [formatCurrency(value), ""]}
                          />
                          <Line type="monotone" dataKey="legacy" stroke={legacyColor} strokeWidth={2} dot={{ r: 4 }} name="Legacy" />
                          <Line type="monotone" dataKey="snowflake" stroke={snowflakeColor} strokeWidth={2} dot={{ r: 4 }} name="Snowflake" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Dynamic insight */}
                <div className="flex gap-3 rounded-xl border border-accent/20 bg-accent/[0.06] p-4">
                  <Lightbulb className="h-5 w-5 shrink-0 text-accent" />
                  <p className="text-[13px] leading-relaxed text-text-secondary">{insight}</p>
                </div>

                {/* Disclaimer */}
                <p className="text-[11px] leading-relaxed text-text-faint">
                  Directional estimates only. Actual costs vary by environment, workload mix, and contract terms. Use with finance and technical stakeholders to pressure-test assumptions.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="businessValue"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <p className="text-[13px] text-text-secondary">
                  Estimated annual business value from faster insights, reduced complexity, lower ops burden, data sharing efficiency, AI readiness, and productivity. Not additive to TCO savings — illustrative of value levers.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <ValueCard
                    icon={Clock}
                    label="Faster time to insights"
                    value={businessValue.fasterTimeToInsights}
                  />
                  <ValueCard
                    icon={Layers}
                    label="Reduced infrastructure complexity"
                    value={businessValue.reducedComplexity}
                  />
                  <ValueCard
                    icon={TrendingDown}
                    label="Lower operational burden"
                    value={businessValue.lowerOperationalBurden}
                  />
                  <ValueCard
                    icon={Briefcase}
                    label="Data sharing efficiency"
                    value={businessValue.dataSharingEfficiency}
                  />
                  <ValueCard
                    icon={Sparkles}
                    label="AI readiness / AI workload enablement"
                    value={businessValue.aiReadiness}
                  />
                  <ValueCard
                    icon={Building2}
                    label="Developer / analyst productivity"
                    value={businessValue.productivity}
                  />
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-accent/90">
                    Total estimated annual value
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
                    {formatCurrency(businessValue.totalAnnualValue)}
                  </p>
                  <p className="mt-1 text-[12px] text-text-muted">
                    From consolidation, elasticity, and a foundation for AI workloads. Refine with the account’s own metrics.
                  </p>
                </div>
                <p className="text-[11px] leading-relaxed text-text-faint">
                  Business value estimates are illustrative and based on typical efficiency gains. Actual outcomes depend on adoption and workload mix.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ValueCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-surface-border/60 bg-surface-elevated/60 px-4 py-4">
      <Icon className="h-4 w-4 text-accent/80" />
      <p className="mt-2 text-[12px] text-text-secondary">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
        {formatCurrency(value)}
      </p>
    </div>
  );
}
