import { useEffect, useRef, useState } from 'react';
import Hero from './Hero';
import Story from './Story';
import Heatmap from './Heatmap';
import TeamBars from './TeamBars';
import Players from './Players';
import Compare from './Compare';
import Awards from './Awards';
import Leaderboard from './Leaderboard';
import PersonalCard from './PersonalCard';

type Tab = 'heat' | 'team' | 'players' | 'compare' | 'board' | 'awards' | 'you';
const TABS: [Tab, string][] = [
  ['heat', 'Heatmaps'],
  ['team', 'Team'],
  ['players', 'Players'],
  ['compare', 'Compare'],
  ['board', 'Leaderboard'],
  ['awards', 'Awards'],
  ['you', 'Your game'],
];

export default function MatchInsights() {
  const [tab, setTab] = useState<Tab>('heat');
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  // Scroll-triggered reveal (replaces the standalone full-screen loader).
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (reduce || !ref.current || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="insights" className="sec" ref={ref}>
      <div className="wrap">
        <div className="sec-h">
          <div className="sec-eyebrow">Post-match · analyzed by Jetson</div>
          <h2 className="sec-title">Match insights</h2>
          <p className="sec-sub">Occupancy, team head-to-head, and a per-player breakdown — straight from the footage.</p>
        </div>

        <div className={`insights-wrap reveal-anim${shown ? ' in' : ''}`}>
          <Hero active={shown} />
          <Story />
          <nav className="tabs">
            {TABS.map(([k, lab]) => (
              <button key={k} className={k === tab ? 'on' : ''} onClick={() => setTab(k)}>
                {lab}
              </button>
            ))}
          </nav>

          {tab === 'heat' && <Heatmap active={shown} />}
          {tab === 'team' && <TeamBars active={shown} />}
          {tab === 'players' && <Players active={shown} />}
          {tab === 'compare' && <Compare />}
          {tab === 'board' && <Leaderboard />}
          {tab === 'awards' && <Awards />}
          {tab === 'you' && <PersonalCard />}
        </div>
      </div>
    </section>
  );
}
