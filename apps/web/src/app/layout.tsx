import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from '@/components/providers';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { siteConfig } from '@/lib/site-config';
import { publicMetadata } from '@/lib/public-seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  ...publicMetadata('/'),
  applicationName: 'DoryAI',
  robots: {
    index: siteConfig.indexable,
    follow: siteConfig.indexable,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DoryAI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

import { UserProvider } from '@/context/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <ConvexClientProvider>
              <UserProvider>
                <TooltipProvider>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </TooltipProvider>
              </UserProvider>
            </ConvexClientProvider>
            <Sonner />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
