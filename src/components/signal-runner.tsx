import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Item = { lane: number; y: number; kind: "token" | "bug" };

export function SignalRunner({ onClose }: { onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lane = useRef(1); const items = useRef<Item[]>([]); const frame = useRef(0); const scoreRef = useRef(0);
  const [score, setScore] = useState(0); const [best, setBest] = useState(0); const [running, setRunning] = useState(true); const [sound, setSound] = useState(false);
  useEffect(() => { const stored = Number(localStorage.getItem("signal-runner-best") ?? 0); setBest(stored); }, []);
  useEffect(() => {
    const move = (event: KeyboardEvent) => { if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") lane.current = Math.max(0, lane.current - 1); if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") lane.current = Math.min(2, lane.current + 1); };
    window.addEventListener("keydown", move); return () => window.removeEventListener("keydown", move);
  }, []);
  useEffect(() => {
    if (!running) return;
    const ctx = canvas.current?.getContext("2d"); if (!ctx) return;
    const tick = () => {
      frame.current += 1;
      if (frame.current % 48 === 0) items.current.push({ lane: Math.floor(Math.random() * 3), y: -30, kind: Math.random() > .32 ? "token" : "bug" });
      items.current.forEach(i => i.y += 4.2);
      items.current = items.current.filter(item => {
        if (item.y > 350 && item.y < 420 && item.lane === lane.current) {
          if (item.kind === "bug") scoreRef.current = Math.max(0, scoreRef.current - 20); else scoreRef.current += 10;
          setScore(scoreRef.current); if (scoreRef.current > best) { setBest(scoreRef.current); localStorage.setItem("signal-runner-best", String(scoreRef.current)); }
          if (sound) { const audio = new AudioContext(); const o = audio.createOscillator(); o.frequency.value = item.kind === "bug" ? 120 : 520; o.connect(audio.destination); o.start(); o.stop(audio.currentTime + .06); }
          return false;
        }
        return item.y < 470;
      });
      ctx.fillStyle = "#07100f"; ctx.fillRect(0,0,540,460);
      ctx.strokeStyle = "#153d36"; ctx.lineWidth = 1; [180,360].forEach(x => { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,460); ctx.stroke(); });
      for (let y=(frame.current*4)%50; y<460; y+=50) { ctx.strokeStyle="#0e2925";ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(540,y);ctx.stroke(); }
      items.current.forEach(i => { const x=i.lane*180+90; ctx.fillStyle=i.kind==="bug"?"#ff5d6c":"#45f0c0"; ctx.font="bold 22px monospace"; ctx.textAlign="center"; ctx.fillText(i.kind==="bug"?"BUG":"</>",x,i.y); });
      const x=lane.current*180+90; ctx.fillStyle="#d7ff55"; ctx.beginPath(); ctx.moveTo(x,370);ctx.lineTo(x-24,416);ctx.lineTo(x+24,416);ctx.closePath();ctx.fill();
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame.current);
  }, [running, best, sound]);
  const reset = () => { items.current=[]; scoreRef.current=0; setScore(0); setRunning(true); };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4" role="dialog" aria-modal="true" aria-label="Signal Runner mini-game">
    <div className="game-panel w-full max-w-2xl border border-primary/50 bg-surface p-4 shadow-signal sm:p-6">
      <div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Mini-game / 01</p><h2 className="font-display text-2xl font-bold">SIGNAL RUNNER</h2></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close game"><X /></Button></div>
      <div className="mb-3 flex items-center justify-between font-mono text-xs"><span>SCORE <b className="text-primary">{score}</b></span><span>BEST <b className="text-accent">{best}</b></span></div>
      <canvas ref={canvas} width="540" height="460" className="aspect-[540/460] w-full border border-border" onPointerDown={(e) => { const r=e.currentTarget.getBoundingClientRect(); lane.current=Math.min(2,Math.floor((e.clientX-r.left)/(r.width/3))); }} />
      <p className="mt-3 text-xs text-muted-foreground">Move with ← → or tap a lane. Collect code. Avoid bugs.</p>
      <div className="mt-4 flex gap-2"><Button variant="outline" onClick={() => setRunning(!running)}>{running?<Pause/>:<Play/>}{running?"Pause":"Resume"}</Button><Button variant="outline" size="icon" onClick={reset} aria-label="Restart"><RotateCcw/></Button><Button variant="ghost" size="icon" onClick={() => setSound(!sound)} aria-label="Toggle sound">{sound?<Volume2/>:<VolumeX/>}</Button></div>
    </div>
  </div>;
}