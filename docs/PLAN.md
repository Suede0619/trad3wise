# Trad3wise — Implementation Plan

A phased, step-by-step plan. Phase 0–3 are built in this scaffold; Phase 4+ are the path to production.

## Tech stack
- **Next.js 16** (App Router, RSC, Server Actions) + **TypeScript**
- **Tailwind CSS v4** + a small shadcn-style UI kit (`cva`, `tailwind-merge`, `lucide-react`)
- **recharts** for charts, **cmdk** for the command palette, **date-fns** for dates
- **Claude Code CLI** (headless `claude -p`) for AI agent, summaries, reports — no API key
- Data-provider abstraction in `src/lib/data/` (mock now → real later)
- Deploy on **Vercel**; repo `github.com/Suede0619/trad3wise`

## Directory shape
```
src/
  app/
    (app)/                 # dashboard shell layout group
      layout.tsx           # sidebar + topbar + command palette + providers
      page.tsx             # Dashboard
      companies/           # screener + [ticker]/{financials,news,filings}
      insiders/            # feed + [slug]
      politicians/         # feed + [slug]
      institutions/        # directory + [slug]
      etfs/                # screener + [ticker]/{holdings,news}
      sec-filings/         # feed + [id]
      news/
      ai/                  # chat agent
      reports/
      watchlist/
      alerts/
      portfolio/
      developer/
      settings/ account/ billing/ referrals/
    (marketing)/           # pricing, docs, terms, privacy (public)
    api/
      ai/chat/route.ts     # Claude-backed chat (streams)
      ai/summary/route.ts  # filing summary
    layout.tsx globals.css opengraph-image.tsx robots.ts sitemap.ts
  components/
    ui/                    # button, card, badge, input, table, tabs, etc.
    layout/                # sidebar, topbar, command-palette, footer
    charts/ , data/        # reusable chart + table components
  lib/
    data/                  # providers (mock + interfaces)
    mock/                  # seed generators
    types.ts utils.ts ai.ts config.ts
```

## Phase 0 — Project setup ✅
1. `create-next-app` (TS, Tailwind, App Router, src dir, alias `@/*`).
2. Install deps (lucide, cva, clsx, tailwind-merge, recharts, cmdk, date-fns, @anthropic-ai/sdk, tw-animate-css).
3. Configure dark theme tokens in `globals.css`; wire Inter + JetBrains Mono in root layout.

## Phase 1 — Design system & shell
4. Build UI kit: `Button, Card, Badge, Input, Tabs, Table, Skeleton, Separator, Avatar, Stat, Sparkline`.
5. Build app shell: collapsible **Sidebar** with all sections, **Topbar** (search, ⌘K, account menu),
   **Footer** (disclaimer + legal links).
6. Build **Command Palette** (`cmdk`) with route + entity actions.
7. Cookie-consent banner; "not investment advice" disclaimer.

## Phase 2 — Data layer (mock)
8. Define domain types in `src/lib/types.ts`.
9. Seed generators in `src/lib/mock/` (companies, quotes, filings, insiders, politicians, institutions,
   ETFs, news, signals) — deterministic, realistic.
10. Provider interfaces in `src/lib/data/` returning typed data; `MOCK` implementation now.

## Phase 3 — Feature pages (mock-backed) ✅ target of this scaffold
11. Dashboard: movers + signals feed + watchlist snapshot + latest filings/news.
12. Companies: screener (filter/sort/paginate) + detail tabs (overview/financials/news/filings).
13. Insiders: feed + profile.
14. Politicians: feed + profile.
15. Institutions: directory + 13F profile.
16. ETFs: screener + detail (holdings/news).
17. SEC Filings: feed + detail with AI summary button.
18. News feed.
19. AI agent chat page → `/api/ai/chat` (Claude streaming; demo fallback if no key).
20. Reports list + generate.
21. Watchlist + Alerts (localStorage-backed in scaffold).
22. Portfolio (connect stub). Developer (API keys mock). Settings/Account/Referrals.
23. Marketing: Pricing (4 tiers), Docs, Terms, Privacy.
24. SEO: `robots.ts`, `sitemap.ts`, OG image.

## Phase 4 — Real data (post-scaffold)
25. SEC EDGAR provider (filings, Forms 3/4/5, 13F) — full-text + submissions API.
26. Market-data provider (quotes, financials) — FMP/Polygon/Finnhub.
27. News provider (Marketaux/Finnhub/Benzinga).
28. Politician-trade provider (Quiver/Capitol Trades).
29. Background ingestion jobs (Vercel Cron) → cache in DB/Redis.

## Phase 5 — Accounts & persistence
30. Auth (Clerk or Auth.js) + access-code gate + demo mode.
31. Database (Postgres: Neon/Supabase) via Prisma/Drizzle; persist watchlists, alerts, reports, keys.
32. Email (Resend) + Web Push for alert delivery; Vercel Cron alert evaluation.

## Phase 6 — Monetization & API
33. Stripe billing + tier gating middleware.
34. Public REST API + API-key auth + Upstash rate limiting; usage metering; `/developer` + `/docs`.

## Phase 7 — Portfolio & hardening
35. Brokerage linking (SnapTrade/Plaid Investments) read-only.
36. Performance (ISR, edge caching), a11y, Lighthouse, error/observability, tests.

## Definition of done for the scaffold
- `pnpm build` succeeds; `pnpm dev` serves every route with no runtime errors.
- Every feature in `docs/FEATURES.md` has a visible page or component.
- AI endpoint works via the local `claude` CLI, degrades gracefully where the CLI is absent.
- Deployed to Vercel from the GitHub remote.
