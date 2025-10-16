/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
  },
}

module.exports = nextConfig
