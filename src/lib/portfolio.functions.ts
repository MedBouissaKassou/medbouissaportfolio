import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database, Json } from "@/integrations/supabase/types";

export type SiteContent = Record<string, Json>;

function makePublicClient() {
  const key = (process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string))!;
  const url = (process.env["SUPABASE_URL"] ||
    (import.meta.env["VITE_SUPABASE_URL"] as string))!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const db = makePublicClient();
  const [content, projects, categories, skills, experiences] = await Promise.all([
    db.from("site_content").select("key,value").eq("published", true),
    db.from("projects").select("*").eq("published", true).order("sort_order"),
    db.from("project_categories").select("*").eq("published", true).order("sort_order"),
    db.from("skills").select("*").eq("published", true).order("sort_order"),
    db.from("experiences").select("*").eq("published", true).order("sort_order"),
  ]);
  const error = content.error ?? projects.error ?? categories.error ?? skills.error ?? experiences.error;
  if (error) throw new Error(error.message);
  return {
    content: Object.fromEntries((content.data ?? []).map((row) => [row.key, row.value])) as SiteContent,
    projects: projects.data ?? [],
    categories: categories.data ?? [],
    skills: skills.data ?? [],
    experiences: experiences.data ?? [],
  };
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email().max(254),
    subject: z.string().trim().min(2).max(200),
    message: z.string().trim().min(10).max(5000),
  }).parse(input))
  .handler(async ({ data }) => {
    const db = makePublicClient();
    const { error } = await db.from("contact_messages").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });