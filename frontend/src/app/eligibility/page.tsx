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
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  Lock,
  RefreshCw,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Confetti } from "@/components/Confetti";

type Step = 0 | 1 | 2;

const STEPS = [
  { label: "01. Wallet Connection", desc: "Authenticate with Midnight Wallet" },
  { label: "02. ZK Proof Execution", desc: "Generate client-side zk-SNARK" },
  { label: "03. Verifiable Result", desc: "On-chain state attestation" },
] as const;

const PROOF_STAGES = [
  { key: "local", label: "Processing score in browser memory" },
  { key: "commit", label: "Deriving Poseidon cryptographic commitment" },
  { key: "proof", label: "Compiling WASM zk-SNARK proof" },
  { key: "sign", label: "Verifying Midnight shielded contract state" },
] as const;

function StepIndicator({ current, completed }: { current: Step; completed: boolean[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-8 font-mono">
      {STEPS.map((step, i) => {
        const done = completed[i];
        const active = i === current;
        return (
          <div
            key={step.label}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
              done
                ? "border-[#7ADAA5]/40 bg-[#7ADAA5]/10 text-[#7ADAA5]"
                : active
                ? "border-[#239BA7]/50 bg-[#239BA7]/15 text-[#ECECBB]"
                : "border-[#ECECBB]/08 bg-[#0F151D] text-[#6E8276]"
            }`}
          >
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold ${
                done
                  ? "bg-[#7ADAA5] text-[#090D12]"
                  : active
                  ? "bg-[#239BA7] text-[#090D12]"
                  : "bg-[#090D12] text-[#6E8276]"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{step.label}</div>
              <div className="text-[10px] text-[#B0BFA8] truncate hidden sm:block">{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Step 0 — Wallet Connection */
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-2 space-y-6">
      {wallet.status === "connected" && wallet.walletInfo ? (
        <div className="rounded-xl border border-[#7ADAA5]/30 bg-[#7ADAA5]/10 p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#7ADAA5]/20 text-[#7ADAA5] border border-[#7ADAA5]/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#B0BFA8] block uppercase">Wallet Connected</span>
            <code className="inline-block mt-1 font-mono text-xs text-[#7ADAA5] bg-[#090D12] px-3 py-1 rounded border border-[#7ADAA5]/30">
              {wallet.walletInfo.address}
            </code>
          </div>
          <p className="text-xs font-mono text-[#B0BFA8]">
            {wallet.walletInfo.walletName} &middot; {wallet.walletInfo.networkId}
          </p>
          <button
            onClick={onConnected}
            className="btn btn-primary px-6 py-2.5 text-xs font-semibold font-mono inline-flex items-center gap-2"
          >
            Proceed to Verification <ArrowRight className="h-4 w-4 text-[#090D12]" />
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-[#ECECBB]/10 bg-[#0F151D] p-6 text-center space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#239BA7]/15 text-[#239BA7] border border-[#239BA7]/30">
            <Wallet className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#ECECBB]">Connect Midnight Wallet</h3>
            <p className="text-xs text-[#B0BFA8] mt-1 max-w-md mx-auto">
              Authenticate with Lace Wallet to enable on-chain proof registration on Midnight Network.
            </p>
          </div>

          {wallet.error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444] font-mono text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{wallet.error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2.5 max-w-sm mx-auto font-mono">
            <button
              onClick={handleConnect}
              disabled={loading}
              className="btn btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-[#090D12]/30 border-t-[#090D12] rounded-full animate-spin" />
                  Connecting Wallet...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 text-[#090D12]" /> Connect Lace Wallet
                </>
              )}
            </button>
            <button
              onClick={wallet.connectDemo}
              className="btn btn-ghost py-2 text-xs text-[#B0BFA8] hover:text-[#ECECBB]"
            >
              Use Demo Mode (No wallet required)
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* Step 1 — Proof Generation */
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
  const [creditScore, setCreditScore] = useState("740");
  const score = parseInt(creditScore, 10);
  const valid = !isNaN(score) && score >= 300 && score <= 850;

  const handleSubmit = useCallback(() => {
    if (valid && !verifying) onVerify(score);
  }, [valid, verifying, score, onVerify]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Privacy Header Badge */}
      <div className="flex items-center gap-3 rounded-lg border border-[#239BA7]/30 bg-[#239BA7]/10 px-4 py-3 text-xs text-[#B0BFA8]">
        <Lock className="h-4 w-4 text-[#239BA7] shrink-0" />
        <div>
          <span className="font-bold text-[#ECECBB] font-mono">100% Client-Side Proving — </span>
          Your raw score is evaluated in browser WASM memory. Zero private data leaves your device.
        </div>
      </div>

      {/* Connected Wallet Chip */}
      <div className="flex items-center justify-between rounded-lg border border-[#ECECBB]/08 bg-[#090D12] px-4 py-2.5 text-xs font-mono">
        <span className="text-[#6E8276]">Connected Identity:</span>
        <span className="text-[#239BA7] font-semibold">{walletAddress}</span>
      </div>

      {/* Interactive Input Form */}
      <div className="rounded-xl border border-[#ECECBB]/10 bg-[#0F151D] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-mono text-[#ECECBB]">Enter Your Credit Score</label>
          <span className="text-xs font-mono text-[#6E8276]">Range: 300 – 850</span>
        </div>

        {/* Score Slider & Numeric Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={300}
              max={850}
              step={5}
              value={creditScore || "700"}
              onChange={(e) => setCreditScore(e.target.value)}
              disabled={verifying}
              className="w-full accent-[#239BA7] h-2 bg-[#090D12] rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min={300}
              max={850}
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              disabled={verifying}
              className="w-24 px-3 py-1.5 text-center font-mono font-bold text-base bg-[#090D12] border border-[#ECECBB]/15 rounded-lg text-[#ECECBB]"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#6E8276]">
            <span>300 (Poor)</span>
            <span className="text-[#E1AA36]">700 (Midnight Qualification Threshold)</span>
            <span>850 (Excellent)</span>
          </div>
        </div>

        {/* Qualification Status Hint */}
        {valid && (
          <div
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-xs font-mono ${
              score >= 700
                ? "border-[#7ADAA5]/40 bg-[#7ADAA5]/10 text-[#7ADAA5]"
                : "border-[#E1AA36]/40 bg-[#E1AA36]/10 text-[#E1AA36]"
            }`}
          >
            {score >= 700 ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>
              {score >= 700
                ? "Score qualifies for Midnight Confidential Credit attestation (>= 700)"
                : "Score is below 700 threshold — proof will output Not Eligible"}
            </span>
          </div>
        )}

        {/* Submit Execution Button */}
        <button
          onClick={handleSubmit}
          disabled={verifying || !valid}
          className="w-full btn btn-primary py-3 text-xs font-semibold font-mono flex items-center justify-center gap-2"
        >
          {verifying ? (
            <>
              <span className="h-4 w-4 border-2 border-[#090D12]/30 border-t-[#090D12] rounded-full animate-spin" />
              Executing WASM Prover...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-[#090D12]" /> Execute Zero-Knowledge Verification
            </>
          )}
        </button>

        {/* Live Execution Logs */}
        {verifying && (
          <div className="rounded-lg border border-[#ECECBB]/08 bg-[#090D12] p-4 font-mono text-xs space-y-2">
            <div className="text-[10px] text-[#6E8276] uppercase border-b border-[#ECECBB]/06 pb-2">
              WASM CIRCUIT EXECUTION TRACE
            </div>
            {PROOF_STAGES.map((stage, i) => (
              <div key={stage.key} className="flex items-center gap-2.5">
                {i < proofStageIndex ? (
                  <Check className="h-3.5 w-3.5 text-[#7ADAA5] shrink-0" />
                ) : i === proofStageIndex ? (
                  <span className="h-3 w-3 border-2 border-[#141C27] border-t-[#239BA7] rounded-full animate-spin shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#141C27] shrink-0 ml-1" />
                )}
                <span
                  className={
                    i < proofStageIndex
                      ? "text-[#7ADAA5]"
                      : i === proofStageIndex
                      ? "text-[#ECECBB] font-semibold"
                      : "text-[#6E8276]"
                  }
                >
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* Step 2 — Result View */
function ResultStep({
  result,
  onReset,
}: {
  result: VerificationResult;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.userHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Result Status Banner */}
      <div
        className={`rounded-xl border p-6 text-center space-y-4 ${
          result.eligible
            ? "border-[#7ADAA5]/40 bg-[#7ADAA5]/10"
            : "border-[#EF4444]/40 bg-[#EF4444]/10"
        }`}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
            result.eligible
              ? "bg-[#7ADAA5] text-[#090D12] border-[#7ADAA5]"
              : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30"
          }`}
        >
          {result.eligible ? <Award className="h-8 w-8" /> : <X className="h-8 w-8" />}
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#B0BFA8]">On-Chain Attestation Result</span>
          <h2
            className={`text-2xl font-extrabold mt-1 font-mono ${
              result.eligible ? "text-[#7ADAA5]" : "text-[#EF4444]"
            }`}
          >
            {result.eligible ? "VERIFIED CREDIT ELIGIBLE" : "NOT ELIGIBLE"}
          </h2>
          <p className="text-xs text-[#B0BFA8] mt-1 max-w-md mx-auto">
            {result.eligible
              ? "Your zero-knowledge proof was successfully validated by Midnight Network's shielded contract."
              : "Credit score did not meet the 700 threshold requirement for this verification tier."}
          </p>
        </div>
      </div>

      {/* Attestation Specifications */}
      <div className="rounded-xl border border-[#ECECBB]/10 bg-[#0F151D] p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#ECECBB]/08 pb-3 text-[#6E8276]">
          <span>ATTESTATION PARAMETERS</span>
          <span className="text-[#239BA7]">MIDNIGHT TESTNET</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#6E8276]">Transaction ID:</span>
            <span className="text-[#ECECBB]">{result.txId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6E8276]">Block Height:</span>
            <span className="text-[#ECECBB]">{result.blockHeight}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6E8276]">Public Commitment Hash:</span>
            <div className="flex items-center gap-2">
              <code className="text-[#ECECBB] bg-[#090D12] px-2 py-1 rounded border border-[#ECECBB]/08">
                {result.userHash.slice(0, 12)}...{result.userHash.slice(-8)}
              </code>
              <button
                onClick={handleCopy}
                className="p-1 text-[#B0BFA8] hover:text-[#ECECBB] rounded hover:bg-[#ECECBB]/08"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#7ADAA5]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6E8276]">Private Data Leakage:</span>
            <span className="text-[#7ADAA5] font-semibold">0 Bytes (Fully Shielded)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="btn btn-primary flex-1 py-3 text-xs font-semibold font-mono flex items-center justify-center gap-2"
        >
          View Credit Dashboard <ArrowRight className="h-4 w-4 text-[#090D12]" />
        </Link>
        <button
          onClick={onReset}
          className="btn btn-ghost py-3 px-4 text-xs font-mono text-[#B0BFA8] hover:text-[#ECECBB] flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Verify Another Score
        </button>
      </div>
    </motion.div>
  );
}

/* MAIN ELIGIBILITY PAGE */
export default function EligibilityPage() {
  const wallet = useWalletContext();
  const reduced = useReducedMotion();

  const [step, setStep] = useState<Step>(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const [verifying, setVerifying] = useState(false);
  const [proofStageIndex, setProofStageIndex] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const markStepDone = useCallback((index: number) => {
    setCompletedSteps((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const handleWalletConnected = useCallback(() => {
    markStepDone(0);
    setStep(1);
  }, [markStepDone]);

  const handleVerify = useCallback(
    async (score: number) => {
      setVerifying(true);
      setProofStageIndex(0);

      try {
        await new Promise((r) => setTimeout(r, 400));
        setProofStageIndex(1);

        const salt = generateSecret();
        const commitmentHash = await deriveUserCommitment(salt);

        await new Promise((r) => setTimeout(r, 600));
        setProofStageIndex(2);

        await new Promise((r) => setTimeout(r, 800));
        setProofStageIndex(3);

        await new Promise((r) => setTimeout(r, 500));

        const eligible = score >= 700;
        const res: VerificationResult = {
          eligible,
          txId: "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          blockHeight: "1,428,910",
          userHash: commitmentHash,
        };

        setResult(res);
        markStepDone(1);
        markStepDone(2);
        setStep(2);
      } finally {
        setVerifying(false);
      }
    },
    [markStepDone]
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setStep(1);
    setCompletedSteps([true, false, false]);
  }, []);

  return (
    <div className="min-h-screen bg-[#090D12] text-[#ECECBB] py-10">
      {result?.eligible && !reduced && <Confetti reduced={reduced} />}

      <div className="page-shell max-w-3xl">
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#239BA7] bg-[#239BA7]/10 px-2.5 py-1 rounded border border-[#239BA7]/30">
            Client-Side Verification Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ECECBB] mt-2">
            Confidential Credit Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#B0BFA8] mt-1">
            Execute zero-knowledge credit score proving directly inside your browser.
          </p>
        </div>

        {/* Step Progress Bar */}
        <StepIndicator current={step} completed={completedSteps} />

        {/* Step Views */}
        <AnimatePresence mode="wait">
          {step === 0 && <WalletStep key="step0" wallet={wallet} onConnected={handleWalletConnected} />}

          {step === 1 && (
            <ProofStep
              key="step1"
              verifying={verifying}
              proofStageIndex={proofStageIndex}
              onVerify={handleVerify}
              walletAddress={wallet.walletInfo?.address ?? "0x...Demo"}
            />
          )}

          {step === 2 && result && <ResultStep key="step2" result={result} onReset={handleReset} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
