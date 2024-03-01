/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cleanDistDir: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
