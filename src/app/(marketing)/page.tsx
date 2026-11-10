import Link from 'next/link';
import { QuoteWidget } from '@/components/quote-widget';
import { DRIVERS, SHIPMENTS } from '@/data/fixtures';
import { CITIES } from '@/data/pricing';

export default function HomePage() {
  return (
    <div>
      {/* Hero with instant quote widget front & centre */}
      <section className="cyber-grid-bg relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">ShadowSpark · Courier</span>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
              Instant quotes. Live tracking. <span className="cyber-text-grad">Smart dispatch.</span>
            </h1>
            <p className="mt-4 max-w-md text-muted">
              Send a parcel anywhere in Nigeria — Lagos to Kano in one tap. Transparent ₦ pricing,
              real-time ETA, and an AI assistant that reroutes, tracks and resolves damage on the spot.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/send" className="rounded-lg bg-cyan px-6 py-3 text-center font-semibold text-bg hover:shadow-glow">
                Send a parcel
              </Link>
              <Link href="/track" className="rounded-lg border border-line px-6 py-3 text-center font-semibold text-ink hover:border-cyan hover:text-cyan">
                Track a shipment
              </Link>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
              <div className="glass rounded-xl p-3 text-center">
                <div className="font-mono text-2xl font-bold text-cyan">{SHIPMENTS.length}</div>
                <div className="text-xs text-muted">sample shipments</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="font-mono text-2xl font-bold text-purple">{DRIVERS.length}</div>
                <div className="text-xs text-muted">example riders</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="font-mono text-2xl font-bold text-amber">{CITIES.length}</div>
                <div className="text-xs text-muted">cities covered</div>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <QuoteWidget />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-ink">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['01', 'Get an instant quote', 'Pickup, dropoff, weight, urgency — price + ETA in two seconds.'],
            ['02', 'Book & pay', 'Pay online via Paystack or choose cash on delivery.'],
            ['03', 'Track & relax', 'Live map + timeline, driver details, and an AI assistant on standby.'],
          ].map(([n, t, d]) => (
            <div key={n} className="glass rounded-2xl p-5">
              <div className="font-mono text-cyan">{n}</div>
              <div className="mt-2 font-semibold text-ink">{t}</div>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live sample */}
      <section className="border-t border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink">Live on the network</h2>
            <Link href="/track" className="text-sm text-cyan hover:underline">Track shipments →</Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SHIPMENTS.slice(0, 6).map((s) => (
              <Link key={s.id} href={`/track/${s.trackingId}`} className="glass rounded-xl p-4 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cyan">{s.trackingId}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${s.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-cyan/15 text-cyan'}`}>
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="mt-2 truncate text-sm text-ink">{s.itemType}</div>
                <div className="mt-1 text-xs text-muted">
                  {s.pickup.zone} → {s.dropoff.zone}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
