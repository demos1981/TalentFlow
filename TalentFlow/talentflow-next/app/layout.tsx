import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TalentFlow - AI-підсилена платформа для найму',
  description: 'Революція в наймі персоналу з використанням штучного інтелекту',
  keywords: 'AI, найм, HR, рекрутинг, таланти, автоматизація',
  authors: [{ name: 'TalentFlow Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'TalentFlow - AI-підсилена платформа для найму',
    description: 'Революція в наймі персоналу з використанням штучного інтелекту',
    type: 'website',
    locale: 'uk_UA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalentFlow - AI-підсилена платформа для найму',
    description: 'Революція в наймі персоналу з використанням штучного інтелекту',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
