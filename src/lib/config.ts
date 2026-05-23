import type { PlanTier } from "./types";
import {
  LayoutDashboard,
  Building2,
  UserRound,
  Landmark,
  Layers,
  Newspaper,
  FileText,
  Bell,
  Bot,
  FileBarChart,
  Star,
  Briefcase,
  Code2,
  Settings,
  Vote,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "Trad3wise",
  tagline: "Filings in. Signals out.",
  description:
    "The next-generation financial screener built on SEC filings. Track insider trades, institutional flow, dilution risk, congressional trades, and market movers in real time.",
};

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: "Markets",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Insiders", href: "/insiders", icon: UserRound },
      { label: "Politicians", href: "/politicians", icon: Vote },
      { label: "Institutions", href: "/institutions", icon: Landmark },
      { label: "ETFs", href: "/etfs", icon: Layers },
      { label: "News", href: "/news", icon: Newspaper },
      { label: "SEC Filings", href: "/sec-filings", icon: FileText },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AI Agent", href: "/ai", icon: Bot },
      { label: "Reports", href: "/reports", icon: FileBarChart },
      { label: "Alerts", href: "/alerts", icon: Bell },
      { label: "Watchlist", href: "/watchlist", icon: Star },
      { label: "Portfolio", href: "/portfolio", icon: Briefcase },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Developer", href: "/developer", icon: Code2 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const PLANS: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Explore the platform with delayed data.",
    cta: "Start free",
    features: [
      "Delayed quotes & filings",
      "Basic company & insider screeners",
      "1 watchlist (up to 10 items)",
      "Daily signals digest",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "per month",
    tagline: "Real-time signals for active traders.",
    cta: "Choose Starter",
    features: [
      "Real-time signals & filings feed",
      "Full company / insider / 13F / ETF screeners",
      "Unlimited watchlists",
      "10 alert rules (in-app + email)",
      "Limited AI summaries",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$99",
    period: "per month",
    tagline: "Full AI + API for serious research.",
    cta: "Go Professional",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Unlimited AI agent + research reports",
      "Unlimited alerts (in-app, email, push)",
      "REST API access + API keys",
      "Portfolio brokerage sync",
      "Politician trade tracker",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    tagline: "Scale, SLAs, and team seats.",
    cta: "Contact sales",
    features: [
      "Everything in Professional",
      "Higher API rate limits",
      "Team seats & SSO",
      "Custom data feeds & webhooks",
      "Priority support + SLA",
    ],
  },
];

export const SECTORS = [
  "Technology",
  "Financials",
  "Health Care",
  "Energy",
  "Consumer Discretionary",
  "Consumer Staples",
  "Industrials",
  "Communication Services",
  "Materials",
  "Utilities",
  "Real Estate",
];

export const FILING_TYPES = [
  "10-K",
  "10-Q",
  "8-K",
  "S-1",
  "4",
  "3",
  "5",
  "13F-HR",
  "SC 13D",
  "SC 13G",
  "DEF 14A",
  "424B5",
] as const;
