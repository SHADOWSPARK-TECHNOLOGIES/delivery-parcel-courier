// Typed lookup helpers over the fixture data modules.
// Centralized so the UI and the AI agent share one data access pattern.

import { DRIVERS, SHIPMENTS, TICKETS } from '@/data/fixtures';
import type { Driver, Shipment, Ticket } from '@/types';

export function findShipment(key: string): Shipment | undefined {
  const k = key.trim().toUpperCase();
  return SHIPMENTS.find(
    (s) => s.trackingId.toUpperCase() === k || s.id.toUpperCase() === k,
  );
}

export function findDriver(id?: string): Driver | undefined {
  if (!id) return undefined;
  return DRIVERS.find((d) => d.id === id || d.name.toLowerCase().includes(id.toLowerCase()));
}

export function nearestDriver(area: string): Driver | undefined {
  const a = area.trim();
  const pool = DRIVERS.filter((d) => d.status === 'available' || d.status === 'on_trip');
  const exact = pool.find((d) => d.zone.includes(a) || a.includes(d.zone));
  if (exact) return exact;
  return pool.find((d) => d.status === 'available') ?? pool[0];
}

export function shipmentsForCustomer(nameFragment: string): Shipment[] {
  const n = nameFragment.trim().toLowerCase();
  return SHIPMENTS.filter(
    (s) =>
      s.sender.name.toLowerCase().includes(n) || s.recipient.name.toLowerCase().includes(n),
  );
}

export function ticketsForShipment(trackingId: string): Ticket[] {
  const k = trackingId.trim().toUpperCase();
  return TICKETS.filter((t) => t.trackingId.toUpperCase() === k);
}

export function listTickets(): Ticket[] {
  return TICKETS;
}

export function maxTicketId(): number {
  return Math.max(...TICKETS.map((t) => parseInt(t.id.replace(/\D/g, ''), 10)));
}
