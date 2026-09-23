#!/usr/bin/env bash
set -euo pipefail

# Write the public backend settings into .env so Vite inlines them into both the
# browser and server bundles (Netlify's build variables alone are not enough).
cat > .env <<EOF
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_PUBLISHABLE_KEY=${SUPABASE_PUBLISHABLE_KEY}
SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID}
EOF

bun install
bun run build
