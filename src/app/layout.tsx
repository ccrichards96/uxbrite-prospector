import type { Metadata, Viewport } from 'next';

import Providers from '~/app/providers';
import {AppProvider} from '~/lib/contexts/app';
import Layout from '~/lib/layout';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'UX Website Audit';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: '%s | UX Website Audit' },
  description:
    'Gain insights into your websites user experience with our comprehensive analysis tool.',
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: 'https://sitechecker.uxbrite.com',
    title: 'UX Website Audit',
    description:
      'Gain insights into your websites user experience with our comprehensive analysis tool.',
    images: {
      url: 'https://og-image.sznm.dev/**nextarter-chakra**.sznm.dev.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fsznm.dev%2Favataaars.svg&widths=250',
      alt: 'nextarter-chakra.sznm.dev og-image',
    },
  },
  twitter: {
    creator: '@sozonome',
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppProvider>
            <Layout>{children}</Layout>
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
