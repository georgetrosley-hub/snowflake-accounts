import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ApiKeyProvider } from "@/app/context/api-key-context";
import { ThemeProvider } from "@/app/context/theme-context";
import { ToastProvider } from "@/app/context/toast-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.snowflake.com/en/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Territory Operating System | Snowflake Enterprise AE",
  description:
    "Practical territory operating system for Snowflake enterprise AEs. Own strategic accounts, run daily execution rhythm, and expand high-value platform use cases.",
  icons: {
    icon: [{ url: "/snowflake-logo.png", type: "image/png", sizes: "any" }],
    apple: [{ url: "/snowflake-logo.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Territory Operating System | Snowflake",
    description:
      "Commercial territory operating system for Snowflake enterprise accounts. Daily execution, expansion strategy, and platform narrative.",
    url: "/",
    siteName: "Snowflake GTM",
    type: "website",
    images: [
      {
        url: "/snowflake-logo.png",
        width: 512,
        height: 512,
        alt: "Snowflake",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Territory Operating System | Snowflake",
    description: "Practical operating rhythm for Snowflake enterprise territory ownership and expansion.",
    images: ["/snowflake-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (() => {
      try {
        var s = localStorage.getItem("snowflake-gtm-theme");
        var theme = (s === "light" || s === "dark") ? s : "dark";
        document.documentElement.dataset.theme = theme;
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.classList.toggle("light", theme === "light");
      } catch {}
    })();
  `;

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ApiKeyProvider>
            <ToastProvider>{children}</ToastProvider>
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
