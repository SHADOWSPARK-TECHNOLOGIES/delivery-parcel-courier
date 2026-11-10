import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/send', label: 'Send' },
  { href: '/track', label: 'Track' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/drivers', label: 'Drivers' },
  { href: '/business', label: 'Business' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold cyber-text-grad">ss//courier</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-0.5 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:text-cyan">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/send"
          className="hidden rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-bg transition-colors hover:shadow-glow md:block"
        >
          Book a send
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-mono text-lg font-bold cyber-text-grad">ss//courier</div>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Instant quotes, live tracking and smart dispatch across Nigeria — Lagos to Kano and
            everywhere between. Prices in ₦.
          </p>
        </div>
        <div className="space-y-1 text-sm">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-dim">Ship</div>
          <Link href="/send" className="block text-muted hover:text-cyan">Send a parcel</Link>
          <Link href="/pricing" className="block text-muted hover:text-cyan">Pricing</Link>
          <Link href="/track" className="block text-muted hover:text-cyan">Track</Link>
        </div>
        <div className="space-y-1 text-sm">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-dim">Company</div>
          <p className="text-muted">Drivers: +234 803 000 0000</p>
          <p className="text-muted">B2B: hello@shadowspark.tech</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center font-mono text-xs text-dim">
        © {new Date().getFullYear()} ShadowSpark Technologies · Owerri, Nigeria
      </div>
    </footer>
  );
}
