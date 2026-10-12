import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hero art is served at 85; everything else at the default 75.
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
