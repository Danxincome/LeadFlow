-- LeadFlow AI Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Businesses table
create table businesses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  business_name text not null,
  owner_name text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  website text not null default '',
  services jsonb not null default '[]'::jsonb,
  business_hours jsonb not null default '{}'::jsonb,
  booking_instructions text not null default '',
  faqs jsonb not null default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- Leads table
create table leads (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  service_requested text not null default '',
  vehicle text not null default '',
  preferred_date date,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'booked', 'lost')),
  notes text not null default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- AI Settings table
create table ai_settings (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  greeting text not null default 'Hi there! Welcome to our auto detailing shop. How can I help you today?',
  tone text not null default 'friendly',
  additional_instructions text not null default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(business_id)
);

-- Conversations table
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references businesses(id) on delete cascade not null,
  lead_id uuid references leads(id) on delete set null,
  visitor_name text,
  started_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('assistant', 'user')),
  content text not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_leads_business_id on leads(business_id);
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at desc);
create index idx_conversations_business_id on conversations(business_id);
create index idx_conversations_updated_at on conversations(updated_at desc);
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_messages_created_at on messages(created_at);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_businesses_updated_at before update on businesses
  for each row execute function update_updated_at();
create trigger tr_leads_updated_at before update on leads
  for each row execute function update_updated_at();
create trigger tr_ai_settings_updated_at before update on ai_settings
  for each row execute function update_updated_at();
create trigger tr_conversations_updated_at before update on conversations
  for each row execute function update_updated_at();

-- Row Level Security
alter table businesses enable row level security;
alter table leads enable row level security;
alter table ai_settings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Businesses: users can only access their own business
create policy "Users can view own business" on businesses
  for select using (auth.uid() = user_id);
create policy "Users can insert own business" on businesses
  for insert with check (auth.uid() = user_id);
create policy "Users can update own business" on businesses
  for update using (auth.uid() = user_id);

-- Leads: users can only access leads for their business
create policy "Users can view own leads" on leads
  for select using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
create policy "Users can insert own leads" on leads
  for insert with check (
    business_id in (select id from businesses where user_id = auth.uid())
  );
create policy "Users can update own leads" on leads
  for update using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
create policy "Users can delete own leads" on leads
  for delete using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

-- Public lead creation (for chat widget)
create policy "Public can insert leads" on leads
  for insert with check (true);

-- AI Settings: users can only access settings for their business
create policy "Users can view own ai_settings" on ai_settings
  for select using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
create policy "Users can insert own ai_settings" on ai_settings
  for insert with check (
    business_id in (select id from businesses where user_id = auth.uid())
  );
create policy "Users can update own ai_settings" on ai_settings
  for update using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

-- Public read for AI settings (chat widget needs business info)
create policy "Public can read ai_settings" on ai_settings
  for select using (true);
create policy "Public can read businesses" on businesses
  for select using (true);

-- Conversations: users can only access conversations for their business
create policy "Users can view own conversations" on conversations
  for select using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
create policy "Public can insert conversations" on conversations
  for insert with check (true);
create policy "Public can update conversations" on conversations
  for update using (true);

-- Messages: users can view messages for their conversations
create policy "Users can view own messages" on messages
  for select using (
    conversation_id in (
      select id from conversations where business_id in (
        select id from businesses where user_id = auth.uid()
      )
    )
  );
create policy "Public can insert messages" on messages
  for insert with check (true);
create policy "Public can read own conversation messages" on messages
  for select using (true);
