import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // configure remote image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vrriyzcurodchxffujof.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },  
  };


export default nextConfig;
