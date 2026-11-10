'use client';

import * as React from 'react';
import { formatNgn } from '@/lib/format';

export function EarningsEstimator() {
  const [trips, setTrips] = React.useState('10');
  const [avg, setAvg] = React.useState('1500');
  const daily = (Number(trips) || 0) * (Number(avg) || 0);
  const weekly = daily * 6;
  const monthly = weekly * 4.3;
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan">Earnings estimator</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-dim">Trips / day</span>
          <input type="number" value={trips} onChange={(e) => setTrips(e.target.value)} className="h-10 w-full rounded-lg border border-line bg-surface/70 px-3 text-sm text-ink outline-none focus:border-cyan" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-dim">Avg fare (₦)</span>
          <input type="number" value={avg} onChange={(e) => setAvg(e.target.value)} className="h-10 w-full rounded-lg border border-line bg-surface/70 px-3 text-sm text-ink outline-none focus:border-cyan" />
        </label>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ['Daily', daily],
          ['Weekly', weekly],
          ['Monthly', monthly],
        ].map(([label, val]) => (
          <div key={label} className="rounded-lg border border-line p-2">
            <div className="font-mono text-sm font-bold text-cyan">{formatNgn(Number(val))}</div>
            <div className="text-[10px] uppercase tracking-widest text-dim">{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Estimate only — actual earnings vary with zone and service mix. You keep 100% of tips.
      </p>
    </div>
  );
}
