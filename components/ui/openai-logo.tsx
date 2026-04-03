"use client";

import Image from "next/image";
import { useTheme } from "@/app/context/theme-context";
import { cn } from "@/lib/utils";

interface OpenAILogoProps {
  className?: string;
  size?: number;
}

const LOGO_LIGHT = "/openai-logo.png";       // black logo on light bg
const LOGO_DARK = "/openai-logo-dark.png";  // white logo on dark bg

/** Official OpenAI logo — light theme: black knot; dark theme: white knot */
export function OpenAILogoImage({ className, size = 20 }: OpenAILogoProps) {
  const { isDark } = useTheme();
  const src = isDark ? LOGO_DARK : LOGO_LIGHT;
  return (
    <Image
      src={src}
      alt="OpenAI"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      priority
      unoptimized
    />
  );
}

/** SVG fallback for small or colored contexts */
export function OpenAILogo({ className, size = 20 }: OpenAILogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      aria-hidden
    >
      <path
        d="M12 2L14 8L20 9L15 12L16 18L12 15L8 18L9 12L4 9L10 8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Compact "ChatGPT" wordmark-style icon: chat bubble + sparkle */
export function ChatGPTIcon({ className, size = 20 }: OpenAILogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6l-2 2V4zm4 4h8v1.5H8V8zm0 3h8v1.5H8V11zm0 3h5v1.5H8V14z"
        fill="currentColor"
      />
      <path
        d="M18 6.5a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  );
}
