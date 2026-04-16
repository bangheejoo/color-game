import { getDelta } from './gameConfig';
import type { TileData } from '../types';

interface HSL { h: number; s: number; l: number }

function randomBaseColor(): HSL {
  return {
    h: Math.floor(Math.random() * 360),
    s: 55 + Math.floor(Math.random() * 25),
    l: 45 + Math.floor(Math.random() * 20),
  };
}

function hsl({ h, s, l }: HSL): string {
  return `hsl(${h},${s}%,${l}%)`;
}

/** 주어진 레벨과 그리드 크기로 타일 배열 생성 */
export function buildTiles(level: number, gridSize: number): { tiles: TileData[]; oddIndex: number } {
  const base = randomBaseColor();
  const delta = getDelta(level);
  const total = gridSize * gridSize;
  const oddIndex = Math.floor(Math.random() * total);

  const oddColor: HSL = { ...base, l: Math.min(90, Math.max(10, base.l + delta)) };

  const tiles: TileData[] = Array.from({ length: total }, (_, i) => ({
    id: i,
    color: i === oddIndex ? hsl(oddColor) : hsl(base),
    isOdd: i === oddIndex,
  }));

  return { tiles, oddIndex };
}
