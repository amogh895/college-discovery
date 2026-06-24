// Clean up environment variables to prevent build crashes.
// On Vercel, we delete NEXTAUTH_URL to let next-auth automatically fall back to VERCEL_URL.
// This prevents "TypeError: Invalid URL" errors caused by invalid or static NEXTAUTH_URL
// variables defined in the Vercel dashboard.
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

// Ensure VERCEL_URL is fallback for any other logic
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}
