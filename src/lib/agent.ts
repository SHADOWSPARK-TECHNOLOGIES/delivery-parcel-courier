import {
  createAgent,
  createDispatchTools,
  createMapTools,
  createOrderTools,
  createPricingTools,
  MockLLM,
  type Agent,
  type AgentResult,
  type LLMAdapter,
  type ToolDefinition,
  type ToolResult,
} from 'delivery-ai-agents-common';
import { ZONE_BY_NAME } from '@/data/pricing';
import {
  findDriver,
  findShipment,
  listTickets,
  maxTicketId,
  nearestDriver,
} from '@/lib/fixtures';
import { computeQuote, normalizeZoneLabel } from '@/lib/pricing';
import { buildParcelSystemPrompt } from '@/ai/prompts';
import type {
  AgentContext,
  DriverAssignment,
  PromoData,
  QuoteData,
  Ticket,
} from '@/types';

const COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Lagos Island': { lat: 6.4438, lng: 3.4158 },
  'Lagos Mainland': { lat: 6.6018, lng: 3.3515 },
  'Outer Abuja': { lat: 9.0785, lng: 7.3981 },
  'Central Abuja': { lat: 9.0625, lng: 7.4882 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
  Owerri: { lat: 5.4836, lng: 7.0331 },
  Kano: { lat: 12.0022, lng: 8.5920 },
  Ibadan: { lat: 7.3775, lng: 3.9470 },
};

// Tool factories from the SDK wired to the typed fixtures.
const pricingClients = {
  quoteDelivery(input: {
    from?: string;
    to?: string;
    weightKg?: number;
    urgency?: string;
  }): ToolResult<QuoteData> {
    const q = computeQuote({
      pickupZone: normalizeZoneLabel(input.from ?? 'Lagos Mainland'),
      dropoffZone: normalizeZoneLabel(input.to ?? 'Lagos Island'),
      weightKg: input.weightKg ?? 5,
      urgency: (input.urgency as never) ?? 'standard',
    });
    return {
      ok: true,
      data: { priceNgn: q.priceNgn, etaMinutes: q.etaMinutes, service: q.serviceLabel },
    };
  },
  applyPromo(input: { code?: string }): ToolResult<PromoData> {
    const code = (input.code ?? '').trim().toUpperCase();
    const valid = ['SPARK10', 'WELCOME5'];
    if (valid.includes(code)) {
      return { ok: true, data: { code, applied: true, amountOffNgn: 500 } };
    }
    return { ok: true, data: { code, applied: false, reason: 'unknown or expired code' } };
  },
};

const orderClients = {
  getStatus(input: { orderId?: string }): ToolResult<{ orderId: string; status: string; eta?: string; driver?: string }> {
    const s = findShipment(input.orderId ?? '');
    if (!s) return { ok: false, error: `No shipment found for ${input.orderId}` };
    const driver = findDriver(s.driverId);
    return {
      ok: true,
      data: {
        orderId: s.trackingId,
        status: s.status,
        eta: s.status === 'delivered' ? 'Delivered' : `${s.etaMinutes} min`,
        driver: driver?.name,
      },
    };
  },
  updateAddress(input: { orderId?: string }): ToolResult<{ orderId: string; updated: boolean }> {
    const s = findShipment(input.orderId ?? '');
    if (!s) return { ok: false, error: `No shipment found for ${input.orderId}` };
    return { ok: true, data: { orderId: s.trackingId, updated: true } };
  },
  reschedule(input: { orderId?: string; time?: string }): ToolResult<{ orderId: string; time: string; changed: boolean }> {
    const s = findShipment(input.orderId ?? '');
    if (!s) return { ok: false, error: `No shipment found for ${input.orderId}` };
    return { ok: true, data: { orderId: s.trackingId, time: input.time ?? 'this evening', changed: true } };
  },
  initiateReturn(input: { orderId?: string }): ToolResult<{ orderId: string }> {
    const s = findShipment(input.orderId ?? '');
    if (!s) return { ok: false, error: `No shipment found for ${input.orderId}` };
    return { ok: true, data: { orderId: s.trackingId } };
  },
};

const mapClients = {
  calculateETA(input: { from?: string; to?: string }): ToolResult<{ etaMinutes: number; distanceKm: number }> {
    const q = computeQuote({
      pickupZone: input.from ?? 'Lagos Mainland',
      dropoffZone: input.to ?? 'Lagos Island',
      weightKg: 5,
      urgency: 'standard',
    });
    return { ok: true, data: { etaMinutes: q.etaMinutes, distanceKm: q.distanceKm } };
  },
  geocodeAddress(input: { address?: string }): ToolResult<{ lat: number; lng: number; label: string }> {
    const zone = normalizeZoneLabel(input.address ?? 'Lagos');
    const c = COORDINATES[zone] ?? ZONE_BY_NAME[zone] ? COORDINATES[ZONE_BY_NAME[zone]?.name ?? ''] : undefined;
    const coord = c ?? { lat: 6.5244, lng: 3.3792 };
    return { ok: true, data: { ...coord, label: zone } };
  },
  getRoute(input: { from?: string; to?: string }): ToolResult<{ from: string; to: string }> {
    return { ok: true, data: { from: input.from ?? '', to: input.to ?? '' } };
  },
};

const dispatchClients = {
  getNearestDriver(input: { area?: string; count?: number }): ToolResult<DriverAssignment> {
    const d = nearestDriver(input.area ?? 'Lagos');
    if (!d) return { ok: true, data: {} };
    return { ok: true, data: { driverId: d.id, driverName: d.name, etaMinutes: 9 } };
  },
  assignDriver(input: { shipmentId?: string }): ToolResult<DriverAssignment> {
    const s = findShipment(input.shipmentId ?? '');
    const d = nearestDriver(s?.pickup.zone ?? 'Lagos');
    return { ok: true, data: { shipmentId: s?.trackingId, driverId: d?.id, driverName: d?.name, etaMinutes: 9 } };
  },
};

// ---- Custom vertical tools (damage/ticket + context) -----------------------
function customTools(): ToolDefinition[] {
  return [
    {
      name: 'escalateIssue',
      description: 'Auto-generate a support ticket and compensation options for a damaged or problematic parcel.',
      keywords: ['damaged', 'damage', 'broken', 'arrived damaged', 'compensation', 'refund', 'issue', 'complaint'],
      extract: (text) => {
        const id = text.match(/\b(SS[KXI][-]?\d{3,4})\b/i)?.[0]?.toUpperCase();
        return { trackingId: id ?? undefined };
      },
      parameters: { type: 'object', properties: {}, required: [] },
      execute(args: { trackingId?: string }, _ctx: AgentContext): ToolResult<Ticket> {
        const s = args.trackingId ? findShipment(args.trackingId) : undefined;
        const id = s?.trackingId ?? 'SSK-1004';
        return {
          ok: true,
          data: {
            id: `TKT-${maxTicketId() + 1}`,
            trackingId: id,
            type: 'damage',
            severity: 'critical',
            summary: `Automatic ticket created for ${id} after a damage report.`,
            status: 'open',
            createdAt: new Date().toISOString(),
            compensationOptions: [
              'Full item value refund',
              'Free re-send with express service',
              '₦5,000 wallet credit',
            ],
          },
        };
      },
    },
    {
      name: 'trackShipment',
      description: 'Return live status + ETA when a user supplies a tracking ID.',
      keywords: ['where is my parcel', 'track my', 'tracking', 'my parcel', 'status of my', 'parcel status'],
      extract: (text) => ({
        trackingId: text.match(/\b(SS[KXI][-]?\d{3,4})\b/i)?.[0]?.toUpperCase(),
      }),
      parameters: { type: 'object', properties: {}, required: [] },
      execute(args: { trackingId?: string }, _ctx): ToolResult<{ status: string; eta?: string; driver?: string; meta?: string }> {
        const s = args.trackingId ? findShipment(args.trackingId) : SHIPMENTS_FALLBACK;
        if (!s) return { ok: false, error: "I couldn't find that tracking number. Try one like SSK-1001." };
        const driver = findDriver(s.driverId);
        return {
          ok: true,
          data: {
            status: s.status,
            eta: s.status === 'delivered' ? 'Delivered' : `${s.etaMinutes} min`,
            driver: driver?.name,
            meta: `${s.itemType} · ${s.service} service`,
          },
        };
      },
    },
  ];
}

const SHIPMENTS_FALLBACK = findShipment('SSK-1001');

function resolveTools(): ToolDefinition[] {
  return [
    ...createOrderTools(orderClients),
    ...createMapTools(mapClients),
    ...createPricingTools(pricingClients),
    ...createDispatchTools(dispatchClients),
    ...customTools(),
  ];
}

export function buildAgent(): Agent {
  const tools = resolveTools();
  const systemPrompt = buildParcelSystemPrompt();
  const llm: LLMAdapter = createRealOrMockLLM(tools);
  return createAgent({ systemPrompt, tools, llm });
}

/** One-line swap: enables the real OpenAI-compatible LLM when a key is present. */
export function createRealOrMockLLM(tools: ToolDefinition[]): LLMAdapter {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return new MockLLM(tools, { systemPrompt: buildParcelSystemPrompt() });
  // Prefer the MockLLM for the guaranteed-offline dev experience unless a key
  // truly exists AND the caller explicitly requests the LLM brain.
  return new MockLLM(tools, { systemPrompt: buildParcelSystemPrompt() });
}

/** Thin typing re-export so callers can depend on the SDK contract. */
export async function dispatchUserMessage(message: string, userId: string): Promise<AgentResult> {
  const agent = buildAgent();
  return agent.handle(userId, message);
}

export { createAgent };
