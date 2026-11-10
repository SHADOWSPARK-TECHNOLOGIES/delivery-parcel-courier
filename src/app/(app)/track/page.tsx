'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SHIPMENTS } from '@/data/fixtures';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';

export default function TrackPage() {
  const router = useRouter();
  const [id, setId] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = id.trim().toUpperCase();
    if (clean) router.push(`/track/${clean}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Track a shipment</h1>
      <p className="mt-1 text-sm text-muted">Enter a tracking ID like SSK-1001 and follow it live.</p>

      <form onSubmit={submit} className="mt-6 flex gap-2">
        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. SSK-1001" className="font-mono" />
        <Button onClick={() => void null} type="submit">Track</Button>
      </form>

      <div className="mt-10">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-dim">Or pick a recent one</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {SHIPMENTS.slice(0, 8).map((s) => (
            <Link key={s.id} href={`/track/${s.trackingId}`} className="glass flex items-center justify-between rounded-xl p-4 hover:shadow-glow">
              <div>
                <div className="font-mono text-sm text-cyan">{s.trackingId}</div>
                <div className="mt-1 truncate text-xs text-muted">{s.itemType} · {s.pickup.zone} → {s.dropoff.zone}</div>
              </div>
              <StatusBadge status={s.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
