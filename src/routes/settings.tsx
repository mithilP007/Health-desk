import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  User, Brain, Languages, Mic, ShieldCheck, Database, Bell,
  AlertTriangle, Stethoscope, FileText, ChevronRight,
} from "lucide-react";
import { TopNav, BottomDock, PageShell, GlassCard, SectionTitle } from "../components/ui-kit";

export const Route = createFileRoute("/settings")({ component: Settings });

function Toggle({ on, set, label, sub }: { on: boolean; set: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {sub && <div className="mt-0.5 text-xs text-white/50">{sub}</div>}
      </div>
      <button
        onClick={() => set(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition ${on ? "border-cyan-300/50 bg-cyan-300/20" : "border-white/15 bg-white/5"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={`absolute top-0.5 h-6 w-6 rounded-full shadow ${on ? "left-[22px] bg-cyan-300 shadow-[0_0_14px_rgba(0,212,255,0.7)]" : "left-0.5 bg-white/80"}`}
        />
      </button>
    </div>
  );
}

function Settings() {
  const [voice, setVoice] = useState(true);
  const [offline, setOffline] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [proactive, setProactive] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [emergencyShare, setEmergencyShare] = useState(true);

  return (
    <PageShell>
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 md:px-6 pt-8">
        <SectionTitle eyebrow="System" title="Settings & Preferences" sub="Tune your medical AI experience. All data stays on-device unless explicitly shared." />

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Profile */}
          <GlassCard className="p-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-emerald-300/20 border border-white/15">
                <User className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <div className="text-base font-semibold text-white">Anika Verma</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">Member · A+ · 32 yrs</div>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              {[
                { i: Stethoscope, k: "Medical profile", v: "Asthma · Lisinopril" },
                { i: AlertTriangle, k: "Emergency contact", v: "+91 98xxxxx112" },
                { i: FileText, k: "Records", v: "12 documents" },
              ].map((x) => (
                <button key={x.k} className="glass flex w-full items-center gap-3 rounded-xl p-3 hover:bg-white/5">
                  <x.i className="h-4 w-4 text-cyan-300" />
                  <div className="flex-1 text-left">
                    <div className="text-white">{x.k}</div>
                    <div className="text-xs text-white/50">{x.v}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </button>
              ))}
            </div>
          </GlassCard>

          {/* AI Preferences */}
          <GlassCard className="p-6 lg:col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">AI Preferences</h3>
            </div>
            <div className="divide-y divide-white/5">
              <Toggle on={voice} set={setVoice} label="Voice replies" sub="HealthDesk speaks back with calibrated medical tone." />
              <Toggle on={proactive} set={setProactive} label="Proactive guidance" sub="Suggest follow-ups based on conversation context." />
              <Toggle on={offline} set={setOffline} label="Offline AI core" sub="Use on-device models when network is unavailable." />
              <Toggle on={haptics} set={setHaptics} label="Haptic micro-feedback" sub="Subtle vibration on critical actions (mobile only)." />
            </div>
            <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">Active model</div>
              <div className="mt-1 text-white">HealthDesk Neural v4.2 · Reasoning + Safety</div>
              <div className="mt-1 text-xs text-white/55">Knowledge corpus: WHO 2024 · NIH MedlinePlus · DailyMed</div>
            </div>
          </GlassCard>

          {/* Language & Voice */}
          <GlassCard className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Languages className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">Language</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["English", "தமிழ்", "हिन्दी", "తెలుగు", "മലയാളം", "ಕನ್ನಡ"].map((l, i) => (
                <button key={l} className={`rounded-full px-3 py-1.5 text-xs border transition ${i === 0 ? "border-cyan-300/50 bg-cyan-300/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:border-cyan-300/30"}`}>{l}</button>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2"><Mic className="h-4 w-4 text-emerald-300" /><span className="text-xs text-white/70">Voice: Calm · Female (default)</span></div>
          </GlassCard>

          {/* Privacy */}
          <GlassCard className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <h3 className="text-sm font-semibold text-white">Privacy</h3>
            </div>
            <div className="divide-y divide-white/5">
              <Toggle on={analytics} set={setAnalytics} label="Anonymous analytics" sub="Help improve AI quality. Disabled by default." />
              <Toggle on={emergencyShare} set={setEmergencyShare} label="Share location in emergency" sub="Only triggered when 108 is dialed from the app." />
            </div>
          </GlassCard>

          {/* Storage */}
          <GlassCard className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">Local storage</h3>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/60"><span>Used</span><span>312 MB / 1.2 GB</span></div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: "26%" }} transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
              </div>
            </div>
            <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-white/80 hover:bg-white/10">Clear conversation cache</button>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-6 lg:col-span-3">
            <div className="mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">Notifications & safety docs</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["Medication reminders", "Critical alerts", "Weekly health digest"].map((n, i) => (
                <div key={n} className="glass flex items-center justify-between rounded-xl p-3">
                  <span className="text-sm text-white/85">{n}</span>
                  <div className={`h-2 w-2 rounded-full ${i === 1 ? "bg-rose-400 shadow-[0_0_8px_rgba(255,59,92,0.7)]" : "bg-cyan-300 shadow-[0_0_8px_rgba(0,212,255,0.7)]"}`} />
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {["Safety Documentation", "Clinical disclaimer", "Open-source licenses"].map((d) => (
                <button key={d} className="glass flex items-center justify-between rounded-xl p-3 text-sm text-white/85 hover:bg-white/5">
                  <span>{d}</span><ChevronRight className="h-4 w-4 text-white/40" />
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
      <BottomDock />
    </PageShell>
  );
}
