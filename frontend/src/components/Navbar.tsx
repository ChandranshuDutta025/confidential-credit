"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { WalletStatus } from "@/lib/hooks/useWalletDetection";
import type { WalletInfo } from "@/lib/types";

interface NavbarProps {
  walletStatus: WalletStatus;
  walletInfo: WalletInfo | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onRetry: () => void;
  onDemoMode: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/eligibility", label: "Verify" },
  { href: "/dashboard", label: "Dashboard" },
];

/* ─── Wallet status indicator ─── */
function WalletButton({
  walletStatus,
  walletInfo,
  onConnect,
  onDisconnect,
  onRetry,
  onDemoMode,
}: {
  walletStatus: WalletStatus;
  walletInfo: WalletInfo | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onRetry: () => void;
  onDemoMode: () => void;
}) {
  const shortAddr = walletInfo
    ? `${walletInfo.address.slice(0, 5)}…${walletInfo.address.slice(-4)}`
    : "";

  if (walletStatus === "detecting" || walletStatus === "connecting") {
    return (
      <span className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
        <span className="h-3 w-3 rounded-full border-[1.5px] border-slate-700 border-t-blue-400 animate-spin inline-block" />
        <span className="hidden sm:inline">
          {walletStatus === "detecting" ? "Detecting…" : "Connecting…"}
        </span>
      </span>
    );
  }

  if (walletStatus === "connected" && walletInfo) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 badge badge-green text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          {shortAddr}
        </span>
        <button
          onClick={onDisconnect}
          className="btn btn-ghost btn-sm text-[12px]"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (walletStatus === "not_found" || walletStatus === "error") {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onRetry}
          className="btn btn-ghost btn-sm text-red-400 border-red-500/20 hover:border-red-500/35 hover:bg-red-500/5 text-[12px]"
        >
          Retry
        </button>
        <button
          onClick={onDemoMode}
          className="btn btn-ghost btn-sm text-amber-400 border-amber-500/20 hover:border-amber-500/35 hover:bg-amber-500/5 text-[12px]"
        >
          Demo
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="btn btn-primary btn-sm text-[12px]"
    >
      Connect Wallet
    </button>
  );
}

export function Navbar({
  walletStatus,
  walletInfo,
  onConnect,
  onDisconnect,
  onRetry,
  onDemoMode,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const networkLabel = process.env.NEXT_PUBLIC_NETWORK ?? "—";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "nav-bar" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-5 py-3 lg:px-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {/* Shield icon */}
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/90 group-hover:bg-blue-500/90 transition-colors" />
            <svg
              className="relative h-3.5 w-3.5 text-white"
              viewBox="0 0 16 16"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 1.5L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1.5z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 8l1.8 1.8L11 6" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-slate-200 hidden sm:inline group-hover:text-white transition-colors">
            MidScore
          </span>
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-150"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-md bg-white/[0.07]"
                    transition={{ type: "spring", stiffness: 450, damping: 38 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-150 ${
                    active ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {/* Network badge */}
          <span className="hidden sm:flex items-center gap-1.5 badge badge-blue text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
            {networkLabel}
          </span>

          {/* Wallet — desktop */}
          <div className="hidden md:flex">
            <WalletButton
              walletStatus={walletStatus}
              walletInfo={walletInfo}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onRetry={onRetry}
              onDemoMode={onDemoMode}
            />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-white/[0.05] bg-[#080A10]/95 backdrop-blur-xl md:hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-white/[0.07] text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/[0.05] mt-1">
                <WalletButton
                  walletStatus={walletStatus}
                  walletInfo={walletInfo}
                  onConnect={onConnect}
                  onDisconnect={onDisconnect}
                  onRetry={onRetry}
                  onDemoMode={onDemoMode}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
