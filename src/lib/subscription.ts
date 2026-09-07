import type { SubscriptionStatus } from '@/lib/types';

/**
 * Statuses that keep the dashboard and chat widget usable. `past_due` is
 * included to give a short grace period while Stripe retries the card —
 * Stripe moves the subscription to `canceled`/`unpaid` once retries are
 * exhausted, which then revokes access here.
 */
export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['active', 'trialing', 'past_due'];

export function hasActiveAccess(status: string | null | undefined): boolean {
  return !!status && (ACTIVE_SUBSCRIPTION_STATUSES as string[]).includes(status);
}

/**
 * Start of the current monthly billing cycle, derived from the subscription's
 * `current_period_end` (all plans are monthly, so one month back from the
 * next renewal is the start of the cycle in progress). Falls back to the
 * start of the current calendar month when the subscription hasn't synced a
 * period end yet.
 */
export function getBillingPeriodStart(currentPeriodEnd: string | null | undefined): Date {
  if (!currentPeriodEnd) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }

  const end = new Date(currentPeriodEnd);
  const year = end.getUTCFullYear();
  const month = end.getUTCMonth();
  const targetYear = month === 0 ? year - 1 : year;
  const targetMonth = month === 0 ? 11 : month - 1;

  // Clamp the day into the target month (e.g. Mar 31 -> Feb 28/29) instead of
  // letting Date roll it forward into the following month — Stripe itself
  // clamps the same way for monthly billing anchors that fall on day 29-31.
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const day = Math.min(end.getUTCDate(), lastDayOfTargetMonth);

  return new Date(Date.UTC(
    targetYear,
    targetMonth,
    day,
    end.getUTCHours(),
    end.getUTCMinutes(),
    end.getUTCSeconds(),
    end.getUTCMilliseconds()
  ));
}
