const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // add your own icons to src/app/manifest.ts
  // to re-generate manifest.json, you can visit https://tomitm.github.io/appmanifest/
});

const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  reactStrictMode: false,
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },
  // Include template files in the serverless function bundle
  outputFileTracingIncludes: {
    '/api/hello': ['./src/lib/templates/**/*'],
  },
  // Turbopack configuration (for dev)
  turbopack: {
    resolveAlias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  // Webpack configuration (for build)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, 'src'),
    };
    return config;
  },
});
