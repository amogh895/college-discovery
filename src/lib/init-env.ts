// Helper to clean up env variables (trim whitespace and strip accidentally pasted quotes)
// If the variable is empty or invalid, we delete it from process.env to prevent Node.js
// from coercing 'undefined' into the literal string "undefined".
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
sanitizeEnvVar("NEXTAUTH_URL");
sanitizeEnvVar("NEXTAUTH_SECRET");

// Fallback NEXTAUTH_URL setup for Vercel
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}
