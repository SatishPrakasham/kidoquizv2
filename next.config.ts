/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
    reactStrictMode: true,
    serverExternalPackages: ['mongodb']
};

export default nextConfig;
