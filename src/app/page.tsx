import Link from 'next/link';
import {
  MessageSquare,
  Users,
  BarChart3,
  Zap,
  Clock,
  Shield,
  ChevronRight,
  Check,
  Bot,
  ArrowRight,
  Sparkles,
  Building2,
  Code2,
  Inbox,
  HelpCircle,
} from 'lucide-react';
import { SiteFooter } from '@/components/layout/site-footer';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">LeadFlow AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 ring-1 ring-primary-100 rounded-full text-sm font-medium mb-6">
          <Bot className="w-4 h-4" />
          AI-Powered Lead Management
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary max-w-4xl mx-auto leading-tight tracking-tight">
          Turn More Website Visitors Into{' '}
          <span className="text-primary-600">Booked Customers</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          LeadFlow AI is an intelligent receptionist that answers customer questions,
          captures leads, and books appointments for your auto detailing business — 24/7.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-3 shadow-lg shadow-primary-500/20 flex items-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base px-8 py-3 flex items-center gap-2">
            See How It Works <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-16 max-w-[380px] mx-auto">
          <div className="rounded-[2.5rem] bg-ink-900 p-3 shadow-2xl shadow-primary-900/20">
            <div className="relative rounded-[2rem] overflow-hidden bg-white">
              <div className="absolute top-0 inset-x-0 flex justify-center pt-2.5 z-10 pointer-events-none">
                <div className="w-20 h-5 rounded-full bg-ink-900" />
              </div>
              <div className="pt-6">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3.5 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/15 ring-1 ring-white/25 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI Assistant</p>
                    <p className="text-xs text-primary-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500" /> Online
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-surface-secondary text-left">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] bg-white text-text-primary shadow-sm border border-border-light">
                      <p className="text-sm">Hi there! Welcome to Pristine Auto Detailing. I can help you with pricing, services, or booking an appointment. What can I help you with today?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] bg-primary-600 text-white shadow-sm">
                      <p className="text-sm">How much for a full detail on my SUV?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] bg-white text-text-primary shadow-sm border border-border-light">
                      <p className="text-sm">Great question! Our Full Detail package for SUVs starts at $249. It includes a thorough exterior wash, clay bar treatment, polish, wax, full interior cleaning, leather conditioning, and carpet shampooing. Would you like to book an appointment?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: Building2,
      title: 'Set Up Your Business Profile',
      description: 'Enter your services, prices, hours, and FAQs. The AI learns everything about your business.',
    },
    {
      step: '02',
      icon: Code2,
      title: 'Add the Chat Widget to Your Site',
      description: 'Copy a simple code snippet to your website. Customers can start chatting immediately.',
    },
    {
      step: '03',
      icon: Bot,
      title: 'AI Handles the Conversation',
      description: 'The AI answers questions, explains your services, and collects lead information automatically.',
    },
    {
      step: '04',
      icon: Inbox,
      title: 'Leads Flow Into Your Dashboard',
      description: 'Every lead is captured with name, phone, email, vehicle, and requested service. Track and manage from one place.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">How LeadFlow AI Works</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Get set up in minutes and start capturing leads automatically.
          </p>
        </div>
        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border" />
          {steps.map((step) => (
            <div key={step.step} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative z-10 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-primary-500/20 shrink-0">
                  {step.step}
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-primary-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Bot,
      title: 'AI Receptionist',
      description: 'Answers customer questions about your services, prices, and availability instantly — using only your real business information.',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      icon: Users,
      title: 'Lead Capture',
      description: 'Automatically collects name, phone, email, vehicle details, and preferred appointment date during conversations.',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Visual Pipeline',
      description: 'See all your leads organized by status — from new inquiry to booked appointment — in a drag-friendly pipeline view.',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      icon: MessageSquare,
      title: 'Conversation History',
      description: 'Every customer conversation is saved. Review what was discussed, what was quoted, and what was promised.',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a lead again. Your AI receptionist works around the clock, even when you\'re out on a job.',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Shield,
      title: 'Accurate Information Only',
      description: 'The AI never invents prices, services, or policies. It only shares what you\'ve configured in your business profile.',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  const [hero, ...rest] = features;

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">Everything You Need to Grow</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Built specifically for auto detailing businesses that want to convert more visitors into paying customers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-8 md:col-span-2 flex flex-col sm:flex-row items-start gap-6">
            <div className={`w-14 h-14 rounded-2xl ${hero.iconBg} flex items-center justify-center shrink-0`}>
              <hero.icon className={`w-7 h-7 ${hero.iconColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{hero.title}</h3>
              <p className="text-text-secondary leading-relaxed">{hero.description}</p>
            </div>
          </div>
          {rest.map((feature) => (
            <div key={feature.title} className="card p-6">
              <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for getting started with AI-powered lead capture.',
      features: [
        '100 AI conversations/month',
        'Unlimited leads',
        'Chat widget',
        'Email notifications',
        'Basic dashboard',
      ],
      cta: 'Start Free Trial',
      featured: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'For growing businesses that want the full experience.',
      features: [
        'Unlimited AI conversations',
        'Unlimited leads',
        'Chat widget',
        'SMS & email notifications',
        'Advanced analytics',
        'Pipeline management',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For multi-location businesses and franchises.',
      features: [
        'Everything in Professional',
        'Multiple locations',
        'Custom AI training',
        'API access',
        'Dedicated account manager',
        'White-label widget',
      ],
      cta: 'Contact Sales',
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card overflow-hidden relative transition-shadow ${
                plan.featured
                  ? 'ring-2 ring-primary-600 shadow-xl lg:-translate-y-3'
                  : 'hover:shadow-md'
              }`}
            >
              {plan.featured && (
                <div className="bg-primary-600 text-white text-xs font-semibold tracking-wide uppercase py-2.5 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}
              <div className="p-8">
                <div className="mb-6 pb-6 border-b border-border-light">
                  <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                    <span className="text-text-secondary">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block text-center py-2.5 rounded-lg font-medium transition-colors ${
                    plan.featured
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-surface-tertiary text-text-primary hover:bg-surface-secondary border border-border'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'How does the AI know about my business?',
      answer: 'You provide your services, prices, business hours, FAQs, and booking instructions through the onboarding process and AI settings page. The AI only uses the information you provide — it never invents or guesses.',
    },
    {
      question: 'Can I see what the AI says to my customers?',
      answer: 'Yes. Every conversation is stored and accessible from your dashboard. You can review exactly what was discussed, what was quoted, and what lead information was collected.',
    },
    {
      question: 'How do I add the chat widget to my website?',
      answer: 'After setup, we provide a simple code snippet you can paste into your website. It works with any website builder — WordPress, Squarespace, Wix, or custom sites.',
    },
    {
      question: 'What if a customer asks something the AI doesn\'t know?',
      answer: 'The AI will politely let the customer know it doesn\'t have that information and suggest they call your business directly. It never makes up answers.',
    },
    {
      question: 'Can I customize the AI\'s personality?',
      answer: 'Yes! You can set the AI\'s greeting, tone (friendly, professional, casual), and add specific instructions about how you want it to communicate with your customers.',
    },
    {
      question: 'Is my business data secure?',
      answer: 'Absolutely. All data is encrypted and isolated. No business can see another business\'s data, leads, or conversations. We use enterprise-grade security through Supabase.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="card p-6 flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{faq.question}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <SiteFooter />
    </div>
  );
}
