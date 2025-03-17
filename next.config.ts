import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI, // Load MongoDB URI properly
  },
  reactStrictMode: true,
};

export default nextConfig;
