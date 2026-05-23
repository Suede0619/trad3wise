import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trad3wise.vercel.app"),
  title: {
    default: "Trad3wise — Filings in. Signals out.",
    template: "%s · Trad3wise",
  },
  description:
    "The next-generation financial screener built on SEC filings. Track insider trades, institutional flow, dilution risk, congressional trades, and market movers in real time.",
  applicationName: "Trad3wise",
  keywords: [
    "SEC filings",
    "insider trading",
    "13F",
    "congressional trades",
    "financial screener",
    "stock signals",
  ],
  openGraph: {
    title: "Trad3wise — Filings in. Signals out.",
    description:
      "The next-generation financial screener built on SEC filings.",
    siteName: "Trad3wise",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Trad3wise" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
