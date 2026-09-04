import Stripe from 'stripe';

/**
 * Server-only Stripe client. Never import this from a client component.
 * Throws instead of silently no-op'ing so a missing key fails loudly at
 * the call site rather than producing a confusing Stripe API error.
 */
export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || secretKey === 'your-stripe-secret-key') {
    throw new Error(
      'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment before using billing features.'
    );
  }

  return new Stripe(secretKey);
}
