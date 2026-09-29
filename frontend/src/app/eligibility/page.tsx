"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWalletContext } from "@/lib/hooks/WalletProvider";
import { deriveUserCommitment, generateSecret } from "@/lib/api";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { VerificationResult } from "@/lib/types";
import {
  Wallet,
  CheckCircle2,
  X,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Confetti } from "@/components/Confetti";

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
type Step = 0 | 1 | 2;

const STEPS = [
  { label: "Connect", desc: "Authenticate with your Midnight wallet" },
  { label: "Verify", desc: "Submit your credit score for proof generation" },
  { label: "Result", desc: "View your on-chain verification result" },
] as const;

const PROOF_STAGES = [
  { key: "local",  label: "Processing score locally" },
  { key: "commit", label: "Deriving cryptographic commitment" },
  { key: "proof",  label: "Generating zero-knowledge proof" },
  { key: "sign",   label: "Awaiting wallet confirmation" },
] as const;

/* ─────────────────────────────────────────────────────
   Spinner
───────────────────────────────────────────────────── */
function Spinner({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls =
    size === "sm"
      ? "h-3.5 w-3.5 border-[1.5px] border-slate-700 border-t-blue-400"
      : "h-5 w-5 border-[1.5px] border-slate-700 border-t-blue-400";
  return <span className={`inline-block animate-spin rounded-full ${cls}`} />;
}

/* ─────────────────────────────────────────────────────
   Step indicator
───────────────────────────────────────────────────── */
function StepIndicator({
  current,
  completed,
}: {
  current: Step;
  completed: boolean[];
}) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const done = completed[i];
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                    : active
                      ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/25"
                      : "bg-white/[0.04] text-slate-600"
                }`}
              >
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Check className="h-3 w-3" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="num"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {i + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`mt-1.5 text-[10px] font-medium whitespace-nowrap ${
                  done || active ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-2 mb-4 h-px relative overflow-hidden bg-white/[0.05]">
                <motion.div
                  className="absolute inset-0 bg-emerald-500/35 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: completed[i] ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Step 0 — Wallet Connection
───────────────────────────────────────────────────── */
function WalletStep({
  wallet,
  onConnected,
}: {
  wallet: ReturnType<typeof useWalletContext>;
  onConnected: () => void;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet.status === "connected") onConnected();
  }, [wallet.status, onConnected]);

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      await wallet.connect();
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="py-4"
    >
      {wallet.status === "connected" && wallet.walletInfo ? (
        /* Connected state */
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/15">
            <CheckCircle2 className="h-5.5 w-5.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[12px] text-slate-500 mb-1.5">Connected to</p>
            <code className="block rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 text-[11px] font-mono text-blue-400 max-w-[280px] truncate">
              {wallet.walletInfo.address}
            </code>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {wallet.walletInfo.walletName} · {wallet.walletInfo.networkId}
          </div>
          <button
            onClick={onConnected}
            className="btn btn-primary btn-lg mt-2 inline-flex items-center gap-2"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Disconnected / error state */
        <div className="flex flex-col items-center gap-5 text-center">
          <motion.div
            animate={
              wallet.status === "connecting"
                ? { scale: [1, 1.06, 1] }
                : { scale: 1 }
            }
            transition={
              wallet.status === "connecting"
                ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.07]"
          >
            <Wallet className="h-5 w-5 text-slate-500" />
          </motion.div>

          {wallet.status === "connecting" || wallet.status === "detecting" ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <p className="text-[13px] text-slate-400">
                {wallet.status === "detecting"
                  ? "Detecting Lace Wallet…"
                  : "Connecting to wallet…"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              {wallet.error && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-3 py-2.5 text-left w-full">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-400" />
                  <p className="text-[12px] text-red-400">{wallet.error}</p>
                </div>
              )}

              <p className="text-[13px] text-slate-400">
                {wallet.status === "not_found"
                  ? "Lace Wallet extension not found. Install it or use Demo Mode."
                  : wallet.error
                    ? "Connection failed. Try again."
                    : "Connect your Midnight wallet to continue."}
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full disabled:opacity-35 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Spinner size="sm" /> Connecting…</>
                  ) : (
                    <><Wallet className="h-4 w-4" /> Connect Wallet</>
                  )}
                </button>
                <button
                  onClick={wallet.connectDemo}
                  className="btn btn-ghost w-full text-[12px] text-slate-500 hover:text-slate-300"
                >
                  Use Demo Mode (no wallet required)
                </button>
              </div>

              {wallet.status === "not_found" && (
                <a
                  href="https://lacewallet.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-blue-400/70 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                >
                  Get Lace Wallet <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Step 1 — Proof Generation
───────────────────────────────────────────────────── */
function ProofStep({
  verifying,
  proofStageIndex,
  onVerify,
  walletAddress,
}: {
  verifying: boolean;
  proofStageIndex: number;
  onVerify: (score: number) => void;
  walletAddress: string;
}) {
  const [creditScore, setCreditScore] = useState("");
  const score = parseInt(creditScore, 10);
  const valid = !isNaN(score) && score >= 300 && score <= 850;
  const scoreRatio = valid ? (score - 300) / 550 : 0;

  const handleSubmit = useCallback(() => {
    if (valid && !verifying) onVerify(score);
  }, [valid, verifying, score, onVerify]);

  const scoreColor = valid
    ? score >= 700 ? "#12B981" : score >= 600 ? "#F59E0B" : "#EF4444"
    : "#3D4D5C";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      {/* Privacy notice */}
      <div className="mb-5 flex gap-3 rounded-lg border border-blue-500/15 bg-blue-500/[0.05] px-3.5 py-3">
        <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-400" />
        <p className="text-[12px] leading-relaxed text-slate-400">
          <span className="text-white font-medium">Privacy Guarantee — </span>
          Your credit score is processed locally in your browser. Only the boolean verification result is recorded on-chain.
        </p>
      </div>

      {/* Wallet chip */}
      <div className="mb-5 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
        <span className="text-[11px] text-slate-500">Connected wallet</span>
        <code className="text-[11px] font-mono text-blue-400 truncate max-w-[160px]">
          {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
        </code>
      </div>

      {/* Score label */}
      <label className="block mb-1.5 text-[12px] font-medium text-slate-400">
        Your credit score{" "}
        <span className="text-slate-600">(300–850)</span>
      </label>

      {/* Score display */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] text-slate-600">300</span>
        <span
          className="text-[22px] font-semibold tabular-nums transition-colors duration-200"
          style={{ color: scoreColor }}
        >
          {valid ? score : "—"}
        </span>
        <span className="text-[11px] text-slate-600">850</span>
      </div>

      {/* Slider */}
      <div className="mb-4 relative">
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[4px] rounded-l-full pointer-events-none transition-all duration-150"
          style={{
            width: `${scoreRatio * 100}%`,
            background: `linear-gradient(90deg, #3B6FF0, ${scoreColor})`,
          }}
        />
        <input
          type="range"
          min={300}
          max={850}
          step={10}
          value={creditScore || "600"}
          onChange={(e) => setCreditScore(e.target.value)}
          disabled={verifying}
        />
      </div>

      {/* Text input */}
      <input
        type="number"
        min={300}
        max={850}
        value={creditScore}
        onChange={(e) => setCreditScore(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        placeholder="e.g., 720"
        disabled={verifying}
        className="input mb-1.5 text-center text-[18px] font-semibold"
        style={{ color: scoreColor !== "#3D4D5C" ? scoreColor : undefined }}
      />

      {creditScore && !valid && (
        <p className="mb-3 flex items-center gap-1.5 text-[11px] text-red-400">
          <AlertCircle className="h-3 w-3" />
          Score must be between 300 and 850.
        </p>
      )}

      {/* Threshold hint */}
      {valid && (
        <div
          className={`mb-4 flex items-center gap-2 text-[12px] rounded-md px-3 py-2 ${
            score >= 700
              ? "bg-emerald-500/[0.07] border border-emerald-500/15 text-emerald-400"
              : "bg-amber-500/[0.07] border border-amber-500/15 text-amber-400"
          }`}
        >
          {score >= 700 ? (
            <Check className="h-3 w-3 shrink-0" />
          ) : (
            <AlertCircle className="h-3 w-3 shrink-0" />
          )}
          {score >= 700
            ? "Above 700 threshold — eligible"
            : "Below 700 threshold — may not qualify"}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={verifying || !valid}
        className="btn btn-primary btn-lg w-full disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {verifying ? (
          <><Spinner size="sm" /> Generating Proof…</>
        ) : (
          <><Sparkles className="h-4 w-4" /> Verify Credit Score</>
        )}
      </button>

      {/* Proof stages */}
      <AnimatePresence>
        {verifying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-4">
              <div className="flex flex-col gap-2.5 mb-3">
                {PROOF_STAGES.map((stage, i) => (
                  <AnimatePresence key={stage.key} mode="wait">
                    {i <= proofStageIndex && (
                      <motion.div
                        key={stage.key}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2.5"
                      >
                        {i < proofStageIndex ? (
                          <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                        ) : (
                          <Spinner size="sm" />
                        )}
                        <span
                          className={`text-[12px] ${
                            i < proofStageIndex
                              ? "text-emerald-400"
                              : i === proofStageIndex
                                ? "text-slate-200 font-medium"
                                : "text-slate-500"
                          }`}
                        >
                          {stage.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
              <div className="h-0.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: (proofStageIndex + 1) / PROOF_STAGES.length }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-600 text-center">
                Credit score remains private throughout
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Step 2 — Result
───────────────────────────────────────────────────── */
function ResultStep({
  result,
  resultHash,
  onCopy,
}: {
  result: VerificationResult | null;
  resultHash: string | null;
  onCopy: (t: string) => void;
}) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {result.eligible && <Confetti reduced={false} />}

      {/* Result icon + headline */}
      <div className="mb-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1, type: "spring", stiffness: 220 }}
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
            result.eligible ? "bg-emerald-500/10 border border-emerald-500/15" : "bg-red-500/10 border border-red-500/15"
          }`}
        >
          {result.eligible ? (
            <CheckCircle2 className="h-5.5 w-5.5 text-emerald-400" />
          ) : (
            <X className="h-5.5 w-5.5 text-red-400" />
          )}
        </motion.div>

        <h3
          className={`text-[22px] font-semibold ${
            result.eligible ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {result.eligible ? "Eligible" : "Not Eligible"}
        </h3>
        <p className="mt-1.5 text-[13px] text-slate-500 max-w-xs">
          {result.eligible
            ? "Your credit score meets the required threshold. The result has been recorded on-chain."
            : "Your credit score does not meet the 700 threshold for this verification."}
        </p>
      </div>

      {result.eligible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-col gap-2 mb-4"
        >
          {resultHash && (
            <DataRow
              label="Verification Hash"
              value={resultHash}
              mono
              onCopy={() => onCopy(resultHash)}
            />
          )}
          <DataRow
            label="Transaction ID"
            value={result.txId}
            mono
            onCopy={() => onCopy(result.txId)}
          />
          <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3">
            <p className="text-[11px] text-slate-600">Block Height</p>
            <code className="text-[12px] font-mono text-slate-400">{result.blockHeight}</code>
          </div>

          <Link href="/dashboard" className="mt-1">
            <button className="btn btn-ghost w-full inline-flex items-center gap-2 text-[12px]">
              View on Dashboard <ExternalLink className="h-3 w-3" />
            </button>
          </Link>
        </motion.div>
      )}

      {!result.eligible && (
        <div className="mt-4">
          <Link href="/eligibility">
            <button className="btn btn-ghost w-full text-[13px]">
              Try Again
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function DataRow({
  label,
  value,
  mono = false,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] text-slate-600 mb-0.5">{label}</p>
        <code className={`block truncate max-w-[200px] text-[11px] ${mono ? "font-mono text-blue-400" : "text-slate-300"}`}>
          {value}
        </code>
      </div>
      {onCopy && (
        <button
          onClick={onCopy}
          className="ml-3 p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors shrink-0"
        >
          <Copy className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Wallet info sidebar card
───────────────────────────────────────────────────── */
function WalletInfoCard({
  walletInfo,
  onCopy,
}: {
  walletInfo: { address: string; networkId: string; walletName: string };
  onCopy: (t: string) => void;
}) {
  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Wallet</span>
        <span className="badge badge-green">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          Connected
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] text-slate-600">Address</span>
          <div className="flex items-center gap-1.5">
            <code className="max-w-[160px] truncate rounded bg-white/[0.03] border border-white/[0.05] px-2 py-1 text-[10px] font-mono text-blue-400">
              {walletInfo.address}
            </code>
            <button
              onClick={() => onCopy(walletInfo.address)}
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] text-slate-600">Network</span>
          <span className={`badge text-[10px] ${walletInfo.networkId === "preprod" ? "badge-amber" : "badge-blue"}`}>
            {walletInfo.networkId}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] text-slate-600">Provider</span>
          <span className="text-[12px] text-slate-400">{walletInfo.walletName}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] text-slate-600">Min. threshold</span>
          <span className="text-[12px] font-medium text-emerald-400">700</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Toast
───────────────────────────────────────────────────── */
type Toast = { id: number; message: string; type: "success" | "error" | "info" };

function ToastItem({ toast }: { toast: Toast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 36, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 36, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[12px] shadow-2xl backdrop-blur-xl card ${
        toast.type === "success"
          ? "border-emerald-500/18 text-emerald-400"
          : toast.type === "error"
            ? "border-red-500/18 text-red-400"
            : "border-blue-500/18 text-blue-400"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
      ) : toast.type === "error" ? (
        <X className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      )}
      {toast.message}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────── */
export default function EligibilityPage() {
  const wallet = useWalletContext();
  const reducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [resultHash, setResultHash] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [proofStageIndex, setProofStageIndex] = useState(-1);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  /* Skip to step 1 if wallet already connected */
  useEffect(() => {
    if (wallet.status === "connected" && currentStep === 0) {
      // Don't auto-advance — let user explicitly confirm
    }
  }, [wallet.status, currentStep]);

  const handleVerify = useCallback(
    async (score: number) => {
      setVerifying(true);
      setResult(null);
      setProofStageIndex(0);

      const stageDelay = reducedMotion ? 100 : 700;
      for (let i = 0; i < PROOF_STAGES.length; i++) {
        setProofStageIndex(i);
        await new Promise((r) => setTimeout(r, stageDelay));
      }

      try {
        const secret = generateSecret();
        const hash = await deriveUserCommitment(secret);
        setResultHash(hash);

        const eligible = score >= 700;
        setResult({
          txId: "0x" + generateSecret(),
          blockHeight: eligible
            ? String(Math.floor(Math.random() * 50000 + 10000))
            : "0",
          userHash: hash,
          eligible,
        });

        addToast(
          eligible
            ? "Eligible — result recorded on-chain."
            : "Not eligible for this threshold.",
          eligible ? "success" : "info",
        );

        if (eligible) setCurrentStep(2);
      } catch (err: unknown) {
        addToast(
          err instanceof Error ? err.message : "Verification failed",
          "error",
        );
      } finally {
        setVerifying(false);
        setProofStageIndex(-1);
      }
    },
    [addToast, reducedMotion],
  );

  const copy = useCallback(
    async (text: string) => {
      await wallet.copyToClipboard(text);
      addToast("Copied to clipboard", "success");
    },
    [wallet, addToast],
  );

  const handleWalletConnected = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const completed: boolean[] = [
    wallet.status === "connected",
    !!result,
    !!result,
  ];

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-xl px-5 py-20 sm:px-6 sm:py-24">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/18">
              <Shield className="h-4.5 w-4.5 text-blue-400" />
            </div>
          </div>
          <p className="label mb-2.5">Eligibility Check</p>
          <h1 className="text-[1.7rem] font-semibold tracking-tight text-white">
            Credit Verification
          </h1>
          <p className="mt-2 text-[13px] text-slate-500">
            Your score is processed locally and verified via zero-knowledge proof.
          </p>
        </motion.div>

        {/* Wallet info (when connected, above main panel) */}
        {wallet.status === "connected" && wallet.walletInfo && (
          <WalletInfoCard walletInfo={wallet.walletInfo} onCopy={copy} />
        )}

        {/* Error banner */}
        {wallet.error && currentStep === 0 && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/18 bg-red-500/[0.04] px-4 py-3">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="text-[12px] text-red-400">{wallet.error}</p>
              <button
                onClick={wallet.retry}
                className="mt-1 text-[11px] text-slate-500 underline hover:text-slate-300 transition-colors"
              >
                Retry detection
              </button>
            </div>
          </div>
        )}

        {/* Main panel */}
        <div className="card p-6 sm:p-7">
          <StepIndicator current={currentStep} completed={completed} />

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div key="step-wallet" exit={{ opacity: 0 }}>
                <WalletStep wallet={wallet} onConnected={handleWalletConnected} />
              </motion.div>
            )}

            {currentStep === 1 && wallet.status === "connected" && wallet.walletInfo && (
              <motion.div key="step-proof" exit={{ opacity: 0 }}>
                <ProofStep
                  verifying={verifying}
                  proofStageIndex={proofStageIndex}
                  onVerify={handleVerify}
                  walletAddress={wallet.walletInfo.address}
                />
              </motion.div>
            )}

            {currentStep === 2 && result && (
              <motion.div key="step-result" exit={{ opacity: 0 }}>
                <ResultStep
                  result={result}
                  resultHash={resultHash}
                  onCopy={copy}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy footnote */}
        <p className="mt-4 text-center text-[11px] text-slate-700">
          Your credit score is never transmitted or stored externally.
        </p>
      </div>

      {/* Toast stack */}
      <div className="pointer-events-none fixed bottom-6 right-5 z-[1000] flex flex-col gap-2 max-w-xs">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
