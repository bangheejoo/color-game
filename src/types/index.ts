// ── 화면 상태 ────────────────────────────────────────
export type Screen = 'start' | 'game' | 'result' | 'leaderboard';

// ── 게임 상태 ────────────────────────────────────────
export interface GameState {
  level: number;
  score: number;
  combo: number;
  maxCombo: number;
  isPerfect: boolean;
  timeLeft: number;
  tiles: TileData[];
  gridSize: number;
  oddIndex: number;
  phase: 'playing' | 'timeout' | 'cleared';
  shaking: boolean;
  comboPopKey: number; // 콤보 팝업 트리거용 key
}

// ── 타일 데이터 ──────────────────────────────────────
export interface TileData {
  id: number;
  color: string;
  isOdd: boolean;
}

// ── 결과 요약 ────────────────────────────────────────
export interface GameResult {
  score: number;
  level: number;
  maxCombo: number;
  isPerfect: boolean;
  phase: 'timeout' | 'cleared';
}

// ── 순위 항목 ────────────────────────────────────────
export interface RankEntry {
  id?: string;
  nickname: string;
  score: number;
  levelReached: number;
  maxCombo: number;
  isPerfect: boolean;
  date: Date;
}

// ── 순위표 탭 ────────────────────────────────────────
export type LeaderboardTab = 'overall' | 'today' | 'combo';
