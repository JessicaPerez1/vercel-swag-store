import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { CartProvider } from '@/lib/cart-context';
import { SiteHeader } from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { getStoreConfig } from '@/lib/api';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig().catch(() => null);

  const defaultTitle = config?.seo.defaultTitle ?? 'Swag Store';
  const titleTemplate = config?.seo.titleTemplate ?? '%s | Swag Store';
  const defaultDescription =
    config?.seo.defaultDescription ??
    'Premium swag for developers who build with Vercel., from tees to tech gear, represent the tools you love.';
  const siteName = config?.storeName ?? 'Swag Store';

  return {
    title: { default: defaultTitle, template: titleTemplate },
    description: defaultDescription,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName,
      title: defaultTitle,
      description: defaultDescription,
    },
    other: {
      generator: 'vswag-cert-v3',
    },
  };
}


export const viewport: Viewport = {
  themeColor: '#171719',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Suspense fallback={<>{children}</>}>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </CartProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
