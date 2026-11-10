# ShadowSpark Courier — Parcel & Courier (Nigeria)

Instant quotes, live tracking and smart dispatch for parcels across Nigeria — Lagos to Kano and
everywhere between. Cyberpunk-neon brand, prices in ₦, and a working AI assistant on every page.

Part of the ShadowSpark delivery-platform suite (see `../delivery-ai-agents-common`).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 · ESLint 8 · Prisma 5 · pnpm.

## Features

- **Landing with instant quote widget** — pickup/dropoff zone, weight, urgency → real ₦ price + ETA
  in two seconds (deterministic engine, same numbers everywhere).
- **Send flow** — 4-step booking: sender/recipient, parcel (fragile, value), zones + service,
  review with live quote → generates a tracking ID.
- **Track** — enter a tracking ID (e.g. `SSK-1001`): live map + timeline + driver + support tickets.
- **Pricing** — full zone-based table across 6 cities / 12 zones (Lagos mainland · island · interstate).
- **Drivers** — recruitment page + earnings estimator.
- **Business** — B2B API + bulk-send pitch with example payloads.
- **Dashboard** — shipment history, address book, invoices.
- **AI assistant** (floating, every page) — instant quote, tracking, reroute ("deliver to my office"),
  damage/escalation tickets, nearest-driver dispatch, "talk to a human". Built on
  `delivery-ai-agents-common`.

## Quick start

```bash
pnpm install
cp .env.example .env          # fill in what you need
pnpm dev                      # http://localhost:3000
```

## AI assistant — how it works

`src/app/api/chat/route.ts` runs the shared SDK agent with all four tool domains (order/map/pricing/
dispatch) plus custom vertical tools (`trackShipment`, `escalateIssue`), all wired to the typed
fixtures and the deterministic quote engine. Without `OPENAI_API_KEY` it uses the bundled
rule-based `MockLLM` and genuinely answers quotes, tracking, reroutes and damage reports offline.
Setting the key swaps in a real LLM (see `createRealOrMockLLM` in `src/lib/agent.ts`).

## Database

`prisma/schema.prisma` (Customer, Shipment, Driver, Zone, PricingRule, Ticket, Invoice) validates
with `pnpm db:validate`. The **build never connects to a database** — pages render from
`src/data/fixtures.ts` + `src/data/pricing.ts`. Real backend:

```bash
pnpm db:generate && pnpm db:seed   # needs a reachable DATABASE_URL
```

## Env vars (see `.env.example`)

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres/Neon — prisma generate/seed only |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | Real LLM for `/api/chat` (optional) |
| `PAYSTACK_SECRET_KEY` | Live Paystack checkout (demo mode without) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Client-side Paystack presence |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Live maps (static placeholder without) |

## Gates

```bash
pnpm tsc --noEmit && pnpm lint && pnpm build
```

## License
MIT — ShadowSpark Technologies, Owerri, Nigeria.
