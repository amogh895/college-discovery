const cleanEnvVar = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  let clean = value.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }
  return clean.trim();
};

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = cleanEnvVar(process.env.DATABASE_URL);
}
if (process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = cleanEnvVar(process.env.NEXTAUTH_URL);
}
if (process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = cleanEnvVar(process.env.NEXTAUTH_SECRET);
}

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
