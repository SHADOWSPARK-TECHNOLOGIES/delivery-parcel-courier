// Shared domain types for the Parcel & Courier platform.

export type Urgency = 'standard' | 'express' | 'instant';

export type ServiceCode = 'SSK' | 'SSX' | 'SSI';

export type ShipmentStatus =
  | 'placed'
  | 'confirmed'
  | 'picked_up'
  | 'en_route'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'
  | 'cancelled';

export interface Zone {
  id: string;
  name: string;
  city: string;
  /** short code used in pricing keys, e.g. 'lag-m' */
  code: string;
  /** extra delivery base (₦) on top of the city base */
  coverageMultiplier: number;
}

export interface CityPricing {
  city: string;
  baseNgn: number;
  /** distance band in km used to model ETA */
  distanceBandsMax: number;
}

export interface UrgencyBand {
  code: Urgency;
  label: string;
  multiplier: number;
  minutesPerKm: number;
  servicePrefix: ServiceCode;
  icon?: string;
}

export interface PricingInput {
  pickupZone: string;
  dropoffZone: string;
  weightKg: number;
  urgency: Urgency;
}

export interface Quote {
  priceNgn: number;
  etaMinutes: number;
  service: Urgency;
  serviceLabel: string;
  trackingPrefix: string;
  distanceKm: number;
  zones: [string, string];
}

export interface TimelineEvent {
  time: string;
  label: string;
  icon: string;
  done: boolean;
}

export interface Shipment {
  id: string;
  trackingId: string;
  status: ShipmentStatus;
  service: Urgency;
  itemType: string;
  itemValueNgn: number;
  weightKg: number;
  fragile: boolean;
  sender: Contact;
  recipient: Contact;
  pickup: Address;
  dropoff: Address;
  created: string;
  etaMinutes: number;
  priceNgn: number;
  driverId?: string;
  timeline: TimelineEvent[];
}

export interface Contact {
  name: string;
  phone: string;
}

export interface Address {
  zone: string;
  street: string;
  landmark?: string;
  instructions?: string;
}

export type DriverVehicle = 'motorcycle' | 'van' | 'truck';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: DriverVehicle;
  plate: string;
  rating: number;
  trips: number;
  zone: string;
  status: 'available' | 'on_trip' | 'offline';
  earningsNgn: number;
  avatarHue: string;
}

export type TicketSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: string;
  trackingId: string;
  type: 'damage' | 'address' | 'delay' | 'missing' | 'other';
  severity: TicketSeverity;
  summary: string;
  status: 'open' | 'resolved' | 'escalated';
  createdAt: string;
  compensationOptions?: string[];
}

export interface DashboardInvoice {
  id: string;
  trackingId: string;
  amountNgn: number;
  status: 'paid' | 'pending';
  issued: string;
}

export interface AddressBookEntry {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  zone: string;
}

// ---- Re-exported SDK contracts (so agents + the UI share one type surface) ----
import type {
  AgentContext,
  DriverAssignment,
  PromoData,
  QuoteData,
} from 'delivery-ai-agents-common';
export type { AgentContext, DriverAssignment, PromoData, QuoteData };
