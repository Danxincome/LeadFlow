'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, User, Bot, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoading, Spinner } from '@/components/ui/loading';
import type { Conversation, Message } from '@/lib/types';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const router = useRouter();

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
        router.push('/dashboard/onboarding');
        return;
      }

      const { data } = await supabase
        .from('conversations')
        .select('*, lead:leads(name, email)')
        .eq('business_id', business.id)
        .order('updated_at', { ascending: false });

      setConversations(data || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function selectConversation(conv: Conversation) {
    setSelected(conv);
    setLoadingMessages(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setLoadingMessages(false);
  }

  if (loading) return <PageLoading />;

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => { setSelected(null); setMessages([]); }}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to conversations
        </button>

        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-text-primary">
              {selected.visitor_name || 'Visitor'}
            </h2>
            <p className="text-xs text-text-secondary">
              Started {new Date(selected.started_at).toLocaleString()}
            </p>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {loadingMessages ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : messages.length === 0 ? (
              <p className="text-center text-text-secondary text-sm py-8">No messages in this conversation.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 max-w-[75%] ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-surface-tertiary text-text-primary rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-200' : 'text-text-tertiary'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-text-tertiary" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Conversations</h1>
        <p className="text-text-secondary mt-1">View all customer chat conversations.</p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Conversations will appear here when customers chat with your AI receptionist."
        />
      ) : (
        <div className="card divide-y divide-border">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-secondary transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-text-tertiary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {conv.visitor_name || 'Visitor'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(conv.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <MessageSquare className="w-4 h-4 text-text-tertiary shrink-0 ml-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
