'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { ChatWidget } from '@/components/chat/chat-widget';
import { SiteFooter } from '@/components/layout/site-footer';

export default function ChatDemoPage() {
  const [businessId, setBusinessId] = useState('');
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">LeadFlow AI</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-3">Chat Widget Demo</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Test the AI receptionist chat widget. Enter your business ID to connect it to your business profile.
          </p>
        </div>

        {!started ? (
          <div className="card p-8 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Connect to Your Business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Business ID
                </label>
                <input
                  className="input-field"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  placeholder="Paste your business ID here"
                />
                <p className="text-xs text-text-tertiary mt-1.5">
                  Find your business ID in the dashboard URL or database.
                </p>
              </div>
              <button
                onClick={() => { if (businessId.trim()) setStarted(true); }}
                disabled={!businessId.trim()}
                className="btn-primary w-full"
              >
                Start Demo Chat
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <ChatWidget
              businessId={businessId}
              greeting="Hi there! Welcome. How can I help you today?"
              inline
            />
            <button
              onClick={() => { setStarted(false); setBusinessId(''); }}
              className="btn-secondary w-full mt-4"
            >
              Reset Demo
            </button>
          </div>
        )}

        <div className="card p-6 max-w-2xl mx-auto mt-12">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Embed on Your Website</h2>
          <p className="text-sm text-text-secondary mb-4">
            Add this snippet to your website to embed the chat widget:
          </p>
          <pre className="bg-surface-tertiary rounded-lg p-4 text-sm text-text-primary overflow-x-auto">
{`<!-- LeadFlow AI Chat Widget -->
<script>
  window.LEADFLOW_BUSINESS_ID = "${businessId.trim() || 'YOUR_BUSINESS_ID'}";
</script>
<script src="/widget.js"></script>`}          </pre>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
