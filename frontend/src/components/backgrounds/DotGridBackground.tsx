"use client";

import { useEffect, useRef } from "react";
import { hexToRgba } from "./colorUtils";

export interface DotGridBackgroundProps {
  color?: string;
  spacing?: number;
  intensity?: number;
}

export default function DotGridBackground({
  color = "#3b82f6",
  spacing = 28,
  intensity = 0.5,
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999, moved: false };

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

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moved = true;
    };
    window.addEventListener("mousemove", onMove);

    const t0 = performance.now();
    let raf = 0;
    const maxR = spacing * 0.18;
    const baseAlpha = 0.05 * intensity;

    const render = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          let r = maxR * 0.5;
          let a = baseAlpha;
          if (mouse.moved) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - dist / 200);
            r = maxR * (0.5 + influence * 1.6);
            a = baseAlpha + influence * 0.5 * intensity;
          } else {
            const tw = 0.5 + 0.5 * Math.sin(t * 0.6 + x * 0.03 + y * 0.03);
            r = maxR * (0.4 + tw * 0.18);
          }
          ctx.fillStyle = hexToRgba(color, a);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
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
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [color, spacing, intensity]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
