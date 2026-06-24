import Stripe from 'stripe';

// Server-only Stripe client. Used by the webhook to verify and parse events.
// Never import this into a client component.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  typescript: true,
});
