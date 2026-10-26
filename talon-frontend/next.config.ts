import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error("API_URL is not set. Copy .env.example to .env.local.");
}

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
};

export default withBundleAnalyzer(nextConfig);
