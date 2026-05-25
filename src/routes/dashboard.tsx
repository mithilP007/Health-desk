import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Search, Mic, AlertTriangle, Thermometer, Bandage, Baby,
  Stethoscope, Pill, Sparkles, ArrowUpRight, Activity,
} from "lucide-react";
import { TopNav, BottomDock, PageShell, GlassCard, SectionTitle, HoloIcon } from "../components/ui-kit";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const QUICK = [
  { title: "Emergency Protocol", desc: "Cardiac, stroke, trauma triage", icon: AlertTriangle, tone: "red", to: "/emergency" },
  { title: "Fever Guide", desc: "Adult & pediatric fever pathways", icon: Thermometer, tone: "cyan", to: "/chat" },
  { title: "Injury First Aid", desc: "Wounds, burns, fractures", icon: Bandage, tone: "emerald", to: "/chat" },
  { title: "Pregnancy Care", desc: "Trimester-by-trimester guidance", icon: Stethoscope, tone: "cyan", to: "/chat" },
  { title: "Child Health", desc: "Vaccines, growth, common illness", icon: Baby, tone: "emerald", to: "/chat" },
  { title: "Medicine Info", desc: "Dosage, interactions, alternatives", icon: Pill, tone: "cyan", to: "/chat" },
] as const;

const SYMPTOMS = [
  "Headache", "Fever > 39°C", "Chest pain", "Shortness of breath",
  "Persistent cough", "Abdominal pain", "Dizziness", "Skin rash",
  "Back pain", "Sore throat", "Vomiting", "Fatigue",
];

const HISTORY = [
  { title: "Persistent migraine with aura", time: "12 min ago", tag: "Neurology", lang: "EN" },
  { title: "Toddler fever 38.4°C dosing", time: "Yesterday · 21:04", tag: "Pediatrics", lang: "HI" },
  { title: "ACE-inhibitor interaction check", time: "2 days ago", tag: "Pharmacology", lang: "EN" },
];

function Dashboard() {
  return (
    <PageShell>
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 md:px-6 pt-8">
        {/* Hero search */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">
              <Sparkles className="h-3 w-3" /> Neural Medical Core · v4.2
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-gradient">
              Your AI-powered medical companion
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-white/60">
              Ask anything — from symptoms to dosages. HealthDesk reasons, cites, and triages with cinematic clarity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="glass-strong group relative flex items-center gap-3 rounded-2xl p-2 pl-5 shadow-[0_30px_80px_-30px_rgba(0,212,255,0.45)]">
              <Search className="h-5 w-5 text-white/60" />
              <input
                placeholder="Describe symptoms, ask about a medication, or paste a lab result…"
                className="w-full bg-transparent py-3 text-[15px] text-white placeholder:text-white/40 outline-none"
              />
              <button className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition" aria-label="Voice">
                <div className="relative">
                  <Mic className="h-4.5 w-4.5 text-cyan-300" />
                  <span className="absolute inset-0 -m-2 rounded-full border border-cyan-300/40 animate-ping" />
                </div>
              </button>
              <Link
                to="/chat"
                className="flex h-11 items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 text-sm font-semibold text-[#04111d] shadow-[0_10px_30px_-5px_rgba(0,212,255,0.6)] hover:opacity-95"
              >
                Ask AI <ArrowUpRight className="h-4 w-4" />
              </Link>
              {/* waveform */}
              <div className="pointer-events-none absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1">
                {Array.from({ length: 22 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="block w-[3px] rounded-full bg-cyan-300/70"
                    animate={{ height: [4, 14 + (i % 5) * 3, 4] }}
                    transition={{ duration: 1.1 + (i % 4) * 0.2, repeat: Infinity, delay: i * 0.04 }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {SYMPTOMS.slice(0, 8).map((s) => (
                <motion.button
                  whileHover={{ y: -2, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  key={s}
                  className="glass rounded-full px-3.5 py-1.5 text-xs text-white/80 hover:text-white hover:border-cyan-300/40 transition"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Quick access */}
        <section className="mt-20">
          <SectionTitle eyebrow="Quick Access" title="Medical Modules" sub="Curated clinical pathways with offline reasoning, citations, and triage logic." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUICK.map((q, i) => {
              const Icon = q.icon;
              return (
                <motion.div
                  key={q.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.06, duration: 0.55 }}
                >
                  <Link to={q.to as any}>
                    <GlassCard glow={q.tone === "red" ? "red" : q.tone === "emerald" ? "emerald" : "cyan"} className="p-6">
                      <div className="flex items-start justify-between">
                        <HoloIcon icon={Icon} tone={q.tone as any} />
                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-white" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">{q.title}</h3>
                      <p className="mt-1 text-sm text-white/55">{q.desc}</p>
                      <div className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                        <Activity className="h-3 w-3" /> Live Module
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Symptoms cloud */}
        <section className="mt-20">
          <SectionTitle eyebrow="Common Symptoms" title="One tap to triage" />
          <div className="flex flex-wrap gap-2.5">
            {SYMPTOMS.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -2, scale: 1.06 }}
                className="glass rounded-full px-4 py-2 text-sm text-white/85 hover:border-cyan-300/40 hover:text-white"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mt-20">
          <SectionTitle eyebrow="Recent" title="Recent Conversations" />
          <div className="grid gap-4 md:grid-cols-3">
            {HISTORY.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/40">
                    <span>{h.tag}</span>
                    <span className="text-cyan-300/80">{h.lang}</span>
                  </div>
                  <h4 className="mt-3 text-base font-medium text-white">{h.title}</h4>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                    <span>{h.time}</span>
                    <Link to="/chat" className="text-cyan-300 hover:text-cyan-200">Resume →</Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <BottomDock />
    </PageShell>
  );
}
