'use client';

import { useState, useEffect } from 'react';
import { Save, Check, Bot } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Spinner, PageLoading } from '@/components/ui/loading';
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
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Set up your business first</h2>
        <p className="text-text-secondary mb-6">You need to create a business profile before configuring AI settings.</p>
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
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Greeting Message</h2>
          <p className="text-sm text-text-secondary mb-4">The first message customers see when they open the chat.</p>
          <textarea
            className="input-field"
            rows={3}
            value={settings.greeting || ''}
            onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
            placeholder="Hi there! Welcome to our shop..."
          />
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tone</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {tones.map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => setSettings({ ...settings, tone: tone.value })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  settings.tone === tone.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-border hover:border-primary-200'
                }`}
              >
                <p className="font-medium text-text-primary text-sm">{tone.label}</p>
                <p className="text-xs text-text-secondary mt-1">{tone.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Additional Instructions</h2>
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

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Spinner size="sm" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
