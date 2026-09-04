import Link from 'next/link';
import type { Metadata } from 'next';
import { Zap, ArrowLeft, ShieldCheck } from 'lucide-react';
import { SiteFooter } from '@/components/layout/site-footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — LeadFlow AI',
  description: 'How LeadFlow AI collects, uses, and protects information for business customers and their end customers.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 pb-8 border-b border-border-light last:border-0 last:mb-0 last:pb-0">
      <h2 className="text-lg font-semibold text-text-primary mb-3 pl-3 border-l-2 border-primary-200">{title}</h2>
      <div className="space-y-3 text-sm text-text-secondary leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
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

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5">
          <ShieldCheck className="w-6 h-6 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-tertiary mb-8">Last updated: August 23, 2026</p>

        <div className="card p-4 mb-10 bg-primary-50 border-primary-100">
          <p className="text-sm text-text-secondary leading-relaxed">
            This Privacy Policy describes the general privacy practices of the LeadFlow AI platform (&quot;LeadFlow,&quot; &quot;we,&quot; &quot;us&quot;).
            It is written in plain language to be broadly understandable and reflects how the LeadFlow product itself is designed to
            work. It is <strong>not</strong> a certification, warranty, or guarantee that any individual business using LeadFlow
            (a &quot;Business Customer&quot;) is independently compliant with every privacy law that may apply to that business, its
            industry, or its location. Each Business Customer is responsible for its own compliance obligations, including obtaining
            any consents required to collect information from its own customers through the chatbot.
          </p>
        </div>

        <Section title="1. Who This Policy Covers">
          <p>
            LeadFlow AI is a software-as-a-service (&quot;SaaS&quot;) platform that lets businesses (&quot;Business Customers&quot;)
            set up an AI-powered chat receptionist for their website, manage the leads it captures, and review conversation history
            from a dashboard. This policy describes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Information we collect from Business Customers who sign up for and use LeadFlow (the dashboard, account, and business profile).</li>
            <li>
              Information submitted by the visitors and customers of a Business Customer (&quot;End Customers&quot;) when they chat
              with that business&apos;s embedded LeadFlow chatbot.
            </li>
          </ul>
          <p>
            If you are an End Customer chatting with a business&apos;s chatbot, please note that LeadFlow operates the chatbot
            technology on behalf of the business you are messaging. That business controls the content, services, and instructions
            the chatbot is configured with, and receives the information you provide through the chat in its own LeadFlow dashboard.
            For questions about how a specific business handles your information, you may also need to contact that business
            directly, in addition to LeadFlow.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p className="font-medium text-text-primary">From Business Customers</p>
          <p>When a business signs up for and configures LeadFlow, we collect information such as:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account information: email address and authentication credentials, managed through our database provider&apos;s authentication system.</li>
            <li>Business profile information: business name, owner name, phone number, email, address, website, services and pricing, business hours, FAQs, and booking instructions.</li>
            <li>AI configuration: the chatbot greeting message, tone, and any additional instructions the business provides for the AI.</li>
            <li>Lead and conversation data generated through use of the Service, as described below.</li>
          </ul>

          <p className="font-medium text-text-primary mt-4">From End Customers, via the embedded chatbot</p>
          <p>
            When someone chats with a Business Customer&apos;s LeadFlow chatbot, the chatbot may collect information the End
            Customer chooses to provide during the conversation, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Vehicle information</li>
            <li>Requested services</li>
            <li>Appointment or preferred date information</li>
            <li>The content of the chat messages exchanged with the chatbot</li>
          </ul>
          <p>
            This information is used to create and update a &quot;lead&quot; record and conversation history that is visible to the
            Business Customer in their LeadFlow dashboard.
          </p>

          <p className="font-medium text-text-primary mt-4">Automatically collected information</p>
          <p>
            Our hosting, database, and AI service providers may automatically log limited technical information in the ordinary
            course of operating the Service, such as timestamps and request metadata. LeadFlow does not currently use the chatbot
            to collect precise location data, payment card information, or government identification numbers, and End Customers
            should not submit that type of sensitive information through the chat (see Section 9).
          </p>
        </Section>

        <Section title="3. How We Use Information">
          <p>We use the information described above to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Operate and provide the AI chatbot, including generating responses grounded in a Business Customer&apos;s configured business information.</li>
            <li>Capture, organize, and update lead and conversation records so Business Customers can follow up with their own customers.</li>
            <li>Operate the LeadFlow dashboard, including authentication, business profile management, and analytics shown to a Business Customer about their own account.</li>
            <li>Provide customer support to Business Customers.</li>
            <li>Maintain, secure, and troubleshoot the Service, including detecting and preventing fraud, abuse, or security incidents.</li>
            <li>Improve and develop the Service, such as understanding feature usage and diagnosing errors.</li>
            <li>Comply with applicable law and enforce our Terms of Service.</li>
          </ul>
          <p>
            We do not use End Customer chat information to serve them advertising, and we do not sell End Customer information to
            data brokers.
          </p>
        </Section>

        <Section title="4. How Information Is Shared">
          <p>We share information in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium text-text-primary">With the relevant Business Customer.</span> Information an End
              Customer submits through a chatbot is shared with the Business Customer operating that chatbot, since providing that
              information to the business is the core purpose of the Service.
            </li>
            <li>
              <span className="font-medium text-text-primary">With service providers (subprocessors).</span> We use third-party
              infrastructure and AI providers to operate LeadFlow, described in Section 5 below.
            </li>
            <li>
              <span className="font-medium text-text-primary">For legal reasons.</span> We may disclose information if required by
              law, legal process, or governmental request, or to protect the rights, property, or safety of LeadFlow, our users, or
              others.
            </li>
            <li>
              <span className="font-medium text-text-primary">In connection with a business transaction.</span> If LeadFlow is
              involved in a merger, acquisition, financing, or sale of assets, information may be transferred as part of that
              transaction, subject to standard confidentiality protections.
            </li>
          </ul>
        </Section>

        <Section title="5. Third-Party Infrastructure and AI Providers">
          <p className="font-medium text-text-primary">Database and hosting: Supabase</p>
          <p>
            LeadFlow uses Supabase to store business profiles, lead records, conversation and message history, and account
            authentication data. Supabase acts as our database and backend infrastructure provider and processes this information
            on our behalf, subject to its own security and privacy practices.
          </p>

          <p className="font-medium text-text-primary mt-4">AI provider: Google Gemini</p>
          <p>
            LeadFlow uses Google&apos;s Gemini API to generate the chatbot&apos;s responses. To do this, the content of a chat
            conversation — along with the business information needed to ground an accurate answer (such as services, pricing, and
            hours) — is transmitted to Google&apos;s Gemini API as necessary to generate a response.
          </p>
          <p>
            Google&apos;s own terms distinguish between its <em>paid</em> Gemini API services and its <em>unpaid</em> (free) Gemini
            API services, and how a given conversation is handled depends on which tier is in use at the time:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              On Google&apos;s <span className="font-medium text-text-primary">unpaid / free</span> Gemini API tier, Google&apos;s
              published terms state that Google may use submitted content to provide, improve, and develop Google&apos;s own
              products and services, and that human reviewers may read, annotate, and process that content as part of that process
              (Google states it takes steps to disconnect such content from the associated account or API key before human review).
            </li>
            <li>
              On Google&apos;s <span className="font-medium text-text-primary">paid</span> Gemini API tier, Google&apos;s published
              terms state that Google does not use submitted prompts or generated responses to improve its products.
            </li>
            <li>
              Google&apos;s terms also state that, for users located in the European Economic Area, the United Kingdom, or
              Switzerland, the more protective paid-tier data-handling terms apply regardless of which underlying tier is used.
            </li>
          </ul>
          <p>
            We do not make guarantees about Google&apos;s data retention or model-training practices beyond what Google itself
            publishes, and Google may update its own terms at any time. For the most current and complete description of how Google
            handles data submitted to the Gemini API, please refer to Google&apos;s own Gemini API Additional Terms of Service and
            Privacy Policy. Because AI providers may, depending on service tier, use or review submitted content as described
            above, End Customers and Business Customers should avoid entering sensitive information into the chat that is not
            necessary to receive the requested service (see Section 9).
          </p>
        </Section>

        <Section title="6. Security">
          <p>
            We use reasonable administrative, technical, and organizational measures designed to protect information from
            unauthorized access, use, or disclosure, including relying on access controls and encryption in transit provided by our
            infrastructure providers. However, no method of transmission over the internet or method of electronic storage is
            completely secure, and we cannot guarantee absolute security of any information.
          </p>
        </Section>

        <Section title="7. Data Retention and Deletion">
          <p>
            We generally retain business profile, lead, and conversation information for as long as a Business Customer maintains
            an active account, or as needed to provide the Service, comply with our legal obligations, resolve disputes, and
            enforce our agreements. Business Customers can generally update or remove lead records and business profile information
            directly from their dashboard.
          </p>
          <p>
            If a Business Customer deletes information or closes their account, we work to remove or de-identify the associated
            data within a reasonable period, though residual copies may persist for a limited time in routine backups or logs
            before being fully purged. Retention periods may also vary depending on the type of information and applicable legal
            requirements.
          </p>
        </Section>

        <Section title="8. Your Privacy Choices and Rights">
          <p>
            Depending on where you live, you may have rights to request access to, correction of, or deletion of personal
            information we hold about you, or to object to or restrict certain processing. Business Customers can exercise many of
            these rights directly through their dashboard for information tied to their account.
          </p>
          <p>
            To make a privacy request — whether you are a Business Customer or an End Customer who chatted with a business using
            LeadFlow — please contact us at <span className="font-medium text-text-primary">[PRIVACY EMAIL]</span>. We may need to
            verify your identity, and to route certain requests to the relevant Business Customer, before completing a request.
          </p>
        </Section>

        <Section title="9. AI Disclosure and Sensitive Information">
          <p>
            The chatbot you interact with on a Business Customer&apos;s website is powered by artificial intelligence, not a human
            agent, unless the business tells you otherwise. Responses are generated automatically based on the information the
            business has configured and the conversation so far, and may occasionally be incomplete or inaccurate.
          </p>
          <p>
            Please do not submit sensitive personal information through the chat that is not necessary to receive the requested
            service — for example, Social Security or government ID numbers, payment card or financial account numbers, precise
            health information, or account passwords. The chat is intended to collect basic contact and service-request details
            (such as your name, phone number, email, vehicle information, requested service, and preferred appointment date), not
            sensitive personal data.
          </p>
        </Section>

        <Section title="10. California Privacy Disclosures">
          <p>
            This section provides additional disclosures for California residents under the California Consumer Privacy Act, as
            amended by the California Privacy Rights Act (&quot;CCPA&quot;). It supplements, and should be read together with, the
            rest of this Privacy Policy.
          </p>
          <p className="font-medium text-text-primary">Notice at collection</p>
          <p>
            In the past 12 months, depending on how you interact with LeadFlow, we may have collected the following categories of
            personal information, for the business and operational purposes described in Section 3 above:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identifiers (such as name, email address, phone number, and account credentials).</li>
            <li>Customer records information (such as business contact details, vehicle information, and requested services).</li>
            <li>Commercial information (such as services requested and appointment preferences).</li>
            <li>Internet or other electronic network activity (such as chat message content and limited technical/request metadata).</li>
          </ul>
          <p>
            We disclose these categories of personal information to the service providers described in Section 5 (Supabase and
            Google) so that they can process it on our behalf, and to the relevant Business Customer as described in Section 4.
          </p>
          <p className="font-medium text-text-primary">No sale or sharing of personal information</p>
          <p>
            We do not sell personal information, and we do not share personal information for cross-context behavioral advertising,
            as those terms are defined under the CCPA.
          </p>
          <p className="font-medium text-text-primary">Your California rights</p>
          <p>Subject to certain exceptions, California residents may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Know what personal information we have collected, used, disclosed, or sold about you;</li>
            <li>Request deletion of your personal information;</li>
            <li>Request correction of inaccurate personal information;</li>
            <li>Limit the use or disclosure of sensitive personal information; and</li>
            <li>Not be discriminated against for exercising any of these rights.</li>
          </ul>
          <p>
            To exercise these rights, contact us at <span className="font-medium text-text-primary">[PRIVACY EMAIL]</span>. You may
            also designate an authorized agent to make a request on your behalf, subject to our ability to verify that
            authorization. We will not discriminate against you for exercising your privacy rights.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            LeadFlow is intended for use by businesses and their adult customers. It is not directed to children, and we do not
            knowingly collect personal information from children through the chatbot. If you believe a child has provided personal
            information to LeadFlow, please contact us at <span className="font-medium text-text-primary">[PRIVACY EMAIL]</span> so
            we can address it.
          </p>
        </Section>

        <Section title="12. International Users">
          <p>
            LeadFlow and its service providers may process and store information in the United States and other countries where we
            or our service providers operate. If you access the Service from outside the United States, you understand that your
            information may be transferred to, stored, and processed in a country that may have different data protection laws
            than your own.
          </p>
        </Section>

        <Section title="13. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes to the Service, our data practices, or legal
            requirements. We will update the &quot;Last updated&quot; date above when we do, and material changes may be
            communicated through the dashboard or by other reasonable means.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>
            LeadFlow AI is operated by <span className="font-medium text-text-primary">[LEGAL BUSINESS NAME]</span>. If you have
            questions about this Privacy Policy or wish to exercise a privacy right described above, please contact us at{' '}
            <span className="font-medium text-text-primary">[PRIVACY EMAIL]</span>.
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
