'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Zap } from 'lucide-react';
import { Spinner } from '@/components/ui/loading';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface ChatWidgetProps {
  businessId: string;
  greeting?: string;
  inline?: boolean;
}

export function ChatWidget({ businessId, greeting, inline = false }: ChatWidgetProps) {
  const [open, setOpen] = useState(inline);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0 && greeting) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: greeting,
        },
      ]);
    }
  }, [open, greeting, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          conversationId,
          message: text,
        }),
      });

      const data = await res.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || "I'm sorry, I couldn't process that. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const chatContent = (
    <div className={`flex flex-col ${inline ? 'h-[600px]' : 'h-[500px]'}`}>
      <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Assistant</p>
            <p className="text-xs text-primary-200">Online</p>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-secondary">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary-600" />
              </div>
            )}
            <div
              className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-sm'
                  : 'bg-white text-text-primary shadow-sm border border-border-light rounded-tl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-text-tertiary" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary-600" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-border-light">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-border bg-white rounded-b-2xl shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3.5 py-2.5 bg-surface-secondary rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-text-tertiary mt-2 flex items-center justify-center gap-1">
          Powered by LeadFlow AI <Zap className="w-2.5 h-2.5" />
        </p>
      </form>
    </div>
  );

  if (inline) {
    return (
      <div className="card overflow-hidden rounded-2xl shadow-lg max-w-md mx-auto">
        {chatContent}
      </div>
    );
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]">
          <div className="card overflow-hidden rounded-2xl shadow-2xl">
            {chatContent}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-105 flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </>
  );
}
