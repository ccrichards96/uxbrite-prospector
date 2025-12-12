import { extendTheme } from '@chakra-ui/react';

import { colors } from './colors';
import { components } from './components';
import { themeConfig } from './config';
import { fonts } from './fonts';

const customTheme = extendTheme({
  fonts,
  colors,
  config: themeConfig,
  components,
});

export default customTheme;
