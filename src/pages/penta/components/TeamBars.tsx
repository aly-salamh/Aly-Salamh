import { CSSProperties, useEffect, useState } from 'react';
import { COL, MATCH } from '../matchData';
import CountUp from './CountUp';

export default function TeamBars({ active }: { active: boolean }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setGo(true), 120);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="panel">
      <div className="card ta-dash">
        <div className="ta-fx">
          <span className="tblob tb1" />
          <span className="tblob tb2" />
        </div>
        <div className="ta-head">
          <div>
            <div className="ta-title">Team analysis</div>
            <div className="ta-sub">BLUE vs YEL · head to head</div>
          </div>
          <div className="ta-leg">
            <span className="ta-chip"><i style={{ background: 'var(--blue)' }} />BLUE</span>
            <span className="ta-chip"><i style={{ background: 'var(--yel)' }} />YEL</span>
          </div>
        </div>
        <div className="ta-rows">
          {MATCH.team.metrics.map((m, idx) => {
            const b = m.BLUE;
            const y = m.YEL;
            const tot = b + y;
            const bp = tot > 0 ? (b / tot) * 100 : 50;
            const yp = tot > 0 ? (y / tot) * 100 : 50;
            const dec = m.unit === '%' || b % 1 !== 0 || y % 1 !== 0;
            const u = m.unit ? <span className="u">{m.unit}</span> : null;
            return (
              <div className="ta-row" key={m.label} style={{ animationDelay: `${idx * 0.12}s` }}>
                <div className="ta-mlabel">{m.label}</div>
                <div className="ta-line">
                  <div className="ta-num l num" style={{ color: COL.BLUE }}>
                    <CountUp to={b} dur={900} dec={dec} active={active} />
                    {u}
                  </div>
                  <div className="ta-bar">
                    <div
                      className={`ta-fill b${b >= y && tot > 0 ? ' win' : ''}`}
                      style={{ '--g': COL.BLUE, width: go ? `${bp}%` : '0%' } as CSSProperties}
                    />
                    <div
                      className={`ta-fill y${y > b && tot > 0 ? ' win' : ''}`}
                      style={{ '--g': COL.YEL, width: go ? `${yp}%` : '0%' } as CSSProperties}
                    />
                    <div className="ta-meet" style={{ left: `${bp}%`, opacity: go && tot > 0 ? 0.85 : 0 }} />
                  </div>
                  <div className="ta-num r num" style={{ color: COL.YEL }}>
                    <CountUp to={y} dur={900} dec={dec} active={active} />
                    {u}
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
