"use client";

import { useEffect, useRef } from "react";
import { hexToRgba } from "./colorUtils";

export interface ThreadsBackgroundProps {
  colors?: string[];
  lineCount?: number;
  speed?: number;
  intensity?: number;
}

interface Line {
  color: string;
  amp: number;
  freq: number;
  phase: number;
  yBase: number;
  speedF: number;
}

export default function ThreadsBackground({
  colors = ["#3b82f6", "#6366f1"],
  lineCount = 14,
  speed = 1,
  intensity = 0.5,
}: ThreadsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

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

    const lines: Line[] = Array.from({ length: lineCount }, (_, i) => ({
      color: colors[i % colors.length],
      amp: 28 + (i % 5) * 13,
      freq: 0.004 + (i % 3) * 0.0015,
      phase: i * 0.5,
      yBase: (i + 0.5) / lineCount,
      speedF: 0.4 + (i % 3) * 0.15,
    }));

    const t0 = performance.now();
    let raf = 0;

    const render = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const ln of lines) {
        const yMid = h * ln.yBase;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = yMid + Math.sin(x * ln.freq + t * ln.speedF * speed + ln.phase) * ln.amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, hexToRgba(ln.color, 0));
        grad.addColorStop(0.5, hexToRgba(ln.color, 0.32 * intensity));
        grad.addColorStop(1, hexToRgba(ln.color, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
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
  }, [colors, lineCount, speed, intensity]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
