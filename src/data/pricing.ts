// Zone + pricing fixtures for the Parcel & Courier platform.
// These are the single source of truth for both the UI widgets AND the AI agent
// quote engine, so page numbers and chat numbers always match.

import type {
  CityPricing,
  Urgency,
  UrgencyBand,
  Zone,
} from '@/types';

export const CITIES = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Owerri',
  'Kano',
  'Ibadan',
] as const;
export type City = (typeof CITIES)[number];

export const URGENCY_BANDS: UrgencyBand[] = [
  { code: 'standard', label: 'Standard', multiplier: 1.0, minutesPerKm: 2.5, servicePrefix: 'SSK', icon: '🚚' },
  { code: 'express', label: 'Express', multiplier: 1.4, minutesPerKm: 1.7, servicePrefix: 'SSX', icon: '🛵' },
  { code: 'instant', label: 'Instant', multiplier: 1.9, minutesPerKm: 1.1, servicePrefix: 'SSI', icon: '⚡' },
];

export const URGENCY_BY_CODE: Record<Urgency, UrgencyBand> = URGENCY_BANDS.reduce(
  (acc, band) => ({ ...acc, [band.code]: band }),
  {} as Record<Urgency, UrgencyBand>,
);

export const CITY_PRICING: Record<City, CityPricing> = {
  Lagos: { city: 'Lagos', baseNgn: 1500, distanceBandsMax: 40 },
  Abuja: { city: 'Abuja', baseNgn: 1600, distanceBandsMax: 45 },
  'Port Harcourt': { city: 'Port Harcourt', baseNgn: 1500, distanceBandsMax: 40 },
  Owerri: { city: 'Owerri', baseNgn: 1300, distanceBandsMax: 30 },
  Kano: { city: 'Kano', baseNgn: 1400, distanceBandsMax: 35 },
  Ibadan: { city: 'Ibadan', baseNgn: 1350, distanceBandsMax: 35 },
};

/**
 * Serviceable zones. `coverageMultiplier` models intra-city roughness
 * (island > mainland > outskirt) and is multiplied into intra-city quotes.
 */
export const ZONES: Zone[] = [
  { id: 'lag-i', name: 'Lagos Island', city: 'Lagos', code: 'lag-island', coverageMultiplier: 1.6 },
  { id: 'lag-m', name: 'Lagos Mainland', city: 'Lagos', code: 'lag-mainland', coverageMultiplier: 1.25 },
  { id: 'abj', name: 'Central Abuja (Wuse/Utako)', city: 'Abuja', code: 'abj-central', coverageMultiplier: 1.2 },
  { id: 'abj-o', name: 'Outer Abuja (Gwarinpa/Kubwa)', city: 'Abuja', code: 'abj-outer', coverageMultiplier: 1.35 },
  { id: 'phc', name: 'Port Harcourt (GRA)', city: 'Port Harcourt', code: 'phc-gra', coverageMultiplier: 1.2 },
  { id: 'phc-t', name: 'Trans-Amadi / Rumuokwurushi', city: 'Port Harcourt', code: 'phc-transamadi', coverageMultiplier: 1.3 },
  { id: 'owr', name: 'Owerri (World Bank)', city: 'Owerri', code: 'owr-central', coverageMultiplier: 1.0 },
  { id: 'owr-a', name: 'Owerri (Aviation Rd / MCC)', city: 'Owerri', code: 'owr-aviation', coverageMultiplier: 1.15 },
  { id: 'kan', name: 'Kano (Fagge)', city: 'Kano', code: 'kan-central', coverageMultiplier: 1.0 },
  { id: 'kan-n', name: 'Kano (Naibawa)', city: 'Kano', code: 'kan-naibawa', coverageMultiplier: 1.1 },
  { id: 'ibd', name: 'Ibadan (Bodija)', city: 'Ibadan', code: 'ibd-bodija', coverageMultiplier: 1.05 },
  { id: 'ibd-d', name: 'Ibadan (Dugbe)', city: 'Ibadan', code: 'ibd-dugbe', coverageMultiplier: 1.1 },
];

export const ZONE_BY_NAME: Record<string, Zone> = Object.fromEntries(
  ZONES.map((z) => [z.name, z]),
);

export const ZONES_FOR_CITY: Record<City, Zone[]> = ZONES.reduce((acc, z) => {
  const city = z.city as City;
  (acc[city] ??= []).push(z);
  return acc;
}, {} as Record<City, Zone[]>);

/**
 * Deterministic inter-city distance matrix (km). Symmetric. Used by the quote
 * engine to compute both the distance surcharge and the ETA.
 */
export const INTERCITY_DISTANCE_KM: Record<City, Partial<Record<City, number>>> = {
  Lagos: { Abuja: 620, 'Port Harcourt': 560, Owerri: 530, Kano: 990, Ibadan: 145 },
  Abuja: { Lagos: 620, 'Port Harcourt': 700, Owerri: 670, Kano: 370, Ibadan: 490 },
  'Port Harcourt': { Lagos: 560, Abuja: 700, Owerri: 90, Kano: 1100, Ibadan: 610 },
  Owerri: { Lagos: 530, Abuja: 670, 'Port Harcourt': 90, Kano: 1050, Ibadan: 580 },
  Kano: { Lagos: 990, Abuja: 370, 'Port Harcourt': 1100, Owerri: 1050, Ibadan: 850 },
  Ibadan: { Lagos: 145, Abuja: 490, 'Port Harcourt': 610, Owerri: 580, Kano: 850 },
};

export const PRICE_PER_KM_NGN = 45; // inter-city per-km charge
export const PRICE_PER_KG_NGN = 120; // weight charge
export const FRAGILE_SURCHARGE_NGN = 500;
export const ZONE_MATCH_CITY = (zoneCity: string) => {
  const city = Object.keys(CITY_PRICING).find(
    (c) => c.toLowerCase() === zoneCity.toLowerCase(),
  );
  return (city as City) ?? null;
};
