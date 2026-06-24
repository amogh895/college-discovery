if (process.env.VERCEL === "1") {
  delete process.env.NEXTAUTH_URL;
}

const sanitizeEnvVar = (key: string) => {
  const value = process.env[key];
  if (!value) {
    delete process.env[key];
    return;
  }
  let clean = value.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  if (!clean || clean === "undefined") {
    delete process.env[key];
  } else {
    process.env[key] = clean;
  }
};

sanitizeEnvVar("DATABASE_URL");
sanitizeEnvVar("NEXTAUTH_SECRET");

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
