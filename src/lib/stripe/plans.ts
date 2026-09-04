/**
 * Billing plan config. Copy (name/price/features) should stay in sync with
 * the Pricing section on the marketing homepage (src/app/page.tsx) — they
 * are kept separate because the homepage array is presentation-only and
 * this one drives server-side checkout logic.
 *
 * Price IDs are read from environment variables rather than hardcoded so
 * no real Stripe price IDs need to be invented here. Set them in .env
 * once the corresponding Products/Prices exist in your Stripe dashboard.
 */
export type PlanId = 'starter' | 'professional' | 'enterprise';

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  priceEnvVar: string;
}

export const PLANS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for getting started with AI-powered lead capture.',
    features: ['100 AI conversations/month', 'Unlimited leads', 'Chat widget', 'Email notifications', 'Basic dashboard'],
    priceEnvVar: 'STRIPE_PRICE_STARTER',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'For growing businesses that want the full experience.',
    features: [
      'Unlimited AI conversations',
      'Unlimited leads',
      'Chat widget',
      'SMS & email notifications',
      'Advanced analytics',
      'Pipeline management',
      'Priority support',
    ],
    priceEnvVar: 'STRIPE_PRICE_PROFESSIONAL',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For multi-location businesses and franchises.',
    features: [
      'Everything in Professional',
      'Multiple locations',
      'Custom AI training',
      'API access',
      'Dedicated account manager',
      'White-label widget',
    ],
    priceEnvVar: 'STRIPE_PRICE_ENTERPRISE',
  },
];

export function getPlan(id: string | undefined | null): PlanConfig | undefined {
  return PLANS.find((plan) => plan.id === id);
}

/** Returns the configured Stripe price ID for a plan, or undefined if not yet set up. */
export function getPriceId(plan: PlanConfig): string | undefined {
  const value = process.env[plan.priceEnvVar];
  return value && !value.startsWith('your-') ? value : undefined;
}
