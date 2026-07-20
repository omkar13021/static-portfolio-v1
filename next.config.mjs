/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site — no backend, no API routes, no server runtime (REQUIREMENTS §2, §10).
  output: 'export',
  reactStrictMode: true,
  // Static export cannot use the Image Optimization server; illustrations are inline SVG anyway.
  images: { unoptimized: true },
  // Emit trailing-slash directories so the export serves cleanly from any static host.
  trailingSlash: true,
};

export default nextConfig;
