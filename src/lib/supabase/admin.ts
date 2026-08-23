import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for trusted server-side code only.
 * Bypasses Row Level Security — never import this from a client component
 * or route that isn't already validating access itself (e.g. the public
 * chat API, which authorizes by businessId rather than by session).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin client is missing required environment variables.');
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
