import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findShipment, findDriver, ticketsForShipment } from '@/lib/fixtures';
import { formatNgn, formatEta, statusLabel } from '@/lib/format';
import { MapPlaceholder } from '@/components/map-placeholder';
import { Badge } from '@/components/ui/badge';

type P = { params: Promise<{ id: string }> };

export default async function TrackingDetailPage({ params }: P) {
  const { id } = await params;
  const s = findShipment(id);
  if (!s) notFound();

  const driver = findDriver(s.driverId);
  const tickets = ticketsForShipment(s.trackingId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/track" className="font-mono text-xs text-cyan hover:underline">← track another</Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-ink">{s.trackingId}</h1>
        <Badge tone={s.status === 'delivered' ? 'ok' : s.status === 'exception' ? 'magenta' : s.status === 'cancelled' ? 'dim' : 'cyan'}>
          {statusLabel(s.status)}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted">
        {s.itemType} · {s.weightKg}kg · {s.service} service · {formatNgn(s.priceNgn)}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Left: timeline + details */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan">Timeline</div>
            <ol className="space-y-0">
              {s.timeline.map((ev, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${ev.done ? 'bg-cyan/20 text-cyan' : 'bg-white/5 text-dim'}`}>
                      {ev.icon}
                    </div>
                    {i < s.timeline.length - 1 && <div className={`h-6 w-px ${ev.done ? 'bg-cyan/40' : 'bg-white/10'}`} />}
                  </div>
                  <div className="pb-5">
                    <div className={`text-sm ${ev.done ? 'text-ink' : 'text-dim'}`}>{ev.label}</div>
                    <div className="font-mono text-[11px] text-dim">{ev.time}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan">Parcel</div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-dim">Item</dt><dd className="text-ink">{s.itemType}</dd></div>
              <div><dt className="text-xs text-dim">Value</dt><dd className="font-mono text-ink">{formatNgn(s.itemValueNgn)}</dd></div>
              <div><dt className="text-xs text-dim">Weight</dt><dd className="font-mono text-ink">{s.weightKg} kg</dd></div>
              <div><dt className="text-xs text-dim">Fragile</dt><dd className="text-ink">{s.fragile ? 'Yes +₦500' : 'No'}</dd></div>
              <div><dt className="text-xs text-dim">ETA</dt><dd className="font-mono text-cyan">{formatEta(s.etaMinutes)}</dd></div>
            </dl>
          </div>
        </div>

        {/* Right: map + driver + tickets */}
        <div className="space-y-4">
          <MapPlaceholder label={s.trackingId} zones={[s.pickup.zone, s.dropoff.zone]} className="h-56" />

          <div className="glass rounded-2xl p-5">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-cyan">Ride</div>
            <div className="text-sm text-ink">{s.pickup.zone} → {s.dropoff.zone}</div>
            <div className="mt-1 text-xs text-muted">pickup land {s.pickup.landmark || '—'} · {s.pickup.street}</div>
            {driver ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-line p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg text-xs font-bold text-bg" style={{ background: driver.avatarHue }}>
                  {driver.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{driver.name}</div>
                  <div className="text-xs text-muted">{driver.vehicle} · {driver.plate} · {driver.rating.toFixed(1)}★</div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted">Driver assigning shortly.</p>
            )}
          </div>

          {tickets.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-widest text-amber">Support tickets</div>
              {tickets.map((t) => (
                <div key={t.id} className="mb-2 rounded-xl border border-line/60 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber">{t.id}</span>
                    <span className="text-dim">{t.status} · {t.severity}</span>
                  </div>
                  <p className="mt-1 text-muted">{t.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
