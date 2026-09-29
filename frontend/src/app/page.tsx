"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Code2,
  Terminal,
  Cpu,
  Database,
  KeyRound,
  Zap,
  Layers,
  FileCheck,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   1. HERO RIGHT PANEL — Interactive Cryptographic Proof Engine Widget
   ═══════════════════════════════════════════════════════════════════════════ */
function HeroProofSimulator() {
  const [score, setScore] = useState<number>(745);
  const [threshold] = useState<number>(700);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execStep, setExecStep] = useState<number>(0);

  const isEligible = score >= threshold;
  const mockSalt = "0x8f92a3c714e6d";
  const mockHash = isEligible
    ? `0x3b${(score * 12345).toString(16).slice(0, 8)}...8a1`
    : "0x000000000000...000";

  const handleRunExecution = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecStep(1);

    setTimeout(() => setExecStep(2), 600);
    setTimeout(() => setExecStep(3), 1200);
    setTimeout(() => {
      setExecStep(4);
      setIsExecuting(false);
    }, 1800);
  };

  return (
    <div className="w-full rounded-xl border border-white/[0.1] bg-[#0D1018] p-5 shadow-2xl backdrop-blur-sm">
      {/* Panel Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="ml-2 font-mono text-[11px] font-medium text-slate-400">
            zk-prover-engine.wasm v1.0.4
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-0.5 border border-blue-500/20 text-[10px] font-mono text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          CLIENT PROVER READY
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-4">
        {/* Score Slider */}
        <div className="rounded-lg border border-white/[0.06] bg-[#121622] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-400" />
              Private Credit Score Input
            </label>
            <span className="font-mono text-xs font-bold text-white bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
              {score} FICO
            </span>
          </div>
          <input
            type="range"
            min="300"
            max="850"
            value={score}
            onChange={(e) => {
              setScore(Number(e.target.value));
              setExecStep(0);
            }}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>300 (Poor)</span>
            <span>Threshold: 700+</span>
            <span>850 (Excellent)</span>
          </div>
        </div>

        {/* Live ZK Circuit Steps */}
        <div className="space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between rounded border border-white/[0.04] bg-[#080A10] px-3 py-2 text-slate-400">
            <span className="flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-slate-500" />
              Shielded Salt:
            </span>
            <span className="text-slate-300 font-semibold">{mockSalt}</span>
          </div>

          <div className="flex items-center justify-between rounded border border-white/[0.04] bg-[#080A10] px-3 py-2 text-slate-400">
            <span className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-slate-500" />
              Circuit Constraint:
            </span>
            <span className="text-slate-300">
              {score} &ge; {threshold}
            </span>
          </div>
        </div>

        {/* Execution Progress Bar */}
        {isExecuting && (
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between text-[11px] font-mono text-blue-400">
              <span>
                {execStep === 1 && "1/3 Deriving Poseidon Hash..."}
                {execStep === 2 && "2/3 Compiling zk-SNARK Witness..."}
                {execStep === 3 && "3/3 Verifying Midnight State..."}
                {execStep === 4 && "Verification Complete"}
              </span>
              <span>{execStep * 25}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${execStep * 25}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Verifiable Result Card */}
        <div
          className={`rounded-lg border p-3.5 transition-all duration-300 ${
            isEligible
              ? "border-emerald-500/30 bg-emerald-500/[0.05]"
              : "border-red-500/30 bg-red-500/[0.05]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Verifiable Proof Output
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                isEligible
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {isEligible ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED ELIGIBLE
                </>
              ) : (
                <>
                  <X className="h-3 w-3" /> NOT ELIGIBLE
                </>
              )}
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Public Proof Hash:</span>
              <span className="text-slate-200">{mockHash}</span>
            </div>
            <div className="flex justify-between">
              <span>Private Data Exposed:</span>
              <span className="text-emerald-400 font-semibold">0 Bytes (100% Shielded)</span>
            </div>
          </div>
        </div>

        {/* Run Execution Button */}
        <button
          onClick={handleRunExecution}
          disabled={isExecuting}
          className="w-full btn btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
        >
          {isExecuting ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running WASM Prover...
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" /> Test ZK Circuit Execution
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. INTERACTIVE VERIFICATION WORKFLOW (STEP-BY-STEP SANDBOX)
   ═══════════════════════════════════════════════════════════════════════════ */
const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "Local Score Ingestion",
    short: "01. Private Ingestion",
    icon: Lock,
    desc: "Your raw credit rating and financial metrics are processed strictly inside client memory (browser/WASM). No data is sent to external servers or cloud indexers.",
    input: "Raw Credit Score = 745, Salt = 0x8f92...",
    proverAction: "In-memory evaluation & salt generation",
    publicResult: "0 Bytes transmitted over network",
    privacyBadge: "100% Client-Side",
  },
  {
    id: 2,
    title: "WASM ZK-Proof Generation",
    short: "02. WASM Circuit Prover",
    icon: Cpu,
    desc: "The Compact DSL circuit evaluates the inequality constraint (Score >= 700) and compiles a zero-knowledge SNARK proof along with a Poseidon commitment hash.",
    input: "Score >= 700 (Private Witness)",
    proverAction: "Generate SNARK Proof & Poseidon Hash",
    publicResult: "Proof Payload (192 bytes)",
    privacyBadge: "Cryptographically Sealed",
  },
  {
    id: 3,
    title: "Midnight On-Chain Verification",
    short: "03. Midnight Ledger",
    icon: Database,
    desc: "The proof is submitted to Midnight's shielded smart contract. Midnight's verifier checks the mathematical proof without learning your actual score.",
    input: "Proof Payload + Commitment Hash",
    proverAction: "Midnight Contract Verifier Execution",
    publicResult: "On-Chain State Update (Success: True)",
    privacyBadge: "Zero-Knowledge Verifiable",
  },
  {
    id: 4,
    title: "Verifiable Attestation",
    short: "04. Attestation Certificate",
    icon: CheckCircle2,
    desc: "DeFi lending protocols and Web3 financial dApps read your verified eligibility attestation directly from the Midnight ledger to approve credit terms.",
    input: "On-Chain Verified State",
    proverAction: "Protocol Attestation Certificate Read",
    publicResult: "Eligible for Low-Interest Credit Tier",
    privacyBadge: "DeFi Integrable",
  },
];

function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(1);
  const current = WORKFLOW_STEPS.find((s) => s.id === activeStep) || WORKFLOW_STEPS[0];
  const IconComponent = current.icon;

  return (
    <section className="py-16 border-t border-white/[0.08] bg-[#07090E]">
      <div className="page-shell">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
            Cryptographic Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
            How MidScore Verifies Credit Confidentially
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A 4-stage client-side proving pipeline that keeps your financial records private while giving on-chain protocols 100% cryptographic certainty.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? "border-blue-500/40 bg-blue-500/10 text-white shadow-lg"
                    : "border-white/[0.06] bg-[#0F131D] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                }`}
              >
                <step.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                <span className="text-xs font-semibold font-mono truncate">{step.short}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Inspector Panel */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-6 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
                    Stage {current.id} of 4
                  </span>
                  <h3 className="text-lg font-bold text-white">{current.title}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{current.desc}</p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                <Shield className="h-3.5 w-3.5" />
                Privacy Guarantee: {current.privacyBadge}
              </div>
            </div>

            {/* Inspector Terminal Box */}
            <div className="lg:col-span-5 rounded-lg border border-white/[0.08] bg-[#080A10] p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-slate-500">
                <span>INSPECTOR PARAMS</span>
                <span>STAGE 0{current.id}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Private Data State:</span>
                <span className="text-slate-300 font-semibold">{current.input}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Operation Executed:</span>
                <span className="text-blue-400">{current.proverAction}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Public Output Payload:</span>
                <span className="text-emerald-400 font-semibold">{current.publicResult}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. PRIVACY & DISCLOSURE SPECIFICATION MATRIX
   ═══════════════════════════════════════════════════════════════════════════ */
function PrivacyMatrixSection() {
  return (
    <section className="py-16 border-t border-white/[0.08] bg-[#090C14]">
      <div className="page-shell">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Privacy Specification Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
            What Stays Private vs What is Verified
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Complete architectural separation between sensitive user inputs and public blockchain attestations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shielded / Private Card */}
          <div className="rounded-xl border border-red-500/20 bg-[#0E111B] p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-4">
              <div className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                <EyeOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">100% Shielded & Private</h3>
                <p className="text-xs text-slate-400">Never leaves your local browser memory</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Exact Credit Score</strong>
                  <span>Your raw score (e.g., 745 FICO) is never exposed to anyone.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Bank Statements & Income</strong>
                  <span>No account numbers, salary details, or bank transactions uploaded.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Identity & Social Security Number</strong>
                  <span>Zero PII (Personally Identifiable Information) stored on-chain.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Debt & Payment History</strong>
                  <span>Individual loan history and debt balances remain completely private.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Verifiable / Public Card */}
          <div className="rounded-xl border border-emerald-500/20 bg-[#0E111B] p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-4">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Verifiable Public Output</h3>
                <p className="text-xs text-slate-400">Published to Midnight shielded ledger</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Boolean Eligibility Result</strong>
                  <span>Only returns true/false attestation (e.g. Score &ge; Threshold).</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Poseidon Commitment Hash</strong>
                  <span>Cryptographic hash anchoring your proof without revealing raw inputs.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Verification Timestamp & Expiration</strong>
                  <span>Proof timestamp ensuring freshness for DeFi protocol execution.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">On-Chain Proof Signature</strong>
                  <span>Mathematical ZK proof signature verified by Midnight smart contract.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. VERIFIABLE CREDIT USE CASES
   ═══════════════════════════════════════════════════════════════════════════ */
const USE_CASES = [
  {
    title: "Undercollateralized DeFi Loans",
    desc: "Borrow funds at lower collateral ratios (e.g., 110% vs 150%) on Midnight money markets by proving your creditworthiness on-chain.",
    tag: "DeFi Lending",
  },
  {
    title: "Private Mortgage Qualification",
    desc: "Prove liquidity and credit rating to real estate sellers and mortgage brokers without revealing full tax returns or bank accounts.",
    tag: "Real Estate",
  },
  {
    title: "Institutional Accreditation",
    desc: "Verify accredited investor status for private RWA (Real World Asset) vaults anonymously with zero identity leakage.",
    tag: "RWA & Funds",
  },
  {
    title: "Cross-Chain Credit Passport",
    desc: "Carry a portable, zero-knowledge credit score attestation across Web3 ecosystems without relying on centralized credit bureaus.",
    tag: "Web3 Identity",
  },
];

function UseCasesSection() {
  return (
    <section className="py-16 border-t border-white/[0.08] bg-[#07090E]">
      <div className="page-shell">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
            Product Use Cases
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
            Powering Next-Gen Confidential Finance
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Real-world applications of zero-knowledge credit verification in Web3 & DeFi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USE_CASES.map((uc, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-5 space-y-3 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {uc.tag}
                </span>
                <span className="text-[11px] font-mono text-slate-500">UC-0{i + 1}</span>
              </div>
              <h3 className="text-base font-bold text-white">{uc.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. TECHNICAL TRUST & COMPACT CODE SPECIFICATION
   ═══════════════════════════════════════════════════════════════════════════ */
function CompactCodeSection() {
  return (
    <section className="py-16 border-t border-white/[0.08] bg-[#090C14]">
      <div className="page-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
              Developer Specifications
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Built with Compact Smart Contracts
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              MidScore is implemented in Midnight's domain-specific language **Compact**. Circuits run in-browser via WebAssembly, generating zk-SNARK proofs that are verified on-chain.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0E111B]">
                <span className="text-slate-500 block text-[10px] uppercase">Language</span>
                <span className="text-white font-semibold">Compact v0.2</span>
              </div>
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0E111B]">
                <span className="text-slate-500 block text-[10px] uppercase">Prover</span>
                <span className="text-white font-semibold">Client WASM</span>
              </div>
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0E111B]">
                <span className="text-slate-500 block text-[10px] uppercase">Hash Primitive</span>
                <span className="text-white font-semibold">Poseidon Hash</span>
              </div>
              <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0E111B]">
                <span className="text-slate-500 block text-[10px] uppercase">Network</span>
                <span className="text-blue-400 font-semibold">Midnight Testnet</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 font-semibold"
              >
                Read Full Compact Contract Documentation <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Code IDE Window */}
          <div className="lg:col-span-7 rounded-xl border border-white/[0.1] bg-[#07090F] p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Code2 className="h-4 w-4 text-blue-400" />
                <span>CreditVerification.compact</span>
              </div>
              <span className="text-[10px] text-slate-500">COMPACT CIRCUIT DEFINITION</span>
            </div>

            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-2 leading-relaxed">
              <code>{`import { Vector, Bytes, Uint } from 'compact-lang';

export circuit verifyCreditEligibility(
  private userScore: Uint<16>,
  private userSalt: Bytes<32>,
  public thresholdScore: Uint<16>
): Boolean {
  // 1. Evaluate private inequality constraint
  assert(userScore >= thresholdScore, "Credit score below required threshold");

  // 2. Compute cryptographic Poseidon commitment
  const commitment = poseidonHash(userScore, userSalt);

  // 3. Return verifiable boolean attestation
  return true;
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. PRIMARY CALL TO ACTION BANNER
   ═══════════════════════════════════════════════════════════════════════════ */
function MainCtaSection() {
  return (
    <section className="py-14 border-t border-white/[0.08] bg-[#0D1018]">
      <div className="page-shell">
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0F1424] to-slate-950 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Midnight Privacy Protocol
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Ready to verify your credit score privately?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Connect your Midnight wallet, execute client-side ZK proof generation, and obtain an on-chain credit attestation in under 2 minutes.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/eligibility"
              className="btn btn-primary px-6 py-3 text-xs font-semibold flex items-center gap-2"
            >
              Start Credit Verification <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080A10] text-[#EEF2F8]">
      {/* Hero Section */}
      <section className="py-10 lg:py-16">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-xs font-mono font-medium text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                MIDNIGHT NETWORK &middot; ZERO-KNOWLEDGE PROOF ENGINE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Confidential Credit Verification.{" "}
                <span className="text-blue-400">Zero Data Leakage.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Prove your creditworthiness to DeFi protocols and financial institutions without exposing your raw score, bank accounts, or financial history. Powered by client-side zk-SNARKs on Midnight Network.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/eligibility"
                  className="btn btn-primary px-5 py-3 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  Start Credit Verification <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="btn btn-ghost px-5 py-3 text-xs font-semibold flex items-center justify-center gap-2 text-slate-300 border-white/[0.12] hover:bg-white/[0.04]"
                >
                  <FileCheck className="h-4 w-4 text-slate-400" />
                  View Protocol Specs
                </Link>
              </div>

              {/* Quick Spec Pills */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 0 Bytes Private Data Disclosed
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-blue-400" /> ~1.2s WASM Prover Speed
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-purple-400" /> Midnight Shielded State
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Visual Proof Simulator Widget */}
            <div className="lg:col-span-5">
              <HeroProofSimulator />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Sandbox Section */}
      <WorkflowSection />

      {/* Privacy Matrix Section */}
      <PrivacyMatrixSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Compact Code Spec Section */}
      <CompactCodeSection />

      {/* Main CTA Section */}
      <MainCtaSection />
    </div>
  );
}
