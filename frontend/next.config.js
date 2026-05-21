/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chatflow/shared'],
  images: {
    domains: ['localhost', 'avatars.githubusercontent.com'],
  },
};

module.exports = nextConfig;
