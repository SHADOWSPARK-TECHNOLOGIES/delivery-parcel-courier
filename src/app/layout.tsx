import type { Metadata } from 'next';
import '@/styles/globals.css';
import ClientShell from '@/components/client-shell';

export const metadata: Metadata = {
  title: 'ShadowSpark Courier — parcel & courier delivery, Nigeria',
  description:
    'Instant quotes, live tracking and smart dispatch for parcels across Nigeria — Lagos to Kano. Prices in ₦ with a 24/7 AI assistant.',
  metadataBase: new URL('https://shadowspark.tech'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
