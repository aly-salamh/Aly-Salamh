// ============================================================
// penta — match data (the "Jetson analysis output") + derive helpers.
// Single source of truth; every section computes from this.
// Ported from the standalone penta/index.html prototype.
// ============================================================

export type TeamId = 'BLUE' | 'YEL';

export interface Player {
  id: string;
  team: TeamId;
  dist: number;   // metres covered
  sprint: number; // high-intensity sprint bursts
  top: number;    // top speed (m/s)
  avg: number;    // avg speed (m/s)
  mins: number;   // minutes played
  poss: number;   // possession (s)
  touches: number;
  made: number;   // passes completed
  recv: number;   // passes received
}

export interface TeamMetric {
  label: string;
  unit: string;
  BLUE: number;
  YEL: number;
}

export interface MatchData {
  score: Record<TeamId, number>;
  durationMin: number;
  team: { metrics: TeamMetric[] };
  radarAxes: [keyof Player, string][];
  faMetrics: [keyof Player, string, string][];
  players: Player[];
}

export const COL: Record<TeamId, string> = { BLUE: '#3b82f6', YEL: '#f5b62a' };

export const MATCH: MatchData = {
  score: { BLUE: 3, YEL: 4 },
  durationMin: 12,
  team: {
    metrics: [
      { label: 'Possession', unit: '%', BLUE: 46.6, YEL: 53.4 },
      { label: 'Passes', unit: '', BLUE: 3, YEL: 3 },
      { label: 'Corners', unit: '', BLUE: 0, YEL: 0 },
    ],
  },
  radarAxes: [
    ['dist', 'Dist'],
    ['top', 'Speed'],
    ['made', 'Pass'],
    ['poss', 'Poss'],
    ['touches', 'Touch'],
  ],
  faMetrics: [
    ['dist', 'Distance', 'm'],
    ['top', 'Top speed', 'm/s'],
    ['made', 'Passes', ''],
    ['poss', 'Possession', 's'],
  ],
  players: [
    { id: 'BLUE1', team: 'BLUE', dist: 42.9, sprint: 0.0, top: 3.6, avg: 1.4, mins: 12, poss: 0.5, touches: 1, made: 0, recv: 1 },
    { id: 'BLUE2', team: 'BLUE', dist: 27.4, sprint: 0.0, top: 3.3, avg: 0.9, mins: 12, poss: 1.1, touches: 1, made: 0, recv: 0 },
    { id: 'BLUE3', team: 'BLUE', dist: 55.1, sprint: 0.0, top: 4.6, avg: 1.8, mins: 12, poss: 2.3, touches: 4, made: 2, recv: 0 },
    { id: 'BLUE4', team: 'BLUE', dist: 47.4, sprint: 0.0, top: 4.9, avg: 1.6, mins: 12, poss: 0.9, touches: 4, made: 0, recv: 2 },
    { id: 'BLUE5', team: 'BLUE', dist: 40.0, sprint: 0.0, top: 3.5, avg: 1.3, mins: 12, poss: 2.9, touches: 5, made: 1, recv: 0 },
    { id: 'YEL1', team: 'YEL', dist: 16.0, sprint: 0.0, top: 1.5, avg: 0.5, mins: 12, poss: 0.0, touches: 0, made: 0, recv: 0 },
    { id: 'YEL2', team: 'YEL', dist: 55.8, sprint: 0.0, top: 5.0, avg: 1.9, mins: 12, poss: 0.1, touches: 1, made: 0, recv: 0 },
    { id: 'YEL3', team: 'YEL', dist: 47.3, sprint: 0.0, top: 3.9, avg: 1.6, mins: 12, poss: 2.9, touches: 4, made: 1, recv: 0 },
    { id: 'YEL4', team: 'YEL', dist: 36.4, sprint: 0.0, top: 4.1, avg: 1.2, mins: 12, poss: 3.8, touches: 5, made: 1, recv: 1 },
    { id: 'YEL5', team: 'YEL', dist: 41.9, sprint: 2.4, top: 5.8, avg: 1.4, mins: 12, poss: 4.4, touches: 5, made: 1, recv: 2 },
  ],
};

export const P = MATCH.players;

// numeric metric keys (exclude id/team)
type NumKey = Exclude<keyof Player, 'id' | 'team'>;

export const fmt = (n: number, u?: string): string => {
  const dec = u === '%' || u === 'm/s' || n % 1 !== 0;
  return dec ? (+n).toFixed(1) : String(Math.round(n));
};

export const maxOf = (k: NumKey): number => Math.max(...P.map((p) => p[k]));

export const leader = (k: NumKey): Player =>
  P.reduce((a, b) => (b[k] > a[k] ? b : a), P[0]);

// rank of player in metric k (1 = best), descending
export const rankOf = (p: Player, k: NumKey): number => {
  const sorted = [...P].sort((a, b) => b[k] - a[k]);
  return sorted.findIndex((x) => x.id === p.id) + 1;
};

export const ord = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// composite MVP score: normalized blend of impact metrics
export const mvpScore = (p: Player): number => {
  const w: Partial<Record<NumKey, number>> = { dist: 1, top: 1, made: 2, poss: 1.5, touches: 1, recv: 0.5 };
  let s = 0;
  (Object.keys(w) as NumKey[]).forEach((k) => {
    const m = maxOf(k) || 1;
    s += (p[k] / m) * (w[k] as number);
  });
  return s;
};

export const MVP: Player = P.reduce((a, b) => (mvpScore(b) > mvpScore(a) ? b : a), P[0]);

export interface AwardDef {
  ico: string;
  ttl: string;
  key: NumKey | null;
  unit: string;
  why: string;
}

export const AWARDS: AwardDef[] = [
  { ico: '★', ttl: 'Player of the match', key: null, unit: '', why: 'Highest overall impact across distance, passing and possession.' },
  { ico: '⚡', ttl: 'Top speed', key: 'top', unit: 'm/s', why: 'Fastest sprint recorded in the match.' },
  { ico: '🔋', ttl: 'Engine', key: 'dist', unit: 'm', why: 'Covered the most ground over the full match.' },
  { ico: '🎯', ttl: 'Playmaker', key: 'made', unit: '', why: 'Most completed passes — pulled the strings.' },
  { ico: '🧲', ttl: 'Possession king', key: 'poss', unit: 's', why: 'Held the ball longer than anyone else.' },
  { ico: '💨', ttl: 'Sprinter', key: 'sprint', unit: '', why: 'Most high-intensity sprint bursts.' },
];

export const awardWinner = (a: AwardDef): Player => (a.key ? leader(a.key) : MVP);

// templated "story of the match"
export const storyText = (): string => {
  const b = MATCH.score.BLUE;
  const y = MATCH.score.YEL;
  const winner: TeamId | null = b > y ? 'BLUE' : y > b ? 'YEL' : null;
  const poss = MATCH.team.metrics.find((m) => m.label === 'Possession')!;
  const possTeam: TeamId = poss.YEL > poss.BLUE ? 'YEL' : 'BLUE';
  const possVal = Math.max(poss.YEL, poss.BLUE);
  const fastest = leader('top');
  const engine = leader('dist');
  const playmaker = leader('made');

  let s = '';
  if (winner) {
    s += `**${winner}** edged it **${Math.max(b, y)}–${Math.min(b, y)}** after ${MATCH.durationMin} hard-fought minutes. `;
  } else {
    s += `Neither side could be separated — **${b}–${y}** after ${MATCH.durationMin} minutes. `;
  }
  s += `${possTeam} controlled the tempo with **${possVal}%** of possession. `;
  s += `**${fastest.id}** was the quickest on the pitch, hitting **${fmt(fastest.top, 'm/s')} m/s**, `;
  s += `while **${engine.id}** covered the most ground at **${Math.round(engine.dist)} m**. `;
  if (playmaker.made > 0) s += `**${playmaker.id}** pulled the strings with ${playmaker.made} completed pass${playmaker.made > 1 ? 'es' : ''}. `;
  s += `Pick of the bunch, though, was **${MVP.id}** — Jetson's player of the match.`;
  return s;
};

// ============================================================
// GAMIFICATION — rating /10, XP + levels, badges, leaderboard.
// All deterministic from the match data.
// ============================================================
const MAX_MVP = Math.max(...P.map((p) => mvpScore(p))) || 1;

/** FIFA-style match rating out of 10 (5.0–9.9), from normalized impact. */
export const rating = (p: Player): number => {
  const r = mvpScore(p) / MAX_MVP; // 0..1
  return Math.round(Math.min(9.9, Math.max(5.0, 5.2 + r * 4.5)) * 10) / 10;
};

/** XP earned this match from raw contributions. */
export const xp = (p: Player): number =>
  Math.round(p.dist * 3 + p.made * 60 + p.touches * 20 + p.sprint * 40 + p.poss * 15 + p.recv * 25 + (p.id === MVP.id ? 150 : 0) + rating(p) * 30);

const XP_PER_LEVEL = 220;
export interface Level {
  level: number;
  into: number;       // xp into current level
  per: number;        // xp per level
  pct: number;        // progress 0..100
  remaining: number;  // xp to next level
}
export const levelOf = (p: Player): Level => {
  const x = xp(p);
  const level = Math.floor(x / XP_PER_LEVEL) + 1;
  const into = x % XP_PER_LEVEL;
  return { level, into, per: XP_PER_LEVEL, pct: (into / XP_PER_LEVEL) * 100, remaining: XP_PER_LEVEL - into };
};

export interface Badge {
  key: string;
  ico: string;
  name: string;
  desc: string;
  earned: (p: Player) => boolean;
}
export const BADGES: Badge[] = [
  { key: 'mvp', ico: '⭐', name: 'MVP', desc: 'Player of the match', earned: (p) => p.id === MVP.id },
  { key: 'pace', ico: '⚡', name: 'Speed Demon', desc: 'Hit 4.5+ m/s top speed', earned: (p) => p.top >= 4.5 },
  { key: 'engine', ico: '🔋', name: 'Engine', desc: 'Covered 47m+ on the pitch', earned: (p) => p.dist >= 47 },
  { key: 'playmaker', ico: '🎯', name: 'Playmaker', desc: 'Completed 2+ passes', earned: (p) => p.made >= 2 },
  { key: 'magnet', ico: '🧲', name: 'Ball Magnet', desc: '3s+ on the ball', earned: (p) => p.poss >= 3 },
  { key: 'sprinter', ico: '💨', name: 'Sprinter', desc: 'Explosive sprint bursts', earned: (p) => p.sprint > 0 },
  { key: 'provider', ico: '🤝', name: 'Provider', desc: 'Received 2+ passes', earned: (p) => p.recv >= 2 },
  { key: 'busy', ico: '🔥', name: 'Involved', desc: '5+ touches in the game', earned: (p) => p.touches >= 5 },
];
export const badgesFor = (p: Player) => BADGES.map((b) => ({ ...b, on: b.earned(p) }));

export interface BoardRow {
  rank: number;
  player: Player;
  rating: number;
  level: number;
  xp: number;
}
export const leaderboard = (): BoardRow[] =>
  [...P]
    .sort((a, b) => rating(b) - rating(a) || xp(b) - xp(a))
    .map((player, i) => ({ rank: i + 1, player, rating: rating(player), level: levelOf(player).level, xp: xp(player) }));

/** rating tier → css class suffix for colouring the pill */
export const ratingTier = (r: number): 'hi' | 'mid' | 'lo' => (r >= 8 ? 'hi' : r >= 6.5 ? 'mid' : 'lo');

// occupancy points per team for the heatmap: [xFrac, yFrac, weight]
export const HEAT: Record<TeamId, [number, number, number][]> = {
  BLUE: [[0.28, 0.5, 1], [0.18, 0.32, 0.7], [0.35, 0.66, 0.8], [0.45, 0.5, 0.9], [0.22, 0.7, 0.6], [0.4, 0.3, 0.7], [0.12, 0.5, 0.5]],
  YEL: [[0.7, 0.5, 1], [0.82, 0.36, 0.8], [0.62, 0.64, 0.85], [0.55, 0.5, 0.9], [0.78, 0.7, 0.7], [0.66, 0.3, 0.6], [0.88, 0.52, 0.6]],
};
