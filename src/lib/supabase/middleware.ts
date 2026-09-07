import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasActiveAccess } from '@/lib/subscription';

const ONBOARDING_PATH = '/dashboard/onboarding';
const BILLING_PATH = '/dashboard/billing';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/dashboard')) {
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Onboarding must stay reachable with no business yet and no subscription —
  // it's the only way to create the business a subscription attaches to.
  if (pathname === ONBOARDING_PATH) {
    return supabaseResponse;
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!business) {
    const url = request.nextUrl.clone();
    url.pathname = ONBOARDING_PATH;
    return NextResponse.redirect(url);
  }

  // Billing must stay reachable so an unsubscribed (or lapsed) business can
  // actually start/fix a subscription.
  if (pathname === BILLING_PATH) {
    return supabaseResponse;
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('business_id', business.id)
    .maybeSingle();

  if (!hasActiveAccess(subscription?.status)) {
    const url = request.nextUrl.clone();
    url.pathname = BILLING_PATH;
    url.searchParams.set('required', '1');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
