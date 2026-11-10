'use client';

import { SiteHeader, SiteFooter } from '@/components/site-shell';
import { ChatWidget } from '@/components/chat-widget';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[62vh]">{children}</main>
      <SiteFooter />
      <ChatWidget />
    </>
  );
}
