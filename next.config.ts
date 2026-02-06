import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Static export cannot use the default Image Optimization API.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Enable static optimization
  output: "export",
  distDir: "dist",
};

export default nextConfig;
