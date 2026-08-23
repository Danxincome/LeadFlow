import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeadFlow AI - AI Receptionist for Auto Detailing',
  description: 'Turn more website visitors into booked customers with an AI receptionist built for auto detailing businesses.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
