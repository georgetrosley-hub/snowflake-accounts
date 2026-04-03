import type { TerritoryAccount } from "@/types/territory-map";

/** Seed book aligned to GT territory workbook; names illustrative—confirm in CRM / LinkedIn. */
export const DEFAULT_TERRITORY_ACCOUNTS: TerritoryAccount[] = [
  {
    id: "ciena",
    name: "Ciena",
    tier: 1,
    acv: "Expansion",
    industry: "Networking / Optical",
    status: "Existing",
    motion: "expansion",
    snowflakeUsage: "heavy",
    usageNote: "Multi-workload; AI + network telemetry expansion lane.",
    pipelineLowK: 600,
    pipelineHighK: 1800,
    day0: {
      likelihood: "high",
      likelihoodWhy:
        "Heavy Snowflake footprint; champion + CTO mapped; expansion ties to a measurable AI backlog narrative.",
      timeline: "60–90 days",
      firstMeeting:
        "VP Data & Analytics — align on a 24-hour proof: backlog risk on 2–3 AI deals before asking for net-new platform work.",
    },
    whyWithoutSnowflake:
      "Network AI and telemetry at scale need one governed copy. External ML fabrics duplicate pipelines, weaken lineage, and break the audit path NOC and partners expect. Field and partner access without native sharing means ETL sprawl and slower incident response.",
    compelling:
      "First workload: backlog and margin visibility on AI deals. Execution binds on ~$7B backlog—demand is not the bottleneck. Prove value: surface backlog risk on 2–3 AI deals in 24 hours. Expand: forecasting → supply chain → Blue Planet.",
    solutions: [
      { product: "Cortex AI", problem: "Network performance prediction and anomaly detection across global optical infrastructure" },
      { product: "Snowpark", problem: "Custom ML pipelines for optical network optimization without moving data outside Snowflake" },
      { product: "Cortex Analyst", problem: "Self-service network analytics for field engineers and NOC teams without SQL" },
      { product: "Dynamic Tables", problem: "Real-time telemetry pipelines from network devices to analytics layer" },
    ],
    contacts: [
      { name: "Patricia Morales", title: "VP Data & Analytics", role: "Champion" },
      { name: "James Okonkwo", title: "CTO", role: "Economic Buyer" },
    ],
  },
  {
    id: "sagent",
    name: "Sagent",
    tier: 1,
    acv: "Expansion",
    industry: "Mortgage Servicing Tech",
    status: "Existing",
    motion: "expansion",
    snowflakeUsage: "moderate",
    usageNote: "Core warehouse; AI + governance attach.",
    pipelineLowK: 400,
    pipelineHighK: 1200,
    day0: {
      likelihood: "high",
      likelihoodWhy: "Core warehouse in place; compliance and partner sharing are funded problems, not science projects.",
      timeline: "45–75 days",
      firstMeeting:
        "Head of Engineering — Dara deployment scorecard across customers; surface 1–2 underperformers with data, not slides.",
    },
    whyWithoutSnowflake:
      "Servicing analytics without Horizon + sharing forces duplicate datasets per partner and brittle CFPB evidence. Rebuilding lineage outside Snowflake extends every audit cycle and blocks self-service for business owners.",
    compelling:
      "First workload: Dara performance across the customer base. Prove Dara in production: flag 1–2 underperforming deployments with evidence. Expand: customer health → compliance telemetry → AI on servicing events.",
    solutions: [
      { product: "Cortex Analyst", problem: "Self-service mortgage servicing analytics for non-technical compliance teams" },
      { product: "Secure Data Sharing", problem: "Share loan performance data with servicer partners securely without data movement" },
      { product: "Horizon Governance", problem: "Automated data lineage and access controls for CFPB and state regulatory audits" },
    ],
    contacts: [
      { name: "Elena Ruiz", title: "Head of Engineering", role: "Champion" },
      { name: "Michael Brennan", title: "CEO", role: "Economic Buyer" },
    ],
  },
  {
    id: "usfintech",
    name: "U.S. Financial Technology",
    tier: 1,
    acv: "Expansion",
    industry: "Fintech / Government",
    status: "Existing",
    motion: "expansion",
    snowflakeUsage: "heavy",
    usageNote: "High data gravity; securitization + regulatory paths.",
    pipelineLowK: 800,
    pipelineHighK: 2200,
    day0: {
      likelihood: "high",
      likelihoodWhy:
        "$800K–$2.2M modeled band; government-adjacent gravity; Director of Data + CTO aligned on securitization latency.",
      timeline: "90 days",
      firstMeeting:
        "Director of Data (David Park) — exception monitoring on a bounded MBS slice; CTO (Susan Whitfield) same week for standards and partner flows.",
    },
    whyWithoutSnowflake:
      "Securitization and regulatory workflows fail on fragmentation and latency: overnight batch cannot surface exceptions in time; partner visibility without Secure Data Sharing recreates sensitive copies. Internal builds do not deliver governed Marketplace distribution and federal-grade lineage in one execution layer.",
    dealMechanics: {
      economicBuyer:
        "CEO / CFO office — owns platform TCO and portfolio exposure on mortgage and government-adjacent flows (confirm economic signatory in CRM).",
      technicalBuyer:
        "CTO (Susan Whitfield) — data movement, latency SLOs, partner integration standards.",
      champion:
        "Director of Data (David Park) — securitization exception visibility as first win; runs day-to-day adoption.",
      landMotion:
        "Exception monitoring on existing Snowflake: real-time anomaly vs batch reporting on a defined MBS cohort—no new silo. Win = sub-hour detection with lineage to source systems.",
      expansionAfter:
        "Horizon for audit-ready lineage → Secure Data Sharing to regulators and counterparties → Marketplace data products → Cortex AI risk at portfolio scale.",
      blockers:
        "Change control on fed-adjacent data; internal teams married to bespoke ETL; multi-vendor rationalization politics.",
      competitiveRisk:
        'Databricks for notebook ML; legacy warehouse "good enough" for static reporting; partner-specific databases that avoid cross-portfolio truth.',
    },
    compelling:
      "First workload: securitization exception monitoring. The business cannot act on ~$6.5T of exposure at batch speed. Prove: anomaly vs delayed reporting on one book. Expand: workflows → stakeholder products → monetized data.",
    solutions: [
      { product: "Marketplace", problem: "Distribute MBS data products to external financial institutions at scale" },
      { product: "Horizon Governance", problem: "Federal regulatory compliance with automated lineage for government-adjacent financial data" },
      { product: "Secure Data Sharing", problem: "Enable external partners to consume MBS analytics without raw data exposure" },
      { product: "Cortex AI", problem: "Automated risk scoring and anomaly detection across mortgage-backed securities portfolios" },
    ],
    contacts: [
      { name: "David Park", title: "Director of Data", role: "Champion" },
      { name: "Susan Whitfield", title: "CTO", role: "Technical Buyer" },
    ],
  },
  {
    id: "sprinklr",
    name: "Sprinklr",
    tier: 1,
    acv: "Expansion",
    industry: "CXM / SaaS",
    status: "Existing",
    motion: "expansion",
    snowflakeUsage: "heavy",
    usageNote: "Large CX data estate; Cortex + Intelligence upsell.",
    pipelineLowK: 700,
    pipelineHighK: 2000,
    day0: {
      likelihood: "high",
      likelihoodWhy: "Heavy usage; new executive bench; AI outcome story maps to revenue and NRR metrics.",
      timeline: "60–90 days",
      firstMeeting:
        "Chief Product & Strategy — tie AI measurement to escalation reduction on one enterprise segment; loop CRO for revenue language.",
    },
    whyWithoutSnowflake:
      "Thirty-plus CX channels fragment without one engine. Copying billions of events to external AI stacks is cost-prohibitive and erodes consent posture. Iceberg + Cortex on Snowflake keep models on governed data; the alternative is perpetual ETL rebuilds per channel.",
    compelling:
      "First workload: cross-channel AI outcome correlation. Prove AI moves customer outcomes: intervention → escalation drop in 48 hours. Expand: AI measurement → benchmarking → CX platform depth.",
    solutions: [
      { product: "Cortex Analyst", problem: "Self-service NRR and churn analytics for 700 Bear Hug accounts without waiting on data team" },
      { product: "Snowflake Intelligence", problem: "Natural language queries on customer health scores across 30+ social channels" },
      { product: "Iceberg Tables", problem: "Open data format to unify CX data lake without vendor lock-in during transformation" },
      { product: "Cortex AI", problem: "Real-time sentiment analysis across billions of social interactions for enterprise customers" },
    ],
    contacts: [
      { name: "Scott Millard", title: "CRO (new Sept 2025)", role: "Economic Buyer" },
      { name: "Anthony Coletta", title: "CFO (new Oct 2025)", role: "Influencer" },
      { name: "Karthik Suri", title: "Chief Product & Strategy", role: "Technical Champion" },
    ],
  },
  {
    id: "bancorp",
    name: "The Bancorp",
    tier: 1,
    acv: "Expansion",
    industry: "Banking / Fintech (BaaS)",
    status: "Existing",
    motion: "expansion",
    snowflakeUsage: "moderate",
    usageNote: "Partner analytics; risk + embedded finance depth.",
    pipelineLowK: 550,
    pipelineHighK: 1600,
    day0: {
      likelihood: "medium",
      likelihoodWhy: "Full stakeholder map; BaaS partner complexity adds coordination, not a missing product story.",
      timeline: "60–90 days",
      firstMeeting:
        "Head of Fintech Solutions — partner profitability vs risk divergence with 5–10 cohorts already in the warehouse.",
    },
    whyWithoutSnowflake:
      "BaaS economics without Secure Data Sharing and Horizon spawns a shadow warehouse per partner. OCC/FDIC lineage and partner-level P&L do not stay true at PayPal-scale embedded volume without one governed plane.",
    compelling:
      "First workload: partner profitability + risk intelligence. Scaling partners without a unified risk/profit view caps growth. Prove: growth vs risk divergence across cohorts. Expand: risk detection → embedded finance → AI ops.",
    solutions: [
      { product: "Secure Data Sharing", problem: "Partner-level analytics across PayPal, Chime and others without exposing raw loan data" },
      { product: "Cortex ML", problem: "Credit risk signal detection and anomaly detection on consumer fintech loan portfolios ($128M provisions)" },
      { product: "Snowflake Intelligence", problem: "Real-time partner-level P&L visibility: GDV, fee income, provision rates, delinquency by partner" },
      { product: "Horizon Governance", problem: "OCC/FDIC regulatory compliance with automated data lineage and access controls" },
    ],
    contacts: [
      { name: "Gregory Walsh", title: "CFO", role: "Economic Buyer" },
      { name: "Amanda Liu", title: "Head of Fintech Solutions", role: "Champion" },
      { name: "Robert Singh", title: "Chief Risk Officer", role: "Influencer" },
      { name: "Nina Kowalski", title: "Director Data Engineering", role: "Technical Champion" },
    ],
  },
  {
    id: "billtrust",
    name: "Billtrust",
    tier: 1,
    acv: "Expansion",
    industry: "B2B Fintech (AR)",
    status: "Existing",
    motion: "expansion",
    snowflakeUsage: "moderate",
    usageNote: "Order-to-cash data mesh; AI collections attach.",
    pipelineLowK: 500,
    pipelineHighK: 1400,
    day0: {
      likelihood: "medium",
      likelihoodWhy: "Order-to-cash mesh narrative is clear; CEO + CTO + VP Data triangle is favorable.",
      timeline: "60–90 days",
      firstMeeting:
        "VP Data Engineering — collections vs payments correlation workshop; CTO for SPCS and model-governance credibility.",
    },
    whyWithoutSnowflake:
      "Multi-agent collections and fine-tuned models on invoices require data to stay in place. Export pipelines for training violate segregation patterns and double storage; SPCS + Cortex keep inference, lineage, and access policy unified.",
    compelling:
      "First workload: cash acceleration intelligence. AR signals sit in parallel systems. Prove: collections vs payment correlation across cohorts. Expand: AI collections → benchmarking → full order-to-cash intelligence.",
    solutions: [
      { product: "Snowpark Container Services", problem: "Run multi-agent AI models for payment matching and collections natively on unified data" },
      { product: "Cortex AI Fine-Tuning", problem: "Fine-tune payment prediction models on proprietary B2B transaction data without export" },
      { product: "Dynamic Tables", problem: "Real-time pipeline for AI training data across invoicing, payments and collections simultaneously" },
      { product: "Cortex ML", problem: "Collections prioritization and credit decisioning models trained on unified cross-product data" },
    ],
    contacts: [
      { name: "Daniel Frost", title: "CTO", role: "Technical Champion" },
      { name: "Laura Chen", title: "VP Data Engineering", role: "Champion" },
      { name: "Thomas Meyer", title: "CEO", role: "Economic Buyer" },
    ],
  },
  {
    id: "lyric",
    name: "Magnum Transaction Sub / Lyric",
    tier: 2,
    acv: "$150K–400K+",
    industry: "Healthcare Payment Integrity",
    status: "Existing",
    motion: "net_new_workload",
    snowflakeUsage: "light",
    usageNote: "Reporting-first today; ML + sharing expansion bet.",
    pipelineLowK: 150,
    pipelineHighK: 400,
    day0: {
      likelihood: "medium",
      likelihoodWhy: "Net-new workload bet; lighter Snowflake today—win must be narrow, time-boxed, and clinical on ROI.",
      timeline: "90–120 days",
      firstMeeting:
        "VP Engineering — single claim-category pre/post-pay correlation; CEO for HIPAA spend and ROI guardrails.",
    },
    whyWithoutSnowflake:
      "Payment integrity without governed sharing rebuilds PHI pathways for every payer partner. Document AI + ML on claims need lineage from OCR to scorecard; stitching that outside Snowflake duplicates HIPAA controls and slows remediation.",
    compelling:
      "First workload: pre- and post-pay claims intelligence. Gap is time from detection to action. Prove: one category, pre/post correlation. Expand: payer analytics → AI claims → COB optimization.",
    solutions: [
      { product: "Cortex ML", problem: "Payment accuracy models to detect overpayment and fraud patterns across billions in claims" },
      { product: "Secure Data Sharing", problem: "Share payment accuracy insights with payer partners without raw PHI exposure" },
      { product: "Horizon Governance", problem: "HIPAA-compliant data governance for healthcare payment data" },
      { product: "Document AI", problem: "Automated extraction from EOBs, claims forms and remittance documents" },
    ],
    contacts: [
      { name: "Kevin O'Donnell", title: "VP Engineering", role: "Champion" },
      { name: "Rachel Simmons", title: "CEO", role: "Economic Buyer" },
    ],
  },
  {
    id: "healthunion",
    name: "Health Union, LLC",
    tier: 2,
    acv: "$100K–250K",
    industry: "Digital Health / AdTech",
    status: "Existing",
    motion: "net_new_workload",
    snowflakeUsage: "light",
    usageNote: "Clean rooms + pharma monetization runway.",
    pipelineLowK: 100,
    pipelineHighK: 250,
    day0: {
      likelihood: "medium",
      likelihoodWhy: "Clean rooms and pharma monetization map directly to Snowflake primitives; attach is execution, not education.",
      timeline: "90 days",
      firstMeeting:
        "VP Data — 48-hour therapeutic-area audience segment from existing engagement data; CTO for privacy architecture sign-off.",
    },
    whyWithoutSnowflake:
      "Pharma monetization without Marketplace and clean rooms forces legal to bless endless one-off extracts. Snowflake keeps analysis partner-side without raw PII movement; DIY clean rooms do not scale across multiple pharma workflows.",
    compelling:
      "First workload: unified patient + HCP activation. Adfire assets need operational discipline. Prove: one therapeutic segment in 48 hours. Expand: clean rooms → clinical trials → AI patient journey.",
    solutions: [
      { product: "Cortex AI", problem: "Audience segmentation and content personalization across health condition communities at scale" },
      { product: "Marketplace", problem: "Monetize health engagement data with pharma partners via privacy-safe clean rooms" },
      { product: "Secure Data Sharing", problem: "Enable pharma partners to query patient engagement patterns without accessing raw PII/PHI" },
    ],
    contacts: [
      { name: "Marcus Webb", title: "CTO", role: "Technical Buyer" },
      { name: "Priya Shah", title: "VP Data", role: "Champion" },
    ],
  },
  {
    id: "everstage",
    name: "Everstage",
    tier: 3,
    acv: "$75K–150K",
    industry: "SaaS (Sales Performance)",
    status: "Existing",
    motion: "net_new_workload",
    snowflakeUsage: "moderate",
    usageNote: "RevOps analytics; Snowpark + Analyst land.",
    pipelineLowK: 75,
    pipelineHighK: 150,
    day0: {
      likelihood: "low",
      likelihoodWhy: "Smaller modeled band; needs a crisp cross-product revenue proof before multi-workload expansion.",
      timeline: "90+ days",
      firstMeeting:
        "VP Operations — commission variance across products in one governed view; CTO for Snowpark acceptance.",
    },
    whyWithoutSnowflake:
      "Commission logic spanning products breaks when each silo exports CSVs nightly. Snowpark on unified data delivers auditable, near-real-time comp without engineering as gatekeeper; spreadsheets and external calc engines cap scale and audit quality.",
    compelling:
      "First workload: cross-product revenue intelligence. Three products, three parallel datasets. Prove: cross-product correlation across cohorts. Expand: benchmarking → Crystal AI → RevOps platform depth.",
    solutions: [
      { product: "Snowpark", problem: "Commission calculation engine at scale across complex multi-tier comp plans" },
      { product: "Cortex Analyst", problem: "Self-service commission analytics for sales leaders without engineering dependency" },
    ],
    contacts: [
      { name: "Srinivas Aiyer", title: "CTO", role: "Technical Buyer" },
      { name: "Olivia Hart", title: "VP Operations", role: "Champion" },
    ],
  },
  {
    id: "chalice",
    name: "Chalice AI",
    tier: 3,
    acv: "$50K–100K",
    industry: "AdTech / Custom AI",
    status: "Existing",
    motion: "net_new_workload",
    snowflakeUsage: "moderate",
    usageNote: "Container + custom models; scale with LiveRamp/Dentsu motion.",
    pipelineLowK: 50,
    pipelineHighK: 100,
    day0: {
      likelihood: "medium",
      likelihoodWhy: "Container-native AI story matches product; leverage LiveRamp / Dentsu partner motions for credibility.",
      timeline: "60–90 days",
      firstMeeting:
        "VP Engineering — time-boxed model deployment on production bidding data; CEO for packaging and pricing.",
    },
    whyWithoutSnowflake:
      "Proprietary bidding models lose edge when copied to generic GPU farms. SPCS keeps inference on the same governed dataset as activation; external K8s forfeits data gravity, latency, and security posture.",
    compelling:
      "First workload: accelerate advertiser model deployment. Custom models are an operations bottleneck. Prove: shorter onboarding on production data. Expand: LiveRamp clean rooms → Dentsu flows → scale.",
    solutions: [
      { product: "Snowpark Container Services", problem: "Run proprietary ad bidding models natively on Snowflake data without external compute" },
      { product: "Cortex AI", problem: "Augment proprietary bidding algorithms with built-in LLM functions for ad creative analysis" },
    ],
    contacts: [
      { name: "Adam Reyes", title: "CEO / Founder", role: "Economic Buyer" },
      { name: "Hannah Cho", title: "VP Engineering", role: "Technical Champion" },
    ],
  },
];
