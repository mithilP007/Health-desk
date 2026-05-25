import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, Trash2, AlertTriangle, MessageSquare, Clock } from "lucide-react";
import { TopNav, BottomDock, PageShell, GlassCard, SectionTitle } from "../components/ui-kit";

export const Route = createFileRoute("/history")({ component: History });

type Conv = { id: string; title: string; tag: string; lang: string; emergency?: boolean; time: string; preview: string };

const DATA: Conv[] = [
  { id: "1", title: "Persistent migraine with aura", tag: "Neurology", lang: "EN", time: "12 min ago", preview: "Throbbing unilateral pain, photophobia, mild nausea…" },
  { id: "2", title: "Suspected MI — chest pain triage", tag: "Cardiology", lang: "EN", emergency: true, time: "2 hours ago", preview: "Severe retrosternal pressure radiating to left arm…" },
  { id: "3", title: "Toddler fever 38.4°C dosing", tag: "Pediatrics", lang: "HI", time: "Yesterday", preview: "बच्चे को बुखार है, खुराक की पुष्टि…" },
  { id: "4", title: "ACE-inhibitor interaction check", tag: "Pharmacology", lang: "EN", time: "2 days ago", preview: "Lisinopril + Ibuprofen renal interaction…" },
  { id: "5", title: "Postpartum bleeding signs", tag: "Obstetrics", lang: "TA", time: "4 days ago", preview: "பிரசவத்திற்கு பிறகான இரத்தப்போக்கு…" },
  { id: "6", title: "Allergic rhinitis seasonal plan", tag: "Allergy", lang: "TE", time: "1 week ago", preview: "మౌసలి అలర్జీ నిర్వహణ…" },
];

function History() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState(DATA);
  const filtered = useMemo(() => items.filter((c) => (c.title + c.preview + c.tag).toLowerCase().includes(q.toLowerCase())), [items, q]);

  return (
    <PageShell>
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 md:px-6 pt-8">
        <SectionTitle eyebrow="Archive" title="Conversation history" sub="Every consult, beautifully preserved. Search, replay, or remove anytime." />

        <div className="glass-strong flex items-center gap-3 rounded-2xl p-2 pl-5">
          <Search className="h-4 w-4 text-white/60" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by symptom, medication, condition…"
            className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/40 outline-none"
          />
          <div className="hidden sm:flex items-center gap-2 pr-2 text-[11px] uppercase tracking-[0.22em] text-white/40">
            <Clock className="h-3.5 w-3.5" /> Timeline
          </div>
        </div>

        <div className="mt-8 relative">
          {/* Spine line */}
          <div className="pointer-events-none absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-300/40 via-white/10 to-transparent" />
          <ul className="space-y-4">
            <AnimatePresence>
              {filtered.map((c, i) => (
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative pl-12"
                >
                  <span className={`absolute left-[14px] top-6 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-[#07111f] ${c.emergency ? "bg-rose-400 shadow-[0_0_10px_rgba(255,59,92,0.8)]" : "bg-cyan-300 shadow-[0_0_10px_rgba(0,212,255,0.7)]"}`} />
                  <GlassCard glow={c.emergency ? "red" : "cyan"} className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">{c.tag}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-cyan-300/80">{c.lang}</span>
                      {c.emergency && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-rose-200">
                          <AlertTriangle className="h-3 w-3" /> Emergency
                        </span>
                      )}
                      <span className="ml-auto text-white/40">{c.time}</span>
                    </div>
                    <h3 className="mt-3 text-base md:text-lg font-semibold text-white">{c.title}</h3>
                    <p className="mt-1 text-sm text-white/55 line-clamp-1">{c.preview}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-300/20">
                        <MessageSquare className="h-3.5 w-3.5" /> Resume
                      </button>
                      <button
                        onClick={() => setItems((p) => p.filter((x) => x.id !== c.id))}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:border-rose-400/40 hover:text-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </GlassCard>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {filtered.length === 0 && (
            <div className="glass mt-6 rounded-2xl p-10 text-center text-sm text-white/50">No conversations match "{q}".</div>
          )}
        </div>
      </main>
      <BottomDock />
    </PageShell>
  );
}
