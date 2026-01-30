/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  images: {
    domains: ['supabase.co', 'images.unsplash.com', 'avatars.githubusercontent.com'],
  },
}

export default nextConfig
