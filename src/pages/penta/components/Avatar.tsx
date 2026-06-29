import { Player, pnum } from '../matchData';

/** Jersey-style profile avatar: team-gradient disc with the player's number. */
export default function Avatar({ player, size = 44 }: { player: Player; size?: number }) {
  const g = player.team === 'BLUE' ? ['#1e5fd6', '#4f93ff'] : ['#ffc94d', '#f5a623'];
  const id = `av${player.id}${size}`;
  return (
    <svg className="ava" width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={g[0]} />
          <stop offset="1" stopColor={g[1]} />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="21" fill={`url(#${id})`} stroke="rgba(255,255,255,.18)" />
      <text x="22" y="29" textAnchor="middle" fontSize="19" fontWeight="800" fill="#04140a">{pnum(player)}</text>
    </svg>
  );
}
