/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const withEnv = {
  publicRuntimeConfig: {
    DEPLOY_ENV: process.env.DEPLOY_ENV,
  },
};

const nextConfig = withPlugins([
  {
    reactStrictMode: true,
    images: {
      domains: ['img.icons8.com', 'gw.alipayobjects.com', ''],
    },

    compiler: {
      // ssr and displayName are configured by default
      styledComponents: true,
    },
  },

  withLess({
    // reactStrictMode: true,
    lessLoaderOptions: {},
  }),
  withEnv,
]);
module.exports = nextConfig;
