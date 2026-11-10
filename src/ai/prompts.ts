import { parcelAgentPrompt } from 'delivery-ai-agents-common';

export const SUPPORT_PHONE = '+234 803 000 0000';
export const SUPPORT_EMAIL = 'hello@shadowspark.tech';

/** Parcel & courier vertical system prompt via the shared SDK. */
export function buildParcelSystemPrompt(): string {
  return parcelAgentPrompt({
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Owerri', 'Kano', 'Ibadan'],
    currency: 'NGN (₦)',
    supportPhone: SUPPORT_PHONE,
  });
}
