import { CSSProperties } from 'react';
import { HEAT, TeamId } from '../matchData';

/** Tilted 3D pitch with occupancy blooms laid on its surface. CSS 3D, no canvas. */
export default function Heatmap(_props: { active?: boolean }) {
  const blobs = (Object.keys(HEAT) as TeamId[]).flatMap((team) => {
    const color = team === 'BLUE' ? '#3b82f6' : '#f5b62a';
    return HEAT[team].map(([fx, fy, w], i) => {
      const s = (w * 30).toFixed(1);
      return (
        <span
          key={`${team}${i}`}
          className="hb3"
          style={{
            left: `${(fx * 100).toFixed(1)}%`,
            top: `${(fy * 100).toFixed(1)}%`,
            width: `${s}%`,
            paddingBottom: `${s}%`,
            background: `radial-gradient(circle, ${color}ee 0%, ${color}66 45%, transparent 70%)`,
          }}
        />
      );
    });
  });

  return (
    <div className="panel">
      <div className="card">
        <div className="card-h">Occupancy heatmaps</div>
        <div className="card-s">Where each side spent its time on the pitch · 3D pitch view</div>
        <div className="pitch-wrap">
          <div className="pitch3d">
            <span className="pl-line pl-mid" />
            <span className="pl-line pl-circle" />
            <span className="pl-line pl-spot" />
            <span className="pl-line pl-box l" />
            <span className="pl-line pl-box r" />
            <span className="pl-line pl-goal l" />
            <span className="pl-line pl-goal r" />
            {blobs}
          </div>
        </div>
        <div className="heat-leg">
          <span><i style={{ background: 'linear-gradient(90deg,transparent,var(--blue))' } as CSSProperties} />BLUE occupancy</span>
          <span><i style={{ background: 'linear-gradient(90deg,transparent,var(--yel))' } as CSSProperties} />YEL occupancy</span>
        </div>
      </div>
    </div>
  );
}
