/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This disables ESLint during builds.
    // TODO: Fix ESLint configuration conflict with root config
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
