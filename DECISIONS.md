# DECISIONS.md — delivery-parcel-courier

Documented judgment calls (per the delivery-platform contract §0 rule 1).

1. **Deterministic quote engine is the single source of truth.** `src/lib/pricing.ts` drives the
   landing widget, the pricing page, the send flow AND the AI quote tool — same inputs, same ₦/ETA
   everywhere (the contract requires chat and page numbers to match). Used a fixed inter-city
   distance matrix + base + per-kg + per-km + zone coverage + urgency multiplier, documented in
   the pricing page's "Pricing model" note.

2. **No database at build time (typed fixtures + Prisma schema).** Real Postgres is unavailable
   and `next build` must stay green, so pages render from `src/data/*` and the AI operates on the
   same fixtures. `prisma/schema.prisma` validates; `prisma/seed.ts` is a self-contained,
   alias-free seed runnable via `tsx` once `DATABASE_URL` exists. Documented per contract §9.

3. **Ref token format normalized to `SSK-`/`SSX-`/`SSI-` tracking IDs**, and the shared SDK's
   MockLLM extractor was fixed (in `delivery-ai-agents-common`) to parse whole `ORD-`/`SSK-` style
   refs instead of dropping the prefix — this repo exercises that fix (see `grabOrderId`).

4. **AI brain OFF by default for guaranteed-offline dev**: `createRealOrMockLLM` returns the
   rule-based MockLLM unless a key exists; the real LLM is a one-line env swap (documented). This
   honours "chat must work with no API key" from the contract.

5. **Custom vertical tools** (`trackShipment`, `escalateIssue`) extend the SDK's four tool domains,
   because tracking-a-shipment and damage/recompensation tickets are courier-specific and map
   cleanly onto the fixtures.

6. **Next 15 async `params`/`searchParams` typed as Promises**, and **no named exports on page
   files** (moved `EarningsEstimator` to its own component) — both satisfy the build's Page
   type-checking.

7. **Mapbox/Paystack gated**, ESLint 8 legacy config for non-interactive `next lint`, and
   hand-authored shadcn-style `components/ui/*` (no interactive scaffolders) — same rationale as
   `delivery-food-grocery/DECISIONS.md`.
