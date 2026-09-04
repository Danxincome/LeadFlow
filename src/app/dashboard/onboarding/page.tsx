'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Check, Building2, Wrench, Clock, CalendarClock, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Spinner, PageLoading } from '@/components/ui/loading';
import type { Service, FAQ, BusinessHours } from '@/lib/types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const defaultHours: BusinessHours = Object.fromEntries(
  DAYS.map((d) => [d, { open: '09:00', close: '17:00', closed: d === 'sunday' }])
);

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    business_name: '',
    owner_name: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    booking_instructions: '',
  });
  const [services, setServices] = useState<Service[]>([{ name: '', description: '', price: '' }]);
  const [hours, setHours] = useState<BusinessHours>(defaultHours);
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: '', answer: '' }]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (business) {
        setExistingId(business.id);
        setForm({
          business_name: business.business_name,
          owner_name: business.owner_name,
          phone: business.phone,
          email: business.email,
          address: business.address,
          website: business.website,
          booking_instructions: business.booking_instructions,
        });
        if (business.services?.length) setServices(business.services);
        if (Object.keys(business.business_hours || {}).length) setHours(business.business_hours);
        if (business.faqs?.length) setFaqs(business.faqs);
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      ...form,
      services: services.filter((s) => s.name.trim()),
      business_hours: hours,
      faqs: faqs.filter((f) => f.question.trim()),
    };

    if (existingId) {
      await supabase.from('businesses').update(payload).eq('id', existingId);
    } else {
      const { data } = await supabase.from('businesses').insert(payload).select().single();
      if (data) {
        setExistingId(data.id);
        await supabase.from('ai_settings').insert({ business_id: data.id });
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <PageLoading />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {existingId ? 'Business Profile' : 'Set Up Your Business'}
        </h1>
        <p className="text-text-secondary mt-1">
          {existingId
            ? 'Update your business information. The AI uses this to answer customer questions.'
            : 'Tell us about your business so the AI can answer customer questions accurately.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card divide-y divide-border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Basic Information</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Business Name *</label>
              <input
                className="input-field"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                placeholder="Pristine Auto Detailing"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Owner Name</label>
              <input
                className="input-field"
                value={form.owner_name}
                onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Phone</label>
              <input
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="info@pristinedetailing.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Address</label>
              <input
                className="input-field"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Website</label>
              <input
                className="input-field"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://pristinedetailing.com"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">Services & Pricing</h2>
            </div>
            <button
              type="button"
              onClick={() => setServices([...services, { name: '', description: '', price: '' }])}
              className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
          <div className="space-y-4">
            {services.map((service, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 grid sm:grid-cols-3 gap-3">
                  <input
                    className="input-field"
                    placeholder="Service name"
                    aria-label={`Service ${i + 1} name`}
                    value={service.name}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[i] = { ...service, name: e.target.value };
                      setServices(updated);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Description"
                    aria-label={`Service ${i + 1} description`}
                    value={service.description}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[i] = { ...service, description: e.target.value };
                      setServices(updated);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Price (e.g. $99)"
                    aria-label={`Service ${i + 1} price`}
                    value={service.price}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[i] = { ...service, price: e.target.value };
                      setServices(updated);
                    }}
                  />
                </div>
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setServices(services.filter((_, idx) => idx !== i))}
                    aria-label={`Remove service ${i + 1}`}
                    className="focus-ring rounded-md p-2 text-text-tertiary hover:text-red-500 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Business Hours</h2>
          </div>
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:flex-nowrap">
                <div className="w-28">
                  <span className="text-sm font-medium text-text-primary capitalize">{day}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hours[day]?.closed}
                    onChange={(e) =>
                      setHours({ ...hours, [day]: { ...hours[day], closed: !e.target.checked } })
                    }
                    aria-label={`${day} open`}
                    className="w-4 h-4 rounded border-border text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  />
                  <span className="text-sm text-text-secondary">Open</span>
                </label>
                {!hours[day]?.closed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      className="input-field py-1.5 text-sm"
                      aria-label={`${day} opening time`}
                      value={hours[day]?.open || '09:00'}
                      onChange={(e) =>
                        setHours({ ...hours, [day]: { ...hours[day], open: e.target.value } })
                      }
                    />
                    <span className="text-text-secondary text-sm">to</span>
                    <input
                      type="time"
                      className="input-field py-1.5 text-sm"
                      aria-label={`${day} closing time`}
                      value={hours[day]?.close || '17:00'}
                      onChange={(e) =>
                        setHours({ ...hours, [day]: { ...hours[day], close: e.target.value } })
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <CalendarClock className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Booking Instructions</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">How should customers book? The AI will share these instructions.</p>
          <textarea
            className="input-field"
            rows={3}
            value={form.booking_instructions}
            onChange={(e) => setForm({ ...form, booking_instructions: e.target.value })}
            placeholder="e.g., Call us at (555) 123-4567 to schedule, or reply with your preferred date and we'll confirm within 2 hours."
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">FAQs</h2>
            </div>
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
              className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    className="input-field"
                    placeholder="Question"
                    aria-label={`FAQ ${i + 1} question`}
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[i] = { ...faq, question: e.target.value };
                      setFaqs(updated);
                    }}
                  />
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Answer"
                    aria-label={`FAQ ${i + 1} answer`}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[i] = { ...faq, answer: e.target.value };
                      setFaqs(updated);
                    }}
                  />
                </div>
                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                    aria-label={`Remove FAQ ${i + 1}`}
                    className="focus-ring rounded-md p-2 text-text-tertiary hover:text-red-500 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Spinner size="sm" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Business Profile'}
          </button>
          {existingId && !saving && !saved && (
            <button type="button" onClick={() => router.push('/dashboard')} className="btn-secondary">
              Back to Dashboard
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
