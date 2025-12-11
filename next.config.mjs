/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "atsway.com",
      "backend.atsway.com",
      "rms-next.logicspice.in",
      "rms-next-backend.logicspice.in",
      "rms-next.logicspice.com",
      "rms-next-backend.logicspice.com"
    ],
  },

  async redirects() {
    return [
      {
        source: "/hr-blog/:path*",   // match every route under /hr-blog
        destination: "/blog/:path*", // keep the same path structure
        permanent: true,             // 308 redirect
      },
    ];
  },
};

export default nextConfig;
