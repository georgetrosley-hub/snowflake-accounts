import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Execution workspace | Snowflake Enterprise AE",
  description:
    "Territory priorities, account dossiers, daily briefing, and execution framework — the weekly rhythm for enterprise AEs.",
};

export default function OperatingSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
