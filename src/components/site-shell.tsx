import { Link } from "@tanstack/react-router";
import { Braces, Gamepad2, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SignalRunner } from "@/components/signal-runner";

const links = [
  ["#about", "About"], ["#skills", "Skills"], ["#projects", "Projects"],
  ["#experience", "Experience"], ["#contact", "Contact"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [game, setGame] = useState(false);
  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-normal">
          <span className="grid size-9 place-items-center border border-primary/60 bg-primary/10 text-primary"><Braces className="size-4" /></span>
          <span>BM<span className="text-primary">.</span>DEV</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {links.map(([to, label]) => <a key={to} href={to} className="nav-link">{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setGame(true)}><Gamepad2 /> <span className="hidden sm:inline">Play</span></Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menu && <nav className="border-t border-border bg-background px-5 py-5 md:hidden">{links.map(([to,label]) => <a key={to} href={to} onClick={() => setMenu(false)} className="block border-b border-border py-3 text-sm font-semibold uppercase">{label}</a>)}</nav>}
    </header>
    <main className="animate-fade-in pt-16">{children}</main>
    <footer className="border-t border-border bg-surface py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p><strong className="text-foreground">BOUISSA MOHAMED</strong> · Full-Stack Developer & Technical Lead</p>
        <div className="flex gap-5"><a href="#contact" className="story-link">Start a project</a><Link to="/auth" className="story-link">Backoffice</Link></div>
      </div>
    </footer>
    {game && <SignalRunner onClose={() => setGame(false)} />}
  </div>;
}