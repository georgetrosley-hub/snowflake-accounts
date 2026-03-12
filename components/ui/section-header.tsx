"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="mb-10">
      <h2 className="text-[15px] font-medium tracking-tight text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-[13px] text-text-muted">{subtitle}</p>
      )}
    </header>
  );
}
