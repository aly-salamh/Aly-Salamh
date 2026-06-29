import { ReactElement } from 'react';
import { COL, MATCH, maxOf, Player } from '../matchData';

interface RadarProps {
  player: Player;
  activeKey?: string | null;
  size?: number;
}

/** SVG radar chart for a player, rendered as JSX. Ported from the prototype. */
export default function Radar({ player, activeKey = null, size = 132 }: RadarProps) {
  const c = size / 2;
  const R = size * 0.318;
  const axes = MATCH.radarAxes;
  const n = axes.length;

  const gridRings = [0.5, 1].map((r, gi) => {
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      pts.push(`${(c + Math.cos(a) * R * r).toFixed(1)},${(c + Math.sin(a) * R * r).toFixed(1)}`);
    }
    return <polygon key={`g${gi}`} points={pts.join(' ')} fill="none" stroke="#2a3a4f" strokeWidth={1} />;
  });

  const spokes: ReactElement[] = [];
  const dots: ReactElement[] = [];
  const labels: ReactElement[] = [];
  const polyPts: string[] = [];

  for (let i = 0; i < n; i++) {
    const [k, lab] = axes[i];
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const mx = maxOf(k as Exclude<keyof Player, 'id' | 'team'>) || 1;
    const value = player[k] as number;
    const rr = R * Math.max(0.06, value / mx);
    const x = c + Math.cos(a) * rr;
    const y = c + Math.sin(a) * rr;
    polyPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    spokes.push(
      <line key={`s${i}`} x1={c} y1={c} x2={(c + Math.cos(a) * R).toFixed(1)} y2={(c + Math.sin(a) * R).toFixed(1)} stroke="#223144" strokeWidth={1} />
    );
    const act = k === activeKey;
    dots.push(
      <circle key={`d${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r={act ? 4 : 2.5} fill={act ? '#fff' : COL[player.team]} stroke={COL[player.team]} strokeWidth={act ? 2 : 0} />
    );
    const lx = c + Math.cos(a) * (R + 11);
    const ly = c + Math.sin(a) * (R + 11);
    labels.push(
      <text key={`l${i}`} x={lx.toFixed(1)} y={(ly + 3).toFixed(1)} textAnchor="middle" fontSize={8.5} fill={act ? '#dbe6f2' : '#7d8aa0'}>
        {lab}
      </text>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridRings}
      {spokes}
      <polygon
        className="radar-poly"
        points={polyPts.join(' ')}
        fill={COL[player.team]}
        fillOpacity={0.22}
        stroke={COL[player.team]}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dots}
      {labels}
    </svg>
  );
}
