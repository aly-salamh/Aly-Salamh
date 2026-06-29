import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { MATCH, P, Player, levelOf, pnum, ppos, rating, ratingTier, xp } from '../matchData';
import Avatar from './Avatar';
import Radar from './Radar';

type Key = Exclude<keyof Player, 'id' | 'team'>;
const HL: Record<string, string> = { dist: 'DIS', top: 'SPD', made: 'PAS', poss: 'POS' };

export default function Players(_props: { active?: boolean }) {
  const [metric, setMetric] = useState<Key>('dist');
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const segRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{ left: number; width: number }>({ left: 4, width: 0 });

  useLayoutEffect(() => {
    const btn = btnRefs.current[metric];
    if (btn) setInd({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [metric]);

  const hl = HL[metric];
  const sorted = [...P].sort((a, b) => (b[metric] as number) - (a[metric] as number));
  const toggle = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  return (
    <div className="panel">
      <div className="card">
        <div className="fa-head">
          <div>
            <div className="fa-title">Player stats</div>
            <div className="fa-sub">Tap a metric to rank · tap a card to flip</div>
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

        <div className="fc-grid">
          {sorted.map((p, idx) => {
            const blue = p.team === 'BLUE';
            const c1 = blue ? '#1e5fd6' : '#ffc94d';
            const c2 = blue ? '#4f93ff' : '#f5a623';
            const bt = blue ? '#fff' : '#1a1205';
            const r = rating(p);
            const lv = levelOf(p);
            const stats: [string, number | string][] = [
              ['DIS', Math.round(p.dist)],
              ['SPD', p.top.toFixed(1)],
              ['PAS', p.made],
              ['POS', p.poss.toFixed(1)],
              ['TCH', p.touches],
              ['SPR', p.sprint.toFixed(1)],
            ];
            return (
              <div
                key={p.id}
                className={`fc${flipped[p.id] ? ' flip' : ''}`}
                style={{ '--c1': c1, '--c2': c2, '--bt': bt, animationDelay: `${idx * 0.04}s` } as CSSProperties}
                onClick={() => toggle(p.id)}
              >
                <div className="fc-inner">
                  <div className="fc-face fc-front">
                    <div className="fc-band">
                      <div className="fc-rt"><b>{r.toFixed(1)}</b><span>{ppos(p)}</span></div>
                      <Avatar player={p} size={60} />
                    </div>
                    <div className="fc-name">{p.id}</div>
                    <div className="fc-sub">{`${p.team} · #${pnum(p)} · Lv ${lv.level}`}</div>
                    <div className="fc-stats">
                      {stats.map(([lab, val]) => (
                        <div key={lab} className={`fc-st${lab === hl ? ' on' : ''}`}>
                          <b>{val}</b>
                          <span>{lab}</span>
                        </div>
                      ))}
                    </div>
                    <div className="fc-hint">tap to flip ⟳</div>
                  </div>
                  <div className="fc-face fc-back">
                    <div className="bk-h">
                      <Avatar player={p} size={28} />
                      <span className="bk-name">{p.id}</span>
                      <span className={`bk-rt rate ${ratingTier(r)}`}>{r.toFixed(1)}</span>
                    </div>
                    <Radar player={p} activeKey={metric} size={150} />
                    <div className="bk-lvl">
                      <div className="lvl">
                        <span className="lvl-badge">Lv {lv.level}</span>
                        <div className="lvl-bar"><div className="lvl-fill" style={{ width: `${lv.pct}%` }} /></div>
                        <span className="lvl-xp">{xp(p)} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
