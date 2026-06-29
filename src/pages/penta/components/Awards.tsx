import { CSSProperties } from 'react';
import { AWARDS, COL, awardWinner, fmt, Player } from '../matchData';

export default function Awards() {
  return (
    <div className="panel">
      <div className="card">
        <div className="card-h">Match awards</div>
        <div className="card-s">Standout performers · auto-selected by Jetson from the match data</div>
        <div className="aw-grid">
          {AWARDS.map((d) => {
            const p: Player = awardWinner(d);
            const key = d.key as Exclude<keyof Player, 'id' | 'team'> | null;
            return (
              <div className="aw" key={d.ttl} style={{ '--ac': COL[p.team] } as CSSProperties}>
                <div className="aw-top">
                  <div className="aw-ico">{d.ico}</div>
                  <div>
                    <div className="aw-ttl">{d.ttl}</div>
                    <div className="aw-win">{p.id}</div>
                  </div>
                </div>
                {key && (
                  <div className="aw-val">
                    <span className="v num">{fmt(p[key], d.unit)}</span>
                    <span className="u">{d.unit}</span>
                  </div>
                )}
                <div className="aw-why">{d.why}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
