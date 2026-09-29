"use client";

import { useEffect, useRef } from "react";
import { hexToRgba } from "./colorUtils";

export interface AuroraBackgroundProps {
  colorStops?: string[];
  amplitude?: number;
  speed?: number;
  intensity?: number;
}

const DEFAULT_COLORS = ["#3b82f6", "#6366f1", "#1e40af", "#0ea5e9"];

interface Blob {
  color: string;
  phase: number;
  fx: number;
  fy: number;
  dir: number;
}

export default function AuroraBackground({
  colorStops = DEFAULT_COLORS,
  amplitude = 1,
  speed = 1,
  intensity = 0.55,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const blobs: Blob[] = colorStops.map((c, i) => ({
      color: c,
      phase: i * 1.7,
      fx: 0.16 + 0.11 * i,
      fy: 0.2 + 0.09 * (i % 2),
      dir: i % 2 === 0 ? 1 : -1,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    let raf = 0;

    const render = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const minDim = Math.min(w, h);
      for (const b of blobs) {
        const cx =
          w * (0.5 + b.dir * b.fx * amplitude * Math.cos(t * 0.1 * speed + b.phase));
        const cy =
          h * (0.5 + Math.sin(t * 0.08 * speed + b.phase) * b.fy * amplitude);
        const r = minDim * (0.45 + 0.1 * Math.sin(t * 0.18 * speed + b.phase));
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, hexToRgba(b.color, 0.5 * intensity));
        grad.addColorStop(0.5, hexToRgba(b.color, 0.18 * intensity));
        grad.addColorStop(1, hexToRgba(b.color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [colorStops, amplitude, speed, intensity]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
