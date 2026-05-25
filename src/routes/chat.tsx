import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Send, Mic, ImagePlus, Sparkles, Brain, ShieldCheck, AlertTriangle,
  Phone, MapPin, ChevronDown, FileText, Activity, X, CheckCircle2,
  Languages, Search as SearchIcon, Network, Layers,
} from "lucide-react";
import { TopNav, BottomDock, PageShell, GlassCard, NeonButton } from "../components/ui-kit";

export const Route = createFileRoute("/chat")({ component: Chat });

type Msg = {
  role: "user" | "ai";
  content: string;
  confidence?: number;
  emergency?: boolean;
  citations?: { src: string; tag: string }[];
};

const SEED: Msg[] = [
  { role: "user", content: "I've had a throbbing headache on one side for 3 hours with light sensitivity and slight nausea." },
  {
    role: "ai",
    confidence: 92,
    content:
      "Symptoms align with a probable **migraine episode** (unilateral, photophobia, nausea). Not an emergency unless accompanied by sudden severe onset, neurological deficits, or fever.",
    citations: [
      { src: "WHO ICHD-3 · Migraine without aura", tag: "Guideline" },
      { src: "NIH NINDS · Migraine Information", tag: "Reference" },
    ],
  },
  {
    role: "user",
    content: "Should I take ibuprofen? I'm also on lisinopril.",
  },
  {
    role: "ai",
    confidence: 88,
    content:
      "Short courses of ibuprofen are generally tolerated, but NSAIDs may reduce the antihypertensive effect of lisinopril and stress renal function. Prefer **paracetamol 500–1000 mg** as first-line. Hydrate, dim lights, and rest. Seek care if pain is the worst of your life or persists > 72h.",
    citations: [
      { src: "NIH DailyMed · Ibuprofen interactions", tag: "Drug DB" },
      { src: "WHO Essential Medicines · Analgesics", tag: "Guideline" },
    ],
  },
];

const REASONING = [
  { icon: Languages, label: "Language detection", detail: "English (en-IN) · 99.8%", color: "cyan" },
  { icon: AlertTriangle, label: "Emergency screening", detail: "Non-critical · Triage Level 4", color: "emerald" },
  { icon: Brain, label: "Intent classification", detail: "symptom_query + medication_interaction", color: "cyan" },
  { icon: SearchIcon, label: "Vector RAG retrieval", detail: "9 relevant chunks · NIH+WHO corpus", color: "cyan" },
  { icon: Network, label: "Knowledge graph reasoning", detail: "Headache→Migraine; NSAID→ACEi nodes", color: "cyan" },
  { icon: Sparkles, label: "Response generation", detail: "Stream · 312 tokens", color: "emerald" },
  { icon: ShieldCheck, label: "Safety verification", detail: "Passed · No high-risk advice", color: "emerald" },
];

function Chat() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [emergency, setEmergency] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    const userMsg: Msg = { role: "user", content: draft };
    const isEmerg = /chest pain|stroke|unconscious|bleeding|108|emergency|can.?t breathe/i.test(draft);
    setEmergency(isEmerg);
    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "ai",
        confidence: 86 + Math.floor(Math.random() * 10),
        content: isEmerg
          ? "⚠️ Possible emergency. Call **108** immediately and follow on-screen first-aid steps."
          : "Based on what you described, here's a structured assessment with differentials, red flags, and next steps tailored to your context.",
        citations: [{ src: "WHO Clinical Guidelines", tag: "Guideline" }, { src: "NIH MedlinePlus", tag: "Reference" }],
        emergency: isEmerg,
      }]);
      setTyping(false);
    }, 1400);
  };

  return (
    <PageShell>
      <TopNav />

      {/* Emergency banner */}
      <AnimatePresence>
        {emergency && (
          <motion.div
            initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
            className="sticky top-[88px] z-30 mx-auto mt-3 max-w-7xl px-4"
          >
            <div className="glass relative overflow-hidden rounded-2xl border border-rose-400/40 p-4 glow-red">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-rose-500/25 to-rose-500/10" />
              <div className="relative flex flex-wrap items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-300" />
                <span className="font-semibold text-white">Critical signal detected — proceed with caution</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <NeonButton variant="danger" className="px-4 py-2 text-xs">
                    <Phone className="h-4 w-4" /> Call 108
                  </NeonButton>
                  <NeonButton variant="ghost" className="px-4 py-2 text-xs">
                    <MapPin className="h-4 w-4" /> Nearby Hospitals
                  </NeonButton>
                  <button onClick={() => setEmergency(false)} className="grid h-9 w-9 place-items-center rounded-full glass">
                    <X className="h-4 w-4 text-white/70" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 pt-6 lg:grid-cols-[1fr_320px]">
        {/* Chat column */}
        <div>
          {/* Assistant header */}
          <GlassCard className="mb-5 flex items-center gap-4 p-4">
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-emerald-300/20 border border-white/15">
                <Brain className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#07111f] shadow-[0_0_10px_rgba(0,255,179,0.7)]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">HealthDesk AI · Clinical Reasoning</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">Encrypted · Offline-capable · WHO + NIH</div>
            </div>
            <button onClick={() => setReasonOpen(true)} className="hidden md:inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-white/80 hover:text-white">
              <Layers className="h-3.5 w-3.5" /> View Reasoning
            </button>
          </GlassCard>

          <div className="space-y-5">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-cyan-400 to-cyan-500 px-5 py-3.5 text-sm font-medium text-[#04111d] shadow-[0_10px_30px_-10px_rgba(0,212,255,0.6)]">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[88%]">
                    <div className="glass relative overflow-hidden rounded-2xl rounded-tl-sm p-5">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                      <p className="text-[15px] leading-relaxed text-white/90"
                         dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyan-300">$1</strong>') }} />

                      {typeof m.confidence === "number" && (
                        <div className="mt-4">
                          <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/40">
                            <span>AI Confidence</span><span className="text-emerald-300">{m.confidence}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${m.confidence}%` }}
                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 shadow-[0_0_10px_rgba(0,212,255,0.7)]"
                            />
                          </div>
                        </div>
                      )}

                      {m.citations && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {m.citations.map((c) => (
                            <span key={c.src} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/75">
                              <FileText className="h-3 w-3 text-cyan-300" />
                              <span className="text-white/50">[{c.tag}]</span> {c.src}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                        <button onClick={() => setReasonOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200">
                          <Sparkles className="h-3.5 w-3.5" /> View full reasoning
                        </button>
                        <span className="text-white/15">·</span>
                        <button onClick={() => setReasonOpen(true)} className="text-xs text-white/60 hover:text-white">Why this answer?</button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                  <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="h-2 w-2 rounded-full bg-cyan-300"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                    <span className="text-xs uppercase tracking-[0.22em] text-white/40">AI reasoning</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="sticky bottom-24 mt-8">
            <div className="glass-strong relative flex items-end gap-2 rounded-2xl p-2 shadow-[0_30px_80px_-30px_rgba(0,212,255,0.45)]">
              <button className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/5 transition" aria-label="Image">
                <ImagePlus className="h-5 w-5 text-white/70" />
              </button>
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Describe your symptom, or type 'chest pain' to see emergency mode…"
                className="flex-1 resize-none bg-transparent px-2 py-3 text-[15px] text-white placeholder:text-white/40 outline-none"
              />
              <button className="relative grid h-11 w-11 place-items-center rounded-xl hover:bg-white/5 transition" aria-label="Voice">
                <Mic className="h-5 w-5 text-cyan-300" />
                <span className="absolute inset-1 rounded-lg border border-cyan-300/30 animate-ping" />
              </button>
              <button onClick={send} className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-[#04111d] shadow-[0_10px_24px_-8px_rgba(0,212,255,0.7)] hover:opacity-95">
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Side rail */}
        <aside className="hidden lg:block space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-semibold text-white">Session vitals</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              {[
                { k: "Triage", v: "Level 4" },
                { k: "Confidence", v: "92%" },
                { k: "Sources", v: "9 cited" },
                { k: "Language", v: "EN" },
              ].map((s) => (
                <div key={s.k} className="glass rounded-xl p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">{s.k}</div>
                  <div className="mt-1 text-white">{s.v}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-semibold text-white">Safety</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/60">
              All responses are reviewed by an automated safety classifier before reaching you. Critical signals trigger emergency mode automatically.
            </p>
            <Link to="/emergency" className="mt-4 inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200">
              <AlertTriangle className="h-3.5 w-3.5" /> Open Emergency Protocol
            </Link>
          </GlassCard>
        </aside>
      </main>

      {/* Reasoning modal */}
      <AnimatePresence>
        {reasonOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setReasonOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="glass-strong relative w-full max-w-3xl overflow-hidden rounded-3xl"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />
              <div className="relative flex items-center justify-between border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300/20 border border-cyan-300/30">
                    <Brain className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AI Reasoning Pipeline</div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">Holographic transparency view</div>
                  </div>
                </div>
                <button onClick={() => setReasonOpen(false)} className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/10">
                  <X className="h-4 w-4 text-white/70" />
                </button>
              </div>

              <div className="relative max-h-[70vh] overflow-y-auto p-6">
                <ol className="space-y-3">
                  {REASONING.map((r, i) => {
                    const Icon = r.icon;
                    const tone = r.color === "emerald" ? "text-emerald-300 border-emerald-300/30 bg-emerald-300/10" : "text-cyan-300 border-cyan-300/30 bg-cyan-300/10";
                    return (
                      <motion.li
                        key={r.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass flex items-start gap-4 rounded-2xl p-4"
                      >
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${tone}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{r.label}</span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          </div>
                          <div className="mt-0.5 text-xs text-white/55">{r.detail}</div>
                          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${75 + i * 3}%` }} transition={{ delay: i * 0.07 + 0.2, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>

                <details className="glass mt-5 rounded-2xl p-4">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-white">
                    Source documents (4)
                    <ChevronDown className="h-4 w-4 text-white/60 transition group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 space-y-2">
                    {["WHO ICHD-3 · Migraine taxonomy", "NIH NINDS · Migraine Information", "NIH DailyMed · Ibuprofen monograph", "WHO Essential Medicines · Analgesics"].map((s) => (
                      <div key={s} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/75">
                        <FileText className="h-3.5 w-3.5 text-cyan-300" /> {s}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomDock />
    </PageShell>
  );
}
