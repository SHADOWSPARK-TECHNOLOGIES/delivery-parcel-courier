// Deterministic quote engine — single source of truth for pricing and ETA.
// Used by BOTH the inbound quote UI and the AI agent tools so numbers always match.

import {
  CITY_PRICING,
  FRAGILE_SURCHARGE_NGN,
  INTERCITY_DISTANCE_KM,
  PRICE_PER_KG_NGN,
  PRICE_PER_KM_NGN,
  URGENCY_BANDS,
  URGENCY_BY_CODE,
  ZONES,
  ZONE_BY_NAME,
  type City,
} from '@/data/pricing';
import type { PricingInput, Quote, Urgency, Zone } from '@/types';

export type PricingZoneInput = string;

export function normalizeZoneLabel(input: string): string {
  const t = input.trim();
  if (ZONE_BY_NAME[t]) return ZONE_BY_NAME[t].name;
  // tolerant match: zone by code or city substring
  const norm = t.toLowerCase();
  const byName = ZONES.find((z) => z.name.toLowerCase() === norm);
  if (byName) return byName.name;
  const byCity = ZONES.find((z) => z.city.toLowerCase() === norm);
  if (byCity) return byCity.name;
  const bySubstr = ZONES.find((z) => z.name.toLowerCase().includes(norm) || norm.includes(z.city.toLowerCase()));
  return bySubstr ? bySubstr.name : t;
}

export function zoneToCity(zoneName: string): City | null {
  const z = ZONE_BY_NAME[zoneName] ?? ZONES.find((x) => x.name === normalizeZoneLabel(zoneName));
  if (!z) return null;
  return z.city as City;
}

export function isIntraCity(from: string, to: string): boolean {
  const a = zoneToCity(from);
  const b = zoneToCity(to);
  return a !== null && b !== null && a === b;
}

export function distanceKmBetween(from: string, to: string): number {
  const a = zoneToCity(from);
  const b = zoneToCity(to);
  // unknown zone fallback
  if (!a || !b) return 10;
  if (a === b) {
    // intra-city: model coverage multipliers as distance
    const fa = ZONE_BY_NAME[from]?.coverageMultiplier ?? 1;
    const fb = ZONE_BY_NAME[to]?.coverageMultiplier ?? 1;
    return Math.max(3, Math.round(8 * (fa + fb)));
  }
  const d = INTERCITY_DISTANCE_KM[a]?.[b] ?? INTERCITY_DISTANCE_KM[b]?.[a];
  return d ?? 100;
}

export function weightRoundedWise(weightKg: number): number {
  return Math.max(0.1, weightKg);
}

/**
 * Deterministic quote. Pure function — same inputs always produce the same
 * price + ETA. Returns cents-accurate (integer naira).
 */
export function computeQuote(input: PricingInput, opts?: { fragile?: boolean; priorityBoost?: number }): Quote {
  const from = normalizeZoneLabel(input.pickupZone);
  const to = normalizeZoneLabel(input.dropoffZone);
  const urgency: Urgency = ['standard', 'express', 'instant'].includes(input.urgency)
    ? input.urgency
    : 'standard';
  const band = URGENCY_BY_CODE[urgency] ?? URGENCY_BY_CODE.standard;
  const weight = weightRoundedWise(input.weightKg);
  const distance = distanceKmBetween(from, to);
  const intra = isIntraCity(from, to);

  const fromZone = ZONE_BY_NAME[from];
  const toZone = ZONE_BY_NAME[to];
  const fromCity = zoneToCity(from);
  const toCity = zoneToCity(to);

  // Base: use the higher of the two cities' base; add zone coverage boost for intra-city.
  const baseCity = (() => {
    const a = fromCity ? CITY_PRICING[fromCity]?.baseNgn : undefined;
    const b = toCity ? CITY_PRICING[toCity]?.baseNgn : undefined;
    const picked = Math.max(a ?? 0, b ?? 0);
    return picked || 1500;
  })();

  // Distance charge
  const distCharge = intra
    ? Math.round((distance / 8) * 90) // intra-city per-band feel
    : distance * PRICE_PER_KM_NGN;

  // Weight charge
  const weightCharge = weight * PRICE_PER_KG_NGN;

  // Zone coverage multiplier (intra-city roughness + city-specific handling)
  const coverage = (fromZone?.coverageMultiplier ?? 1) + (toZone?.coverageMultiplier ?? 1);

  const fragileCharge = opts?.fragile ? FRAGILE_SURCHARGE_NGN : 0;

  // Integer naira
  const raw = baseCity + distCharge + weightCharge;
  const withCoverage = raw * (intra ? coverage / 2 : 1);
  const priceNgn = Math.round((withCoverage * band.multiplier + fragileCharge + (opts?.priorityBoost ?? 0)) / 10) * 10;

  // ETA: minutes — distance-based * minutesPerKm, plus service handle time
  const baseHandle = band.code === 'instant' ? 15 : band.code === 'express' ? 45 : 90;
  const etaMinutes = Math.max(15, Math.round(baseHandle + distance * band.minutesPerKm));

  const label = URGENCY_BANDS.find((u) => u.code === band.code)?.label ?? 'Standard';

  return {
    priceNgn,
    etaMinutes,
    service: band.code,
    serviceLabel: label,
    trackingPrefix: band.servicePrefix,
    distanceKm: distance,
    zones: [from, to],
  };
}

/** All bundles for the pricing table page. */
export function quoteMatrix() {
  const urgencies: Urgency[] = ['standard', 'express', 'instant'];
  const sample = [
    ['Lagos Mainland', 'Lagos Island'],
    ['Lagos Mainland', 'Lagos Mainland'],
    ['Lagos Island', 'Lagos Island'],
    ['Owerri', 'Lagos Island'],
    ['Abuja', 'Port Harcourt'],
    ['Kano', 'Ibadan'],
    ['Lagos Island', 'Kano'],
    ['Ibadan', 'Owerri'],
    ['Port Harcourt', 'Abuja'],
    ['Owerri', 'Kano'],
  ] as const;
  const weight = 5;

  return urgencies.map((urgency) => ({
    urgency,
    rows: sample.map(([from, to]) => ({
      from,
      to,
      ...computeQuote({ pickupZone: from, dropoffZone: to, weightKg: weight, urgency }),
    })),
  }));
}

/** Availability: maps a zone name to its serviceable city for dropdowns. */
export function citiesWithZones() {
  const map = new Map<string, Zone[]>();
  for (const z of ZONES) {
    const list = map.get(z.city) ?? [];
    list.push(z);
    map.set(z.city, list);
  }
  return map;
}
