import Link from 'next/link';
import type { Metadata } from 'next';
import { Zap, ArrowLeft, ScrollText } from 'lucide-react';
import { SiteFooter } from '@/components/layout/site-footer';

export const metadata: Metadata = {
  title: 'Terms of Service — LeadFlow AI',
  description: 'The terms that govern use of the LeadFlow AI platform.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 pb-8 border-b border-border-light last:border-0 last:mb-0 last:pb-0">
      <h2 className="text-lg font-semibold text-text-primary mb-3 pl-3 border-l-2 border-primary-200">{title}</h2>
      <div className="space-y-3 text-sm text-text-secondary leading-relaxed">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
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
          <ScrollText className="w-6 h-6 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-text-tertiary mb-8">Last updated: August 23, 2026</p>

        <div className="card p-4 mb-10 bg-primary-50 border-primary-100">
          <p className="text-sm text-text-secondary leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) are general product terms for the LeadFlow AI platform (&quot;LeadFlow,&quot;
            &quot;we,&quot; &quot;us&quot;). They govern use of the LeadFlow dashboard and chatbot by businesses (&quot;Business
            Customers&quot;). By creating an account or using LeadFlow, a Business Customer agrees to these Terms. These Terms do
            not, by themselves, make any Business Customer compliant with laws that apply to that business — each Business
            Customer remains responsible for its own legal and regulatory obligations.
          </p>
        </div>

        <Section title="1. The Service">
          <p>
            LeadFlow is a SaaS platform that provides an AI-powered chat widget businesses can embed on their own website, a
            dashboard for reviewing and managing the leads and conversations that widget generates, and related account and
            configuration tools (the &quot;Service&quot;).
          </p>
        </Section>

        <Section title="2. Accounts and Eligibility">
          <p>
            You must provide accurate information when creating a LeadFlow account and keep your login credentials secure. You are
            responsible for all activity that occurs under your account. You represent that you are authorized to act on behalf of
            the business for which you are configuring the Service.
          </p>
        </Section>

        <Section title="3. Business Customer Responsibilities">
          <p>As a Business Customer, you are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The accuracy of the business information (services, pricing, hours, policies, FAQs) you provide for the chatbot to use.</li>
            <li>
              Complying with laws that apply to your own collection, use, and handling of information from your customers through
              the chatbot, including obtaining any consents or providing any notices required in your jurisdiction or industry.
            </li>
            <li>Reviewing chatbot conversations and lead data for accuracy before relying on them for business decisions or customer commitments.</li>
            <li>Not using the Service for any unlawful, fraudulent, deceptive, or abusive purpose.</li>
            <li>
              Not instructing or encouraging your customers to submit sensitive personal information (such as government ID
              numbers, payment card numbers, or health information) through the chatbot beyond what is necessary to receive the
              requested service.
            </li>
          </ul>
        </Section>

        <Section title="4. AI-Generated Content; No Guarantee of Accuracy">
          <p>
            The chatbot uses artificial intelligence (currently Google&apos;s Gemini API, as described in our{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Privacy Policy
            </Link>
            ) to generate responses automatically. While the chatbot is designed to answer based only on the business information
            you provide, AI-generated responses may occasionally be incomplete, out of date, or inaccurate. You should review
            chatbot conversations and are responsible for verifying important information — including pricing, availability, and
            appointment details — before relying on it or treating it as a binding commitment to a customer.
          </p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>
            The Service relies on third-party infrastructure and AI providers, including Supabase (database and hosting) and
            Google (the Gemini API), as described in our Privacy Policy. LeadFlow does not control these providers and is not
            responsible for their independent acts, omissions, outages, or changes to their own terms or practices. Your use of the
            Service is also subject to any applicable terms those providers impose on end users of AI-generated content.
          </p>
        </Section>

        <Section title="6. Fees">
          <p>
            Certain features of the Service may require payment of fees, as described on our pricing page or in an order presented
            to you at signup or upgrade. Fees, billing terms, and any trial periods will be disclosed to you before you are charged.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            LeadFlow and its licensors retain all rights, title, and interest in and to the Service, including its software,
            design, and branding. As between you and LeadFlow, you retain ownership of the business content you submit (such as
            your services, pricing, and FAQs). You grant LeadFlow a license to use that content solely as necessary to operate and
            provide the Service to you.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p>
            THE SERVICE, INCLUDING ALL AI-GENERATED CONTENT, IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT
            WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
            OR COMPLETELY SECURE.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEADFLOW AND ITS SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING FROM OR
            RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY
            CLAIM RELATING TO THE SERVICE WILL NOT EXCEED THE AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE
            CLAIM AROSE.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            You may stop using the Service and close your account at any time. We may suspend or terminate your access to the
            Service if we reasonably believe you have violated these Terms, misused the Service, or created risk or legal exposure
            for LeadFlow. Sections of these Terms that by their nature should survive termination (such as intellectual property,
            disclaimers, and limitation of liability) will survive.
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            We may update these Terms from time to time to reflect changes to the Service or for legal or operational reasons. We
            will update the &quot;Last updated&quot; date above when we do, and material changes may be communicated through the
            dashboard or by other reasonable means. Continued use of the Service after changes take effect constitutes acceptance
            of the updated Terms.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms will be governed by the laws of [GOVERNING LAW JURISDICTION], without regard to its conflict-of-laws
            principles, except where applicable law requires otherwise.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            This Service is operated by <span className="font-medium text-text-primary">LeadFlow AI</span>. If you have
            questions about these Terms, please contact us at{' '}
            <span className="font-medium text-text-primary">d95555194@gmail.com</span>. For privacy-related requests, see our{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>
      </div>

      <SiteFooter />
    </div>
  );
}
