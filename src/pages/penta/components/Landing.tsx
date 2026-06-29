function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const STEPS = [
  { n: '1', h: 'Play your match', p: 'Just book a pitch and play. Ceiling cameras capture every minute — no wearables, no setup, nothing to think about.' },
  { n: '2', h: 'Jetson analyzes the footage', p: 'The moment you finish, an on-site NVIDIA Jetson tracks every player and the ball, turning the video into rich match data.' },
  { n: '3', h: 'Get your insights', p: 'Minutes later your match story, team head-to-head, heatmaps, awards and personal stats are ready to explore and share.' },
];

const FEATS = [
  { ic: '🔥', h: 'Occupancy heatmaps', p: 'See exactly where each side controlled the pitch.' },
  { ic: '⚔️', h: 'Team head-to-head', p: 'Possession, passes and more, side by side.' },
  { ic: '🎯', h: 'Player radars', p: 'Rank the squad by distance, speed, passing or possession.' },
  { ic: '🏅', h: 'Match awards', p: 'MVP, top speed, engine, playmaker — auto-selected.' },
  { ic: '📈', h: 'Your performance', p: 'Personal stats, squad rank and tips to improve.' },
  { ic: '⚡', h: 'Ready in minutes', p: 'Insights land on your phone right after full time.' },
];

const PROG = [
  { ic: '⭐', h: 'Match rating /10', p: 'Every performance gets a single FIFA-style score, computed from your stats.' },
  { ic: '📊', h: 'XP & levels', p: 'Earn XP from distance, passes and big moments — level up game after game.' },
  { ic: '🎖️', h: 'Badges to collect', p: 'Unlock achievements like Speed Demon, Engine and Playmaker.' },
  { ic: '🏆', h: 'Squad leaderboard', p: 'See who topped the match and chase the number one spot next time.' },
];

export default function Landing() {
  return (
    <>
      <section className="lhero">
        <span className="hb hb1" />
        <span className="hb hb2" />
        <div className="wrap lhero-in">
          <span className="pill"><span className="live-dot" />Powered by on-site Jetson AI</span>
          <h1>
            Every match,<br /><span className="grad">analyzed.</span>
          </h1>
          <p className="lead">
            Play your 5-a-side game at penta and walk away with pro-level insights — heatmaps, team
            head-to-head, player radars and awards, generated automatically from the footage.
          </p>
          <div className="cta">
            <button className="btn" onClick={() => scrollTo('insights')}>See your match insights ↓</button>
            <button className="btn ghost" onClick={() => scrollTo('how')}>How it works</button>
          </div>
        </div>
      </section>

      <section id="how" className="sec">
        <div className="wrap">
          <div className="sec-h">
            <div className="sec-eyebrow">How it works</div>
            <h2 className="sec-title">From kickoff to insights in three steps</h2>
            <p className="sec-sub">No wearables. No manual tagging. Just play — the rest is automatic.</p>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="n">{s.n}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-h">
            <div className="sec-eyebrow">What you get</div>
            <h2 className="sec-title">Insights that make every game count</h2>
          </div>
          <div className="feats">
            {FEATS.map((f) => (
              <div className="feat" key={f.h}>
                <div className="ic">{f.ic}</div>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="sec-h">
          <div className="sec-eyebrow">Level up</div>
          <h2 className="sec-title">Every game makes you better</h2>
          <p className="sec-sub">penta turns each match into progress — a rating, XP, badges and a spot on the squad leaderboard.</p>
        </div>
        <div className="feats">
          {PROG.map((f) => (
            <div className="feat" key={f.h}>
              <div className="ic">{f.ic}</div>
              <h4>{f.h}</h4>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
