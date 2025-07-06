import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // También ignorar errores de TypeScript si los hay
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
