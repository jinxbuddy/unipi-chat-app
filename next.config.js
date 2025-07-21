/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    NEXT_PUBLIC_STUN_SERVERS: process.env.NEXT_PUBLIC_STUN_SERVERS || 'stun:stun.l.google.com:19302',
  }
}

module.exports = nextConfig
