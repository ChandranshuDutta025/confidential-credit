"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  X,
  BarChart3,
  Clock,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Shield,
  Activity,
  FileCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TableRowSkeleton } from "@/components/Skeleton";

const MOCK_APPLICATIONS = [
  { id: "APP-2847", range: "750-850", status: "Approved", date: "2026-01-15", commitment: "0x8f92a3c7...14e" },
  { id: "APP-2846", range: "700-749", status: "Approved", date: "2026-01-15", commitment: "0x7a31f9b2...80d" },
  { id: "APP-2845", range: "600-699", status: "Pending",  date: "2026-01-14", commitment: "0x6c42d1e0...95f" },
  { id: "APP-2844", range: "300-599", status: "Rejected", date: "2026-01-14", commitment: "0x00000000...000" },
  { id: "APP-2843", range: "750-850", status: "Approved", date: "2026-01-13", commitment: "0x9d14a5b6...31a" },
  { id: "APP-2842", range: "700-749", status: "Pending",  date: "2026-01-13", commitment: "0x5e23c8d1...74b" },
  { id: "APP-2841", range: "750-850", status: "Approved", date: "2026-01-12", commitment: "0x8a92f1b4...2a9" },
  { id: "APP-2840", range: "300-599", status: "Rejected", date: "2026-01-12", commitment: "0x00000000...000" },
  { id: "APP-2839", range: "600-699", status: "Pending",  date: "2026-01-11", commitment: "0x3f12a9c4...62e" },
  { id: "APP-2838", range: "750-850", status: "Approved", date: "2026-01-11", commitment: "0x7d81e3f2...91c" },
];

function generateChartData() {
  const data = [];
  const now = new Date("2026-01-15");
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    data.push({
      name: `${month} ${day}`,
      proofsGenerated: Math.floor(Math.random() * 25) + 20,
      verified: Math.floor(Math.random() * 20) + 15,
    });
  }
  return data;
}

const CHART_DATA = generateChartData();

type SortKey = "id" | "range" | "status" | "date";
type SortDir = "asc" | "desc";
type StatusFilter = "All" | "Approved" | "Pending" | "Rejected";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filteredApps = useMemo(() => {
    let result = [...MOCK_APPLICATIONS];
    if (statusFilter !== "All") {
      result = result.filter((app) => app.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (app) => app.id.toLowerCase().includes(q) || app.range.includes(q)
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "range") cmp = a.range.localeCompare(b.range);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "date") cmp = a.date.localeCompare(b.date);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [statusFilter, searchQuery, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / pageSize));
  const paginatedApps = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, page]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="min-h-screen bg-[#080A10] text-[#EEF2F8] py-10">
      <div className="page-shell space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
              Midnight Analytics & Ledger Inspector
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
              Credit Attestation Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring of zero-knowledge credit proofs and Midnight on-chain attestations.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0D1018] text-slate-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Contract State: Active
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>TOTAL PROOFS</span>
              <FileCheck className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,284</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +14.2% this week
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>QUALIFICATION RATE</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">78.4%</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> Score &ge; 700 Threshold
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>AVERAGE PROVING TIME</span>
              <Zap className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">1.18s</div>
            <div className="text-[10px] text-slate-400">Browser WASM Prover</div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>LEAKED DATA</span>
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">0 Bytes</div>
            <div className="text-[10px] text-slate-400">100% Shielded Proofs</div>
          </div>
        </div>

        {/* Activity Chart Section */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>14-DAY PROOF GENERATION ACTIVITY</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">CLIENT-SIDE SNARK COMPILATIONS</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorProofs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1018",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Area type="monotone" dataKey="proofsGenerated" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorProofs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Ledger Table */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1018] p-5 space-y-4">
          {/* Table Controls Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/[0.06] pb-4 font-mono text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search App ID or range..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#080A10] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1">
              {(["All", "Approved", "Pending", "Rejected"] as StatusFilter[]).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    statusFilter === st
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort("id")}>
                    Application ID
                  </th>
                  <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort("range")}>
                    Credit Range Tier
                  </th>
                  <th className="py-2.5 px-3">Commitment Hash</th>
                  <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort("status")}>
                    Status
                  </th>
                  <th className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort("date")}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                ) : paginatedApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No verification records found.
                    </td>
                  </tr>
                ) : (
                  paginatedApps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-bold text-white">{app.id}</td>
                      <td className="py-3 px-3 text-slate-300">{app.range}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{app.commitment}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.status === "Approved"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : app.status === "Pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{app.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-xs text-slate-500">
            <span>
              Showing {paginatedApps.length} of {filteredApps.length} records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded border border-white/[0.08] disabled:opacity-30 hover:bg-white/[0.04]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded border border-white/[0.08] disabled:opacity-30 hover:bg-white/[0.04]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
