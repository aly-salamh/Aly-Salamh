import { ReactElement, useState } from 'react';
import { COL, MATCH, P, Player, fmt, leaderboard, levelOf, maxOf, ppos, rating, ratingTier } from '../matchData';
import Avatar from './Avatar';

type Key = Exclude<keyof Player, 'id' | 'team'>;

function CompareRadar({ a, b, size = 210 }: { a: Player; b: Player; size?: number }) {
  const c = size / 2;
  const R = size * 0.33;
  const axes = MATCH.radarAxes;
  const n = axes.length;
  const rings = [0.5, 1].map((rr, gi) => {
    const pp: string[] = [];
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      pp.push(`${(c + Math.cos(ang) * R * rr).toFixed(1)},${(c + Math.sin(ang) * R * rr).toFixed(1)}`);
    }
    return <polygon key={`r${gi}`} points={pp.join(' ')} fill="none" stroke="#26402f" strokeWidth={1} />;
  });
  const poly = (p: Player) => {
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const k = axes[i][0] as Key;
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const mx = maxOf(k) || 1;
      const r = R * Math.max(0.06, (p[k] as number) / mx);
      pts.push(`${(c + Math.cos(ang) * r).toFixed(1)},${(c + Math.sin(ang) * r).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const spokes: ReactElement[] = [];
  const labels: ReactElement[] = [];
  for (let i = 0; i < n; i++) {
    const [, lab] = axes[i];
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    spokes.push(<line key={`s${i}`} x1={c} y1={c} x2={(c + Math.cos(ang) * R).toFixed(1)} y2={(c + Math.sin(ang) * R).toFixed(1)} stroke="#1f3127" strokeWidth={1} />);
    const lx = c + Math.cos(ang) * (R + 12);
    const ly = c + Math.sin(ang) * (R + 12);
    labels.push(<text key={`l${i}`} x={lx.toFixed(1)} y={(ly + 3).toFixed(1)} textAnchor="middle" fontSize="8.5" fill="#7e948a">{lab}</text>);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings}{spokes}
      <polygon points={poly(a)} fill={COL[a.team]} fillOpacity={0.2} stroke={COL[a.team]} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={poly(b)} fill="none" stroke={COL[b.team]} strokeWidth={2} strokeDasharray="4 3" strokeLinejoin="round" />
      {labels}
    </svg>
  );
}

function ProfileCard({ p }: { p: Player }) {
  const rt = rating(p);
  const lv = levelOf(p);
  return (
    <div className="cmp-card">
      <Avatar player={p} size={64} />
      <div className="cmp-name">{p.id}</div>
      <div className="cmp-meta">{`${ppos(p)} · ${p.team} · Lv ${lv.level}`}</div>
      <div className={`rate ${ratingTier(rt)}`} style={{ marginTop: 5 }}>{rt.toFixed(1)}</div>
    </div>
  );
}

const METRICS: [string, Key, string][] = [
  ['Distance', 'dist', 'm'],
  ['Top speed', 'top', 'm/s'],
  ['Passes', 'made', ''],
  ['Possession', 'poss', 's'],
  ['Touches', 'touches', ''],
  ['Sprints', 'sprint', ''],
];

export default function Compare() {
  const lb = leaderboard();
  const [aId, setAId] = useState(lb[0].player.id);
  const [bId, setBId] = useState(lb[1].player.id);
  const a = P.find((x) => x.id === aId)!;
  const b = P.find((x) => x.id === bId)!;

  return (
    <div className="panel">
      <div className="card">
        <div className="card-h">Head-to-head compare</div>
        <div className="card-s">Pick any two players and see how they stack up</div>
        <div className="cmp-head">
          <div className="cmp-pick a">
            <select value={aId} onChange={(e) => setAId(e.target.value)}>
              {P.map((p) => <option key={p.id} value={p.id}>{`${p.id} · ${ppos(p)}`}</option>)}
            </select>
            <ProfileCard p={a} />
          </div>
          <div className="cmp-vs">VS</div>
          <div className="cmp-pick b">
            <select value={bId} onChange={(e) => setBId(e.target.value)}>
              {P.map((p) => <option key={p.id} value={p.id}>{`${p.id} · ${ppos(p)}`}</option>)}
            </select>
            <ProfileCard p={b} />
          </div>
        </div>
        <div className="cmp-radar">
          <CompareRadar a={a} b={b} size={210} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 4 }}>
            <span className="cmp-leg" style={{ color: COL[a.team] }}><i style={{ background: COL[a.team] }} />{a.id}</span>
            <span className="cmp-leg" style={{ color: COL[b.team] }}><i style={{ background: COL[b.team] }} />{b.id}</span>
          </div>
        </div>
        <div className="cmp-rows">
          {METRICS.map(([l, k, u]) => {
            const va = a[k] as number;
            const vb = b[k] as number;
            const tot = va + vb;
            const wa = tot > 0 ? (va / tot) * 100 : 50;
            const wb = tot > 0 ? (vb / tot) * 100 : 50;
            return (
              <div className="cmp-row" key={l}>
                <div className="cl">{l}</div>
                <div className="cmp-line">
                  <div className="cmp-v l" style={{ color: COL[a.team] }}>{fmt(va, u)}{u && <small> {u}</small>}</div>
                  <div className="cmp-bar">
                    <div className="cmp-fill" style={{ width: `${wa}%`, background: COL[a.team] }} />
                    <div className="cmp-fill r" style={{ width: `${wb}%`, background: COL[b.team] }} />
                  </div>
                  <div className="cmp-v r" style={{ color: COL[b.team] }}>{fmt(vb, u)}{u && <small> {u}</small>}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
