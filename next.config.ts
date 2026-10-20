import type { NextConfig } from "next";

// Security headers on every page: no framing by other sites, no MIME sniffing, page addresses kept private
// when visitors follow a link out, and no camera / microphone / location access for anything on the page.
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
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
