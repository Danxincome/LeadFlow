import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hasActiveAccess } from '@/lib/subscription';

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
    .select('status')
    .eq('business_id', business.id)
    .maybeSingle();

  if (!hasActiveAccess(subscription?.status)) {
    return NextResponse.json({ error: 'Subscription inactive' }, { status: 402 });
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ leads: leads || [] });
}

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

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('business_id', business.id)
    .maybeSingle();

  if (!hasActiveAccess(subscription?.status)) {
    return NextResponse.json({ error: 'Subscription inactive' }, { status: 402 });
  }

  const body = await request.json();

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({ ...body, business_id: business.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ lead });
}
