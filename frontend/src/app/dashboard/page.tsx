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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TableRowSkeleton } from "@/components/Skeleton";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/* ─────────────────────────────────────────────────────
   Static data (same as before — preserved)
───────────────────────────────────────────────────── */
const MOCK_APPLICATIONS = [
  { id: "APP-2847", range: "750-850", status: "Approved", date: "2026-01-15" },
  { id: "APP-2846", range: "700-749", status: "Approved", date: "2026-01-15" },
  { id: "APP-2845", range: "600-699", status: "Pending",  date: "2026-01-14" },
  { id: "APP-2844", range: "300-599", status: "Rejected", date: "2026-01-14" },
  { id: "APP-2843", range: "750-850", status: "Approved", date: "2026-01-13" },
  { id: "APP-2842", range: "700-749", status: "Pending",  date: "2026-01-13" },
  { id: "APP-2841", range: "750-850", status: "Approved", date: "2026-01-12" },
  { id: "APP-2840", range: "300-599", status: "Rejected", date: "2026-01-12" },
  { id: "APP-2839", range: "600-699", status: "Pending",  date: "2026-01-11" },
  { id: "APP-2838", range: "750-850", status: "Approved", date: "2026-01-11" },
  { id: "APP-2837", range: "700-749", status: "Approved", date: "2026-01-10" },
  { id: "APP-2836", range: "300-599", status: "Rejected", date: "2026-01-10" },
];

function generate30DayData() {
  const data = [];
  const now = new Date("2026-01-15");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    data.push({
      name: `${month} ${day}`,
      approved: Math.floor(Math.random() * 30) + 15,
      pending:  Math.floor(Math.random() * 15) + 5,
      rejected: Math.floor(Math.random() * 10) + 2,
    });
  }
  return data;
}

const CHART_DATA = generate30DayData();

const SPARKLINE_DATA = {
  eligible: [8, 12, 10, 14, 11, 15, 13],
  rejected: [5, 4, 6, 3, 5, 4, 3],
  today:    [3, 5, 4, 6, 7, 5, 8],
  avg:      [2.8, 2.6, 2.5, 2.4, 2.5, 2.3, 2.3],
};

const MOCK_TIMELINE = [
  { time: "2:30 PM", label: "Application submitted" },
  { time: "2:31 PM", label: "Identity verified" },
  { time: "2:32 PM", label: "Credit check initiated" },
  { time: "2:33 PM", label: "ZK proof generated" },
  { time: "2:34 PM", label: "Decision rendered" },
];

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
type SortKey = "id" | "range" | "status" | "date";
type SortDir = "asc" | "desc";
type StatusFilter = "All" | "Approved" | "Pending" | "Rejected";

/* ─────────────────────────────────────────────────────
   Utility hooks
───────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ─────────────────────────────────────────────────────
   Count-up animation
───────────────────────────────────────────────────── */
function CountUp({
  target,
  suffix = "",
  decimals = 0,
  duration = 1200,
  reduced,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  reduced: boolean;
}) {
  const [val, setVal] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) { setVal(target); return; }
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration, reduced]);

  return (
    <span>
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Mini sparkline
───────────────────────────────────────────────────── */
function MiniSparkline({
  data,
  color,
  reduced,
}: {
  data: number[];
  color: string;
  reduced: boolean;
}) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-6 w-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={!reduced}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Status badge
───────────────────────────────────────────────────── */
function statusBadge(status: string) {
  if (status === "Approved") return "badge badge-green";
  if (status === "Pending") return "badge badge-amber";
  return "badge badge-red";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ─────────────────────────────────────────────────────
   KPI Card
───────────────────────────────────────────────────── */
function KPICard({
  label,
  target,
  suffix,
  decimals,
  change,
  up,
  icon: Icon,
  colorClass,
  sparkColor,
  sparkData,
  reduced,
}: {
  label: string;
  target: number;
  suffix: string;
  decimals: number;
  change: string;
  up: boolean;
  icon: React.ElementType;
  colorClass: string;
  sparkColor: string;
  sparkData: number[];
  reduced: boolean;
}) {
  return (
    <motion.div variants={fadeUp} className="card card-interactive p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[12px] text-slate-500">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${colorClass}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mb-2 text-[1.5rem] font-semibold text-white tabular-nums">
        <CountUp target={target} suffix={suffix} decimals={decimals} reduced={reduced} />
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
            up ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {up ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {change}
        </span>
        <MiniSparkline data={sparkData} color={sparkColor} reduced={reduced} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────── */
export default function DashboardPage() {
  const reduced = useReducedMotion();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;
  const [isRefetching, setIsRefetching] = useState(false);
  const [drawerApp, setDrawerApp] = useState<(typeof MOCK_APPLICATIONS)[number] | null>(null);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else { setSortKey(key); setSortDir("asc"); }
    },
    [sortKey],
  );

  const filtered = useMemo(() => {
    let rows = [...MOCK_APPLICATIONS];
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      rows = rows.filter((r) => r.id.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "range") cmp = a.range.localeCompare(b.range);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else cmp = a.date.localeCompare(b.date);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [debouncedSearch, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);
  useEffect(() => {
    setIsRefetching(true);
    const t = setTimeout(() => setIsRefetching(false), 320);
    return () => clearTimeout(t);
  }, [debouncedSearch, statusFilter, sortKey, sortDir, page]);

  useEffect(() => {
    if (!drawerApp) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerApp(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [drawerApp]);

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    const active = sortKey === field;
    return (
      <th
        className="cursor-pointer select-none px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-400 transition-colors"
        onClick={() => toggleSort(field)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {active ? (
            sortDir === "asc" ? (
              <ChevronUp className="h-3 w-3 text-blue-400" />
            ) : (
              <ChevronDown className="h-3 w-3 text-blue-400" />
            )
          ) : (
            <span className="h-3 w-3" />
          )}
        </span>
      </th>
    );
  }

  const kpis = [
    {
      label: "Eligible Applications",
      target: 1247, decimals: 0, suffix: "",
      change: "+12.5%", up: true,
      icon: CheckCircle2,
      colorClass: "text-emerald-400 bg-emerald-500/10",
      sparkColor: "#34d399",
      sparkData: SPARKLINE_DATA.eligible,
    },
    {
      label: "Rejected",
      target: 89, decimals: 0, suffix: "",
      change: "-3.2%", up: false,
      icon: X,
      colorClass: "text-red-400 bg-red-500/10",
      sparkColor: "#f87171",
      sparkData: SPARKLINE_DATA.rejected,
    },
    {
      label: "Today's Requests",
      target: 56, decimals: 0, suffix: "",
      change: "+8.1%", up: true,
      icon: BarChart3,
      colorClass: "text-blue-400 bg-blue-500/10",
      sparkColor: "#7B9FF5",
      sparkData: SPARKLINE_DATA.today,
    },
    {
      label: "Avg. Processing Time",
      target: 2.3, decimals: 1, suffix: "s",
      change: "-15%", up: true,
      icon: Clock,
      colorClass: "text-blue-400 bg-blue-500/10",
      sparkColor: "#7B9FF5",
      sparkData: SPARKLINE_DATA.avg,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-[1160px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14">

        {/* Page header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-10"
        >
          <motion.p variants={fadeUp} className="label mb-3">
            Dashboard
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mb-1.5 text-[1.75rem] font-semibold tracking-tight text-white"
          >
            Lender Overview
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[13px] text-slate-500">
            Monitor verification requests and review borrower eligibility.
          </motion.p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} reduced={reduced} />
          ))}
        </motion.div>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.2 }}
          className="card mb-5 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[13px] font-semibold text-white">Applications Over Time</h2>
              <p className="text-[11px] text-slate-600 mt-0.5">Last 30 days</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: "Approved", color: "#34d399" },
                { label: "Pending",  color: "#fbbf24" },
                { label: "Rejected", color: "#f87171" },
              ].map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-1.5 text-[11px] text-slate-600"
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: l.color }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRejected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#3D4D5C", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#3D4D5C", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={26}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1018",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "#EEF2F8",
                  }}
                  itemStyle={{ color: "#EEF2F8" }}
                />
                <Area type="monotone" dataKey="approved" name="Approved" stroke="#34d399" fill="url(#gradApproved)" strokeWidth={1.5} isAnimationActive={!reduced} />
                <Area type="monotone" dataKey="pending"  name="Pending"  stroke="#fbbf24" fill="url(#gradPending)"  strokeWidth={1.5} isAnimationActive={!reduced} />
                <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#f87171" fill="url(#gradRejected)" strokeWidth={1.5} isAnimationActive={!reduced} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.3 }}
          className="card overflow-hidden"
        >
          {/* Controls */}
          <div className="flex flex-col gap-3 border-b border-white/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-white">Recent Applications</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.02] px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-[12px] text-slate-300 outline-none placeholder:text-slate-700 w-36"
                />
              </div>

              {/* Status filters */}
              <div className="flex items-center gap-1">
                {(["All", "Approved", "Pending", "Rejected"] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      statusFilter === s
                        ? s === "Approved"  ? "bg-emerald-500/12 text-emerald-400"
                          : s === "Pending"  ? "bg-amber-500/12 text-amber-400"
                          : s === "Rejected" ? "bg-red-500/12 text-red-400"
                          : "bg-blue-500/12 text-blue-400"
                        : "bg-transparent text-slate-600 hover:text-slate-400 hover:bg-white/[0.04]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <SortHeader label="Application" field="id" />
                  <SortHeader label="Score Range" field="range" />
                  <SortHeader label="Status" field="status" />
                  <SortHeader label="Date" field="date" />
                  <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <motion.tbody
                  key={isRefetching ? "loading" : `${safePage}-${filtered.length}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.13 }}
                >
                  {isRefetching
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                      ))
                    : paged.length === 0
                      ? [
                          <tr key="empty">
                            <td colSpan={5} className="px-5 py-14 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
                                  <Inbox className="h-4 w-4 text-slate-700" />
                                </div>
                                <p className="text-[13px] font-medium text-slate-500">
                                  No applications found
                                </p>
                                <p className="text-[11px] text-slate-700">
                                  Try adjusting your search or filters.
                                </p>
                              </div>
                            </td>
                          </tr>,
                        ]
                      : paged.map((row) => (
                          <tr key={row.id}>
                            <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">
                              {row.id}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                              {row.range}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={statusBadge(row.status)}>{row.status}</span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                              {formatDate(row.date)}
                            </td>
                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                              <button
                                onClick={() => setDrawerApp(row)}
                                className="text-[12px] font-medium text-blue-400/70 hover:text-blue-400 transition-colors"
                              >
                                View →
                              </button>
                            </td>
                          </tr>
                        ))}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/[0.04] px-5 py-3">
            <span className="text-[11px] text-slate-700">
              {(safePage - 1) * PER_PAGE + 1}–
              {Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white/[0.04] hover:text-slate-400 disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`rounded-md w-7 h-7 text-[11px] font-medium transition-colors ${
                    safePage === i + 1
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white/[0.04] hover:text-slate-400 disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Application Detail Drawer */}
      <AnimatePresence>
        {drawerApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
              onClick={() => setDrawerApp(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: reduced ? "tween" : "spring",
                damping: 28,
                stiffness: 280,
              }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[380px] border-l border-white/[0.06] bg-[#0D1018]"
            >
              <div className="flex h-full flex-col">
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-5">
                  <h3 className="text-[14px] font-semibold text-white">Application Details</h3>
                  <button
                    onClick={() => setDrawerApp(null)}
                    className="rounded-md p-1.5 text-slate-600 hover:bg-white/[0.05] hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Drawer content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                  {/* Fields */}
                  <div className="space-y-3.5">
                    {[
                      { label: "Application ID", value: drawerApp.id },
                      { label: "Score Range",     value: drawerApp.range },
                      { label: "Date",            value: formatDate(drawerApp.date) },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-[12px] text-slate-600">{row.label}</span>
                        <span className="text-[13px] font-medium text-white">{row.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-slate-600">Status</span>
                      <span className={statusBadge(drawerApp.status)}>{drawerApp.status}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.05]" />

                  {/* Timeline */}
                  <div>
                    <h4 className="mb-4 text-[12px] font-semibold text-slate-400">Status History</h4>
                    <div className="relative ml-3 border-l border-white/[0.07] pl-5">
                      {MOCK_TIMELINE.map((item, i) => (
                        <div key={i} className="relative mb-4 last:mb-0">
                          <div className="absolute -left-[22px] top-1 h-1.5 w-1.5 rounded-full border border-blue-500/50 bg-[#080A10]" />
                          <p className="text-[12px] font-medium text-slate-300">{item.label}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{item.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
