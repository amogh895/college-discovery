if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

const safeUrl = (url: string | undefined) => {
  if (!url) return "undefined";
  try {
    const parsed = new URL(url);
    if (parsed.password) parsed.password = "REDACTED";
    return parsed.toString();
  } catch (e) {
    return `INVALID_URL_STRING: "${url}"`;
  }
};

console.log("=== VERCEL BUILD ENVIRONMENT VARIABLES ===");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("VERCEL_URL:", process.env.VERCEL_URL);
console.log("DATABASE_URL:", safeUrl(process.env.DATABASE_URL));
console.log("==========================================");

import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
