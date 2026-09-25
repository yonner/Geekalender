import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Self-contained server bundle for the container image.
  output: 'standalone',
  // Trace dependencies from the monorepo root so hoisted node_modules are included.
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // The shared package ships TypeScript source, so Next must compile it.
  transpilePackages: ['@geekalender/shared'],
};

export default nextConfig;
