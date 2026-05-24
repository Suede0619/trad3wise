# Trad3wise — Accounts & APIs You Need to Set Up

This is the checklist of external services to provision. The scaffold runs with **none** of these (it uses
mock data and degrades gracefully), but each one unlocks real functionality. Add the keys to a `.env.local`
file locally and to **Vercel → Project → Settings → Environment Variables** for deploys.

Legend: ✅ free tier exists · 💳 paid · 🔑 needs API key · ⚙️ needs config only

---

## Tier 0 — already in place
- **Vercel account** + this project linked to `github.com/Suede0619/trad3wise` (deploy target).
- **GitHub repo** `Suede0619/trad3wise` (✅ done, you authorized `gh`).

## Tier 1 — AI features (Claude Code CLI, NOT the Anthropic API)
AI (the filing-intelligence chat agent, filing deep-dives, and research reports) runs on the **local
Claude Code CLI** (`claude` binary) in headless mode — **no `ANTHROPIC_API_KEY`, no API billing**.

| Requirement | Why | Env var | Notes |
|---|---|---|---|
| **Claude Code CLI** ✅ | Powers all AI features via `claude -p` (headless) | `CLAUDE_MODEL` (default `sonnet`), optional `CLAUDE_CLI_PATH`, `CLAUDE_TIMEOUT_MS` | The `claude` CLI must be **installed + authenticated** on the machine running the Next.js server. Works with `pnpm dev` / `pnpm start` / any self-hosted box. **It is NOT available on Vercel's serverless runtime**, so on the Vercel deploy the AI routes return a clearly-labeled demo reply — run the app locally or self-host for live AI. |

## Tier 2 — core financial data
| Service | Why | Env var | Notes |
|---|---|---|---|
| **SEC EDGAR** ✅⚙️ **(WIRED — LIVE)** | SEC filings, Forms 3/4/5 (insiders), 13F (institutions), full-text search, XBRL financials | `SEC_USER_AGENT` | No key needed. **Already integrated**: (1) global SEC Filings feed + dashboard (latest filings, cached 5 min); (2) per-company filings tab + overview (submissions API, cached 1h); (3) company financials tab (real XBRL company-facts, cached 24h); (4) per-company insider transactions (real **Form 4 XML** parsing, cached 1–24h); (5) institution profiles (real **13F-HR information table** holdings via name→CIK search, cached 1–24h). All fall back to sample data if unreachable. Set `SEC_USER_AGENT` (e.g. `Trad3wise you@domain.com`); rate-limit ~10 req/s. `EDGAR_LIVE=off` forces sample data. |
| **Market data** 🔑💳 **(WIRED — add key to activate)** | Real-time/delayed quotes for the screener, dashboard movers & ticker strip | `MARKETDATA_API_KEY` (+ optional `MARKETDATA_BASE_URL`) | Provider client lives in `src/lib/providers/marketdata.ts` (default vendor **Financial Modeling Prep**: `/quote/{symbols}`). Add the key and the companies screener + dashboard switch to "Live quotes"; otherwise they show sample prices. Alt vendors: Polygon, Finnhub (✅ free), Tiingo, Alpha Vantage — point `MARKETDATA_BASE_URL` and adjust the client. |
| **News** 🔑 **(WIRED — add key to activate)** | Market news feed (News page + dashboard) | `NEWS_API_KEY` (+ optional `NEWS_BASE_URL`) | Client in `src/lib/providers/news.ts` (default vendor **Finnhub** `/news?category=general`). Add the key → "Live feed"; else sample data. Alt: Marketaux, NewsAPI.org. |
| **Congressional / politician trades** 🔑💳 **(WIRED — add key to activate)** | Politicians page | `POLITICIAN_API_KEY` (+ optional `POLITICIAN_BASE_URL`) | Client in `src/lib/providers/politicians.ts` (default vendor **Finnhub** congressional-trading; may be premium). Add the key → "Live feed"; else sample data. Alt: Quiver Quantitative. |

## Tier 3 — accounts, persistence, delivery
| Service | Why | Env var(s) | Notes |
|---|---|---|---|
| **Database (Postgres)** ✅💳 | Users, watchlists, alerts, reports, API keys, usage | `DATABASE_URL` | **Neon**, **Supabase**, or **Vercel Postgres**. Use with Prisma or Drizzle. |
| **Auth** ✅💳 | Sign-in, access-code/invite gate, sessions | provider-specific | **Clerk** (`CLERK_*`) or **Auth.js/NextAuth** (`AUTH_SECRET`, OAuth client IDs). |
| **Email** ✅🔑 | Alert emails, transactional | `RESEND_API_KEY` | **Resend** (✅) or Postmark. Set a verified sending domain. |
| **Web Push (VAPID)** ✅⚙️ | Browser push alerts (PWA) | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | Generate with `web-push generate-vapid-keys`. |
| **Redis / rate-limit** ✅ | API rate limiting, caching, live-price fan-out | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | **Upstash** (✅ serverless Redis). |

## Tier 4 — monetization & integrations
| Service | Why | Env var(s) | Notes |
|---|---|---|---|
| **Stripe** ✅🔑 | Subscriptions (Free/Starter/Pro/Enterprise), checkout, billing portal, webhooks | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Create products/prices for each tier. |
| **Brokerage linking** 💳 | Portfolio: read-only holdings | provider-specific | **SnapTrade** (multi-broker) or **Plaid Investments**. |
| **Analytics** ✅⚙️ | Usage analytics / tag manager | `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID, or use Vercel Analytics (zero-config). |

---

## Minimal `.env.local` to start
Copy `.env.example` → `.env.local` and fill what you have. Nothing is required — AI uses your local
`claude` CLI and SEC EDGAR is already live; everything else falls back to mock data.

```bash
# AI = local Claude Code CLI (no API key). Run locally/self-hosted for live AI.
CLAUDE_MODEL=sonnet
SEC_USER_AGENT="Trad3wise youremail@example.com"
MARKETDATA_API_KEY=
NEWS_API_KEY=
POLITICIAN_API_KEY=
DATABASE_URL=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GTM_ID=
ACCESS_CODE=demo            # access-code gate; "demo" enables demo mode
```

## Recommended order to provision
1. **Claude Code CLI** — already gives you AI when running locally/self-hosted (no key).
2. **SEC EDGAR User-Agent** (free) + **one market-data key** — unlocks the core screeners/financials.
3. **News** + **politician** data.
4. **Postgres + Auth** — when you want real accounts/persistence.
5. **Stripe** — when you want to charge.
6. **Redis, Email, Push, Brokerage, Analytics** — as features come online.
