"use client";

import { motion } from "framer-motion";

const COLORS = ["#34d399", "#3b82f6", "#6366f1", "#fbbf24", "#f87171", "#ffffff"];

export function Confetti({ reduced }: { reduced: boolean }) {
  if (reduced) return null;

  const pieces = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 70 + (i % 4) * 26;
    return {
      i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: COLORS[i % COLORS.length],
      rot: (i * 47) % 360,
      delay: (i % 5) * 0.04,
    };
  });

  return (
    <div className="pointer-events-none absolute left-1/2 top-8 z-20 -translate-x-1/2">
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 90],
            opacity: [1, 1, 0],
            rotate: p.rot,
            scale: [1, 1, 0.5],
          }}
          transition={{ duration: 1.4, delay: 0.25 + p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
