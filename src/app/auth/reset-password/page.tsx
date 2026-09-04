'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Spinner, PageLoading } from '@/components/ui/loading';

export default function ResetPasswordPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setHasSession(!!user);
      setCheckingSession(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 1500);
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
          <h2 className="text-3xl font-bold leading-tight mb-4">Choose a new password.</h2>
          <p className="text-primary-100 text-lg leading-relaxed max-w-md">
            Almost there — set a new password to get back into your account.
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
            <h1 className="text-2xl font-bold text-text-primary">Set a new password</h1>
            <p className="text-text-secondary mt-1">Choose a new password for your account</p>
          </div>

          <div className="card p-8">
            {checkingSession ? (
              <PageLoading />
            ) : !hasSession ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">Link expired or invalid</h2>
                <p className="text-sm text-text-secondary mb-6">
                  This password reset link is no longer valid. Request a new one to continue.
                </p>
                <Link href="/auth/forgot-password" className="btn-primary inline-flex items-center justify-center">
                  Request a new link
                </Link>
              </div>
            ) : done ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">Password updated</h2>
                <p className="text-sm text-text-secondary">Taking you to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading && <Spinner size="sm" />}
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
