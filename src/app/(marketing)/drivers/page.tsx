import { DRIVERS } from '@/data/fixtures';
import { formatNgn } from '@/lib/format';
import { EarningsEstimator } from '@/components/earnings-estimator';

export default function DriversPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Ride with ShadowSpark</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Drive a motorcycle, van or truck and set your own hours. Guaranteed base on express/instant
        orders, weekly payouts, and a worldwide-grade dispatch board.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Sample riders on the network</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {DRIVERS.map((d) => (
              <div key={d.id} className="glass rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg font-mono text-sm font-bold text-bg" style={{ background: d.avatarHue }}>
                    {d.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{d.name}</div>
                    <div className="text-xs text-muted">{d.vehicle} · {d.zone}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-amber">{d.rating.toFixed(1)}★ · {d.trips.toLocaleString()} trips</span>
                  <span className="font-mono text-cyan">{formatNgn(d.earningsNgn)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <EarningsEstimator />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ['Requirements', 'Valid national ID, riding licence, smartphone, and a clean record.'],
          ['Weekly payout', 'Payments every Friday to your bank or wallet — no late drama.'],
          ['Support', '24/7 dispatch + a dedicated ops line for every rider.'],
        ].map(([t, d]) => (
          <div key={t} className="glass rounded-2xl p-5">
            <div className="font-semibold text-ink">{t}</div>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
