// Helper to clean up env variables (trim whitespace and strip accidentally pasted quotes)
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

// Fallback NEXTAUTH_URL setup for Vercel
if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}
