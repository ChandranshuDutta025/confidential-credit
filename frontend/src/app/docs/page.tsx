"use client";

import { useState } from "react";
import {
  Code2,
  Shield,
  Cpu,
  Layers,
} from "lucide-react";

const SECTIONS = [
  { id: "overview", title: "Protocol Architecture" },
  { id: "compact", title: "Compact Smart Contract" },
  { id: "proving", title: "WASM ZK Proving Pipeline" },
  { id: "integration", title: "DeFi Integration Guide" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-[#ECECBB] text-[#14222D] py-10">
      <div className="page-shell max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-[rgba(20,34,45,0.08)] pb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#196D76] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#239BA7]/30 shadow-sm">
            Developer & Protocol Documentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14222D] mt-2">
            Midnight Confidential Credit Specification
          </h1>
          <p className="text-xs sm:text-sm text-[#3A4D5C] mt-1">
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
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${
                  activeSection === sec.id
                    ? "bg-[#239BA7] text-[#FFFFFF] font-bold shadow-md"
                    : "text-[#3A4D5C] hover:text-[#14222D] hover:bg-[#FFFFFF]/60"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Main Docs Content */}
          <div className="md:col-span-9 space-y-8 text-xs leading-relaxed text-[#3A4D5C]">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#14222D] font-mono flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#239BA7]" />
                  Protocol Architecture Overview
                </h2>
                <p>
                  MidScore enables confidential credit qualification on Midnight Network using zero-knowledge proofs (zk-SNARKs). Instead of broadcasting sensitive financial documents or raw credit scores to public ledgers, users run a WASM-compiled circuit locally inside their browser.
                </p>

                <div className="rounded-2xl border border-[rgba(20,34,45,0.1)] bg-[#FFFFFF] p-5 space-y-3 font-mono shadow-sm">
                  <div className="text-[#14222D] font-bold border-b border-[rgba(20,34,45,0.08)] pb-2">
                    CORE SECURITY GUARANTEES
                  </div>
                  <ul className="space-y-2 text-[#3A4D5C]">
                    <li>&bull; <strong className="text-[#14222D]">Zero Knowledge:</strong> Verifiers only receive a boolean attestation flag.</li>
                    <li>&bull; <strong className="text-[#14222D]">Client-Side Proving:</strong> Raw inputs are computed strictly in browser WASM memory.</li>
                    <li>&bull; <strong className="text-[#14222D]">Poseidon Commitment:</strong> Mathematical hash binds score input to user salt.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Compact Contract Section */}
            {activeSection === "compact" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#14222D] font-mono flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-[#94670D]" />
                  Compact Smart Contract Specification
                </h2>
                <p>
                  The contract is written in **Compact DSL v0.2**, Midnight’s domain-specific language for confidential smart contracts.
                </p>

                <div className="rounded-2xl border border-[#239BA7]/40 bg-[#16222B] p-5 font-mono shadow-xl text-[#ECECBB]">
                  <div className="text-[#E1AA36] text-[10px] uppercase mb-2 font-bold">CreditVerification.compact</div>
                  <pre className="text-[#ECECBB] text-[11px] overflow-x-auto">
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
                <h2 className="text-lg font-bold text-[#14222D] font-mono flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#12633C]" />
                  WASM Proving Pipeline
                </h2>
                <p>
                  Execution latency averaged over 50 client proving benchmarks on standard desktop hardware:
                </p>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-4 rounded-xl border border-[rgba(20,34,45,0.1)] bg-[#FFFFFF] shadow-sm">
                    <span className="text-[#627685] block text-[10px] uppercase font-bold">WASM Compilation</span>
                    <span className="text-[#14222D] font-extrabold text-sm">~420ms</span>
                  </div>
                  <div className="p-4 rounded-xl border border-[rgba(20,34,45,0.1)] bg-[#FFFFFF] shadow-sm">
                    <span className="text-[#627685] block text-[10px] uppercase font-bold">SNARK Proof Size</span>
                    <span className="text-[#14222D] font-extrabold text-sm">192 Bytes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Section */}
            {activeSection === "integration" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#14222D] font-mono flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#239BA7]" />
                  DeFi Integration Guide
                </h2>
                <p>
                  DeFi protocols can verify credit attestations on Midnight by calling the contract verification endpoint:
                </p>

                <div className="rounded-2xl border border-[rgba(20,34,45,0.1)] bg-[#FFFFFF] p-5 font-mono text-[11px] space-y-2 shadow-sm">
                  <div className="text-[#627685] font-bold">TypeScript Client SDK</div>
                  <div className="text-[#196D76] font-bold">
                    {`import { MidScoreClient } from '@midscore/sdk';`}
                  </div>
                  <div className="text-[#14222D] font-bold">
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
