import React, { useEffect, useRef } from "react";

/**
 * The assistant's visualizer: an audio-reactive orb of pixels (the same square, blocky language as
 * the site's pixel portraits). Its motion carries the state; the words are shown below it:
 *
 *   idle        a slow breathing glow                       (an invitation to click)
 *   connecting  a ring of light expanding outward
 *   listening   ripples travel inward, bigger when the visitor's voice is louder
 *   thinking    a comet of light circles the orb
 *   speaking    waves flow outward with the voice
 *   muted/error grey and still
 *
 * Plain canvas 2D: no shader, no WebGL, works everywhere and costs almost nothing.
 */
const PALETTE = {
  light: { base: [237, 93, 48], hot: [255, 168, 64], grey: [138, 133, 126] },
  dark: { base: [255, 150, 109], hot: [255, 214, 140], grey: [150, 150, 156] }
};

// A stable 0..1 value per grid cell, so twinkles do not flicker from frame to frame.
const hash = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const clamp01 = v => Math.max(0, Math.min(1, v));

// How lit a cell is (0..1) for each state. d: 0 centre .. 1 rim. a: angle. h: cell hash.
function lit(state, d, a, h, t, lvl) {
  const rim = d > 0.86 ? 0.36 : 0; // the silhouette of the orb always shows
  switch (state) {
    case "connecting": {
      const ring = (t * 0.8) % 1.2;
      return 0.14 + rim * 0.6 + Math.exp(-((d - ring) ** 2) / 0.012) * 0.95;
    }
    case "listening": {
      const w = 0.5 + 0.5 * Math.sin(d * 7 + t * 5);
      return 0.17 + rim * (0.5 + lvl) + (0.14 + lvl * 1.1) * w * (0.4 + 0.6 * d);
    }
    case "thinking": {
      const behind = (((a - t * 3.4) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const comet = Math.max(0, 1 - behind / 1.5) ** 2;
      return 0.13 + rim * 0.6 + comet * 0.95 * (0.45 + 0.55 * d) + (h > 0.93 ? 0.25 : 0);
    }
    case "speaking": {
      const w = 0.5 + 0.5 * Math.sin(d * 8 - t * 7);
      return 0.18 + rim * 0.7 + (0.22 + lvl * 1.15) * w * (1 - 0.35 * d) + lvl * 0.2 * h;
    }
    case "muted":
    case "error":
      return 0.2 + rim;
    default: {
      // idle: slow breathing and a few twinkles
      const breath = Math.max(0, Math.sin(d * 5 - t * 1.1)) * 0.2;
      return 0.15 + rim + breath + 0.1 * Math.sin(t * 0.9 + h * 6.28);
    }
  }
}

export default function PixelOrb({ state = "idle", levelRef, dark = false, className = "" }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const live = useRef({ state, dark });
  live.current = { state, dark };

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let lvl = 0;

    const draw = now => {
      raf = window.requestAnimationFrame(draw);
      if (now - last < (reduce ? 250 : 33)) return; // ~30fps is plenty
      last = now;

      const { state: st, dark: isDark } = live.current;
      const css = wrap.current.clientWidth * 1.4;
      if (css < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.round(css * dpr);
      if (cv.width !== px) {
        cv.width = px;
        cv.height = px;
      }
      const t = reduce ? 3 : now / 1000;
      lvl += ((reduce ? 0 : (levelRef && levelRef.current) || 0) - lvl) * 0.35;

      const pal = PALETTE[isDark ? "dark" : "light"];
      const R = px * 0.41;
      const cells = css < 110 ? 17 : 25;
      const cell = Math.max(2, Math.floor((2 * R) / cells));
      const half = Math.floor(R / cell);
      const c = px / 2;
      const grey = st === "muted" || st === "error";

      ctx.clearRect(0, 0, px, px);

      // soft glow behind the icon
      const glow = ctx.createRadialGradient(c, c, 0, c, c, R * 0.7);
      const col = grey ? pal.grey : pal.base;
      const ga = grey ? 0.1 : 0.14 + Math.min(0.3, lvl * 0.4);
      glow.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${ga})`);
      glow.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, px, px);

      // the pixels
      for (let gy = -half; gy <= half; gy += 1) {
        for (let gx = -half; gx <= half; gx += 1) {
          const x = gx * cell;
          const y = gy * cell;
          const d = Math.hypot(x, y) / R;
          if (d <= 1 && d >= 0.08) {
            const h = hash(gx, gy);
            const i = clamp01(lit(st, d, Math.atan2(y, x), h, t, lvl));
            const size = Math.max(1, Math.round(cell * (0.3 + 0.62 * i)));
            const rgb = grey ? pal.grey : mix(pal.base, pal.hot, clamp01((i - 0.4) * 1.6));
            ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.16 + 0.84 * i})`;
            ctx.fillRect(Math.round(c + x - size / 2), Math.round(c + y - size / 2), size, size);
          }
        }
      }
    };
    raf = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(raf);
  }, [levelRef]);

  return (
    <span ref={wrap} className={`aura ${className}`} aria-hidden="true">
      <canvas ref={canvas} />
    </span>
  );
}
