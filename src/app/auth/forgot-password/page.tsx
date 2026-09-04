'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Check, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Spinner } from '@/components/ui/loading';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Always show the same success state, regardless of whether the email
    // is registered, so this form can't be used to enumerate accounts.
    setSent(true);
  }

  return (
    <div className="min-h-screen flex bg-surface-secondary">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <Link href="/" className="relative inline-flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/15 ring-1 ring-white/25 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">LeadFlow AI</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight mb-4">Forgot your password?</h2>
          <p className="text-primary-100 text-lg leading-relaxed max-w-md">
            No problem. Enter the email on your account and we&apos;ll send you a link to reset it.
          </p>
        </div>
        <p className="relative text-xs text-primary-200">&copy; {new Date().getFullYear()} LeadFlow AI</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-text-primary">LeadFlow AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">Reset your password</h1>
            <p className="text-text-secondary mt-1">We&apos;ll email you a link to choose a new one</p>
          </div>

          <div className="card p-8">
            {sent ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">Check your email</h2>
                <p className="text-sm text-text-secondary">
                  If an account exists for <span className="font-medium text-text-primary">{email}</span>, we&apos;ve sent a
                  link to reset your password. It may take a minute to arrive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading && <Spinner size="sm" />}
                  Send Reset Link
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-text-secondary mt-6">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
