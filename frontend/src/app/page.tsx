"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Fingerprint,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Zap,
  FileCheck,
  Check,
  X,
} from "lucide-react";

/* ─── Animation helpers ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function SectionDivider() {
  return (
    <div className="mx-auto max-w-[1160px] px-5 lg:px-14">
      <div className="h-px bg-white/[0.05]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection({ reduced }: { reduced: boolean }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 55% 25%, rgba(59,111,240,0.055) 0%, transparent 55%)",
        }}
      />

      <div className="page-shell relative z-10 w-full py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-20 items-center">
          {/* Left: copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Status badge */}
            <motion.div variants={fadeUp} className="mb-7 inline-flex">
              <span className="badge badge-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
                Midnight Network · Zero-Knowledge Verification
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mb-6 text-[2.5rem] sm:text-[3.2rem] lg:text-[3.6rem] font-semibold leading-[1.07] tracking-tight text-white"
            >
              Prove you qualify.{" "}
              <span className="gradient-text-blue">
                Without revealing your score.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="mb-10 max-w-[490px] text-[15px] leading-[1.75] text-slate-400"
            >
              Your credit score is evaluated entirely in your browser. Only a
              cryptographic proof of eligibility is published to the Midnight
              blockchain — your financial data never leaves your device.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/eligibility"
                className="btn btn-primary btn-lg group inline-flex items-center gap-2"
              >
                Check Eligibility
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("how-it-works")?.scrollIntoView({
                    behavior: reduced ? "auto" : "smooth",
                  });
                }}
                className="btn btn-ghost btn-lg"
              >
                How it works
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap gap-6"
            >
              {[
                { label: "Score never transmitted" },
                { label: "Local browser processing" },
                { label: "Tamper-proof on-chain result" },
              ].map((sig) => (
                <div
                  key={sig.label}
                  className="flex items-center gap-2 text-[12px] text-slate-500"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {sig.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: verification status card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <VerificationPreviewCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VerificationPreviewCard() {
  const steps = [
    { label: "Private Input", sub: "Credit score — local only", icon: CreditCard, done: true },
    { label: "SHA-256 Commitment", sub: "Derived locally, never sent", icon: Lock, done: true },
    { label: "ZK Proof Generated", sub: "Validity without disclosure", icon: ShieldCheck, done: true },
    { label: "On-Chain Result", sub: "Result on Midnight ledger", icon: CheckCircle2, done: false, active: true },
  ];

  return (
    <div className="card p-5 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Verification Status
        </span>
        <span className="badge badge-blue">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
          Live Preview
        </span>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <div
          key={step.label}
          className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
            step.active ? "bg-blue-500/[0.06] border border-blue-500/15" : ""
          }`}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
              step.done
                ? "bg-emerald-500/15 text-emerald-400"
                : step.active
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-white/[0.04] text-slate-600"
            }`}
          >
            {step.done ? (
              <Check className="h-3.5 w-3.5" />
            ) : step.active ? (
              <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-slate-600 border-t-blue-400 animate-spin inline-block" />
            ) : (
              <step.icon className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[12px] font-medium truncate ${
                step.done ? "text-slate-200" : step.active ? "text-slate-200" : "text-slate-500"
              }`}>
                {step.label}
              </span>
              {step.done && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
              {step.active && (
                <span className="text-[10px] text-blue-400 shrink-0">Processing…</span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 truncate">{step.sub}</p>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.05] mt-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-600">Score disclosed:</span>
          <span className="text-emerald-400 font-medium">Never</span>
        </div>
        <div className="flex items-center justify-between text-[11px] mt-1">
          <span className="text-slate-600">Processing location:</span>
          <span className="text-slate-400">Your browser</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS — Vertical Journey (scroll-driven)
   ═══════════════════════════════════════════════════════════════════════════ */

const STAGES = [
  {
    num: "01",
    label: "Private Input",
    detail:
      "Your credit score is entered locally in your browser. The raw value never touches any server, network request, or external system. Processing is entirely offline.",
    icon: CreditCard,
    side: "right" as const,
    from: 0,
    to: 0.2,
  },
  {
    num: "02",
    label: "SHA-256 Commitment",
    detail:
      "A cryptographic commitment is derived from your score and wallet address using SHA-256. This binding proves ownership without revealing the underlying score to any party.",
    icon: Lock,
    side: "left" as const,
    from: 0.2,
    to: 0.4,
  },
  {
    num: "03",
    label: "ZK Circuit",
    detail:
      "A zero-knowledge circuit evaluates your score against the eligibility threshold. The proof certifies the result is valid — without disclosing what the input value was.",
    icon: ShieldCheck,
    side: "right" as const,
    from: 0.4,
    to: 0.6,
  },
  {
    num: "04",
    label: "Wallet Signature",
    detail:
      "Your Midnight wallet authorizes the transaction. This ties your on-chain identity to the proof without exposing any financial data to the ledger.",
    icon: Fingerprint,
    side: "left" as const,
    from: 0.6,
    to: 0.8,
  },
  {
    num: "05",
    label: "Verified On-Chain",
    detail:
      "Only the boolean eligibility result is published to Midnight. Your credit score remains entirely private — permanently. The proof is tamper-proof and immutable.",
    icon: CheckCircle2,
    side: "right" as const,
    from: 0.8,
    to: 1.0,
    isFinal: true,
  },
] as const;

type NodeState = "idle" | "active" | "done";

function getNodeState(stage: (typeof STAGES)[number], progress: number): NodeState {
  if (progress >= stage.to) return "done";
  if (progress >= stage.from) return "active";
  return "idle";
}

function StageNode({
  state,
  icon: Icon,
  isFinal,
}: {
  state: NodeState;
  icon: (typeof STAGES)[number]["icon"];
  isFinal?: boolean;
}) {
  const colors = {
    idle:   { border: "rgba(255,255,255,0.09)", bg: "rgba(255,255,255,0.03)", icon: "rgba(255,255,255,0.18)" },
    active: { border: "#3B6FF0",                bg: "rgba(59,111,240,0.1)",   icon: "#7B9FF5" },
    done:   { border: "#12B981",                bg: "rgba(18,185,129,0.1)",   icon: "#34D399" },
  }[state];

  const glow =
    state === "active"
      ? "0 0 0 5px rgba(59,111,240,0.1), 0 0 18px rgba(59,111,240,0.2)"
      : "none";

  const size = state === "active" ? 38 : 30;

  return (
    <div className="relative flex items-center justify-center">
      {state === "active" && (
        <motion.div
          className="absolute rounded-full border"
          style={{ borderColor: "rgba(59,111,240,0.3)" }}
          animate={{ width: [42, 56, 42], height: [42, 56, 42], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className="flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: size,
          height: size,
          background: colors.bg,
          border: `1.5px solid ${colors.border}`,
          boxShadow: glow,
        }}
      >
        {state === "done" ? (
          <Check className="h-3.5 w-3.5" style={{ color: colors.icon }} />
        ) : (
          <Icon className="h-3.5 w-3.5" style={{ color: colors.icon }} />
        )}
      </div>
    </div>
  );
}

function JourneySection({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const targetRef = useRef(0);
  const smoothRef = useRef(0);

  useEffect(() => {
    function measure() {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      targetRef.current = Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    function loop() {
      if (reduced) {
        measure();
        setProgress(targetRef.current);
      } else {
        const diff = targetRef.current - smoothRef.current;
        if (Math.abs(diff) > 0.0003) {
          smoothRef.current += diff * 0.09;
          setProgress(smoothRef.current);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  const nodeStates = STAGES.map((s) => getNodeState(s, progress));

  return (
    <section id="how-it-works" className="py-0">
      {/* Intro */}
      <div className="page-shell py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="label mb-4">
            How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-[2rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.4rem]"
          >
            The verification journey
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-[420px] text-[14px] leading-relaxed text-slate-400"
          >
            Scroll to walk through the cryptographic verification pipeline, step by step.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex justify-center">
            <motion.div
              className="flex flex-col items-center gap-1.5"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-7 w-px bg-gradient-to-b from-transparent to-blue-500/50" />
              <div className="h-1 w-1 rounded-full bg-blue-500/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll track */}
      <div ref={trackRef} className="relative" style={{ height: "500vh" }}>
        <div
          className="sticky top-0 flex items-center justify-center overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Side progress bar */}
          <div
            className="absolute top-[18%] bottom-[18%] right-6 w-px rounded-full overflow-hidden hidden lg:block"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="absolute top-0 left-0 w-full bg-blue-500/35 origin-top"
              style={{
                height: `${Math.round(progress * 100)}%`,
                transition: reduced ? "none" : "height 0.05s linear",
              }}
            />
          </div>

          {/* Desktop layout */}
          <div className="hidden md:block w-full max-w-[800px] mx-auto px-10">
            {STAGES.map((stage, i) => {
              const state = nodeStates[i];
              const isLast = i === STAGES.length - 1;
              const isLeft = stage.side === "left";
              const connectorFilled = nodeStates[i] === "done";

              const numColor =
                state === "done" ? "#34D399" : state === "active" ? "#7B9FF5" : "rgba(255,255,255,0.16)";
              const contentOpacity = state === "idle" ? 0.28 : 1;

              return (
                <div key={stage.num}>
                  <div className="relative flex items-start">
                    {/* Left slot */}
                    <div
                      className="flex-1 pr-10"
                      style={{
                        opacity: contentOpacity,
                        transition: reduced ? "none" : "opacity 0.4s ease",
                        visibility: isLeft ? "visible" : "hidden",
                      }}
                      aria-hidden={!isLeft}
                    >
                      {isLeft && (
                        <div className="text-right py-1 max-w-[260px] ml-auto">
                          <p
                            className="mb-1 text-[10px] font-mono font-semibold tracking-[0.16em] uppercase"
                            style={{ color: numColor }}
                          >
                            {stage.num}
                          </p>
                          <h3
                            className="mb-2 text-[1.05rem] font-semibold leading-snug tracking-tight"
                            style={{
                              color: state === "idle" ? "rgba(255,255,255,0.28)" : "#EEF2F8",
                            }}
                          >
                            {stage.label}
                          </h3>
                          <p
                            className="text-[12.5px] leading-[1.7] text-slate-500"
                            style={{
                              opacity: state === "idle" ? 0 : 1,
                              transition: reduced ? "none" : "opacity 0.5s ease",
                            }}
                          >
                            {stage.detail}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Center path */}
                    <div className="relative flex flex-col items-center shrink-0" style={{ width: 48 }}>
                      <StageNode state={state} icon={stage.icon} isFinal={(stage as any).isFinal} />
                    </div>

                    {/* Right slot */}
                    <div
                      className="flex-1 pl-10"
                      style={{
                        opacity: contentOpacity,
                        transition: reduced ? "none" : "opacity 0.4s ease",
                        visibility: !isLeft ? "visible" : "hidden",
                      }}
                      aria-hidden={isLeft}
                    >
                      {!isLeft && (
                        <div className="py-1 max-w-[260px]">
                          <p
                            className="mb-1 text-[10px] font-mono font-semibold tracking-[0.16em] uppercase"
                            style={{ color: numColor }}
                          >
                            {stage.num}
                          </p>
                          <h3
                            className="mb-2 text-[1.05rem] font-semibold leading-snug tracking-tight"
                            style={{
                              color: state === "idle" ? "rgba(255,255,255,0.28)" : "#EEF2F8",
                            }}
                          >
                            {stage.label}
                          </h3>
                          <p
                            className="text-[12.5px] leading-[1.7] text-slate-500"
                            style={{
                              opacity: state === "idle" ? 0 : 1,
                              transition: reduced ? "none" : "opacity 0.5s ease",
                            }}
                          >
                            {stage.detail}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connector */}
                  {!isLast && (
                    <div className="relative flex">
                      <div className="flex-1" />
                      <div style={{ width: 48 }} className="flex justify-center">
                        <div className="relative overflow-hidden" style={{ width: 1, height: 54 }}>
                          <div className="absolute inset-0 bg-white/[0.05]" />
                          <div
                            className="absolute top-0 left-0 w-full origin-top"
                            style={{
                              height: connectorFilled ? "100%" : "0%",
                              background: "linear-gradient(to bottom, #3B6FF0, #5B8FF8)",
                              boxShadow: connectorFilled ? "0 0 4px rgba(59,111,240,0.4)" : "none",
                              transition: reduced ? "none" : "height 0.4s ease",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile layout */}
          <div className="md:hidden w-full px-5 max-w-sm mx-auto">
            {STAGES.map((stage, i) => {
              const state = nodeStates[i];
              const isLast = i === STAGES.length - 1;
              const numColor =
                state === "done" ? "#34D399" : state === "active" ? "#7B9FF5" : "rgba(255,255,255,0.16)";
              const contentOpacity = state === "idle" ? 0.28 : 1;
              return (
                <div key={stage.num} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
                    <StageNode state={state} icon={stage.icon} />
                    {!isLast && (
                      <div
                        className="flex-1 mt-2 relative overflow-hidden"
                        style={{ width: 1, minHeight: 72 }}
                      >
                        <div className="absolute inset-0 bg-white/[0.05]" />
                        <div
                          className="absolute top-0 left-0 w-full bg-blue-500 origin-top"
                          style={{
                            height: state === "done" ? "100%" : "0%",
                            transition: reduced ? "none" : "height 0.5s ease",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="pb-10 pt-0.5"
                    style={{
                      opacity: contentOpacity,
                      transition: reduced ? "none" : "opacity 0.4s ease",
                    }}
                  >
                    <p
                      className="mb-1 text-[9px] font-mono font-semibold tracking-[0.18em] uppercase"
                      style={{ color: numColor }}
                    >
                      {stage.num}
                    </p>
                    <h3
                      className="mb-1.5 text-[15px] font-semibold leading-snug tracking-tight"
                      style={{ color: state === "idle" ? "rgba(255,255,255,0.28)" : "#EEF2F8" }}
                    >
                      {stage.label}
                    </h3>
                    <p
                      className="text-[12px] leading-[1.65] text-slate-500 max-w-[240px]"
                      style={{
                        opacity: state === "idle" ? 0 : 1,
                        transition: reduced ? "none" : "opacity 0.5s ease",
                      }}
                    >
                      {stage.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stage dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-1.5">
              {STAGES.map((s, i) => (
                <div
                  key={s.num}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: nodeStates[i] === "active" ? 18 : 4,
                    height: 4,
                    background:
                      nodeStates[i] === "done"
                        ? "#12B981"
                        : nodeStates[i] === "active"
                          ? "#3B6FF0"
                          : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA after journey */}
      <div className="page-shell py-16 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
        >
          <Link
            href="/eligibility"
            className="btn btn-primary btn-lg group inline-flex items-center gap-2"
          >
            Check Your Eligibility
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHITECTURE
   ═══════════════════════════════════════════════════════════════════════════ */

function ArchitectureSection() {
  const pillars = [
    {
      n: "01",
      title: "Private Input",
      body:
        "Your credit score is evaluated entirely in your browser. The raw value is never transmitted over the network or stored on any server.",
      icon: CreditCard,
    },
    {
      n: "02",
      title: "Cryptographic Commitment",
      body:
        "A SHA-256 commitment is derived from your credit data and wallet address, creating a tamper-proof binding without revealing the score.",
      icon: Lock,
    },
    {
      n: "03",
      title: "On-Chain Verification",
      body:
        "Only the boolean eligibility result and its proof are published to the Midnight blockchain. Your score remains entirely private.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="architecture" className="py-24">
      <div className="page-shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mb-12"
        >
          <motion.p variants={fadeUp} className="label mb-4">
            Architecture
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-[2rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]"
          >
            Your data stays yours.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-[460px] text-[14px] leading-relaxed text-slate-400"
          >
            Every layer of the verification stack is built to eliminate data exposure.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.n}
              variants={fadeUp}
              className="card card-interactive p-6 group"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-blue-400/50">
                  {p.n}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] group-hover:border-blue-500/20 group-hover:bg-blue-500/[0.06] transition-colors">
                  <p.icon className="h-3.5 w-3.5 text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-white leading-tight">
                {p.title}
              </h3>
              <p className="text-[13px] leading-[1.65] text-slate-500">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CAPABILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function CapabilitiesSection() {
  const items = [
    { icon: ShieldCheck, title: "Local Processing",  body: "Credit score computation happens entirely in your browser. Zero server round-trips for the evaluation." },
    { icon: Zap,         title: "Fast Verification", body: "SHA-256 commitments are derived locally with no API delays. Sub-second performance." },
    { icon: Lock,        title: "Minimal Trust",     body: "Verification occurs directly between your wallet and the blockchain. No intermediary required." },
    { icon: EyeOff,      title: "Score Privacy",     body: "Your raw credit score is never transmitted. Only the cryptographic commitment leaves your device." },
    { icon: FileCheck,   title: "Immutable Record",  body: "Verification results are on-chain as tamper-proof commitments that cannot be altered." },
    { icon: Fingerprint, title: "Wallet Identity",   body: "Your Midnight wallet is your identity. No passwords, no accounts, no credential exposure." },
  ];

  return (
    <section className="py-24">
      <div className="page-shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mb-12"
        >
          <motion.p variants={fadeUp} className="label mb-4">
            Capabilities
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-[2rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]"
          >
            Built for private verification.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group flex gap-4 p-5 rounded-lg border border-white/[0.05] hover:border-white/[0.09] hover:bg-white/[0.02] transition-colors"
            >
              <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/14 transition-colors">
                <item.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="mb-1 text-[13px] font-semibold text-white">{item.title}</h3>
                <p className="text-[12.5px] leading-[1.6] text-slate-500">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPARISON
   ═══════════════════════════════════════════════════════════════════════════ */

function ComparisonSection() {
  const rows = [
    { topic: "Score handling",  traditional: "Uploaded to third-party server",  midnight: "Processed locally in browser" },
    { topic: "Data storage",    traditional: "Stored in external databases",     midnight: "Never stored externally" },
    { topic: "Privacy model",   traditional: "Full data access to verifier",     midnight: "Only boolean result disclosed" },
    { topic: "Breach risk",     traditional: "High — centralized data target",   midnight: "None — no raw data transmitted" },
    { topic: "Identity",        traditional: "Account + credentials required",   midnight: "Wallet-native, no account needed" },
  ];

  return (
    <section className="py-24">
      <div className="page-shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mb-12"
        >
          <motion.p variants={fadeUp} className="label mb-4">
            Comparison
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-[2rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.3rem]"
          >
            A fundamentally different approach.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="card overflow-hidden"
        >
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/[0.06]">
            <div className="px-5 py-3.5" />
            <div className="flex items-center gap-2 px-5 py-3.5 border-l border-white/[0.06]">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-red-500/10">
                <X className="h-2.5 w-2.5 text-red-400" />
              </div>
              <span className="text-[12px] font-semibold text-slate-400">Traditional</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3.5 border-l border-white/[0.06]">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10">
                <Check className="h-2.5 w-2.5 text-emerald-400" />
              </div>
              <span className="text-[12px] font-semibold text-slate-400">Midnight</span>
            </div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.topic}
              className={`grid grid-cols-[1fr_1fr_1fr] ${i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}
            >
              <div className="px-5 py-4 text-[12px] font-medium text-slate-500">{row.topic}</div>
              <div className="flex items-start gap-2 px-5 py-4 border-l border-white/[0.04]">
                <X className="h-3 w-3 shrink-0 mt-0.5 text-red-400/45" />
                <span className="text-[12px] text-slate-600">{row.traditional}</span>
              </div>
              <div className="flex items-start gap-2 px-5 py-4 border-l border-white/[0.04]">
                <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5 text-emerald-500/55" />
                <span className="text-[12px] text-slate-300">{row.midnight}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function CTASection() {
  return (
    <section className="py-24">
      <div className="page-shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-[2rem] font-semibold tracking-tight text-white sm:text-[2.3rem]"
          >
            Ready to verify privately?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mb-8 text-[14px] text-slate-400 leading-relaxed"
          >
            Check your credit eligibility without exposing your score to any third party.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row justify-center gap-3"
          >
            <Link
              href="/eligibility"
              className="btn btn-primary btn-lg group inline-flex items-center gap-2"
            >
              Start Verification
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/dashboard" className="btn btn-ghost btn-lg">
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const reduced = useReducedMotion();

  return (
    <>
      <HeroSection reduced={reduced} />
      <SectionDivider />
      <ArchitectureSection />
      <SectionDivider />
      <JourneySection reduced={reduced} />
      <SectionDivider />
      <CapabilitiesSection />
      <SectionDivider />
      <ComparisonSection />
      <SectionDivider />
      <CTASection />
    </>
  );
}
