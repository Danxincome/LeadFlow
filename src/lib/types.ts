export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'booked' | 'lost';

export type LeadIntent = 'inquiry' | 'booking' | 'quote' | 'other';
export type LeadQualification = 'hot' | 'warm' | 'cold';

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  services: Service[];
  business_hours: BusinessHours;
  booking_instructions: string;
  faqs: FAQ[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  name: string;
  description: string;
  price: string;
}

export interface BusinessHours {
  [day: string]: { open: string; close: string; closed: boolean };
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Lead {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email: string;
  service_requested: string;
  vehicle: string;
  preferred_date: string | null;
  status: LeadStatus;
  lead_score: number;
  intent: LeadIntent;
  qualification: LeadQualification;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AISettings {
  id: string;
  business_id: string;
  greeting: string;
  tone: string;
  additional_instructions: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  lead_id: string | null;
  visitor_name: string | null;
  started_at: string;
  updated_at: string;
  lead?: Lead;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'assistant' | 'user';
  content: string;
  created_at: string;
}

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export interface Subscription {
  id: string;
  business_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_leads: number;
  new_leads: number;
  conversion_rate: number;
  pipeline_value: number;
  leads_by_status: Record<LeadStatus, number>;
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'lead_created' | 'lead_updated' | 'conversation_started';
  description: string;
  created_at: string;
}
