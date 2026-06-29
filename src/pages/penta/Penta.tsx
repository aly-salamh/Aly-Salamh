import { useEffect } from 'react';
import './penta.css';
import PentaNav from './components/PentaNav';
import Landing from './components/Landing';
import MatchInsights from './components/MatchInsights';

export default function Penta() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'penta · Match Insights';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="penta-root">
      <PentaNav />
      <Landing />
      <MatchInsights />
      <footer className="pfoot">
        <div className="pfoot-in">
          <div className="brand">
            <span className="mark">p</span>
            <span>penta</span>
          </div>
          <span>Post-match analysis &amp; insights · analyzed on-site by Jetson</span>
        </div>
      </footer>
    </div>
  );
}
