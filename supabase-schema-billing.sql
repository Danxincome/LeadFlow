-- LeadFlow AI Billing Schema (Stripe)
-- Run this in your Supabase SQL editor AFTER supabase-schema.sql.
-- Requires the update_updated_at() function defined in supabase-schema.sql.

create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  stripe_price_id text,
  status text not null default 'incomplete' check (
    status in ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused')
  ),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(business_id),
  unique(stripe_subscription_id)
);

create index idx_subscriptions_business_id on subscriptions(business_id);
create index idx_subscriptions_stripe_customer_id on subscriptions(stripe_customer_id);

create trigger tr_subscriptions_updated_at before update on subscriptions
  for each row execute function update_updated_at();

alter table subscriptions enable row level security;

-- Users can view their own business's subscription. All writes come from the
-- Stripe webhook and checkout/portal routes, which use the service-role
-- (admin) client and therefore bypass RLS — no insert/update/delete policy
-- is defined for regular users.
create policy "Users can view own subscription" on subscriptions
  for select using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
