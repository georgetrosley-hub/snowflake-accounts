"use client";

import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Show Snowflake logo next to title for a consistent branded look */
  showLogo?: boolean;
}

export function SectionHeader({ title, subtitle, showLogo }: SectionHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8 lg:mb-10">
      <div className="flex items-center gap-3">
        {showLogo && (
          <SnowflakeLogoIcon size={28} className="shrink-0 opacity-90" />
        )}
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-text-primary sm:text-[16px]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-text-muted sm:text-[13px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
