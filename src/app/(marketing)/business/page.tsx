import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function BusinessPage() {
  const endpoints = [
    ['POST', '/v1/quotes', 'Compute a quote for a route + weight + urgency'],
    ['POST', '/v1/bookings', 'Create a shipment and get a tracking id'],
    ['GET', '/v1/shipments/:id', 'Live status + ETA for a shipment'],
    ['POST', '/v1/shipments/bulk', 'Create up to 5,000 shipments from one CSV payload'],
    ['POST', '/v1/webhooks', 'Subscribe to delivery events (picked_up, delivered, exception)'],
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">ShadowSpark Courier · B2B</span>
      <h1 className="mt-2 max-w-3xl text-4xl font-bold text-ink">Courier as an API.</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Hooks into the same network that powers our app. Instant quotes, programmatic booking, webhook
        tracking events, and bulk send for high-volume shippers across Nigeria.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Try it</h2>
          <div className="glass overflow-hidden rounded-xl">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2 font-mono text-[11px] text-dim">
              <span className="h-2.5 w-2.5 rounded-full bg-magenta" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan" />
              <span className="ml-2">POST /v1/quotes</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-ink">
{`{
  "pickup": "Ikeja, Lagos",
  "dropoff": "Central Abuja",
  "weightKg": 4.2,
  "urgency": "express",
  "fragile": true
}
→
{
  "priceNgn": 18400,
  "etaMinutes": 118,
  "service": "express",
  "trackingPrefix": "SSX"
}`}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-cyan">Endpoints</h2>
          <div className="space-y-2">
            {endpoints.map(([m, path, desc]) => (
              <div key={path} className="glass flex items-center gap-3 rounded-xl px-3 py-2.5">
                <Badge tone={m === 'GET' ? 'cyan' : m === 'POST' ? 'purple' : 'amber'}>{m}</Badge>
                <code className="font-mono text-xs text-ink">{path}</code>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Full reference + sandbox keys on request: <span className="text-cyan">hello@shadowspark.tech</span></p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ['Self-serve dashboard', 'Track every shipment, download invoices, top up wallet.'],
          ['Bulk send', 'Upload a CSV of 5,000 rows and create them all in one call.'],
          ['Webhooks', 'Get pushed updates instead of polling — resend with backoff included.'],
        ].map(([t, d]) => (
          <div key={t} className="glass rounded-2xl p-5">
            <div className="font-semibold text-ink">{t}</div>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <Link href="/send" className="mt-8 inline-block rounded-lg bg-cyan px-6 py-3 font-semibold text-bg hover:shadow-glow">
        Try the consumer flow →
      </Link>
    </div>
  );
}
