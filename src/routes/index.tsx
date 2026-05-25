import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Heart, ShieldCheck, Brain, CheckCircle2 } from "lucide-react";
import { NeonButton } from "../components/ui-kit";

export const Route = createFileRoute("/")({ component: Splash });

const STEPS = [
  { label: "Initializing medical intelligence", icon: Brain },
  { label: "Loading WHO + NIH knowledge graph", icon: ShieldCheck },
  { label: "Calibrating reasoning models", icon: Activity },
  { label: "Offline AI Ready", icon: CheckCircle2 },
];

function Splash() {
  const nav = useNavigate();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + 1 + Math.random() * 2.4);
      setProgress(p);
      setStep(Math.min(STEPS.length - 1, Math.floor((p / 100) * STEPS.length)));
      if (p >= 100) { clearInterval(id); setTimeout(() => setDone(true), 350); }
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Pulse rings */}
      <div className="relative mb-10">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40"
            style={{ animation: `pulse-ring 2.4s ${i * 0.6}s ease-out infinite` }}
          />
        ))}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid h-32 w-32 place-items-center rounded-3xl glass-strong glow-cyan"
        >
          <div className="animate-spin-slow absolute inset-2 rounded-2xl border border-dashed border-cyan-300/30" />
          <div className="relative grid place-items-center">
            <Heart className="absolute h-14 w-14 text-cyan-300/30 animate-heartbeat" fill="currentColor" />
            <div className="relative grid h-14 w-14 place-items-center">
              <div className="absolute h-10 w-2 rounded-full bg-gradient-to-b from-cyan-300 to-emerald-300 shadow-[0_0_20px_rgba(0,212,255,0.7)]" />
              <div className="absolute h-2 w-10 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 shadow-[0_0_20px_rgba(0,212,255,0.7)]" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="text-[11px] uppercase tracking-[0.36em] text-cyan-300/80">HealthDesk</div>
        <h1 className="mt-2 text-5xl md:text-6xl font-semibold text-gradient">HealthDesk Pro</h1>
        <p className="mt-3 text-sm md:text-base text-white/60">Advanced Medical Reasoning AI</p>
      </motion.div>

      {/* Progress */}
      <div className="mt-12 w-full max-w-md">
        <div className="glass relative h-2 w-full overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-300 shadow-[0_0_20px_rgba(0,212,255,0.7)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
          <div className="absolute inset-0 opacity-60" style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.8s linear infinite",
          }} />
        </div>
        <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.22em] text-white/40">
          <span>{Math.round(progress)}%</span>
          <span>Booting Neural Core</span>
        </div>

        <ul className="mt-6 space-y-2 text-left">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i <= step;
            return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: active ? 1 : 0.35, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className={`grid h-6 w-6 place-items-center rounded-full border ${active ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-300" : "border-white/10 text-white/40"}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className={active ? "text-white/85" : "text-white/40"}>{s.label}</span>
                {active && i < step && <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-300" />}
              </motion.li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-10"
          >
            <NeonButton onClick={() => nav({ to: "/onboarding" })} className="px-8 py-3.5 text-base">
              Enter HealthDesk →
            </NeonButton>
            <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/40">WHO + NIH Knowledge Loaded</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
