"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WalletProvider, useWalletContext } from "@/lib/hooks/WalletProvider";
import { Navbar } from "@/components/Navbar";
import { AnimatedBackground, type BackgroundVariant } from "@/components/backgrounds/AnimatedBackground";
import Link from "next/link";

function NavbarWrapper() {
  const wallet = useWalletContext();
  return (
    <Navbar
      walletStatus={wallet.status}
      walletInfo={wallet.walletInfo}
      onConnect={wallet.connect}
      onDisconnect={wallet.disconnect}
      onRetry={wallet.retry}
      onDemoMode={wallet.connectDemo}
    />
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.16, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variant: BackgroundVariant =
    pathname === "/eligibility"
      ? "threads"
      : pathname === "/dashboard"
        ? "dotgrid"
        : "aurora";

  return (
    <WalletProvider>
      <div className="min-h-screen w-full bg-[#080A10] text-slate-100 font-sans overflow-x-hidden">
        <AnimatedBackground variant={variant} />
        <NavbarWrapper />
        <main className="relative z-10 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t border-white/[0.05] mt-20">
          <div className="mx-auto max-w-[1160px] px-5 py-10 lg:px-14">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Brand */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 16 16"
                    fill="none"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 1.5L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 8l1.8 1.8L11 6" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-slate-400">MidScore</span>
              </div>

              {/* Links + tagline */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <nav className="flex items-center gap-5">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/eligibility", label: "Verify" },
                    { href: "/dashboard", label: "Dashboard" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
                <p className="text-[11px] text-slate-700">
                  Zero-Knowledge Proofs · Midnight Network
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
