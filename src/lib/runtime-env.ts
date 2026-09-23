// Netlify does not expose netlify.toml [build.environment] variables to the
// serverless function runtime — only to the build. The VITE_* values are inlined
// into the bundle at build time, so mirror them into process.env on startup so
// server-only code reading SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY keeps working.
// Dot notation is required: the build only replaces `import.meta.env.VITE_X`.
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
const inlined: Record<string, string | undefined> = {
  // @ts-ignore TS4111: dot access is required for build-time inlining
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  // @ts-ignore TS4111: dot access is required for build-time inlining
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  // @ts-ignore TS4111: dot access is required for build-time inlining
  SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
};

export function hydrateRuntimeEnv() {
  if (typeof process === "undefined" || !process.env) return;
  for (const [key, value] of Object.entries(inlined)) {
    if (value && !process.env[key]) process.env[key] = value;
  }
}

hydrateRuntimeEnv();
