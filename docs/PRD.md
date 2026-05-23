# Trad3wise — Product Requirements Document

**Version:** 1.0 (scaffold)
**Date:** 2026-05-23
**One-liner:** *Filings in. Signals out.* — a financial intelligence platform that turns SEC filings and
market data into actionable signals, with AI summaries, a filing-intelligence chat agent, watchlists,
alerts, and a developer API.

> Trad3wise is a functional clone of the Signal8 product. See `docs/FEATURES.md` for the full
> reverse-engineered feature catalog this PRD is based on.

---

## 1. Goals & non-goals

### Goals
1. Recreate the full information architecture and feature surface of the reference product.
2. Ship a working, deployable Next.js app (Vercel) with a clean data-provider abstraction so real data
   sources can be swapped in later without rewriting UI.
3. Dark, fast, finance-grade UI (Inter + JetBrains Mono, dense tables, charts, command palette).
4. AI features that run on the Anthropic Claude API.
5. Clearly enumerate every external account/API the operator must provision (`docs/SETUP.md`).

### Non-goals (for the scaffold)
- Production-grade real-time market data feed (mock/seed data ships first; real feeds are pluggable).
- Full payment processing & PCI scope (Stripe is wired as a placeholder).
- Real brokerage account linking (UI + provider stub only).
- Regulatory/compliance certification. The app shows an "informational only, not investment advice" disclaimer.

## 2. Target users
- **Retail/active traders** wanting fast, structured insider/institutional/political signals.
- **Analysts & PMs** who need filing summaries and screeners.
- **Developers/quants** consuming the REST API.

## 3. Personas → top jobs-to-be-done
| Persona | JTBD |
|---|---|
| Active trader | "Alert me when an insider buys a stock on my watchlist." |
| Analyst | "Summarize this 10-K's risk factors and dilution language in seconds." |
| PM | "Show me what hedge fund X added last quarter (13F)." |
| Developer | "Pull insider transactions for a ticker via API." |

## 4. Functional requirements

### 4.1 Navigation & shell
- Persistent sidebar (desktop) + responsive mobile nav with all sections.
- Global command palette (`⌘K` / `Ctrl+K`): search entities and jump to routes.
- Forced dark theme. Brand mark "Trad3wise".
- Cookie-consent banner; "not investment advice" disclaimer in footer.

### 4.2 Dashboard (`/`)
- Index/movers strip, top gainers/losers/most-active.
- "Signals" feed combining insider buys/sells, large 13F moves, politician trades, notable filings.
- Watchlist snapshot, latest filings, news highlights.

### 4.3 Companies (`/companies`, `/companies/[ticker]/{,financials,news,filings}`)
- Screener: search + filters (sector, exchange, market-cap band, signal flags), sortable, paginated.
- Detail: price chart + key stats + profile; tabs for Financials, News, Filings (with AI summaries).
- Add to watchlist; create alert.

### 4.4 Insiders (`/insiders`, `/insiders/[slug]`)
- Feed of Form 3/4/5 transactions with filters (buy/sell, role, value, date).
- Profile: roles, full history, aggregate stats.

### 4.5 Politicians (`/politicians`, `/politicians/[slug]`)
- Congressional trade feed; filters (party, chamber, ticker); profile pages.

### 4.6 Institutions (`/institutions`, `/institutions/[slug]`)
- 13F filer directory; profile with top/new/added/reduced/sold-out holdings + QoQ deltas.

### 4.7 ETFs (`/etfs`, `/etfs/[ticker]/{,holdings,news}`)
- Screener; detail with holdings (weights) and news.

### 4.8 SEC Filings (`/sec-filings`, `/sec-filings/[id]`)
- Global filing feed; filter by form type/company/date.
- Filing detail: AI summary + extracted provisions + link to EDGAR.
- Specialized lenses: ROFR, dilution, deals/financing, counsel/counterparty, events calendar, compliance.

### 4.9 News (`/news`)
- Aggregated feed; filter by ticker/topic; sentiment tag.

### 4.10 AI (`/ai`, `/reports`)
- Chat agent grounded in entity/filing context; streamed responses; source citations.
- On-demand AI research reports per company/theme; saved to `/reports`.

### 4.11 Watchlist & Alerts (`/watchlist`, `/alerts`)
- Watch companies/insiders/institutions/ETFs.
- Alert rules (insider buy, 13F change, new filing type, price threshold, politician trade) with
  delivery channels (in-app, web push, email).

### 4.12 Portfolio (`/portfolio`)
- Connect brokerage (provider stub); show holdings vs. signals.

### 4.13 Developer & Docs (`/developer`, `/docs`)
- API key issuance + usage; REST endpoints documented; tier-gated.

### 4.14 Account, Billing, Settings, Referrals
- Auth via access-code/invite gate + demo mode.
- Plans: Free / Starter / Professional / Enterprise; checkout placeholder; manage subscription.
- Settings (notifications, profile). Referral program.

## 5. Non-functional requirements
- **Performance:** SSR/streaming; entity pages cached/ISR. Lighthouse ≥ 90 on marketing/public pages.
- **Accessibility:** keyboard-navigable, semantic tables, focus states.
- **SEO:** sitemaps, robots, dynamic OG images, structured nav.
- **Observability:** GTM/analytics hook; error boundaries; chunk-load recovery.
- **Security:** API keys hashed; rate limiting on API; secrets via env; read-only brokerage scopes.
- **Data abstraction:** every data read goes through `src/lib/data/*` providers; swap mock→real per env.

## 6. Data model (core entities)
`Company, Quote, Financials, Filing, InsiderTransaction, Insider, PoliticianTrade, Politician,
Institution, Holding (13F), ETF, ETFHolding, NewsArticle, Signal, WatchlistItem, AlertRule, Report,
User, ApiKey, Subscription`.

## 7. Subscription tiers (target)
| Tier | Price (placeholder) | Highlights |
|---|---|---|
| Free | $0 | Delayed data, limited screeners, 1 watchlist, no AI/API |
| Starter | $29/mo | Real-time signals, alerts, full screeners, limited AI |
| Professional | $99/mo | Full AI agent + reports, API access, unlimited alerts/watchlists |
| Enterprise | Custom | SLA, higher API limits, team seats, custom data |

## 8. Success metrics
- Activation: % of signups that create a watchlist + 1 alert in week 1.
- Engagement: weekly active screener/feed sessions; AI messages per user.
- Conversion: Free→paid; API key activation rate.

## 9. Milestones
1. **M1 Scaffold (this repo):** all routes, dark UI, command palette, mock data, AI endpoint, docs.
2. **M2 Real data:** EDGAR + market-data + news + politician providers.
3. **M3 Accounts:** auth, DB, watchlists/alerts persistence, email/push delivery.
4. **M4 Monetization:** Stripe billing, tier gating, developer API + rate limits.
5. **M5 Portfolio & polish:** brokerage linking, reports, performance/SEO hardening.
