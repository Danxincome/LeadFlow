import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
import { getPlan, getPriceId } from '@/lib/stripe/plans';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: 'No business found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const plan = getPlan(body?.plan);

  if (!plan) {
    return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
  }

  const priceId = getPriceId(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe is not configured for the ${plan.name} plan yet. Set ${plan.priceEnvVar} in your environment.` },
      { status: 501 }
    );
  }

  let stripe;
  try {
    stripe = getStripeClient();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 501 });
  }

  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('business_id', business.id)
    .maybeSingle();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    ...(existingSubscription?.stripe_customer_id
      ? { customer: existingSubscription.stripe_customer_id }
      : { customer_email: user.email }),
    client_reference_id: business.id,
    subscription_data: { metadata: { business_id: business.id } },
    metadata: { business_id: business.id },
    success_url: `${appUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl}/dashboard/billing?checkout=canceled`,
  });

  return NextResponse.json({ url: session.url });
}
