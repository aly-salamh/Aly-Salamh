import { useEffect, useRef } from 'react';
import { HEAT } from '../matchData';

/** Procedural occupancy heatmap drawn on a canvas. Ported from the prototype. */
export default function Heatmap({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width;
    const H = cv.height;
    const pad = 24;
    ctx.clearRect(0, 0, W, H);

    // pitch base
    ctx.fillStyle = '#0c5c2e';
    ctx.globalAlpha = 0.18;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    // mowed stripes
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.015)' : 'rgba(0,0,0,.06)';
      ctx.fillRect(pad + (i * (W - 2 * pad)) / 10, pad, (W - 2 * pad) / 10, H - 2 * pad);
    }

    const bloom = (pts: [number, number, number][], color: string) => {
      pts.forEach(([fx, fy, w]) => {
        const x = pad + fx * (W - 2 * pad);
        const y = pad + fy * (H - 2 * pad);
        const r = 120 * w;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color + 'cc');
        g.addColorStop(0.5, color + '55');
        g.addColorStop(1, color + '00');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 7);
        ctx.fill();
      });
    };
    ctx.globalCompositeOperation = 'screen';
    bloom(HEAT.BLUE, '#3b82f6');
    bloom(HEAT.YEL, '#f5b62a');
    ctx.globalCompositeOperation = 'source-over';

    // pitch lines
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
    ctx.beginPath();
    ctx.moveTo(W / 2, pad);
    ctx.lineTo(W / 2, H - pad);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 64, 0, 7);
    ctx.stroke();
    const bh = H * 0.42;
    const by = (H - bh) / 2;
    const bw = 90;
    ctx.strokeRect(pad, by, bw, bh);
    ctx.strokeRect(W - pad - bw, by, bw, bh);
  }, [active]);

  return (
    <div className="panel">
      <div className="card">
        <div className="card-h">Occupancy heatmaps</div>
        <div className="card-s">Where each side spent its time on the pitch · team occupancy</div>
        <canvas ref={ref} className="heat-canvas" width={1040} height={620} />
        <div className="heat-leg">
          <span>
            <i style={{ background: 'linear-gradient(90deg,transparent,var(--blue))' }} />
            BLUE occupancy
          </span>
          <span>
            <i style={{ background: 'linear-gradient(90deg,transparent,var(--yel))' }} />
            YEL occupancy
          </span>
        </div>
      </div>
    </div>
  );
}
