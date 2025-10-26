import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.avtovykup196.ru" }],
        destination: "https://avtovykup196.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
