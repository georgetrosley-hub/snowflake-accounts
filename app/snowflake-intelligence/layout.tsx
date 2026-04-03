import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snowflake Intelligence | Snowflake Enterprise AE",
  description:
    "Claude-powered assistant for Snowflake Intelligence, territory planning, and the AI Data Cloud.",
};

export default function SnowflakeIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
