import * as React from 'react';
import { cn } from '@/lib/format';

type Tone = 'cyan' | 'purple' | 'magenta' | 'amber' | 'dim' | 'ok';
const tones: Record<Tone, string> = {
  cyan: 'bg-cyan/15 text-cyan border-cyan/30',
  purple: 'bg-purple/15 text-purple border-purple/30',
  magenta: 'bg-magenta/15 text-magenta border-magenta/30',
  amber: 'bg-amber/15 text-amber border-amber/30',
  dim: 'bg-white/5 text-muted border-white/10',
  ok: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export function Badge({ className, tone = 'dim', ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium', tones[tone], className)}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Tone =
    status === 'delivered'
      ? 'ok'
      : status === 'picked_up'
        ? 'cyan'
        : status === 'en_route' || status === 'out_for_delivery'
          ? 'cyan'
          : status === 'confirmed' || status === 'placed'
            ? 'amber'
            : status === 'exception'
              ? 'magenta'
              : status === 'cancelled'
                ? 'dim'
                : 'dim';
  return <Badge tone={tone}>{status.replace(/_/g, ' ')}</Badge>;
}
