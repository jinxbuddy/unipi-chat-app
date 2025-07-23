/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_SOCKET_URL: 'https://unipi-chat-app-production.up.railway.app',
    NEXT_PUBLIC_STUN_SERVERS: 'stun:stun.l.google.com:19302',
  }
}

module.exports = nextConfig
