'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { Chakra as ChakraProvider } from '~/lib/components/Chakra';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'head',
        }}
      >
        <ChakraProvider>{children}</ChakraProvider>
      </GoogleReCaptchaProvider>
    </CacheProvider>
  );
};

export default Providers;
