import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export the app as static HTML into `out/` so it can be served directly
  // from S3/CloudFront via Amplify Hosting. The app is fully client-side,
  // so no server runtime is needed.
  output: "export",
  // next/image optimization needs a server; disable it for static export.
  images: {
    unoptimized: true,
  },
  // Pin the workspace root to this app so Next.js doesn't infer a parent
  // directory when multiple lockfiles are present (e.g. on CI).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
