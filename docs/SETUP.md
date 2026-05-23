# Trad3wise — Accounts & APIs You Need to Set Up

This is the checklist of external services to provision. The scaffold runs with **none** of these (it uses
mock data and degrades gracefully), but each one unlocks real functionality. Add the keys to a `.env.local`
file locally and to **Vercel → Project → Settings → Environment Variables** for deploys.

Legend: ✅ free tier exists · 💳 paid · 🔑 needs API key · ⚙️ needs config only

---

## Tier 0 — already in place
- **Vercel account** + this project linked to `github.com/Suede0619/trad3wise` (deploy target).
- **GitHub repo** `Suede0619/trad3wise` (✅ done, you authorized `gh`).

## Tier 1 — to make AI features real (do this first)
| Service | Why | Env var | Notes |
|---|---|---|---|
| **Anthropic (Claude API)** 🔑💳 | AI filing-intelligence chat agent, filing summaries, research reports | `ANTHROPIC_API_KEY` | Get from console.anthropic.com. Without it, AI returns a clearly-labeled demo response. Model: `claude-opus-4-7` (or `claude-sonnet-4-6` for cheaper). |

## Tier 2 — core financial data
| Service | Why | Env var | Notes |
|---|---|---|---|
| **SEC EDGAR** ✅⚙️ **(WIRED — LIVE)** | SEC filings, Forms 3/4/5 (insiders), 13F (institutions), full-text search | `SEC_USER_AGENT` | No key needed. **Already integrated**: the SEC Filings page + dashboard pull the live EDGAR feed (cached 5 min) and fall back to sample data if unreachable. Set `SEC_USER_AGENT` (e.g. `Trad3wise you@domain.com`) so traffic identifies itself; rate-limit ~10 req/s. Set `EDGAR_LIVE=off` to force sample data. |
| **Market data** 🔑💳 (pick one) | Real-time/delayed quotes, OHLC, fundamentals/financials, ETF holdings | `MARKETDATA_API_KEY` | Options: **Financial Modeling Prep** (easiest, has financials + ETF holdings), **Polygon.io**, **Finnhub** (✅ free tier), **Tiingo**, **Alpha Vantage** (✅). |
| **News** 🔑 (pick one) | Market + company news feed, sentiment | `NEWS_API_KEY` | Options: **Marketaux** (✅ finance-focused), **Finnhub news**, **NewsAPI.org**, **Benzinga** (💳). |
| **Congressional / politician trades** 🔑💳 | Politicians page | `POLITICIAN_API_KEY` | Options: **Quiver Quantitative API**, **Capitol Trades** (scrape/partner), or parse House/Senate PTR disclosures directly (free but messy). |

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
Copy `.env.example` → `.env.local` and fill what you have. The only one needed for a meaningful demo is
`ANTHROPIC_API_KEY` (everything else falls back to mock data).

```bash
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-opus-4-7
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
1. **Anthropic** — unlocks AI immediately.
2. **SEC EDGAR User-Agent** (free) + **one market-data key** — unlocks the core screeners/financials.
3. **News** + **politician** data.
4. **Postgres + Auth** — when you want real accounts/persistence.
5. **Stripe** — when you want to charge.
6. **Redis, Email, Push, Brokerage, Analytics** — as features come online.
