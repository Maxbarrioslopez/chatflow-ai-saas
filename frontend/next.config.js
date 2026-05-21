/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chatmbl/shared'],
  images: {
    domains: ['localhost', 'avatars.githubusercontent.com'],
  },
};

module.exports = nextConfig;
