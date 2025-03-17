import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI, // Ensure MongoDB URI is loaded
  },
  reactStrictMode: true, // Enable strict mode for React
  swcMinify: true, // Enable SWC compiler for minification (improves performance)
};

export default nextConfig;
