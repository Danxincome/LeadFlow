'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreditCard, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PageLoading, Spinner } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { PLANS, type PlanId } from '@/lib/stripe/plans';
import { hasActiveAccess } from '@/lib/subscription';
import type { Subscription } from '@/lib/types';

export default function BillingPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <BillingPageContent />
    </Suspense>
  );
}

function BillingPageContent() {
  const searchParams = useSearchParams();
  const subscriptionRequired = searchParams.get('required') === '1';
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<PlanId | null>(null);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) {
        setLoading(false);
        return;
      }

      setBusinessId(business.id);

      const res = await fetch('/api/stripe/subscription');
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
        setCurrentPlanId(data.planId);
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleChoosePlan(planId: PlanId) {
    setError('');
    setPendingPlan(planId);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong starting checkout.');
        return;
      }

      window.location.assign(data.url);
    } catch {
      setError('Something went wrong starting checkout.');
    } finally {
      setPendingPlan(null);
    }
  }

  async function handleManageBilling() {
    setError('');
    setPortalLoading(true);

    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong opening the billing portal.');
        return;
      }

      window.location.assign(data.url);
    } catch {
      setError('Something went wrong opening the billing portal.');
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) return <PageLoading />;

  if (!businessId) {
    return (
      <div className="max-w-lg mx-auto mt-8">
        <EmptyState
          icon={CreditCard}
          title="Set up your business first"
          description="You need to create a business profile before managing billing."
        />
      </div>
    );
  }

  const currentPlan = currentPlanId ? PLANS.find((p) => p.id === currentPlanId) : undefined;
  const hasActiveSubscription = hasActiveAccess(subscription?.status);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Billing</h1>
        <p className="text-text-secondary mt-1">Manage your LeadFlow AI subscription.</p>
      </div>

      {error && (
        <div className="card p-4 mb-6 bg-red-50 border-red-100 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!error && subscriptionRequired && !hasActiveSubscription && (
        <div className="card p-4 mb-6 bg-amber-50 border-amber-100 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">Choose a plan to unlock your dashboard and chat widget.</p>
        </div>
      )}

      {hasActiveSubscription && (
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1">Current Plan</p>
              <p className="text-lg font-semibold text-text-primary">{currentPlan?.name || 'Active subscription'}</p>
              <p className="text-sm text-text-secondary mt-1">
                Status: <span className="capitalize">{subscription!.status.replace('_', ' ')}</span>
                {subscription!.current_period_end && (
                  <>
                    {' '}
                    &middot; Renews {new Date(subscription!.current_period_end).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="btn-secondary flex items-center justify-center gap-2 shrink-0"
            >
              {portalLoading ? <Spinner size="sm" /> : <ExternalLink className="w-4 h-4" />}
              Manage Billing
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = hasActiveSubscription && currentPlan?.id === plan.id;
          return (
            <div key={plan.id} className="card p-6 flex flex-col">
              <h3 className="text-base font-semibold text-text-primary">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-text-secondary text-sm">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
              <ul className="space-y-2 my-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleChoosePlan(plan.id)}
                disabled={isCurrent || pendingPlan !== null}
                className={isCurrent ? 'btn-secondary w-full flex items-center justify-center gap-2' : 'btn-primary w-full flex items-center justify-center gap-2'}
              >
                {pendingPlan === plan.id && <Spinner size="sm" />}
                {isCurrent ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-text-tertiary mt-8 text-center">
        Billing is powered by Stripe. Plans that aren&apos;t configured yet will show an error when selected — see{' '}
        <code className="bg-surface-tertiary px-1 py-0.5 rounded">.env.example</code> for the required Stripe environment
        variables.
      </p>
    </div>
  );
}
