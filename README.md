# Trad3wise — *Filings in. Signals out.*

A next-generation financial screener built on SEC filings. Track insider trades, institutional flow,
congressional trades, dilution risk, ETF flows, and market movers in real time — with an AI agent that
reads every filing for you.

This is a full, deployable scaffold built with Next.js 16, React 19, Tailwind v4, and the Anthropic
Claude API. It ships with a deterministic **mock data layer** so every screen works out of the box, and
a clean **data-provider seam** for swapping in real sources.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # optional — add ANTHROPIC_API_KEY for live AI
pnpm dev                     # http://localhost:3000
```

The app opens with an access-code gate — click **“Continue in demo mode”** (or enter any code).

## What's inside

| Area | Routes |
|---|---|
| Dashboard | `/` |
| Companies | `/companies`, `/companies/[EXCH:TICKER]/{,financials,filings,news}` |
| Insiders | `/insiders`, `/insiders/[slug]` |
| Politicians | `/politicians`, `/politicians/[slug]` |
| Institutions (13F) | `/institutions`, `/institutions/[slug]` |
| ETFs | `/etfs`, `/etfs/[EXCH:TICKER]/{,holdings,news}` |
| SEC Filings | `/sec-filings`, `/sec-filings/[id]` |
| News | `/news` |
| AI | `/ai` (chat agent), `/reports` |
| Watchlist & Alerts | `/watchlist`, `/alerts` |
| Portfolio | `/portfolio` |
| Developer & Docs | `/developer`, `/docs` |
| Account | `/account`, `/settings`, `/referrals`, `/pricing` |
| Legal | `/terms`, `/privacy` |

Plus: `⌘K` command palette, live ticker strip, dark theme (Inter + JetBrains Mono), cookie consent,
access-code/demo gate, dynamic OG image, robots & sitemap.

## Architecture

- **Data seam** — every page reads through `src/lib/data/`. Today it returns mock data from
  `src/lib/mock/`. Implement the same function signatures against real APIs to go live.
- **AI** — `src/lib/ai.ts` + `/api/ai/*`. Uses Claude when `ANTHROPIC_API_KEY` is set; otherwise returns
  a clearly-labeled demo response.
- **UI kit** — `src/components/ui/` (shadcn-style, hand-rolled), charts in `src/components/charts/`.

## Docs

- `docs/FEATURES.md` — full feature catalog (the spec).
- `docs/PRD.md` — product requirements.
- `docs/PLAN.md` — phased implementation plan.
- `docs/SETUP.md` — **the accounts & APIs you need to provision** (start with Anthropic + SEC EDGAR).

## Deploy

Pushes to `github.com/Suede0619/trad3wise` deploy on Vercel. Add the env vars from `.env.example` in
**Vercel → Settings → Environment Variables**.

> Informational only — not investment advice.
