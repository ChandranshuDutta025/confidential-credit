"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Code2,
  Cpu,
  Database,
  KeyRound,
  Zap,
  FileCheck,
  Check,
  X,
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
    ? `0x7a${(score * 12345).toString(16).slice(0, 8)}...8a1`
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
    <div className="w-full rounded-xl border border-[#ECECBB]/10 bg-[#0F151D] p-5 shadow-2xl backdrop-blur-sm">
      {/* Panel Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-[#ECECBB]/08 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E1AA36]/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7ADAA5]/60" />
          </div>
          <span className="ml-2 font-mono text-[11px] font-medium text-[#B0BFA8]">
            zk-prover-engine.wasm v1.0.4
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-[#239BA7]/10 px-2 py-0.5 border border-[#239BA7]/30 text-[10px] font-mono text-[#7ADAA5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ADAA5] animate-pulse" />
          CLIENT PROVER READY
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-4">
        {/* Score Slider */}
        <div className="rounded-lg border border-[#ECECBB]/08 bg-[#141C27] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] font-medium text-[#ECECBB] flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#239BA7]" />
              Private Credit Score Input
            </label>
            <span className="font-mono text-xs font-bold text-[#090D12] bg-[#7ADAA5] px-2 py-0.5 rounded border border-[#7ADAA5]/40">
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
            className="w-full accent-[#239BA7] cursor-pointer h-1.5 bg-[#090D12] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#6E8276] font-mono mt-1">
            <span>300 (Poor)</span>
            <span className="text-[#E1AA36]">Threshold: 700+</span>
            <span>850 (Excellent)</span>
          </div>
        </div>

        {/* Live ZK Circuit Steps */}
        <div className="space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between rounded border border-[#ECECBB]/06 bg-[#090D12] px-3 py-2 text-[#B0BFA8]">
            <span className="flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-[#239BA7]" />
              Shielded Salt:
            </span>
            <span className="text-[#ECECBB] font-semibold">{mockSalt}</span>
          </div>

          <div className="flex items-center justify-between rounded border border-[#ECECBB]/06 bg-[#090D12] px-3 py-2 text-[#B0BFA8]">
            <span className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-[#239BA7]" />
              Circuit Constraint:
            </span>
            <span className="text-[#ECECBB]">
              {score} &ge; {threshold}
            </span>
          </div>
        </div>

        {/* Execution Progress Bar */}
        {isExecuting && (
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between text-[11px] font-mono text-[#7ADAA5]">
              <span>
                {execStep === 1 && "1/3 Deriving Poseidon Hash..."}
                {execStep === 2 && "2/3 Compiling zk-SNARK Witness..."}
                {execStep === 3 && "3/3 Verifying Midnight State..."}
                {execStep === 4 && "Verification Complete"}
              </span>
              <span>{execStep * 25}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#090D12] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#239BA7]"
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
              ? "border-[#7ADAA5]/40 bg-[#7ADAA5]/10"
              : "border-[#EF4444]/40 bg-[#EF4444]/10"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B0BFA8]">
              Verifiable Proof Output
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                isEligible
                  ? "bg-[#7ADAA5] text-[#090D12] border border-[#7ADAA5]"
                  : "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30"
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

          <div className="space-y-1 text-[11px] font-mono text-[#B0BFA8]">
            <div className="flex justify-between">
              <span>Public Proof Hash:</span>
              <span className="text-[#ECECBB] font-semibold">{mockHash}</span>
            </div>
            <div className="flex justify-between">
              <span>Private Data Exposed:</span>
              <span className="text-[#7ADAA5] font-semibold">0 Bytes (100% Shielded)</span>
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
              <span className="h-3.5 w-3.5 border-2 border-[#090D12]/30 border-t-[#090D12] rounded-full animate-spin" />
              Running WASM Prover...
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5 text-[#090D12]" /> Test ZK Circuit Execution
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
    <section className="py-16 border-t border-[#ECECBB]/08 bg-[#090D12]">
      <div className="page-shell">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#7ADAA5] bg-[#7ADAA5]/10 px-2.5 py-1 rounded border border-[#7ADAA5]/30">
            Cryptographic Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ECECBB] mt-3">
            How MidScore Verifies Credit Confidentially
          </h2>
          <p className="text-sm text-[#B0BFA8] mt-2">
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
                    ? "border-[#239BA7]/50 bg-[#239BA7]/15 text-[#ECECBB] shadow-lg"
                    : "border-[#ECECBB]/08 bg-[#0F151D] text-[#B0BFA8] hover:border-[#ECECBB]/20 hover:text-[#ECECBB]"
                }`}
              >
                <step.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#7ADAA5]" : "text-[#6E8276]"}`} />
                <span className="text-xs font-semibold font-mono truncate">{step.short}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Inspector Panel */}
        <div className="rounded-xl border border-[#ECECBB]/10 bg-[#0F151D] p-6 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#239BA7]/15 border border-[#239BA7]/30 text-[#7ADAA5]">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#7ADAA5] uppercase tracking-wider font-semibold">
                    Stage {current.id} of 4
                  </span>
                  <h3 className="text-lg font-bold text-[#ECECBB]">{current.title}</h3>
                </div>
              </div>

              <p className="text-sm text-[#B0BFA8] leading-relaxed">{current.desc}</p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#7ADAA5]/10 border border-[#7ADAA5]/30 text-[#7ADAA5] text-xs font-mono font-medium">
                <Shield className="h-3.5 w-3.5" />
                Privacy Guarantee: {current.privacyBadge}
              </div>
            </div>

            {/* Inspector Terminal Box */}
            <div className="lg:col-span-5 rounded-lg border border-[#ECECBB]/08 bg-[#090D12] p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#ECECBB]/06 pb-2 text-[#6E8276]">
                <span>INSPECTOR PARAMS</span>
                <span className="text-[#E1AA36]">STAGE 0{current.id}</span>
              </div>

              <div>
                <span className="text-[#6E8276] block text-[10px] uppercase">Private Data State:</span>
                <span className="text-[#ECECBB] font-semibold">{current.input}</span>
              </div>

              <div>
                <span className="text-[#6E8276] block text-[10px] uppercase">Operation Executed:</span>
                <span className="text-[#239BA7] font-semibold">{current.proverAction}</span>
              </div>

              <div>
                <span className="text-[#6E8276] block text-[10px] uppercase">Public Output Payload:</span>
                <span className="text-[#7ADAA5] font-semibold">{current.publicResult}</span>
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
    <section className="py-16 border-t border-[#ECECBB]/08 bg-[#0F151D]">
      <div className="page-shell">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E1AA36] bg-[#E1AA36]/10 px-2.5 py-1 rounded border border-[#E1AA36]/30">
            Privacy Specification Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ECECBB] mt-3">
            What Stays Private vs What is Verified
          </h2>
          <p className="text-sm text-[#B0BFA8] mt-2">
            Complete architectural separation between sensitive user inputs and public blockchain attestations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shielded / Private Card */}
          <div className="rounded-xl border border-[#EF4444]/30 bg-[#090D12] p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#ECECBB]/08 pb-4">
              <div className="p-2 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                <EyeOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#ECECBB]">100% Shielded & Private</h3>
                <p className="text-xs text-[#B0BFA8]">Never leaves your local browser memory</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#B0BFA8]">
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Exact Credit Score</strong>
                  <span>Your raw score (e.g., 745 FICO) is never exposed to anyone.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Bank Statements & Income</strong>
                  <span>No account numbers, salary details, or bank transactions uploaded.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Identity & Social Security Number</strong>
                  <span>Zero PII (Personally Identifiable Information) stored on-chain.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Debt & Payment History</strong>
                  <span>Individual loan history and debt balances remain completely private.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Verifiable / Public Card */}
          <div className="rounded-xl border border-[#7ADAA5]/30 bg-[#090D12] p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#ECECBB]/08 pb-4">
              <div className="p-2 rounded bg-[#7ADAA5]/10 text-[#7ADAA5] border border-[#7ADAA5]/30">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#ECECBB]">Verifiable Public Output</h3>
                <p className="text-xs text-[#B0BFA8]">Published to Midnight shielded ledger</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#B0BFA8]">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#7ADAA5] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Boolean Eligibility Result</strong>
                  <span>Only returns true/false attestation (e.g. Score &ge; Threshold).</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#7ADAA5] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Poseidon Commitment Hash</strong>
                  <span>Cryptographic hash anchoring your proof without revealing raw inputs.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#7ADAA5] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">Verification Timestamp & Expiration</strong>
                  <span>Proof timestamp ensuring freshness for DeFi protocol execution.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#7ADAA5] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ECECBB] block font-medium">On-Chain Proof Signature</strong>
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
    <section className="py-16 border-t border-[#ECECBB]/08 bg-[#090D12]">
      <div className="page-shell">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#239BA7] bg-[#239BA7]/10 px-2.5 py-1 rounded border border-[#239BA7]/30">
            Product Use Cases
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ECECBB] mt-3">
            Powering Next-Gen Confidential Finance
          </h2>
          <p className="text-sm text-[#B0BFA8] mt-2">
            Real-world applications of zero-knowledge credit verification in Web3 & DeFi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USE_CASES.map((uc, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#ECECBB]/08 bg-[#0F151D] p-5 space-y-3 hover:border-[#239BA7]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#239BA7]/10 text-[#7ADAA5] border border-[#239BA7]/30">
                  {uc.tag}
                </span>
                <span className="text-[11px] font-mono text-[#6E8276]">UC-0{i + 1}</span>
              </div>
              <h3 className="text-base font-bold text-[#ECECBB]">{uc.title}</h3>
              <p className="text-xs text-[#B0BFA8] leading-relaxed">{uc.desc}</p>
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
    <section className="py-16 border-t border-[#ECECBB]/08 bg-[#0F151D]">
      <div className="page-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E1AA36] bg-[#E1AA36]/10 px-2.5 py-1 rounded border border-[#E1AA36]/30">
              Developer Specifications
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ECECBB]">
              Built with Compact Smart Contracts
            </h2>
            <p className="text-sm text-[#B0BFA8] leading-relaxed">
              MidScore is implemented in Midnight's domain-specific language **Compact**. Circuits run in-browser via WebAssembly, generating zk-SNARK proofs that are verified on-chain.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-lg border border-[#ECECBB]/08 bg-[#090D12]">
                <span className="text-[#6E8276] block text-[10px] uppercase">Language</span>
                <span className="text-[#ECECBB] font-semibold">Compact v0.2</span>
              </div>
              <div className="p-3 rounded-lg border border-[#ECECBB]/08 bg-[#090D12]">
                <span className="text-[#6E8276] block text-[10px] uppercase">Prover</span>
                <span className="text-[#ECECBB] font-semibold">Client WASM</span>
              </div>
              <div className="p-3 rounded-lg border border-[#ECECBB]/08 bg-[#090D12]">
                <span className="text-[#6E8276] block text-[10px] uppercase">Hash Primitive</span>
                <span className="text-[#ECECBB] font-semibold">Poseidon Hash</span>
              </div>
              <div className="p-3 rounded-lg border border-[#ECECBB]/08 bg-[#090D12]">
                <span className="text-[#6E8276] block text-[10px] uppercase">Network</span>
                <span className="text-[#7ADAA5] font-semibold">Midnight Testnet</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#239BA7] hover:text-[#7ADAA5] font-semibold transition-colors"
              >
                Read Full Compact Contract Documentation <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Code IDE Window */}
          <div className="lg:col-span-7 rounded-xl border border-[#ECECBB]/10 bg-[#090D12] p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#ECECBB]/08 pb-3 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#B0BFA8]">
                <Code2 className="h-4 w-4 text-[#239BA7]" />
                <span>CreditVerification.compact</span>
              </div>
              <span className="text-[10px] text-[#E1AA36]">COMPACT CIRCUIT DEFINITION</span>
            </div>

            <pre className="font-mono text-[11px] text-[#ECECBB] overflow-x-auto p-2 leading-relaxed">
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
    <section className="py-14 border-t border-[#ECECBB]/08 bg-[#0F151D]">
      <div className="page-shell">
        <div className="rounded-xl border border-[#239BA7]/40 bg-gradient-to-r from-[#141C27] via-[#0F151D] to-[#090D12] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7ADAA5] bg-[#7ADAA5]/10 px-2.5 py-0.5 rounded border border-[#7ADAA5]/30">
              Midnight Privacy Protocol
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#ECECBB]">
              Ready to verify your credit score privately?
            </h2>
            <p className="text-xs sm:text-sm text-[#B0BFA8]">
              Connect your Midnight wallet, execute client-side ZK proof generation, and obtain an on-chain credit attestation in under 2 minutes.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/eligibility"
              className="btn btn-primary px-6 py-3 text-xs font-semibold flex items-center gap-2"
            >
              Start Credit Verification <ArrowRight className="h-4 w-4 text-[#090D12]" />
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
    <div className="min-h-screen bg-[#090D12] text-[#ECECBB]">
      {/* Hero Section */}
      <section className="py-10 lg:py-16">
        <div className="page-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#239BA7]/40 bg-[#239BA7]/10 text-xs font-mono font-medium text-[#7ADAA5]">
                <span className="h-2 w-2 rounded-full bg-[#7ADAA5] animate-pulse" />
                MIDNIGHT NETWORK &middot; ZERO-KNOWLEDGE PROOF ENGINE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#ECECBB] leading-[1.15]">
                Confidential Credit Verification.{" "}
                <span className="text-[#7ADAA5]">Zero Data Leakage.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#B0BFA8] leading-relaxed max-w-xl">
                Prove your creditworthiness to DeFi protocols and financial institutions without exposing your raw score, bank accounts, or financial history. Powered by client-side zk-SNARKs on Midnight Network.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/eligibility"
                  className="btn btn-primary px-5 py-3 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  Start Credit Verification <ArrowRight className="h-4 w-4 text-[#090D12]" />
                </Link>
                <Link
                  href="/docs"
                  className="btn btn-ghost px-5 py-3 text-xs font-semibold flex items-center justify-center gap-2 text-[#ECECBB] border-[#ECECBB]/15 hover:bg-[#ECECBB]/05"
                >
                  <FileCheck className="h-4 w-4 text-[#239BA7]" />
                  View Protocol Specs
                </Link>
              </div>

              {/* Quick Spec Pills */}
              <div className="pt-4 border-t border-[#ECECBB]/08 flex flex-wrap gap-4 text-[11px] font-mono text-[#B0BFA8]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#7ADAA5]" /> 0 Bytes Private Data Disclosed
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#239BA7]" /> ~1.2s WASM Prover Speed
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-[#E1AA36]" /> Midnight Shielded State
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
