import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Portfolio Backoffice — Bouissa Mohamed" }, { name: "description", content: "Private portfolio content editor." }, { property: "og:title", content: "Portfolio Backoffice" }, { property: "og:description", content: "Private portfolio content editor." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate(); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true);setError(""); const form=new FormData(event.currentTarget); const email=String(form.get("email")).toLowerCase(); const password=String(form.get("password"));
    if(email!=="medbouissa.contact@gmail.com"){setError("This backoffice is restricted to the portfolio owner.");setBusy(false);return;}
    const {data,error:e}=await supabase.auth.signInWithPassword({email,password}); if(e)setError(e.message); else if(data.user){ await supabase.from("user_roles").upsert({user_id:data.user.id,role:"admin"},{onConflict:"user_id,role"}); await navigate({to:"/dashboard"}); }
    setBusy(false);
  }
  return <main className="grid min-h-screen place-items-center bg-background p-5"><div className="w-full max-w-md border border-border bg-surface p-7 sm:p-9"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4"/> Portfolio</Link><div className="mb-8 grid size-12 place-items-center border border-primary bg-primary/10 text-primary"><LockKeyhole/></div><p className="eyebrow">Owner access</p><h1 className="mt-3 font-display text-3xl font-bold uppercase">Portfolio backoffice</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Enter your owner credentials to manage the public site.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="field-label">Email<Input name="email" type="email" defaultValue="medbouissa.contact@gmail.com" required/></label><label className="field-label">Password<Input name="password" type="password" minLength={8} autoComplete="current-password" required/></label>{error&&<p className="text-sm text-destructive">{error}</p>}<Button className="w-full" size="lg" disabled={busy}>{busy?"Please wait…":"Sign in"}</Button></form></div></main>;
}