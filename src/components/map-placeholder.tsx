import { cn } from '@/lib/format';

export function MapPlaceholder({
  label,
  className,
  zones,
}: {
  label?: string;
  className?: string;
  zones?: string[];
}) {
  return (
    <div className={cn('cyber-grid-bg relative overflow-hidden rounded-2xl border border-line bg-surface/40', className ?? 'h-64')}>
      <div className="absolute inset-0 cyber-grid-bg opacity-60" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-xl" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-glow" />
      <div className="absolute left-1/2 top-1/3 h-32 w-32 opacity-40" style={{ background: 'radial-gradient(circle, transparent 55%, rgba(168,85,247,0.25))' }} />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-dim">
          {label ?? 'Live map'}
          {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? '' : ' · placeholder'}
        </span>
        {zones && zones.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {zones.map((z, i) => (
              <span key={i} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-cyan">{z}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
