"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/snowflake-logo.png";

interface SnowflakeLogoProps {
  className?: string;
  size?: number;
}

/** Snowflake brand mark — PNG asset, works in both light and dark themes */
export function SnowflakeLogoIcon({ className, size = 24 }: SnowflakeLogoProps) {
  const s = size ?? 24;
  return (
    <Image
      src={LOGO_SRC}
      alt="Snowflake"
      width={s}
      height={s}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
      unoptimized
    />
  );
}

/** Wordmark: Snowflake */
export function SnowflakeWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold tracking-tight text-[15px] text-text-primary", className)}>
      Snowflake
    </span>
  );
}

/** Logo + wordmark for header/sidebar */
export function SnowflakeLogoImage({ className, size = 24 }: SnowflakeLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SnowflakeLogoIcon size={size} />
    </div>
  );
}

/** Icon-only for compact UI (same as SnowflakeLogoIcon, alias for drop-in) */
export function SnowflakeLogo({ className, size = 20 }: SnowflakeLogoProps) {
  return <SnowflakeLogoIcon className={className} size={size} />;
}
