import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Stripe webhook receiver. Point a Stripe webhook endpoint at
 * POST /api/stripe/webhook and subscribe it to at least:
 *   checkout.session.completed
 *   customer.subscription.created
 *   customer.subscription.updated
 *   customer.subscription.deleted
 * STRIPE_WEBHOOK_SECRET must be set to the signing secret Stripe gives you
 * for that endpoint (different for local `stripe listen` vs. production).
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');

  if (!webhookSecret || webhookSecret === 'your-stripe-webhook-secret' || !signature) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 501 });
  }

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 501 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.client_reference_id || session.metadata?.business_id;
      if (businessId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertSubscription(supabase, businessId, subscription);
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const businessId = subscription.metadata?.business_id;
      if (businessId) {
        await upsertSubscription(supabase, businessId, subscription);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  businessId: string,
  subscription: Stripe.Subscription
) {
  const item = subscription.items.data[0];

  await supabase.from('subscriptions').upsert(
    {
      business_id: businessId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: item?.price?.id ?? null,
      status: subscription.status,
      current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: 'business_id' }
  );
}
