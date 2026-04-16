/**
 * 점수 계산
 * 기본 점수 = 남은 시간 * 100
 * 콤보 보너스 = 기본 점수 * (콤보 * 0.2)
 */
export function calcScore(timeLeft: number, combo: number): number {
  const base = timeLeft * 100;
  const bonus = base * (combo * 0.2);
  return Math.round(base + bonus);
}

/** 퍼펙트 클리어 보너스 */
export const PERFECT_BONUS = 5000;
