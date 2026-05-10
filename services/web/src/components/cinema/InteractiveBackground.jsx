import React, { useEffect, useRef } from "react";

// Subtle interactive canvas: deep dark base, drifting fog, light responding to mouse
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    // Precompute a noise texture
    const noise = document.createElement("canvas");
    noise.width = 256; noise.height = 256;
    const nctx = noise.getContext("2d");
    const nimg = nctx.createImageData(noise.width, noise.height);
    for (let i = 0; i < nimg.data.length; i += 4) {
      const v = 230 + Math.random() * 25; // bright speckle
      nimg.data[i] = v; nimg.data[i+1] = v; nimg.data[i+2] = v; nimg.data[i+3] = Math.random() * 12; // very low alpha
    }
    nctx.putImageData(nimg, 0, 0);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      tRef.current += 0.0025;

      // Base
      ctx.fillStyle = "#0B0F14";
      ctx.fillRect(0, 0, w, h);

      // Drifting fog ellipses
      const drift = (amp) => Math.sin(tRef.current * amp);
      const cx = w * 0.5 + drift(0.7) * 30;
      const cy = h * 0.25 + drift(0.9) * 20;
      const gradA = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      gradA.addColorStop(0.0, "rgba(20,22,24,0.85)");
      gradA.addColorStop(0.35, "rgba(12,14,18,0.6)");
      gradA.addColorStop(0.7, "rgba(8,10,14,0.0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gradA;
      ctx.fillRect(0, 0, w, h);

      // Horizon glow (cold, industrial)
      const gy = h * 0.85;
      const gradB = ctx.createRadialGradient(w/2, gy, 0, w/2, gy, w);
      gradB.addColorStop(0.0, "rgba(160,170,180,0.10)");
      gradB.addColorStop(0.3, "rgba(120,130,140,0.06)");
      gradB.addColorStop(0.6, "rgba(60,70,80,0.03)");
      gradB.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = gradB;
      ctx.fillRect(0, 0, w, h);

      // Mouse spotlight + downward beam
      const mx = mouse.current.x || w/2;
      const my = mouse.current.y || h/2;
      const r = 90;
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      glow.addColorStop(0.0, "rgba(255,255,255,0.9)");
      glow.addColorStop(0.2, "rgba(255,255,255,0.45)");
      glow.addColorStop(1.0, "rgba(255,255,255,0.0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mx, my, r, 0, Math.PI * 2);
      ctx.fill();

      // Beam
      const beam = ctx.createLinearGradient(mx, my, mx, my + 220);
      beam.addColorStop(0.0, "rgba(255,255,255,0.25)");
      beam.addColorStop(0.2, "rgba(255,255,255,0.18)");
      beam.addColorStop(1.0, "rgba(255,255,255,0.0)");
      ctx.fillStyle = beam;
      ctx.fillRect(mx - 14, my + 10, 28, 220);

      // Noise overlay
      ctx.globalAlpha = 0.25;
      for (let y = 0; y < h; y += noise.height) {
        for (let x = 0; x < w; x += noise.width) {
          ctx.drawImage(noise, x, y);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-30" />;
}
