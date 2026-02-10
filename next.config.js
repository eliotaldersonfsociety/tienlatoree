/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    optimizePackageImports: [
      "@tensorflow/tfjs",
      "lucide-react",
    ],
    optimizeCss: true,
  },

  // Enable React Server Components
  reactStrictMode: true,
}

module.exports = withBundleAnalyzer(nextConfig)
