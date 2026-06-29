import { COL, leaderboard, ratingTier } from '../matchData';

export default function Leaderboard() {
  const rows = leaderboard();
  return (
    <div className="panel">
      <div className="card">
        <div className="card-h">Squad leaderboard</div>
        <div className="card-s">Ranked by match rating · earn XP and climb every game</div>
        <div className="bd-head">
          <span>#</span>
          <span>Player</span>
          <span>Lvl</span>
          <span className="h-xp">XP</span>
          <span>Rating</span>
        </div>
        <div className="board">
          {rows.map((row) => (
            <div className={`bd-row${row.rank <= 3 ? ' top' : ''}`} key={row.player.id}>
              <div className={`bd-rank${row.rank <= 3 ? ` m${row.rank}` : ''}`}>{row.rank}</div>
              <div className="bd-who">
                <span className="bd-dot" style={{ background: COL[row.player.team] }} />
                <span className="bd-name">{row.player.id}</span>
                <span className="bd-team">{row.player.team}</span>
              </div>
              <div className="bd-lvl">Lv {row.level}</div>
              <div className="bd-xp">{row.xp} XP</div>
              <div className={`rate ${ratingTier(row.rating)}`}>{row.rating.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
