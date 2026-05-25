import { motion, type HTMLMotionProps } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Activity, Bell, Home, MessageSquare, Settings as SettingsIcon, History,
  Languages, Mic, AlertTriangle, Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

export function GlassCard({
  children, className = "", glow = "cyan", ...rest
}: { children: ReactNode; className?: string; glow?: "cyan" | "emerald" | "red" | "none" } & HTMLMotionProps<"div">) {
  const glowCls = glow === "cyan" ? "hover:glow-cyan" : glow === "emerald" ? "hover:glow-emerald" : glow === "red" ? "glow-red" : "";
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`glass relative overflow-hidden rounded-2xl ${glowCls} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function NeonButton({
  children, onClick, variant = "primary", className = "", disabled, type = "button",
}: {
  children: ReactNode; onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "emerald";
  className?: string; disabled?: boolean; type?: "button" | "submit";
}) {
  const styles = {
    primary: "text-[#04111d] bg-gradient-to-r from-[#7df0ff] via-[#00d4ff] to-[#00b6e8] shadow-[0_10px_40px_-10px_rgba(0,212,255,0.7)] hover:shadow-[0_14px_50px_-8px_rgba(0,212,255,0.9)]",
    emerald: "text-[#04111d] bg-gradient-to-r from-[#9ffce0] via-[#00ffb3] to-[#00cf91] shadow-[0_10px_40px_-10px_rgba(0,255,179,0.7)]",
    ghost: "glass text-white hover:bg-white/10",
    danger: "text-white bg-gradient-to-r from-[#ff5a78] via-[#ff3b5c] to-[#e02448] shadow-[0_10px_40px_-10px_rgba(255,59,92,0.7)]",
  }[variant];
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/90">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(0,212,255,0.8)]" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-gradient">{title}</h2>
      {sub && <p className="mt-2 text-sm text-white/60 max-w-2xl">{sub}</p>}
    </div>
  );
}

export function StatusDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </div>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="glass-strong mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-emerald-300/20 border border-white/15">
            <Activity className="h-4.5 w-4.5 text-cyan-300" strokeWidth={2.2} />
            <span className="absolute inset-0 rounded-xl glow-cyan opacity-50" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-white">HealthDesk <span className="text-cyan-300">Pro</span></div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Medical AI OS</div>
          </div>
        </Link>
        <div className="hidden md:block">
          <StatusDot label="AI Online · Offline-Ready" />
        </div>
        <div className="flex items-center gap-2">
          <button className="glass rounded-full p-2.5 hover:bg-white/10 transition" aria-label="Language">
            <Languages className="h-4 w-4 text-white/80" />
          </button>
          <button className="glass rounded-full p-2.5 hover:bg-white/10 transition relative" aria-label="Notifications">
            <Bell className="h-4 w-4 text-white/80" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(0,212,255,0.8)]" />
          </button>
          <Link to="/settings" className="glass rounded-full p-2.5 hover:bg-white/10 transition" aria-label="Settings">
            <SettingsIcon className="h-4 w-4 text-white/80" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomDock() {
  const items = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/chat", icon: MessageSquare, label: "Chat" },
    { to: "/emergency", icon: AlertTriangle, label: "SOS" },
    { to: "/history", icon: History, label: "History" },
    { to: "/settings", icon: SettingsIcon, label: "Settings" },
  ] as const;
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-4">
      <div className="glass-strong flex items-center gap-1 rounded-full px-2 py-2 shadow-[0_20px_60px_-15px_rgba(0,212,255,0.35)]">
        {items.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="group relative flex flex-col items-center justify-center rounded-full px-4 py-2 text-[10px] font-medium text-white/60 transition hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="dock-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400/25 to-cyan-400/10 border border-cyan-300/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative h-5 w-5" />
                <span className="relative mt-0.5 hidden sm:block">{label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen pb-28"
    >
      {children}
    </motion.div>
  );
}

export function HoloIcon({ icon: Icon, tone = "cyan" }: { icon: any; tone?: "cyan" | "emerald" | "red" }) {
  const tones = {
    cyan: "from-cyan-400/30 to-cyan-300/10 text-cyan-300",
    emerald: "from-emerald-300/30 to-emerald-300/10 text-emerald-300",
    red: "from-rose-400/30 to-rose-400/10 text-rose-300",
  }[tone];
  return (
    <div className={`relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-gradient-to-br ${tones}`}>
      <Icon className="h-5 w-5" strokeWidth={2} />
      <Sparkles className="absolute -right-1 -top-1 h-2.5 w-2.5 text-white/70" />
    </div>
  );
}
