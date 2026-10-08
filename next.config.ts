import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages from the previous site that no longer exist.
  async redirects() {
    return [
      { source: "/gallery", destination: "/artists", permanent: true },
      { source: "/test-downloads", destination: "/releases", permanent: true },
      { source: "/licensing", destination: "/work-with-us", permanent: true },
    ];
  },
};

export default nextConfig;
