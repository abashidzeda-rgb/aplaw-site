import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'rkdb205au98yl2g1.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
