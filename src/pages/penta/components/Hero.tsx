import { MATCH, MVP, P, fmt, leader } from '../matchData';
import CountUp from './CountUp';

export default function Hero({ active }: { active: boolean }) {
  const b = MATCH.score.BLUE;
  const y = MATCH.score.YEL;
  const res = b > y ? 'BLUE win' : y > b ? 'YEL win' : 'Draw';
  const poss = MATCH.team.metrics.find((m) => m.label === 'Possession')!;

  const totalDist = P.reduce((s, p) => s + p.dist, 0);
  const fastest = leader('top');
  const sprints = P.reduce((s, p) => s + p.sprint, 0);

  const chips = [
    { l: 'Top speed', v: fmt(fastest.top, 'm/s'), u: 'm/s' },
    { l: 'Total distance', v: String(Math.round(totalDist)), u: 'm' },
    { l: 'Sprints', v: fmt(sprints, ''), u: '' },
    { l: 'Possession', v: String(poss.YEL > poss.BLUE ? poss.YEL : poss.BLUE), u: '%' },
  ];

  return (
    <section className="hero">
      <span className="hb hb1" />
      <span className="hb hb2" />
      <div className="hero-grid">
        <div className="side blue">
          <div className="crest">B</div>
          <div className="tname" style={{ color: 'var(--blue)' }}>BLUE</div>
          <div className="poss">{poss.BLUE}% poss</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="score">
            <CountUp className="n blue num" to={b} dur={900} active={active} />
            <span className="dash">–</span>
            <CountUp className="n yel num" to={y} dur={900} active={active} />
          </div>
          <div className="result">{`Full time · ${res} · ${MATCH.durationMin} min`}</div>
        </div>
        <div className="side yel">
          <div className="crest">Y</div>
          <div className="tname" style={{ color: 'var(--yel)' }}>YEL</div>
          <div className="poss">{poss.YEL}% poss</div>
        </div>
      </div>
      <div className="hero-meta">
        <div className="mvp">
          <div className="star">★</div>
          <div>
            <div className="l">Player of the match</div>
            <div className="v">
              {MVP.id}
              <small>{`${fmt(MVP.dist, 'm')}m · ${fmt(MVP.top, 'm/s')} m/s · ${MVP.made} pass`}</small>
            </div>
          </div>
        </div>
        <div className="chips">
          {chips.map((c) => (
            <div className="stat-chip" key={c.l}>
              <div className="l">{c.l}</div>
              <div className="v num">
                {c.v}
                {c.u && <small>{c.u}</small>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
