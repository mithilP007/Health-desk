import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Share2, HeartPulse, ShieldAlert, Activity } from "lucide-react";
import { TopNav, BottomDock, PageShell, GlassCard, NeonButton } from "../components/ui-kit";

export const Route = createFileRoute("/emergency")({ component: Emergency });

const STEPS = [
  { t: "Assess responsiveness", d: "Tap shoulder, ask loudly: 'Are you okay?'" },
  { t: "Open airway, check breathing", d: "Tilt head, lift chin. Look, listen, feel for 10s." },
  { t: "Begin CPR if no breathing", d: "30 chest compressions at 100–120/min, depth 5–6 cm." },
  { t: "Use AED if available", d: "Follow voice prompts. Resume CPR immediately after shock." },
];

function Emergency() {
  return (
    <PageShell>
      <TopNav />

      {/* Flashing border */}
      <div className="pointer-events-none fixed inset-0 z-20">
        <motion.div
          className="absolute inset-3 rounded-3xl border-2 border-rose-400/60"
          animate={{ opacity: [0.25, 0.85, 0.25], boxShadow: ["0 0 0 rgba(255,59,92,0.0)", "0 0 80px rgba(255,59,92,0.55)", "0 0 0 rgba(255,59,92,0.0)"] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 md:px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-12 glow-red"
        >
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,59,92,0.35), transparent 60%), radial-gradient(circle at 10% 90%, rgba(255,59,92,0.25), transparent 60%)" }}
            />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-rose-200">
              <ShieldAlert className="h-3.5 w-3.5" /> Emergency Protocol Active
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold text-white">
              Critical signal detected.
              <br />
              <span className="bg-gradient-to-r from-rose-200 via-rose-400 to-rose-500 bg-clip-text text-transparent">Act now.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">
              HealthDesk has classified the current case as time-sensitive. Call emergency services, share your location, and follow the live first-aid protocol below.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.a
                href="tel:108"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-5 text-lg font-bold text-white shadow-[0_20px_60px_-10px_rgba(255,59,92,0.65)]"
              >
                <span className="absolute inset-0 rounded-full border border-white/20" />
                <span className="absolute -inset-1 rounded-full border border-rose-400/40 animate-ping" />
                <Phone className="h-6 w-6" /> CALL 108
              </motion.a>
              <NeonButton variant="ghost" className="px-5 py-4">
                <MapPin className="h-4 w-4" /> Nearest Hospital
              </NeonButton>
              <NeonButton variant="ghost" className="px-5 py-4">
                <Share2 className="h-4 w-4" /> Share Location
              </NeonButton>
            </div>
          </div>
        </motion.div>

        <section className="mt-10 grid gap-5 md:grid-cols-[1fr_320px]">
          <GlassCard glow="red" className="p-6 border-rose-400/30">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-rose-300" />
              <h2 className="text-lg font-semibold text-white">Live first-aid protocol</h2>
            </div>
            <ol className="mt-5 space-y-3">
              {STEPS.map((s, i) => (
                <motion.li key={s.t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass flex items-start gap-4 rounded-2xl p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-200 font-semibold">{i + 1}</div>
                  <div>
                    <div className="text-sm font-medium text-white">{s.t}</div>
                    <div className="text-xs text-white/55">{s.d}</div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="p-5 border-rose-400/20">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">Vitals (manual)</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { k: "Pulse", v: "—" }, { k: "Resp/min", v: "—" }, { k: "SpO₂", v: "—" }, { k: "BP", v: "—" },
                ].map((x) => (
                  <div key={x.k} className="glass rounded-xl p-3">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">{x.k}</div>
                    <div className="mt-1 font-semibold text-white">{x.v}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-300" />
                <span className="text-sm font-semibold text-white">Critical indicators</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-white/70">
                <li className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-rose-300" /> Unresponsive</li>
                <li className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-rose-300" /> Severe bleeding</li>
                <li className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-rose-300" /> Chest pain &gt; 10 min</li>
                <li className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-rose-300" /> Stroke FAST signs</li>
              </ul>
              <Link to="/chat" className="mt-4 inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200">
                Back to assessment →
              </Link>
            </GlassCard>
          </div>
        </section>
      </main>
      <BottomDock />
    </PageShell>
  );
}
