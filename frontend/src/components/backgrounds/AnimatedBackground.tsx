"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import AuroraBackground from "./AuroraBackground";
import DotGridBackground from "./DotGridBackground";
import ThreadsBackground from "./ThreadsBackground";

export type BackgroundVariant = "aurora" | "dotgrid" | "threads";

export function AnimatedBackground({ variant }: { variant: BackgroundVariant }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(59,130,246,0.06), transparent 60%)",
        }}
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {variant === "aurora" && (
        <AuroraBackground
          colorStops={["#3b82f6", "#6366f1", "#1e40af"]}
          amplitude={1}
          speed={0.6}
          intensity={0.5}
        />
      )}
      {variant === "dotgrid" && (
        <DotGridBackground color="#3b82f6" spacing={30} intensity={0.5} />
      )}
      {variant === "threads" && (
        <ThreadsBackground
          colors={["#3b82f6", "#6366f1"]}
          lineCount={14}
          speed={0.5}
          intensity={0.45}
        />
      )}
    </div>
  );
}
