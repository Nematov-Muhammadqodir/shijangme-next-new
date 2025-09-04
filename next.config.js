/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_API_URL: process.env.NEXT_PUBLIC_API_URL,
    REACT_APP_API_GRAPHQL_URL: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
  },
  images: {
    domains: ["api.kadai.uz"],
  },
};

const { i18n } = require("./next-i18next.config");
nextConfig.i18n = i18n;

module.exports = nextConfig;
