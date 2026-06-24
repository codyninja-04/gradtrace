// Pro tier constants and the client-safe upgrade URL builder. Kept free of any
// server-only imports so it can be used from client components too.

// How many top matches a free user sees on the dashboard before the paywall.
export const FREE_MATCH_LIMIT = 15;

export const PRO_PRICE_LABEL = 'S$15';

export const PRO_FEATURES = [
  'Your full ranked company list, not just the top 15',
  'The AI 4-week action plan, written around your real matches',
  'Skill gap analysis against the companies you fit best',
  'A private share link to send your report to a mentor',
] as const;

/**
 * Builds the Stripe Payment Link URL with the user attached, so the webhook can
 * tie the completed payment back to the right account. The payment link itself
 * is created once in the Stripe dashboard and supplied via env.
 */
export function buildUpgradeUrl(userId: string, email?: string | null): string {
  const base = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  if (!base) return '';

  const url = new URL(base);
  url.searchParams.set('client_reference_id', userId);
  if (email) url.searchParams.set('prefilled_email', email);
  return url.toString();
}
