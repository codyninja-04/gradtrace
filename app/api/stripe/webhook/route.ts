import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { createServiceClient } from '@/lib/supabase/server';

// Stripe needs the raw, unparsed request body to verify the signature, so this
// handler reads request.text() and must run on the Node runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: `Webhook verification failed: ${msg}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only unlock once the one-time payment has actually settled.
    if (session.payment_status === 'paid') {
      const userId = session.client_reference_id;
      if (userId) {
        const supabase = createServiceClient();
        const { error } = await supabase
          .from('user_profiles')
          .update({ has_pro_report: true })
          .eq('user_id', userId);

        if (error) {
          // Return 500 so Stripe retries rather than dropping the unlock.
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
