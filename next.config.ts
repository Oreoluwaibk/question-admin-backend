import type { NextConfig } from "next";

const MARKETING_SITE =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL ??
  "https://oiquestionbank.netlify.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: `${MARKETING_SITE}/privacy`,
        permanent: true,
      },
      {
        source: "/terms",
        destination: `${MARKETING_SITE}/terms`,
        permanent: true,
      },
      {
        source: "/delete-account",
        destination: `${MARKETING_SITE}/delete-account`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
