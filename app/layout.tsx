import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude Seller Hub",
  description: "The agentic sales platform for Anthropic sellers — powered by Claude",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23DA7756' d='M12 1C12.5 5.5 13 8 14.5 9.5C16 11 18.5 11.5 23 12C18.5 12.5 16 13 14.5 14.5C13 16 12.5 18.5 12 23C11.5 18.5 11 16 9.5 14.5C8 13 5.5 12.5 1 12C5.5 11.5 8 11 9.5 9.5C11 8 11.5 5.5 12 1Z'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
