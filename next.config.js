/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "@tensorflow/tfjs",
    "@tensorflow-models/pose-detection",
  ],
  turbopack: {}, // Configuración básica de Turbopack
  webpack: (config) => {
    config.resolve.alias['@mediapipe/pose'] = require('path').resolve(__dirname, 'components/mediapipe-pose-dummy.js');
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@mediapipe/pose': './components/mediapipe-pose-dummy.js',
      },
    }
  },
};

module.exports = withBundleAnalyzer(nextConfig);
