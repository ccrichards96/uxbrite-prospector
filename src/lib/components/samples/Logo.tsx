'use client';

import { Flex, color, useColorMode } from '@chakra-ui/react';

import HelperImage from './HelperImage';

const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex gap={2} justifyContent="center" alignItems="center">
      {colorMode === 'light' ? (
        <HelperImage src="/uxbrite-logo.png" label="Logo" />
      ) : (
        <HelperImage src="/uxbrite-logo-white.png" label="Logo" />
      )}
    </Flex>
  );
};

export default Logo;
