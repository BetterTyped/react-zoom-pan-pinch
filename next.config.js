/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, module: false };

    return config;
  },
};

module.exports = nextConfig;
