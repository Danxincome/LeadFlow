import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getBillingPeriodStart, hasActiveAccess } from '@/lib/subscription';
import { getConversationLimit, getPlanByPriceId } from '@/lib/stripe/plans';

const supabase = createAdminClient();

function buildSystemPrompt(business: Record<string, unknown>, aiSettings: Record<string, unknown>): string {
  const services = (business.services as Array<{ name: string; description: string; price: string }>) || [];
  const faqs = (business.faqs as Array<{ question: string; answer: string }>) || [];
  const hours = business.business_hours as Record<string, { open: string; close: string; closed: boolean }> || {};

  const servicesText = services.length > 0
    ? services.map((s) => `- ${s.name}: ${s.description} — ${s.price}`).join('\n')
    : 'No services configured yet.';

  const hoursText = Object.entries(hours)
    .map(([day, h]) => `- ${day.charAt(0).toUpperCase() + day.slice(1)}: ${h.closed ? 'Closed' : `${h.open} - ${h.close}`}`)
    .join('\n');

  const faqsText = faqs.length > 0
    ? faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : '';

  const today = new Date().toISOString().slice(0, 10);

  return `You are an AI receptionist for ${business.business_name}. Your job is to help customers, answer their questions, and capture their information as a lead.

TODAY'S DATE: ${today}

TONE: ${(aiSettings.tone as string) || 'friendly'}

IMPORTANT RULES:
- ONLY use the information provided below. NEVER invent prices, services, hours, availability, or policies.
- If asked about something not covered below, politely say you don't have that information and suggest calling the business directly at ${business.phone || 'their phone number'}.
- Be conversational and helpful.
- During the conversation, naturally collect: name, phone number, email, vehicle info, service interest, and preferred appointment date.
- Don't ask for all info at once — weave it into the conversation naturally.
- When you have enough info, explain the booking process.

BUSINESS: ${business.business_name}
${business.address ? `ADDRESS: ${business.address}` : ''}
${business.phone ? `PHONE: ${business.phone}` : ''}
${business.website ? `WEBSITE: ${business.website}` : ''}

SERVICES & PRICING:
${servicesText}

BUSINESS HOURS:
${hoursText}

BOOKING INSTRUCTIONS:
${business.booking_instructions || 'Contact the business to schedule an appointment.'}

${faqsText ? `FREQUENTLY ASKED QUESTIONS:\n${faqsText}` : ''}

${(aiSettings.additional_instructions as string) ? `ADDITIONAL INSTRUCTIONS:\n${aiSettings.additional_instructions}` : ''}

When you've collected customer information during the conversation, include a JSON block at the end of your response (hidden from the customer) in this exact format:
<!--LEAD_DATA:{"name":"","phone":"","email":"","vehicle":"","service_requested":"","preferred_date":"","lead_score":0,"intent":"","qualification":""}-->
Only include fields that the customer has actually provided. Update this block whenever you learn new information.
preferred_date MUST be a specific calendar date in YYYY-MM-DD format — use TODAY'S DATE above to resolve relative phrases like "this Saturday" or "next Tuesday" into an actual date. If you don't yet know a specific date, leave preferred_date as an empty string rather than writing a relative phrase.

You must also score the lead on every turn:
- intent: one of "inquiry" (just asking questions), "booking" (trying to schedule an appointment), "quote" (asking for pricing/estimate), or "other".
- lead_score: an integer 0-100 reflecting how sales-ready this lead is. Increase the score for: providing contact info (phone/email), naming a specific service, giving a preferred date, expressing clear buying intent (e.g. "I want to book", "can I come in"), and booking intent generally. Keep the score low for vague browsing or early-stage questions with no contact info.
- qualification: derived from lead_score — 0-49 is "cold", 50-79 is "warm", 80-100 is "hot".
Always include lead_score, intent, and qualification in the LEAD_DATA block once you have said anything meaningful about the customer, and update them as the conversation develops.`;
}

async function callAI(systemPrompt: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    return generateFallbackResponse(messages);
  }

  const contents = messages
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return generateFallbackResponse(messages);
    }

    const data = await response.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((p: { text?: string }) => p.text || '')
      .join('')
      .trim();

    return text || 'I apologize, I had trouble processing that. Could you try again?';
  } catch (error) {
    console.error('Gemini request failed:', error);
    return generateFallbackResponse(messages);
  }
}

function generateFallbackResponse(
  messages: Array<{ role: string; content: string }>
): string {
  const lastMessage =
    messages[messages.length - 1]?.content?.toLowerCase().trim() || '';

  if (/^(hi|hello|hey|yo|sup)/.test(lastMessage)) {
    return "Hi! Welcome! 👋 How can I help you today? I can help with services, pricing, hours, or appointments.";
  }

  if (
    lastMessage.includes('price') ||
    lastMessage.includes('cost') ||
    lastMessage.includes('how much') ||
    lastMessage.includes('pricing')
  ) {
    return "I'd be happy to help with pricing. What service are you interested in?";
  }

  if (
    lastMessage.includes('service') ||
    lastMessage.includes('offer')
  ) {
    return "We offer a variety of services. Tell me what you're looking to have done, and I'll help you find the right service.";
  }

  if (
    lastMessage.includes('hours') ||
    lastMessage.includes('open') ||
    lastMessage.includes('closed')
  ) {
    return "Our business hours are listed in our profile. What day are you looking to come in?";
  }

  if (
    lastMessage.includes('appointment') ||
    lastMessage.includes('book') ||
    lastMessage.includes('schedule')
  ) {
    return "Absolutely! I'd be happy to help you get started. What service are you interested in?";
  }

  if (lastMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  return "Thanks for reaching out! I can help with services, pricing, business hours, and appointments. What would you like to know?";
}

function extractLeadData(text: string): Record<string, unknown> | null {
  const match = text.match(/<!--LEAD_DATA:([\s\S]*?)-->/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function stripLeadData(text: string): string {
  return text.replace(/<!--LEAD_DATA:[\s\S]*?-->/, '').trim();
}

function toIsoDateOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return Number.isNaN(new Date(`${trimmed}T00:00:00Z`).getTime()) ? null : trimmed;
}

const LEAD_INTENTS = ['inquiry', 'booking', 'quote', 'other'] as const;
type LeadIntentValue = (typeof LEAD_INTENTS)[number];

function toLeadIntentOrNull(value: unknown): LeadIntentValue | null {
  return typeof value === 'string' && (LEAD_INTENTS as readonly string[]).includes(value)
    ? (value as LeadIntentValue)
    : null;
}

function toLeadScoreOrNull(value: unknown): number | null {
  const num = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(num)) return null;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function qualificationFromScore(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 80) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
}

export async function GET(request: NextRequest) {
  try {
    const businessId = request.nextUrl.searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('business_name')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { data: aiSettings, error: aiSettingsError } = await supabase
      .from('ai_settings')
      .select('greeting')
      .eq('business_id', businessId)
      .single();

    if (aiSettingsError && aiSettingsError.code !== 'PGRST116') {
      console.error('Failed to load AI settings:', aiSettingsError);
    }

    return NextResponse.json({
      businessName: business.business_name,
      greeting:
        aiSettings?.greeting ||
        `Hi there! Welcome to ${business.business_name}. How can I help you today?`,
    });
  } catch (error) {
    console.error('Chat config lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, conversationId, message } = body;

    if (!businessId || typeof businessId !== 'string' || !message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('status, stripe_price_id, current_period_end')
      .eq('business_id', businessId)
      .maybeSingle();

    if (subscriptionError) {
      console.error('Failed to load subscription status:', subscriptionError);
    }

    if (!hasActiveAccess(subscription?.status)) {
      return NextResponse.json({ error: 'Subscription inactive' }, { status: 402 });
    }

    const { data: aiSettings, error: aiSettingsError } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (aiSettingsError && aiSettingsError.code !== 'PGRST116') {
      console.error('Failed to load AI settings:', aiSettingsError);
    }

    let convId = conversationId;

    if (!convId) {
      const limit = getConversationLimit(getPlanByPriceId(subscription?.stripe_price_id));

      if (limit !== null) {
        const periodStart = getBillingPeriodStart(subscription?.current_period_end ?? null);
        const { count, error: usageError } = await supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .gte('started_at', periodStart.toISOString());

        if (usageError) {
          console.error('Failed to check conversation usage:', usageError);
        } else if ((count ?? 0) >= limit) {
          return NextResponse.json({ error: 'Usage limit reached' }, { status: 402 });
        }
      }

      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ business_id: businessId })
        .select()
        .single();

      if (convError || !conv) {
        console.error('Failed to create conversation:', convError);
        return NextResponse.json({ error: 'Failed to start conversation' }, { status: 500 });
      }
      convId = conv.id;
    }

    const { error: userMsgError } = await supabase.from('messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    });

    if (userMsgError) {
      console.error('Failed to save user message:', userMsgError);
    }

    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('Failed to load message history:', historyError);
    }

    const systemPrompt = buildSystemPrompt(business, aiSettings || {});
    const chatHistory = (history || []).map((m) => ({
      role: m.role as string,
      content: m.content as string,
    }));

    const aiResponse = await callAI(systemPrompt, chatHistory);
    const cleanResponse = stripLeadData(aiResponse);
    const leadData = extractLeadData(aiResponse);

    const { error: assistantMsgError } = await supabase.from('messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: cleanResponse,
    });

    if (assistantMsgError) {
      console.error('Failed to save assistant message:', assistantMsgError);
    }

    const name = typeof leadData?.name === 'string' ? leadData.name : '';
    const phone = typeof leadData?.phone === 'string' ? leadData.phone : '';
    const email = typeof leadData?.email === 'string' ? leadData.email : '';
    const vehicle = typeof leadData?.vehicle === 'string' ? leadData.vehicle : '';
    const serviceRequested = typeof leadData?.service_requested === 'string' ? leadData.service_requested : '';
    const preferredDateRaw = typeof leadData?.preferred_date === 'string' ? leadData.preferred_date : '';
    const isoDate = toIsoDateOrNull(preferredDateRaw);
    const leadScore = leadData ? toLeadScoreOrNull(leadData.lead_score) : null;
    const intent = leadData ? toLeadIntentOrNull(leadData.intent) : null;
    const qualification = leadScore !== null ? qualificationFromScore(leadScore) : null;

    if (leadData && Object.values(leadData).some((v) => v)) {
      const { data: existingConv, error: existingConvError } = await supabase
        .from('conversations')
        .select('lead_id')
        .eq('id', convId)
        .single();

      if (existingConvError) {
        console.error('Failed to look up conversation:', existingConvError);
      }

      if (existingConv?.lead_id) {
        const updateData: Record<string, string | number> = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email;
        if (vehicle) updateData.vehicle = vehicle;
        if (serviceRequested) updateData.service_requested = serviceRequested;
        if (isoDate) updateData.preferred_date = isoDate;
        if (leadScore !== null) updateData.lead_score = leadScore;
        if (intent) updateData.intent = intent;
        if (qualification) updateData.qualification = qualification;

        const { error: updateLeadError } = await supabase
          .from('leads')
          .update(updateData)
          .eq('id', existingConv.lead_id);

        if (updateLeadError) {
          console.error('Failed to update lead:', updateLeadError);
        }
      } else {
        const { data: newLead, error: newLeadError } = await supabase
          .from('leads')
          .insert({
            business_id: businessId,
            name,
            phone,
            email,
            vehicle,
            service_requested: serviceRequested,
            preferred_date: isoDate,
            notes: !isoDate && preferredDateRaw ? `Requested date: ${preferredDateRaw}` : '',
            status: 'new',
            lead_score: leadScore ?? 0,
            intent: intent ?? 'inquiry',
            qualification: qualification ?? 'cold',
          })
          .select()
          .single();

        if (newLeadError) {
          console.error('Failed to create lead:', newLeadError);
        } else if (newLead) {
          const { error: linkError } = await supabase
            .from('conversations')
            .update({ lead_id: newLead.id, visitor_name: name || null })
            .eq('id', convId);

          if (linkError) {
            console.error('Failed to link lead to conversation:', linkError);
          }
        }
      }
    }

    if (name) {
      const { error: nameError } = await supabase
        .from('conversations')
        .update({ visitor_name: name })
        .eq('id', convId);

      if (nameError) {
        console.error('Failed to update visitor name:', nameError);
      }
    }

    return NextResponse.json({
      message: cleanResponse,
      conversationId: convId,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
