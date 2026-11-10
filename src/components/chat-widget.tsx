'use client';

import * as React from 'react';
import { cn } from '@/lib/format';

type Msg = { role: 'user' | 'bot'; text: string };
const QUICK = ['Where is my parcel?', 'Get an instant quote', 'Deliver to my office instead', 'Package arrived damaged', 'Talk to a human'];

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [msgs, setMsgs] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setMsgs((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-chidi', message: trimmed }),
      });
      const json = await res.json();
      setMsgs((m) => [...m, { role: 'bot', text: json.reply ?? 'Something went wrong — try again.' }]);
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: 'Could not reach the assistant. Please try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-purple text-bg shadow-glow-purple transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-glow-purple backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-purple text-xs font-bold text-bg">ss</span>
              <div>
                <div className="text-sm font-semibold text-ink">Courier Assistant</div>
                <div className="font-mono text-[11px] text-purple">● online · rule-based</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted hover:text-ink">✕</button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {msgs.length === 0 && (
              <div>
                <p className="text-sm text-muted">Hi 👋 I can quote, track, reroute and sort out damage reports. Try a quick one:</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => void send(q)} className="rounded-full border border-line px-3 py-1 text-xs text-purple hover:border-purple">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={cn('max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm', m.role === 'user' ? 'ml-auto bg-purple/20 text-ink' : 'bg-white/5 text-ink')}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-1 rounded-2xl bg-white/5 px-3 py-2">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-cyan" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-cyan [animation-delay:150ms]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-cyan [animation-delay:300ms]" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="flex items-center gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tracking ID, quote, reroute…"
              className="h-9 flex-1 rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-purple"
            />
            <button type="submit" disabled={busy} className="grid h-9 w-9 place-items-center rounded-lg bg-purple text-bg disabled:opacity-40">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M3 3l18 9-18 9 3-9z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
