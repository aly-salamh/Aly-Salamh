import { CSSProperties, Fragment, useState } from 'react';
import { COL, MVP, P, Player, badgesFor, fmt, levelOf, ord, rankOf, rating, xp } from '../matchData';
import Radar from './Radar';
import Avatar from './Avatar';

type Key = Exclude<keyof Player, 'id' | 'team'>;

function renderBold(text: string) {
  const parts = text.split('**');
  return parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>));
}

const rankClass = (r: number) => (r <= 3 ? 'pg-rank-good' : r <= 6 ? 'pg-rank-mid' : 'pg-rank-low');

const STAT_KEYS: [string, Key, string][] = [
  ['Distance', 'dist', 'm'],
  ['Top speed', 'top', 'm/s'],
  ['Passes', 'made', ''],
  ['Possession', 'poss', 's'],
];

const LABELS: Record<string, string> = { dist: 'distance covered', top: 'top speed', made: 'passing', poss: 'ball control' };

export default function PersonalCard() {
  const [id, setId] = useState<string>(MVP.id);
  const p = P.find((x) => x.id === id)!;

  const keys: Key[] = ['dist', 'top', 'made', 'poss'];
  let best: Key = keys[0];
  let worst: Key = keys[0];
  keys.forEach((k) => {
    if (rankOf(p, k) < rankOf(p, best)) best = k;
    if (rankOf(p, k) > rankOf(p, worst)) worst = k;
  });
  const br = rankOf(p, best);
  const wr = rankOf(p, worst);
  const good = `You ranked **${ord(br)}** in the squad for **${LABELS[best]}**` + (br <= 3 ? ' — a standout part of your game.' : '. Solid contribution.');
  const tip = wr > 4
    ? `Your **${LABELS[worst]}** came in **${ord(wr)}** of ${P.length}. Target this next match to round out your game.`
    : `Well balanced across the board — keep pushing your **${LABELS[worst]}** to climb even higher.`;

  return (
    <div className="panel">
      <div className="card">
        <div className="pg-top">
          <div className="card-h">Your game</div>
          <select className="pg-pick" value={id} onChange={(e) => setId(e.target.value)}>
            {P.map((pl) => (
              <option key={pl.id} value={pl.id}>{pl.id}</option>
            ))}
          </select>
        </div>
        <div className="card-s">{`${p.id} · ${p.team} · ${p.mins} min played`}</div>

        {(() => {
          const r = rating(p);
          const lv = levelOf(p);
          return (
            <div className="pg-hero">
              <Avatar player={p} size={56} />
              <div className="pg-rate">
                <span className="big">{r.toFixed(1)}</span>
                <span className="cap">Rating</span>
              </div>
              <div className="pg-lvlbox">
                <div className="lvl">
                  <span className="lvl-badge">Level {lv.level}</span>
                  <div className="lvl-bar"><div className="lvl-fill" style={{ width: `${lv.pct}%` }} /></div>
                  <span className="lvl-xp">{xp(p)} XP</span>
                </div>
                <div className="card-s" style={{ margin: '8px 0 0' }}>{`${lv.remaining} XP to level ${lv.level + 1}`}</div>
              </div>
            </div>
          );
        })()}

        <div className="pg-body">
          <div className="pg-radar">
            <span className="pc-ring" style={{ '--ac': COL[p.team] } as CSSProperties} />
            <Radar player={p} activeKey={null} size={200} />
          </div>
          <div className="pg-stats">
            {STAT_KEYS.map(([l, k, u]) => {
              const r = rankOf(p, k);
              return (
                <div className="pg-stat" key={l}>
                  <div className="l">{l}</div>
                  <div className="v num">
                    {fmt(p[k], u)}
                    {u && <small>{u}</small>}
                  </div>
                  <div className={`rank ${rankClass(r)}`}>{`${ord(r)} of ${P.length} in the match`}</div>
                </div>
              );
            })}
          </div>
          <div className="pg-insight">
            <div className="pg-note good">
              <span className="lab">What went well</span>
              <span>{renderBold(good)}</span>
            </div>
            <div className="pg-note tip">
              <span className="lab">Improve next time</span>
              <span>{renderBold(tip)}</span>
            </div>
            <div>
              <div className="pg-sublab">Badges {`· ${badgesFor(p).filter((b) => b.on).length}/${badgesFor(p).length} earned`}</div>
              <div className="badges">
                {badgesFor(p).map((b) => (
                  <div className={`badge${b.on ? '' : ' off'}`} key={b.key}>
                    <span className="bi">{b.ico}</span>
                    <span>
                      <span className="bn">{b.name}</span>
                      <span className="bd" style={{ display: 'block' }}>{b.on ? b.desc : 'Locked'}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
