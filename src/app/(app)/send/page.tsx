'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { computeQuote, normalizeZoneLabel } from '@/lib/pricing';
import { URGENCY_BANDS, ZONES } from '@/data/pricing';
import { formatNgn, formatEta, normalizePhone } from '@/lib/format';
import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [senderName, setSenderName] = React.useState('Chidi Okeke');
  const [senderPhone, setSenderPhone] = React.useState('0802223030');
  const [recipientName, setRecipientName] = React.useState('');
  const [recipientPhone, setRecipientPhone] = React.useState('');
  const [itemType, setItemType] = React.useState('Consumer electronics');
  const [weight, setWeight] = React.useState('3');
  const [value, setValue] = React.useState('50000');
  const [fragile, setFragile] = React.useState(false);
  const [pickupZone, setPickupZone] = React.useState('Lagos Mainland');
  const [dropoffZone, setDropoffZone] = React.useState('Lagos Island');
  const [urgency, setUrgency] = React.useState<'standard' | 'express' | 'instant'>('standard');
  const [window, setWindow] = React.useState('9:00 am – 12:00 pm');

  const quote = React.useMemo(
    () => computeQuote({ pickupZone: normalizeZoneLabel(pickupZone), dropoffZone: normalizeZoneLabel(dropoffZone), weightKg: Number(weight) || 1, urgency }, { fragile }),
    [pickupZone, dropoffZone, weight, urgency, fragile],
  );

  const book = () => {
    const prefix = URGENCY_BANDS.find((b) => b.code === urgency)?.servicePrefix ?? 'SSK';
    const id = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    router.push(`/track/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Book a send</h1>
      <p className="mt-1 text-sm text-muted">Step {step} of 4 · prices update live as you fill this in.</p>

      {/* stepper */}
      <div className="mt-4 flex gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-cyan' : 'bg-white/10'}`} />
        ))}
      </div>

      <div className="glass mt-6 rounded-2xl p-6">
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs text-dim">Sender name</div>
              <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Sender phone</div>
              <Input value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="080xxxxxxxx" />
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Recipient name</div>
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Who's receiving?" />
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Recipient phone</div>
              <Input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="080xxxxxxxx" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="mb-1 text-xs text-dim">Item type</div>
              <Select value={itemType} onChange={(e) => setItemType(e.target.value)}>
                {['Consumer electronics', 'Legal documents', 'Perishables (frozen)', 'Fashion & accessories', 'Home appliances', 'Glassware (fragile)', 'Medical supplies', 'Books & stationery', 'Other'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Weight (kg)</div>
              <Input type="number" min={0.1} step={0.1} value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Declared value (₦)</div>
              <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={fragile} onChange={(e) => setFragile(e.target.checked)} className="h-4 w-4 accent-cyan" />
                Fragile — add ₦500 handling
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs text-dim">Pickup zone</div>
              <Select value={pickupZone} onChange={(e) => setPickupZone(e.target.value)}>
                {ZONES.map((z) => <option key={z.id} value={z.name}>{z.name}</option>)}
              </Select>
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Dropoff zone</div>
              <Select value={dropoffZone} onChange={(e) => setDropoffZone(e.target.value)}>
                {ZONES.map((z) => <option key={z.id} value={z.name}>{z.name}</option>)}
              </Select>
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Service</div>
              <Select value={urgency} onChange={(e) => setUrgency(e.target.value as typeof urgency)}>
                {URGENCY_BANDS.map((b) => <option key={b.code} value={b.code}>{b.icon} {b.label}</option>)}
              </Select>
            </div>
            <div>
              <div className="mb-1 text-xs text-dim">Pickup window</div>
              <Select value={window} onChange={(e) => setWindow(e.target.value)}>
                {['ASAP', '9:00 am – 12:00 pm', '12:00 pm – 3:00 pm', '3:00 pm – 6:00 pm'].map((w) => <option key={w}>{w}</option>)}
              </Select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="rounded-xl border border-line bg-surface/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink">{senderName || 'Sender'} → {recipientName || 'Recipient'}</span>
                <span className="font-mono text-xs text-muted">{itemType} · {weight}kg{fragile ? ' · fragile' : ''}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted">{pickupZone} → {dropoffZone} · {urgency}</span>
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                <div>
                  <div className="text-xs text-dim">Total</div>
                  <div className="font-mono text-3xl font-bold text-cyan">{formatNgn(quote.priceNgn)}</div>
                  <div className="mt-1 text-xs text-muted">~{formatEta(quote.etaMinutes)} · {quote.distanceKm} km</div>
                </div>
                <span className="text-xs text-muted">Pickup: {window}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-dim">Payment via Paystack at the door or card on booking (configure PAYSTACK_SECRET_KEY to enable). Recipient phone {recipientPhone ? normalizePhone(recipientPhone) : '(none set)'}.</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep((s) => Math.min(4, s + 1))}>Continue →</Button>
          ) : (
            <Button onClick={book} disabled={!recipientName || !recipientPhone}>Book send</Button>
          )}
        </div>
      </div>
    </div>
  );
}
