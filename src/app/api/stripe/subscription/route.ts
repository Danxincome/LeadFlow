import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, getPriceId } from '@/lib/stripe/plans';

/**
 * Returns the caller's subscription row plus which configured plan (if any)
 * its stripe_price_id matches. Resolving the price ID -> plan mapping here
 * (server-side) avoids needing to expose STRIPE_PRICE_* as NEXT_PUBLIC_ vars.
 */
export async function GET() {
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

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle();

  const planId = subscription?.stripe_price_id
    ? PLANS.find((plan) => getPriceId(plan) === subscription.stripe_price_id)?.id ?? null
    : null;

  return NextResponse.json({ subscription: subscription ?? null, planId });
}
