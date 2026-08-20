import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({ business });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const payload = { ...body, user_id: user.id };

  const { data: existing } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('businesses')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ business: data });
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from('ai_settings').insert({ business_id: data.id });

  return NextResponse.json({ business: data });
}
