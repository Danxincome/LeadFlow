import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

  return `You are an AI receptionist for ${business.business_name}. Your job is to help customers, answer their questions, and capture their information as a lead.

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
<!--LEAD_DATA:{"name":"","phone":"","email":"","vehicle":"","service_requested":"","preferred_date":""}-->
Only include fields that the customer has actually provided. Update this block whenever you learn new information.`;
}

async function callAI(systemPrompt: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'claude-sonnet-5';

  if (!apiKey) {
    return generateFallbackResponse(messages);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    console.error('AI API error:', response.status, await response.text());
    return generateFallbackResponse(messages);
  }

  const data = await response.json();
  return data.content[0]?.text || 'I apologize, I had trouble processing that. Could you try again?';
}

function generateFallbackResponse(messages: Array<{ role: string; content: string }>): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const messageCount = messages.filter((m) => m.role === 'user').length;

  if (messageCount === 1) {
    if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('how much')) {
      return "I'd love to help you with pricing! To give you an accurate quote, could you tell me what service you're interested in and what type of vehicle you have?";
    }
    if (lastMessage.includes('hour') || lastMessage.includes('open') || lastMessage.includes('when')) {
      return "Great question! Our business hours are listed in our profile. Is there a particular day you're looking to come in? I can also help you find the right service for your vehicle.";
    }
    if (lastMessage.includes('book') || lastMessage.includes('appointment') || lastMessage.includes('schedule')) {
      return "I'd be happy to help you get booked! What service are you interested in, and what type of vehicle do you have? Once I have a few details, I can walk you through the booking process.";
    }
    return "Thanks for reaching out! I can help you with information about our services, pricing, and scheduling. What are you looking for today?";
  }

  if (messageCount === 2) {
    return "That's great! To make sure we get you the best service, could you share your name and the best phone number to reach you? That way we can follow up with all the details.";
  }

  if (messageCount === 3) {
    return "Perfect, thank you! And what's the best email address for you? We'll send over a confirmation once everything is set up.";
  }

  return "Thank you for all that information! We'll be in touch shortly to confirm your appointment. Is there anything else you'd like to know about our services?";
}

function extractLeadData(text: string): Record<string, string> | null {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, conversationId, message } = body;

    if (!businessId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { data: aiSettings } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    let convId = conversationId;

    if (!convId) {
      const { data: conv } = await supabase
        .from('conversations')
        .insert({ business_id: businessId })
        .select()
        .single();
      convId = conv?.id;
    }

    await supabase.from('messages').insert({
      conversation_id: convId,
      role: 'user',
      content: message,
    });

    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    const systemPrompt = buildSystemPrompt(business, aiSettings || {});
    const chatHistory = (history || []).map((m) => ({
      role: m.role as string,
      content: m.content as string,
    }));

    const aiResponse = await callAI(systemPrompt, chatHistory);
    const cleanResponse = stripLeadData(aiResponse);
    const leadData = extractLeadData(aiResponse);

    await supabase.from('messages').insert({
      conversation_id: convId,
      role: 'assistant',
      content: cleanResponse,
    });

    if (leadData && Object.values(leadData).some((v) => v)) {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('lead_id')
        .eq('id', convId)
        .single();

      if (existingConv?.lead_id) {
        const updateData: Record<string, string> = {};
        if (leadData.name) updateData.name = leadData.name;
        if (leadData.phone) updateData.phone = leadData.phone;
        if (leadData.email) updateData.email = leadData.email;
        if (leadData.vehicle) updateData.vehicle = leadData.vehicle;
        if (leadData.service_requested) updateData.service_requested = leadData.service_requested;
        if (leadData.preferred_date) updateData.preferred_date = leadData.preferred_date;

        await supabase.from('leads').update(updateData).eq('id', existingConv.lead_id);
      } else {
        const { data: newLead } = await supabase
          .from('leads')
          .insert({
            business_id: businessId,
            name: leadData.name || '',
            phone: leadData.phone || '',
            email: leadData.email || '',
            vehicle: leadData.vehicle || '',
            service_requested: leadData.service_requested || '',
            preferred_date: leadData.preferred_date || null,
            status: 'new',
          })
          .select()
          .single();

        if (newLead) {
          await supabase
            .from('conversations')
            .update({ lead_id: newLead.id, visitor_name: leadData.name || null })
            .eq('id', convId);
        }
      }
    }

    if (leadData?.name) {
      await supabase
        .from('conversations')
        .update({ visitor_name: leadData.name })
        .eq('id', convId);
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
