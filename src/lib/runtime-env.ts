// Netlify does not expose netlify.toml [build.environment] variables to the
// serverless function runtime — only to the build. The VITE_* values are inlined
// into the bundle at build time, so mirror them into process.env on startup so
// server-only code reading SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY keeps working.
const inlined: Record<string, string | undefined> = {
  SUPABASE_URL: import.meta.env["VITE_SUPABASE_URL"] as string | undefined,
  SUPABASE_PUBLISHABLE_KEY: import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined,
  SUPABASE_PROJECT_ID: import.meta.env["VITE_SUPABASE_PROJECT_ID"] as string | undefined,
};

export function hydrateRuntimeEnv() {
  if (typeof process === "undefined" || !process.env) return;
  for (const [key, value] of Object.entries(inlined)) {
    if (value && !process.env[key]) process.env[key] = value;
  }
}

hydrateRuntimeEnv();
