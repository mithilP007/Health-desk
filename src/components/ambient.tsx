import { useEffect, useRef } from "react";

/**
 * AmbientBackground — neural particle field + radial glows + grid.
 * Fixed, behind all content. Lightweight canvas (no deps).
 */
export function AmbientBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    const COLORS = ["#00d4ff", "#00ffb3", "#5aa9ff"];
    let pts: P[] = [];

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 22000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      // links
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const o = 1 - Math.sqrt(d2) / 140;
            ctx.strokeStyle = `rgba(0,212,255,${o * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = a.c;
        ctx.globalAlpha = 0.65;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* deep base */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(1200px 700px at 80% -10%, rgba(0,212,255,0.18), transparent 60%)," +
          "radial-gradient(900px 600px at -10% 110%, rgba(0,255,179,0.14), transparent 60%)," +
          "radial-gradient(700px 500px at 50% 50%, rgba(90,169,255,0.08), transparent 70%)," +
          "linear-gradient(180deg, #050d18 0%, #07111f 50%, #04101c 100%)",
      }} />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* floating blurred orbs */}
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full animate-float-slow" style={{ background: "radial-gradient(closest-side, rgba(0,212,255,0.35), transparent)", filter: "blur(40px)" }} />
      <div className="absolute bottom-[-160px] right-[-120px] h-[460px] w-[460px] rounded-full animate-float-slow" style={{ background: "radial-gradient(closest-side, rgba(0,255,179,0.25), transparent)", filter: "blur(50px)", animationDelay: "-3s" }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
      }} />
    </div>
  );
}
