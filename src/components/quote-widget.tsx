'use client';

import * as React from 'react';
import { computeQuote, normalizeZoneLabel } from '@/lib/pricing';
import { URGENCY_BANDS, ZONES } from '@/data/pricing';
import { formatNgn, formatEta } from '@/lib/format';
import { Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function QuoteWidget() {
  const [from, setFrom] = React.useState('Lagos Mainland');
  const [to, setTo] = React.useState('Lagos Island');
  const [weight, setWeight] = React.useState('3');
  const [urgency, setUrgency] = React.useState<'standard' | 'express' | 'instant'>('standard');
  const [fragile, setFragile] = React.useState(false);

  const quote = React.useMemo(() => {
    try {
      return computeQuote(
        { pickupZone: normalizeZoneLabel(from), dropoffZone: normalizeZoneLabel(to), weightKg: Number(weight) || 1, urgency },
        { fragile },
      );
    } catch {
      return null;
    }
  }, [from, to, weight, urgency, fragile]);

  return (
    <div className="glass w-full max-w-md rounded-2xl p-6">
      <div className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan">Instant quote</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-dim">Pickup zone</span>
          <Select value={from} onChange={(e) => setFrom(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-dim">Dropoff zone</span>
          <Select value={to} onChange={(e) => setTo(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </Select>
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-dim">Weight (kg)</span>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-10 w-full rounded-lg border border-line bg-surface/70 px-3 text-sm text-ink outline-none focus:border-cyan"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-dim">Service</span>
          <Select value={urgency} onChange={(e) => setUrgency(e.target.value as typeof urgency)}>
            {URGENCY_BANDS.map((b) => (
              <option key={b.code} value={b.code}>{b.icon} {b.label}</option>
            ))}
          </Select>
        </label>
      </div>
      <button
        onClick={() => setFragile((f) => !f)}
        className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${fragile ? 'border-cyan text-cyan' : 'border-line text-muted'}`}
      >
        <span className={`grid h-4 w-4 place-items-center rounded ${fragile ? 'bg-cyan text-bg' : 'bg-white/5'}`}>
          {fragile && '✓'}
        </span>
        Fragile (+₦500)
      </button>

      <div className="mt-5 rounded-xl border border-line bg-surface/50 p-4">
        {quote ? (
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-3xl font-bold text-cyan">{formatNgn(quote.priceNgn)}</div>
              <div className="mt-1 text-xs text-muted">
                {quote.serviceLabel} · ~{formatEta(quote.etaMinutes)} · {quote.distanceKm} km
              </div>
            </div>
            <Button size="sm" className="mb-0.5">Book</Button>
          </div>
        ) : (
          <p className="text-sm text-muted">Choose zones to see a price.</p>
        )}
      </div>
    </div>
  );
}
