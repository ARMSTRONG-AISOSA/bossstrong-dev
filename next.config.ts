import type { NextConfig } from "next";

/**
 * Security headers — applied to every route, including /admin.
 * Baseline values are defined in docs/specs/technical-specification.md Section 10.
 * The CSP is deliberately the pragmatic (non-nonce) baseline from that section, not a
 * maximal policy; 'unsafe-inline' on script-src is intentional for now. Revisit toward a
 * stricter nonce-based CSP later per that spec, not ad hoc.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage public URLs for post cover images / body images
    // (backend-specification.md §5) — technical-specification.md §5 prefers
    // next/image where practical.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ciezdxwbshriqjuwvahl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
