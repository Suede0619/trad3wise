# Signal8 — Feature Documentation (Reverse-Engineered)

> Source studied: https://signal8.ai/ (tagline: **"Filings in. Signals out."**)
> Studied via: server HTML, meta tags, RSC payload, `robots.txt`, `sitemap.xml`, and public marketing copy.
> This document is the basis for the **Trad3wise** clone. It catalogs *every* feature observed so the
> rebuild can be verified for completeness.

## 1. What the product is

Signal8 is a **next-generation financial screener built on SEC filings**. It ingests U.S. regulatory
filings (EDGAR) and market data, then surfaces actionable "signals": insider trades, institutional
flow, congressional (politician) trades, dilution risk, ETF flows, corporate events, and news — all
with AI-generated summaries, a conversational filing-intelligence agent, watchlists, real-time alerts,
and a developer API.

Value proposition (paraphrased): *read every SEC filing automatically and extract the material parts in
seconds instead of hours.*

## 2. Technical fingerprint of the original

- **Framework:** Next.js (App Router, React Server Components, Turbopack). Built with **v0.app**, hosted on Vercel.
- **Theme:** Forced **dark mode** (theme init script removes any stored light preference).
- **Fonts:** Inter (sans) + JetBrains Mono (mono).
- **Backend API:** separate origin `https://api.signal8.ai` (preconnect + dns-prefetch in `<head>`).
- **Analytics:** Google Tag Manager (`GTM-KHFPF2FN`).
- **PWA:** Service worker registration + web push ("NotificationPromptWrapper").
- **Gating:** `AccessCodeModal` (invite/access-code gate) and a **demo mode** (`DemoRedirectToast`,
  `/disconnect-demo`). `LivePricesProvider` streams live quotes. `CookieConsentBanner`. `FeatureConfigSeed`
  (server-driven feature flags). Global **command palette** (`⌘K`).

## 3. Global navigation (top-level)

`Dashboard · Companies · Insiders · Politicians · Institutions · ETFs · News · SEC Filings · Alerts · ⌘K`

## 4. Route map (from sitemap.xml + robots.txt)

### Public / indexable
| Route | Purpose |
|---|---|
| `/` | Dashboard / home (market movers, signals overview) |
| `/companies` | Company screener (filterable list) |
| `/companies/[EXCH:TICKER]` | Company overview (e.g. `NYSE:JPM`) |
| `/companies/[EXCH:TICKER]/financials` | Company financial statements |
| `/companies/[EXCH:TICKER]/news` | Company news |
| `/companies/[EXCH:TICKER]/filings` | Company SEC filings |
| `/insiders` | Insider directory + insider-trade feed |
| `/insiders/[person-slug]` | Insider profile + trade history |
| `/institutions` | Institutional investor directory (13F filers) |
| `/institutions/[firm-slug]` | Institution profile + 13F holdings |
| `/etfs` | ETF screener |
| `/etfs/[EXCH:TICKER]` | ETF overview |
| `/etfs/[EXCH:TICKER]/holdings` | ETF constituent holdings |
| `/etfs/[EXCH:TICKER]/news` | ETF news |
| `/politicians` | Congressional / politician trade tracker |
| `/sec-filings` | Global SEC filings feed |
| `/news` | Market news feed |
| `/docs` | API / developer documentation |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |

### Authenticated / gated (Disallowed in robots.txt)
| Route | Purpose |
|---|---|
| `/dashboard` | Authenticated dashboard |
| `/account` | User account |
| `/settings` | Preferences (theme, notifications, profile) |
| `/billing`, `/payment` | Subscription & checkout |
| `/alerts` | Alert rules management |
| `/watchlist` | Saved tickers / people / institutions |
| `/portfolio` | Connected brokerage portfolio |
| `/reports` | AI-generated research reports |
| `/ai` | AI Filing-Intelligence agent (chat) |
| `/developer` | API keys & usage |
| `/referrals` | Referral program |
| `/admin` | Internal admin |
| `/landing` | Marketing landing variant |
| `/disconnect-demo` | Exit demo mode |

## 5. Feature catalog (by area)

### 5.1 Dashboard
- Market overview: index/movers, top gainers/losers, most active.
- "Signals" feed: notable insider buys/sells, large 13F changes, unusual filings, politician trades.
- Live prices (streaming/polled) via `LivePricesProvider`.
- Watchlist snapshot, recent filings, news highlights.
- Quick search + `⌘K` command palette (jump to any company/insider/institution/ETF/page).

### 5.2 Companies (screener + detail)
- **Screener:** searchable, filterable, sortable table (sector, market cap, exchange, price, change %,
  signal flags). Pagination.
- **Detail overview:** price + chart, key stats, profile, recent signals.
- **Financials:** income statement / balance sheet / cash flow, ratios, period toggles.
- **News:** company-specific news.
- **Filings:** company's SEC filings with AI summaries; filing-type filters (10-K, 10-Q, 8-K, S-1, 4, 13D/G…).
- Watchlist add/remove; create alert from company.

### 5.3 Insiders (Forms 3/4/5)
- Global insider-trade feed (buy/sell, value, shares, price, role, transaction code).
- Filters: buy/sell, transaction value, role (CEO/CFO/Director/10% owner), date range, company.
- Insider profile: identity, roles across companies, full trade history, aggregate buy/sell stats.

### 5.4 Politicians (congressional trading)
- Feed of trades disclosed by members of Congress (chamber, party, ticker, amount range, trade/disclosure date).
- Filters by politician, party, chamber, ticker.
- Politician profile with trade history and performance-style summaries.

### 5.5 Institutions (13F)
- Directory of institutional filers (AUM, # holdings, last filing date).
- Institution profile: top holdings, new/added/reduced/sold-out positions, quarter-over-quarter changes.

### 5.6 ETFs
- ETF screener (issuer, AUM, expense ratio, category, flows).
- ETF detail: overview, holdings/constituents with weights, news.

### 5.7 SEC Filings (global feed)
- Real-time filing stream across all companies.
- Filter by form type, company, date.
- Each filing: AI-generated summary + extracted provisions; link to original on EDGAR.
- Special trackers referenced in marketing: **Right of First Refusal (ROFR)** tracking, **dilution analytics**,
  **deal / financing tracking**, **legal counsel & counterparty intelligence**, **corporate events calendar**,
  **compliance monitoring**.

### 5.8 News
- Aggregated market + company news feed; filter by ticker/topic; sentiment tagging.

### 5.9 AI features
- **Filing-Intelligence Agent** (`/ai`): conversational chat grounded in filings/market data; cites sources.
- **AI summaries** on every filing.
- **AI research reports** (`/reports`): on-demand generated deep-dive reports per company/theme.

### 5.10 Watchlist & Alerts
- **Watchlist** (`/watchlist`): save companies, insiders, institutions, ETFs.
- **Alerts** (`/alerts`): rule-based notifications (new insider buy on watched ticker, new 13F change,
  new filing of type X, price thresholds, politician trade). Delivery via in-app, web push, and/or email.

### 5.11 Portfolio
- Connect brokerage account (read-only) to track holdings against signals & filings.

### 5.12 Developer / API
- REST API at `api.signal8.ai`; API keys & usage dashboard (`/developer`); docs at `/docs`.
- API access gated to higher plan tiers.

### 5.13 Account / Billing / Settings
- Auth (access-code/invite gate), account profile, settings (notifications, theme is locked dark).
- Subscription tiers: **Free → Starter → Professional → Enterprise**. Stripe-style checkout
  (`/billing`, `/payment`). 30-day notice on price changes (per ToS).
- **Referrals** program (`/referrals`).

### 5.14 Platform / cross-cutting
- Forced dark theme; responsive; PWA + web push; cookie consent; demo mode; feature flags; command palette;
  GTM analytics; SEO (sitemaps, OpenGraph/Twitter cards, per-entity dynamic OG images).
- Legal: Terms, Privacy, and an "informational/research only — not investment advice" disclaimer.

## 6. Completeness review (checklist used to verify the rebuild)

- [ ] Dark theme + Inter/JetBrains Mono + brand logo
- [ ] Global sidebar/top nav with all 9 sections + ⌘K command palette
- [ ] Dashboard with movers + signals feed + live-price treatment + watchlist snapshot
- [ ] Companies screener + 4 detail tabs (overview/financials/news/filings)
- [ ] Insiders feed + insider profile
- [ ] Politicians feed + politician profile
- [ ] Institutions directory + institution (13F) profile
- [ ] ETFs screener + detail (overview/holdings/news)
- [ ] SEC Filings global feed + filing detail with AI summary
- [ ] News feed
- [ ] AI agent chat (`/ai`) + AI reports (`/reports`)
- [ ] Watchlist + Alerts
- [ ] Portfolio (brokerage connect placeholder)
- [ ] Developer (API keys/usage) + Docs
- [ ] Pricing (Free/Starter/Professional/Enterprise) + billing placeholders
- [ ] Account / Settings / Referrals
- [ ] Access-code gate + demo mode
- [ ] Terms / Privacy / disclaimer / cookie consent
- [ ] SEO: sitemap, robots, OG images
