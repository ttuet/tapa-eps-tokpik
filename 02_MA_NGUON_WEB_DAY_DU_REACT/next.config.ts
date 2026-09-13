import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app so Next.js doesn't infer a parent
  // directory when multiple lockfiles are present (e.g. on CI).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
