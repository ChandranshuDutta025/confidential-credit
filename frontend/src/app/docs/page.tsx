"use client";

import { useState } from "react";
import {
  FileCheck,
  Code2,
  Shield,
  Terminal,
  Cpu,
  Lock,
  Layers,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  { id: "overview", title: "Protocol Architecture" },
  { id: "compact", title: "Compact Smart Contract" },
  { id: "proving", title: "WASM ZK Proving Pipeline" },
  { id: "integration", title: "DeFi Integration Guide" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-[#080A10] text-[#EEF2F8] py-10">
      <div className="page-shell max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
            Developer & Protocol Documentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Midnight Confidential Credit Specification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Technical reference for client-side proving, Compact smart contracts, and zero-knowledge attestations.
          </p>
        </div>

        {/* Grid Layout: Sidebar Navigation + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="md:col-span-3 space-y-1 font-mono text-xs sticky top-20">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  activeSection === sec.id
                    ? "bg-blue-500/10 text-white font-semibold border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Main Docs Content */}
          <div className="md:col-span-9 space-y-8 text-xs leading-relaxed text-slate-300">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Protocol Architecture Overview
                </h2>
                <p>
                  MidScore enables confidential credit qualification on Midnight Network using zero-knowledge proofs (zk-SNARKs). Instead of broadcasting sensitive financial documents or raw credit scores to public ledgers, users run a WASM-compiled circuit locally inside their browser.
                </p>

                <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-4 space-y-3 font-mono">
                  <div className="text-slate-400 font-semibold border-b border-white/[0.06] pb-2">
                    CORE SECURITY GUARANTEES
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li>&bull; <strong className="text-white">Zero Knowledge:</strong> Verifiers only receive a boolean attestation flag.</li>
                    <li>&bull; <strong className="text-white">Client-Side Proving:</strong> Raw inputs are computed strictly in browser WASM memory.</li>
                    <li>&bull; <strong className="text-white">Poseidon Commitment:</strong> Mathematical hash binds score input to user salt.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Compact Contract Section */}
            {activeSection === "compact" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-purple-400" />
                  Compact Smart Contract Specification
                </h2>
                <p>
                  The contract is written in **Compact DSL v0.2**, Midnight’s domain-specific language for confidential smart contracts.
                </p>

                <div className="rounded-xl border border-white/[0.1] bg-[#07090F] p-4 font-mono">
                  <div className="text-slate-500 text-[10px] uppercase mb-2">CreditVerification.compact</div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto">
                    <code>{`import { Vector, Bytes, Uint } from 'compact-lang';

export circuit verifyCreditEligibility(
  private userScore: Uint<16>,
  private userSalt: Bytes<32>,
  public thresholdScore: Uint<16>
): Boolean {
  assert(userScore >= thresholdScore, "Credit score below required threshold");
  const commitment = poseidonHash(userScore, userSalt);
  return true;
}`}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* WASM Proving Section */}
            {activeSection === "proving" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                  WASM Proving Pipeline
                </h2>
                <p>
                  Execution latency averaged over 50 client proving benchmarks on standard desktop hardware:
                </p>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#0D1018]">
                    <span className="text-slate-500 block text-[10px]">WASM Compilation</span>
                    <span className="text-white font-bold">~420ms</span>
                  </div>
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#0D1018]">
                    <span className="text-slate-500 block text-[10px]">SNARK Proof Size</span>
                    <span className="text-white font-bold">192 Bytes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Section */}
            {activeSection === "integration" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-400" />
                  DeFi Integration Guide
                </h2>
                <p>
                  DeFi protocols can verify credit attestations on Midnight by calling the contract verification endpoint:
                </p>

                <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-4 font-mono text-[11px] space-y-2">
                  <div className="text-slate-500">TypeScript Client SDK</div>
                  <div className="text-blue-400">
                    {`import { MidScoreClient } from '@midscore/sdk';`}
                  </div>
                  <div className="text-slate-300">
                    {`const isEligible = await MidScoreClient.verifyAttestation(userAddress);`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
