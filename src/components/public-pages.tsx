import { ArrowRight, Check, ExternalLink, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteShell } from "@/components/site-shell";
import { sendContactMessage } from "@/lib/portfolio.functions";
import type { getPortfolio } from "@/lib/portfolio.functions";

type Portfolio = Awaited<ReturnType<typeof getPortfolio>>;
type Profile = { name?: string; role?: string; tagline?: string; portrait?: string; since?: string; years?: string };
type About = { heading?: string; body?: string; focus?: string[] };
type Contact = { email?: string; whatsapp?: string; linkedin?: string; availability?: string };
const content = <T,>(data: Portfolio, key: string) => (data.content[key] ?? {}) as T;

export function HomePage({ data }: { data: Portfolio }) {
  const profile = content<Profile>(data, "profile");
  return <SiteShell>
    <section className="hero-grid relative flex min-h-[calc(100vh-4rem)] items-center border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.25fr_.75fr] lg:px-8">
        <div className="relative z-10 self-center">
          <p className="eyebrow mb-6"><span className="status-dot" /> Available for select projects</p>
          <h1 className="font-display text-[clamp(3.2rem,9vw,8.5rem)] font-black uppercase leading-[.82] tracking-normal">BOUISSA<br/><span className="text-outline">MOHAMED</span></h1>
          <p className="mt-8 max-w-3xl text-lg font-semibold leading-relaxed text-foreground sm:text-2xl">{profile.role}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{profile.tagline}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button size="lg" asChild><Link to="/projects">Explore my work <ArrowRight /></Link></Button><Button size="lg" variant="outline" asChild><Link to="/contact">Start a project</Link></Button></div>
          <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-border py-5 font-mono text-xs uppercase text-muted-foreground"><span><b className="block font-display text-2xl text-foreground">{profile.years}</b>Years</span><span><b className="block font-display text-2xl text-foreground">14</b>Projects</span><span><b className="block font-display text-2xl text-primary">∞</b>Curiosity</span></div>
        </div>
        <div className="relative mx-auto grid w-full max-w-md place-items-center self-center">
          <div className="portrait-frame absolute inset-8 border border-primary/40" />
          <img src={profile.portrait} alt={profile.name} className="relative z-10 aspect-[4/5] w-[78%] object-cover grayscale transition duration-700 hover:grayscale-0" />
          <span className="absolute bottom-4 right-0 z-20 border border-accent bg-background px-3 py-2 font-mono text-xs text-accent">BUILD STATUS: ONLINE</span>
        </div>
      </div>
    </section>
    <section className="border-b border-border bg-primary py-4 text-primary-foreground"><div className="ticker font-display text-sm font-bold uppercase">Web products • Mobile applications • SaaS systems • AI experiences • Unity & interactive 3D • Technical leadership •</div></section>
    <section className="section-wrap"><div className="grid gap-10 lg:grid-cols-2"><div><p className="eyebrow">Selected / Work</p><h2 className="section-title">Systems with substance.<br/>Experiences with energy.</h2></div><div className="self-end"><p className="text-lg leading-8 text-muted-foreground">From real-time gameplay to product architecture, I combine technical depth with an instinct for what makes software feel effortless.</p><Button variant="link" className="mt-4 px-0" asChild><Link to="/about">More about my approach <ArrowRight/></Link></Button></div></div>
      <div className="mt-14 grid gap-px bg-border md:grid-cols-3">{data.projects.filter(p=>p.featured).map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}</div>
    </section>
  </SiteShell>;
}

export function AboutPage({ data }: { data: Portfolio }) {
  const about = content<About>(data,"about"); const profile=content<Profile>(data,"profile");
  return <SiteShell><PageIntro index="01" title="About me" subtitle="Engineering range, product judgment, and a builder’s bias for action."/><section className="section-wrap grid gap-14 lg:grid-cols-[.7fr_1.3fr]"><div><img src={profile.portrait} alt={profile.name} className="aspect-[4/5] w-full object-cover grayscale"/><p className="mt-4 font-mono text-xs text-muted-foreground">&lt;LEVELING UP SINCE {profile.since} /&gt;</p></div><div><h2 className="section-title max-w-4xl">{about.heading}</h2><p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">{about.body}</p><div className="mt-12 grid gap-px bg-border sm:grid-cols-2">{about.focus?.map((item,i)=><div key={item} className="flex items-center gap-3 bg-background p-5"><span className="font-mono text-xs text-primary">0{i+1}</span><span className="font-semibold">{item}</span></div>)}</div></div></section></SiteShell>;
}

export function SkillsPage({ data }: { data: Portfolio }) {
  const grouped = data.skills.reduce<Record<string, Portfolio["skills"]>>((result, skill) => {
    (result[skill.group_name] ??= []).push(skill);
    return result;
  }, {});
  const groups = Object.entries(grouped);
  return <SiteShell><PageIntro index="02" title="Skills & stack" subtitle="A multi-disciplinary toolkit for shipping reliable, high-impact products."/><section className="section-wrap"><div className="grid gap-12 lg:grid-cols-2">{groups.map(([group,skills])=><div key={group}><h2 className="mb-6 border-b border-border pb-4 font-display text-xl font-bold uppercase">{group}</h2><div className="space-y-6">{skills?.map(s=><div key={s.id}><div className="mb-2 flex justify-between font-mono text-xs"><span>{s.name}</span><span className="text-primary">{s.level}%</span></div><div className="h-1 bg-muted"><div className="h-full bg-primary skill-bar" style={{"--skill-width":`${s.level}%`} as CSSProperties}/></div></div>)}</div></div>)}</div></section></SiteShell>;
}

function ProjectCard({ project, index }: { project: Portfolio["projects"][number]; index: number }) { return <article className="group relative bg-background p-5 transition hover:bg-surface"><div className="mb-4 flex justify-between font-mono text-xs text-muted-foreground"><span>PRJ-{String(index+1).padStart(2,"0")}</span><span>{project.category_slug}</span></div><div className="overflow-hidden bg-muted"><img src={project.image_url} alt={project.title} className="aspect-video w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" loading="lazy"/></div><h2 className="mt-5 font-display text-xl font-bold uppercase">{project.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p><div className="mt-4 flex flex-wrap gap-2">{project.technologies.slice(0,4).map(t=><span key={t} className="tech-tag">{t}</span>)}</div>{project.demo_url&&<a href={project.demo_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">View project <ExternalLink className="size-4"/></a>}</article> }

export function ProjectsPage({ data }: { data: Portfolio }) { const [filter,setFilter]=useState("all"); const filtered=useMemo(()=>filter==="all"?data.projects:data.projects.filter(p=>p.category_slug===filter),[filter,data.projects]); return <SiteShell><PageIntro index="03" title="Project portfolio" subtitle="Verified games, tools, mobile releases, immersive work, and experiments."/><section className="section-wrap"><div className="mb-10 flex flex-wrap gap-2"><Button size="sm" variant={filter==="all"?"default":"outline"} onClick={()=>setFilter("all")}>All · {data.projects.length}</Button>{data.categories.map(c=><Button key={c.id} size="sm" variant={filter===c.slug?"default":"outline"} onClick={()=>setFilter(c.slug)}>{c.name} · {data.projects.filter(p=>p.category_slug===c.slug).length}</Button>)}</div>{filtered.length?<div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">{filtered.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}</div>:<div className="border border-dashed border-border py-20 text-center"><p className="font-display text-2xl font-bold">NEXT BUILD LOADING</p><p className="mt-2 text-muted-foreground">This category is ready for a verified case study.</p></div>}</section></SiteShell> }

export function ExperiencePage({ data }: { data: Portfolio }) { return <SiteShell><PageIntro index="04" title="Career timeline" subtitle="From community building and studio leadership to independent technical delivery."/><section className="section-wrap"><div className="relative mx-auto max-w-4xl before:absolute before:bottom-0 before:left-5 before:top-0 before:w-px before:bg-border sm:before:left-1/2">{data.experiences.map((e,i)=><article key={e.id} className={`relative mb-10 pl-16 sm:w-1/2 sm:pl-0 ${i%2?"sm:ml-auto sm:pl-12":"sm:pr-12 sm:text-right"}`}><span className={`absolute left-1 top-0 grid size-9 place-items-center border border-primary bg-background font-mono text-xs text-primary sm:left-auto ${i%2?"sm:-left-[18px]":"sm:-right-[18px]"}`}>{e.level}</span><p className="font-mono text-xs text-primary">{e.period}</p><h2 className="mt-2 font-display text-xl font-bold uppercase">{e.role_title}</h2><p className="mt-1 text-muted-foreground">{e.company}</p></article>)}</div></section></SiteShell> }

export function ContactPage({ data }: { data: Portfolio }) { const info=content<Contact>(data,"contact"); const send=useServerFn(sendContactMessage); const [sent,setSent]=useState(false); const [busy,setBusy]=useState(false); async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);const form=new FormData(e.currentTarget);await send({data:{name:String(form.get("name")),email:String(form.get("email")),subject:String(form.get("subject")),message:String(form.get("message"))}});setBusy(false);setSent(true);e.currentTarget.reset();} return <SiteShell><PageIntro index="05" title="Get in touch" subtitle="Have an ambitious product in mind? Let’s make the difficult parts feel simple."/><section className="section-wrap grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><div><p className="mb-8 text-lg leading-8 text-muted-foreground">{info.availability}</p><div className="space-y-4"><a href={`mailto:${info.email}`} className="contact-line"><Mail/><span><small>Email</small>{info.email}</span></a><a href="https://wa.me/21653490237" className="contact-line"><MessageCircle/><span><small>WhatsApp</small>{info.whatsapp}</span></a><a href={info.linkedin} className="contact-line" target="_blank" rel="noreferrer"><MapPin/><span><small>Network</small>LinkedIn</span></a></div></div><form onSubmit={submit} className="grid gap-5 border border-border bg-surface p-6 sm:grid-cols-2 sm:p-8"><label className="field-label">Full name<Input name="name" required minLength={2}/></label><label className="field-label">Email address<Input name="email" type="email" required/></label><label className="field-label sm:col-span-2">Subject<Input name="subject" required minLength={2}/></label><label className="field-label sm:col-span-2">Message<Textarea name="message" required minLength={10} rows={7}/></label><div className="sm:col-span-2">{sent?<p className="flex items-center gap-2 text-sm text-primary"><Check/> Message received. I’ll be in touch.</p>:<Button type="submit" size="lg" disabled={busy}>{busy?"Sending…":"Send message"}<Send/></Button>}</div></form></section></SiteShell> }

function PageIntro({index,title,subtitle}:{index:string;title:string;subtitle:string}) { return <header className="page-intro border-b border-border"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><p className="eyebrow">Section / {index}</p><h1 className="mt-5 font-display text-[clamp(3rem,8vw,7.5rem)] font-black uppercase leading-none">{title}</h1><p className="mt-6 max-w-2xl text-lg text-muted-foreground">{subtitle}</p></div></header> }