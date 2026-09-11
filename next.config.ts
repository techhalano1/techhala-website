import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale(en|vi)/products/hal-sdlc",
        destination: "/:locale/solutions/hal-sdlc",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
