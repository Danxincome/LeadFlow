'use client';

import { useState, useEffect } from 'react';
import { Save, Check, Bot, MessageSquare, Sparkles, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Spinner, PageLoading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ChatWidget } from '@/components/chat/chat-widget';
import type { AISettings } from '@/lib/types';

const tones = [
  { value: 'friendly', label: 'Friendly', description: 'Warm, approachable, conversational' },
  { value: 'professional', label: 'Professional', description: 'Polished, courteous, business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed, informal, laid-back' },
];

export default function AISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Partial<AISettings>>({
    greeting: 'Hi there! Welcome to our auto detailing shop. How can I help you today?',
    tone: 'friendly',
    additional_instructions: '',
  });
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      const { data: aiSettings } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('business_id', business.id)
        .single();

      if (aiSettings) {
        setSettingsId(aiSettings.id);
        setSettings({
          greeting: aiSettings.greeting,
          tone: aiSettings.tone,
          additional_instructions: aiSettings.additional_instructions,
        });
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) return;
    setSaving(true);
    setSaved(false);

    const supabase = createClient();

    if (settingsId) {
      await supabase.from('ai_settings').update(settings).eq('id', settingsId);
    } else {
      const { data } = await supabase
        .from('ai_settings')
        .insert({ ...settings, business_id: businessId })
        .select()
        .single();
      if (data) setSettingsId(data.id);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <PageLoading />;

  if (!businessId) {
    return (
      <div className="max-w-lg mx-auto mt-8">
        <EmptyState
          icon={Bot}
          title="Set up your business first"
          description="You need to create a business profile before configuring AI settings."
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">AI Settings</h1>
        <p className="text-text-secondary mt-1">Customize how the AI receptionist interacts with your customers.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card divide-y divide-border overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">Greeting Message</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">The first message customers see when they open the chat.</p>
            <textarea
              className="input-field"
              rows={3}
              value={settings.greeting || ''}
              onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
              placeholder="Hi there! Welcome to our shop..."
            />
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">Tone</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {tones.map((tone) => {
                const active = settings.tone === tone.value;
                return (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => setSettings({ ...settings, tone: tone.value })}
                    className={`focus-ring relative p-4 rounded-xl border-2 text-left transition-all ${
                      active
                        ? 'border-primary-600 bg-primary-50 shadow-sm'
                        : 'border-border hover:border-primary-200 hover:shadow-sm'
                    }`}
                  >
                    {active && (
                      <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                    <p className="font-medium text-text-primary text-sm pr-5">{tone.label}</p>
                    <p className="text-xs text-text-secondary mt-1">{tone.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">Additional Instructions</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Extra instructions for the AI. For example: &quot;Always mention our loyalty program&quot; or &quot;Recommend ceramic coating to SUV owners.&quot;
            </p>
            <textarea
              className="input-field"
              rows={4}
              value={settings.additional_instructions || ''}
              onChange={(e) => setSettings({ ...settings, additional_instructions: e.target.value })}
              placeholder="Any special instructions for the AI..."
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Spinner size="sm" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>

      <div className="card p-6 mt-8">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Preview Your Chatbot</h2>
        <p className="text-sm text-text-secondary mb-6">
          Try out your AI receptionist exactly as customers will see it, using your live business profile and settings.
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-[380px] rounded-[2.5rem] bg-ink-900 p-3 shadow-2xl">
            <div className="relative rounded-[2rem] overflow-hidden bg-white">
              <div className="absolute top-0 inset-x-0 flex justify-center pt-2.5 z-10 pointer-events-none">
                <div className="w-20 h-5 rounded-full bg-ink-900" />
              </div>
              <div className="pt-6">
                <ChatWidget businessId={businessId} greeting={settings.greeting} inline />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Embed on Your Website</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Add this snippet to your website to embed the chat widget:
        </p>
        <pre className="bg-surface-tertiary rounded-lg p-4 text-sm text-text-primary overflow-x-auto">
{`<!-- LeadFlow AI Chat Widget -->
<script>
  window.LEADFLOW_BUSINESS_ID = "${businessId}";
</script>
<script src="/widget.js"></script>`}
        </pre>
      </div>
    </div>
  );
}
