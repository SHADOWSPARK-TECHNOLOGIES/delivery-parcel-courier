import { quoteMatrix, computeQuote, normalizeZoneLabel } from '@/lib/pricing';
import { URGENCY_BANDS, ZONES } from '@/data/pricing';
import { formatNgn, formatEta } from '@/lib/format';

export default function PricingPage() {
  const bands = URGENCY_BANDS;
  const rows = quoteMatrix();
  // build a combined table keyed by route
  const routes = rows[0].rows.map((r) => r.from);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Zone-based pricing</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Deterministic ₦ quotes (5 kg sample). Same engine drives the landing quote widget and the AI
        assistant — numbers always match. Add weight increments or mark fragile for a fresh total.
      </p>

      {routes.map((from, idx) => {
        const group = bands.map((b) => {
          const to = rows[0].rows[idx].to;
          const q = computeQuote(
            { pickupZone: normalizeZoneLabel(from), dropoffZone: normalizeZoneLabel(to), weightKg: 5, urgency: b.code },
            { fragile: true },
          );
          return { to, q };
        });
        return (
          <div key={from} className="mt-8">
            <h2 className="mb-2 font-mono text-sm uppercase tracking-widest text-cyan">From {from}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.map(({ to, q }) => (
                <div key={to + q.service} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink">{to}</span>
                    <span className="font-mono text-[10px] text-dim">{q.distanceKm} km</span>
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <span className="font-mono text-xl font-bold text-cyan">{formatNgn(q.priceNgn)}</span>
                    <span className="text-xs text-muted">~{formatEta(q.etaMinutes)}</span>
                  </div>
                  <div className="mt-1 text-xs text-purple">{q.serviceLabel}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-10 glass rounded-2xl p-5 text-sm text-muted">
        <div className="mb-1 font-mono text-xs uppercase tracking-widest text-cyan">Pricing model</div>
        <p>
          base (per city) + distance charge + weight (₦120/kg) + zone coverage multiplier + urgency
          multiplier (±. Include extra labels). Fragile adds ₦500. Inter-city legs use a fixed distance
          matrix; ETA = handle time + distance × minutes-per-km for the service level.
        </p>
      </div>
    </div>
  );
}
