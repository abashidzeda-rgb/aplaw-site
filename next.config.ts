import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'images.unsplash.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
