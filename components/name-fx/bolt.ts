// Lightning helpers for the name: canvas sizing, nearest-letter search, branching bolt
// geometry (midpoint displacement) and the layered glow stroke.
// Bolt shape after Michael Hoffman's "How to Generate Shockingly Good 2D Lightning Effects"
// (Envato Tuts+): split each segment at its midpoint, push the midpoint sideways by an amount
// that halves each pass, and now and then fork a dimmer branch off the midpoint.

export type Pt = [number, number];
export type Seg = { a: Pt; b: Pt; w: number }; // w: brightness 0..1 (1 = main channel)

export const YELLOW = '246,206,58';

// Size a canvas to its CSS box at up to 2x pixel density. Returns the CSS box.
export function fitCanvas(cv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(r.width * dpr);
  cv.height = Math.round(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return r;
}

export type Hit = { el: HTMLSpanElement; i: number; d: number; x: number; y: number; r: DOMRect };

// The letter closest to a viewport point, with the contact point clamped inside the glyph's core.
export function nearest(letters: HTMLSpanElement[], px: number, py: number): Hit | null {
  let best: Hit | null = null;
  letters.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const x = Math.max(r.left + r.width * 0.2, Math.min(px, r.right - r.width * 0.2));
    const y = Math.max(r.top + r.height * 0.25, Math.min(py, r.bottom - r.height * 0.25));
    const d = Math.hypot(x - px, y - py);
    if (!best || d < best.d) best = { el, i, d, x, y, r };
  });
  return best;
}

// A branching bolt from a to b. `rough` is the first sideways push as a share of the length.
export function forkedBolt(a: Pt, b: Pt, { passes = 5, rough = 0.18, forks = 0.35 } = {}): Seg[] {
  let segs: Seg[] = [{ a, b, w: 1 }];
  let off = Math.hypot(b[0] - a[0], b[1] - a[1]) * rough;
  for (let p = 0; p < passes; p++) {
    const next: Seg[] = [];
    for (const s of segs) {
      const [ax, ay] = s.a;
      const [bx, by] = s.b;
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const push = (Math.random() - 0.5) * 2 * off * (s.w < 1 ? 0.7 : 1);
      const m: Pt = [(ax + bx) / 2 - (dy / len) * push, (ay + by) / 2 + (dx / len) * push];
      next.push({ a: s.a, b: m, w: s.w }, { a: m, b: s.b, w: s.w });
      // fork: a dimmer branch heading roughly the same way, turned up to ~35 degrees
      if (p < passes - 1 && Math.random() < forks * s.w) {
        const turn = (Math.random() - 0.5) * 1.2;
        const fx = bx - m[0];
        const fy = by - m[1];
        const k = 0.6 + Math.random() * 0.4;
        const end: Pt = [m[0] + (fx * Math.cos(turn) - fy * Math.sin(turn)) * k, m[1] + (fx * Math.sin(turn) + fy * Math.cos(turn)) * k];
        next.push({ a: m, b: end, w: s.w * 0.45 });
      }
    }
    segs = next;
    off /= 2;
  }
  return segs;
}

// Stroke bolt segments as a glow, a coloured body and a white-hot core, added together.
export function drawSegs(ctx: CanvasRenderingContext2D, segs: Seg[], alpha = 1, scale = 1) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const [w, col, a] of [
    [9, YELLOW, 0.1],
    [3.2, YELLOW, 0.55],
    [1.3, '255,250,230', 1],
  ] as const) {
    for (const s of segs) {
      ctx.strokeStyle = `rgba(${col},${(a * alpha * (0.35 + 0.65 * s.w)).toFixed(3)})`;
      ctx.lineWidth = w * scale * (0.45 + 0.55 * s.w);
      ctx.beginPath();
      ctx.moveTo(s.a[0], s.a[1]);
      ctx.lineTo(s.b[0], s.b[1]);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// A soft round glow (contact points, illumination).
export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number, rgb = YELLOW) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a.toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}
