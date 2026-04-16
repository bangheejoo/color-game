export const MAX_LEVEL = 45;
export const TIME_PER_LEVEL = 5; // 초

/** 레벨에 따른 그리드 크기 (3x3 ~ 7x7) */
export function getGridSize(level: number): number {
  if (level <= 5)  return 3;
  if (level <= 15) return 4;
  if (level <= 25) return 5;
  if (level <= 35) return 6;
  return 7;
}

/** 레벨에 따른 색상 차이 (레벨 높을수록 작아짐: 30 → 5) */
export function getDelta(level: number): number {
  const min = 5;
  const max = 30;
  return Math.max(min, Math.round(max - (level - 1) * ((max - min) / (MAX_LEVEL - 1))));
}
