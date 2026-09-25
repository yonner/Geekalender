import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The shared package ships TypeScript source, so Next must compile it.
  transpilePackages: ['@geekalender/shared'],
};

export default nextConfig;
