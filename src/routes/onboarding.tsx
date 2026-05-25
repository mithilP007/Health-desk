import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, ShieldAlert, Brain, Heart } from "lucide-react";
import { NeonButton, GlassCard } from "../components/ui-kit";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const LANGS = [
  { code: "en", name: "English", native: "English" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
];

const SAFETY = [
  { icon: ShieldAlert, title: "Medical Disclaimer", body: "HealthDesk Pro is an AI-assisted reference, not a replacement for licensed clinicians." },
  { icon: Heart, title: "Emergency Awareness", body: "In critical situations, the assistant will guide you to call 108 or the nearest hospital immediately." },
  { icon: Brain, title: "AI Limitations", body: "Responses are probabilistic. Always verify with a qualified medical professional." },
];

function Onboarding() {
  const nav = useNavigate();
  const [lang, setLang] = useState<string | null>(null);
  const [acks, setAcks] = useState<Record<number, boolean>>({});
  const allAck = SAFETY.every((_, i) => acks[i]);
  const canContinue = lang && allAck;

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="text-center">
        <div className="text-[11px] uppercase tracking-[0.36em] text-cyan-300/80">Step 01 / 02</div>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-gradient">Choose your language</h1>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">Calibrate the neural medical interface to your preferred language.</p>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
        {LANGS.map((l, i) => {
          const sel = lang === l.code;
          return (
            <motion.button
              key={l.code}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLang(l.code)}
              className={`glass relative overflow-hidden rounded-2xl p-6 text-left transition ${sel ? "glow-cyan ring-1 ring-cyan-300/50" : ""}`}
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">{l.code}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{l.native}</div>
              <div className="text-sm text-white/50">{l.name}</div>
              <motion.div
                initial={false}
                animate={{ scale: sel ? 1 : 0, opacity: sel ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-cyan-400 text-[#04111d] shadow-[0_0_20px_rgba(0,212,255,0.7)]"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </motion.div>
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-16">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.36em] text-emerald-300/80">Step 02 / 02</div>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-gradient-emerald">Safety acknowledgements</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SAFETY.map((s, i) => {
            const Icon = s.icon;
            const checked = !!acks[i];
            return (
              <GlassCard key={i} glow="emerald" className="p-6">
                <Icon className="h-6 w-6 text-emerald-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{s.body}</p>
                <label className="mt-5 flex items-center gap-3 cursor-pointer">
                  <span
                    onClick={() => setAcks((a) => ({ ...a, [i]: !a[i] }))}
                    className={`relative grid h-6 w-6 place-items-center rounded-md border transition ${checked ? "border-emerald-300 bg-emerald-300/20" : "border-white/15"}`}
                  >
                    {checked && <Check className="h-4 w-4 text-emerald-300" strokeWidth={3} />}
                  </span>
                  <span className="text-sm text-white/80">I acknowledge & accept</span>
                </label>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="mt-14 flex justify-center">
        <NeonButton disabled={!canContinue} onClick={() => nav({ to: "/dashboard" })} className="px-10 py-4 text-base">
          Continue to Dashboard
        </NeonButton>
      </div>
    </div>
  );
}
