// ShadowSpark Courier — database seed.
//
//   pnpm db:seed
//
// Requires a reachable DATABASE_URL. The Next.js build never runs this.
// Self-contained (no '@/' alias) so tsx can execute it directly.

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.upsert({
    where: { id: 'cus-chidi' },
    update: {},
    create: {
      id: 'cus-chidi',
      name: 'Chidi Okeke',
      phone: '+2348102223030',
      email: 'chidi@example.com',
      address: '5 MCC Road, Owerri',
    },
  });

  const zones = [
    ['lag-i', 'Lagos Island', 'Lagos', 'lag-island', 1.6],
    ['lag-m', 'Lagos Mainland', 'Lagos', 'lag-mainland', 1.25],
    ['abj', 'Central Abuja', 'Abuja', 'abj-central', 1.2],
    ['abj-o', 'Outer Abuja', 'Abuja', 'abj-outer', 1.35],
    ['phc', 'Port Harcourt (GRA)', 'Port Harcourt', 'phc-gra', 1.2],
    ['owr', 'Owerri', 'Owerri', 'owr-central', 1.0],
    ['kan', 'Kano', 'Kano', 'kan-central', 1.0],
    ['ibd', 'Ibadan', 'Ibadan', 'ibd-bodija', 1.05],
  ] as const;
  for (const [id, name, city, code, cov] of zones) {
    await prisma.zone.upsert({ where: { id }, update: {}, create: { id, name, city, code, coverageMultiplier: cov } });
  }

  const drivers = [
    { id: 'drv-001', name: 'Ahmed Yusuf', phone: '+2348025550101', vehicle: 'motorcycle', plate: 'LAG-5567-KJA', rating: 4.9, trips: 1280, zone: 'Lagos Mainland', status: 'available', earningsNgn: 184000 },
    { id: 'drv-004', name: 'Chisom Okafor', phone: '+2348095550404', vehicle: 'truck', plate: 'PHC-3344-RNW', rating: 4.6, trips: 512, zone: 'Port Harcourt', status: 'available', earningsNgn: 98000 },
  ] as const;
  for (const d of drivers) {
    await prisma.driver.upsert({ where: { id: d.id }, update: {}, create: { ...d } });
  }

  const shipments = [
    {
      id: 'shp-seed-1',
      trackingId: 'SSK-SEED-1001',
      status: 'en_route',
      service: 'express',
      itemType: 'Legal documents',
      itemValueNgn: 92000,
      weightKg: 1.5,
      fragile: false,
      senderName: 'Chidi Okeke',
      senderPhone: '+2348102223030',
      recipientName: 'HR, GTB Abuja',
      recipientPhone: '+2348023334040',
      pickupZone: 'Owerri',
      pickupStreet: '5 MCC Road',
      dropoffZone: 'Central Abuja',
      dropoffStreet: 'Plot 1026, Wuse II',
      etaMinutes: 96,
      priceNgn: 15800,
      driverId: 'drv-004',
      customerId: customer.id,
    },
  ];
  for (const s of shipments) {
    await prisma.shipment.upsert({ where: { trackingId: s.trackingId }, update: {}, create: s });
  }

  await prisma.invoice.createMany({
    data: [
      { id: 'INV-9001', trackingId: 'SSK-SEED-1001', amountNgn: 15800, status: 'paid', issued: '2026-11-09', customerId: customer.id },
    ],
    skipDuplicates: true,
  });

  await prisma.ticket.upsert({
    where: { id: 'TKT-4001' },
    update: {},
    create: {
      id: 'TKT-4001',
      trackingId: 'SSK-9999',
      type: 'damage',
      severity: 'critical',
      summary: 'Example damage ticket — resolves against a real shipment once assigned.',
      status: 'open',
    },
  });

  console.log('[seed] ShadowSpark Courier seeded:');
  console.log(`  zones: ${zones.length} · drivers: ${drivers.length} · shipments: ${shipments.length}`);
  console.log('  customer:', customer.email);
  console.log('[seed] Done.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('[seed] Failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
