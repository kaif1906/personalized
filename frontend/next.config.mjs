/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // already used for recipes
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // optional if you use plus.unsplash.com
      },
      {
        protocol: "https",
        hostname: "randomuser.me", // ✅ allow randomuser avatars
      },
    ],
  },
};

export default nextConfig;
