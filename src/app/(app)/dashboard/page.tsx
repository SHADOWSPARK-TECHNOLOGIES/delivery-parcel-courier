import Link from 'next/link';
import { ADDRESS_BOOK, DASHBOARD_INVOICES, SHIPMENTS, TICKETS } from '@/data/fixtures';
import { formatNgn } from '@/lib/format';
import { StatusBadge } from '@/components/ui/badge';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Shipment history, address book and invoices for your ShadowSpark Courier account.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Recent shipments</h2>
          <div className="space-y-2">
            {SHIPMENTS.slice(0, 8).map((s) => (
              <Link key={s.id} href={`/track/${s.trackingId}`} className="glass flex items-center justify-between rounded-xl p-4 hover:shadow-glow">
                <div>
                  <div className="font-mono text-sm text-cyan">{s.trackingId}</div>
                  <div className="mt-0.5 text-xs text-muted">{s.itemType} · {s.pickup.zone} → {s.dropoff.zone}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-ink">{formatNgn(s.priceNgn)}</span>
                  <StatusBadge status={s.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-purple">Address book</h2>
            <div className="space-y-2">
              {ADDRESS_BOOK.map((a) => (
                <div key={a.id} className="rounded-xl border border-line p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{a.label}</span>
                    <span className="font-mono text-[10px] text-dim">{a.zone}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{a.name} · {a.phone}</p>
                  <p className="text-xs text-muted">{a.street}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">Invoices</h2>
            <div className="space-y-2">
              {DASHBOARD_INVOICES.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-xl border border-line p-3 text-sm">
                  <div>
                    <div className="font-mono text-ink">{inv.id}</div>
                    <div className="text-xs text-muted">{inv.trackingId} · {inv.issued}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-ink">{formatNgn(inv.amountNgn)}</div>
                    <span className={inv.status === 'paid' ? 'text-xs text-emerald-300' : 'text-xs text-amber'}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
