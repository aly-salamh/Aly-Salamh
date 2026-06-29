import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { COL, MATCH, P, Player, pnum, ppos, rating, ratingTier } from '../matchData';
import Avatar from './Avatar';
import CountUp from './CountUp';
import Radar from './Radar';

type Key = Exclude<keyof Player, 'id' | 'team'>;

export default function Players({ active }: { active: boolean }) {
  const [metric, setMetric] = useState<Key>('dist');
  const segRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{ left: number; width: number }>({ left: 4, width: 0 });

  useLayoutEffect(() => {
    const btn = btnRefs.current[metric];
    if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [metric, active]);

  const meta = MATCH.faMetrics.find((m) => m[0] === metric)!;
  const unit = meta[2];
  const label = meta[1];
  const sorted = [...P].sort((a, b) => (b[metric] as number) - (a[metric] as number));

  return (
    <div className="panel">
      <div className="card">
        <div className="fa-head">
          <div>
            <div className="fa-title">Player stats</div>
            <div className="fa-sub">Tap a metric to rank the squad</div>
          </div>
          <div className="fa-leg">
            <span className="fa-chip"><i style={{ background: 'var(--blue)' }} />BLUE</span>
            <span className="fa-chip"><i style={{ background: 'var(--yel)' }} />YEL</span>
          </div>
        </div>

        <div className="seg" ref={segRef}>
          <div className="seg-ind" style={{ left: ind.left, width: ind.width }} />
          {MATCH.faMetrics.map(([k, lab]) => (
            <button
              key={k}
              ref={(el) => { btnRefs.current[k as string] = el; }}
              className={`seg-btn${k === metric ? ' on' : ''}`}
              onClick={() => setMetric(k as Key)}
            >
              {lab}
            </button>
          ))}
        </div>

        <div className="fa-grid">
          {sorted.map((p, idx) => {
            const dec = unit === 'm/s' || (p[metric] as number) % 1 !== 0;
            const r = rating(p);
            return (
              <div key={p.id} className="pc" style={{ '--ac': COL[p.team], animationDelay: `${idx * 0.04}s` } as CSSProperties}>
                <div className={`pc-rate rate ${ratingTier(r)}`} title="Match rating">{r.toFixed(1)}</div>
                <div className="pc-top">
                  <Avatar player={p} size={34} />
                  <span className="pc-id">
                    <span className="pc-name">{p.id}</span>
                    <span className="pc-pos">{`${ppos(p)} · #${pnum(p)}`}</span>
                  </span>
                  <span className="pc-min">{p.mins} min</span>
                </div>
                <div className="pc-feat">
                  <CountUp className="pc-big num" to={p[metric] as number} dur={650} dec={dec} active={active} />
                  <span className="pc-unit">{unit}</span>
                  <span className="pc-flab">{label}</span>
                </div>
                <div className="pc-radar">
                  <span className="pc-ring" />
                  <Radar player={p} activeKey={metric} size={132} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
