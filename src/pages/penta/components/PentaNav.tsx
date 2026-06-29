function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function PentaNav() {
  return (
    <header className="pnav">
      <div className="pnav-in">
        <div className="brand">
          <span className="mark">p</span>
          <span>penta <small>match insights</small></span>
        </div>
        <nav className="pnav-links">
          <a onClick={() => scrollTo('how')}>How it works</a>
          <a onClick={() => scrollTo('insights')}>Insights</a>
          <button className="btn" onClick={() => scrollTo('insights')}>See match insights</button>
        </nav>
      </div>
    </header>
  );
}
