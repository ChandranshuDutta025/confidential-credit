"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Lock } from "lucide-react";
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
  { href: "/", label: "Overview" },
  { href: "/eligibility", label: "Verify Credit" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Docs" },
];

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
      <span className="flex items-center gap-2 text-xs text-[#B0BFA8] font-mono">
        <span className="h-3 w-3 rounded-full border-2 border-[#141C27] border-t-[#239BA7] animate-spin inline-block" />
        <span>{walletStatus === "detecting" ? "Detecting..." : "Connecting..."}</span>
      </span>
    );
  }

  if (walletStatus === "connected" && walletInfo) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#7ADAA5]/10 border border-[#7ADAA5]/30 text-[#7ADAA5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ADAA5] animate-pulse" />
          {shortAddr}
        </span>
        <button
          onClick={onDisconnect}
          className="btn btn-ghost py-1 px-2.5 text-xs text-[#B0BFA8] hover:text-[#ECECBB]"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (walletStatus === "not_found" || walletStatus === "error") {
    return (
      <div className="flex items-center gap-2 font-mono text-xs">
        <button
          onClick={onRetry}
          className="px-2.5 py-1 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20 transition-all"
        >
          Retry
        </button>
        <button
          onClick={onDemoMode}
          className="px-2.5 py-1 rounded bg-[#E1AA36]/10 border border-[#E1AA36]/30 text-[#E1AA36] hover:bg-[#E1AA36]/20 transition-all"
        >
          Demo Wallet
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="btn btn-primary py-1.5 px-3.5 text-xs font-semibold flex items-center gap-1.5 font-mono"
    >
      <Lock className="h-3.5 w-3.5 text-[#090D12]" /> Connect Wallet
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#090D12]/95 backdrop-blur-md border-b border-[#ECECBB]/10 shadow-lg"
          : "bg-[#090D12]/70 backdrop-blur-sm border-b border-[#ECECBB]/05"
      }`}
    >
      <div className="page-shell">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Brand Logo & Network Status Pill */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#239BA7]/20 border border-[#239BA7]/40 text-[#239BA7] group-hover:bg-[#239BA7]/30 transition-all">
                <Shield className="h-4 w-4 text-[#7ADAA5]" />
              </div>
              <span className="font-bold text-sm tracking-tight text-[#ECECBB] font-mono flex items-center gap-1">
                MID<span className="text-[#239BA7]">SCORE</span>
              </span>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#239BA7]/10 border border-[#239BA7]/30 text-[10px] font-mono text-[#7ADAA5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7ADAA5] animate-pulse" />
              MIDNIGHT TESTNET
            </span>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors font-mono ${
                    active
                      ? "text-[#7ADAA5] bg-[#239BA7]/15 border border-[#239BA7]/30 font-bold"
                      : "text-[#B0BFA8] hover:text-[#ECECBB] hover:bg-[#ECECBB]/05"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Wallet Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <WalletButton
              walletStatus={walletStatus}
              walletInfo={walletInfo}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onRetry={onRetry}
              onDemoMode={onDemoMode}
            />

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 rounded-md text-[#B0BFA8] hover:text-[#ECECBB] hover:bg-[#ECECBB]/10"
              aria-label="Toggle Navigation"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#ECECBB]/10 py-3 space-y-1 font-mono text-xs"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "text-[#7ADAA5] bg-[#239BA7]/15 font-semibold"
                      : "text-[#B0BFA8] hover:text-[#ECECBB]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
