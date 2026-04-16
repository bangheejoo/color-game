import type { GameResult } from '../types';

const GAME_URL = 'https://bangheejoo.github.io/color-game/';

/** 완료 화면 공유 메시지 생성 */
export function buildShareMessage(result: GameResult): string {
  const perfect = result.isPerfect ? '\n🎯 퍼펙트 클리어!' : '';
  return `나는 컬러게임에서 ${result.score.toLocaleString()}점!
최고 콤보 ${result.maxCombo} 🔥${perfect}
너는 어디까지 갈 수 있어?
${GAME_URL}`;
}

/** 순위표 공유 메시지 생성 */
export function buildRankShareMessage(rank: number, nickname: string, score: number, combo: number): string {
  return `[컬러게임 순위표]
🏆 ${rank}위 ${nickname}
점수: ${score.toLocaleString()}점 | 최고 콤보: ${combo} 🔥
너도 도전해봐!
${GAME_URL}`;
}

/** 클립보드 복사 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Web Share API 또는 클립보드 폴백 */
export async function shareOrCopy(text: string): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch {
      // 취소했거나 실패 시 클립보드로 폴백
    }
  }
  const ok = await copyToClipboard(text);
  return ok ? 'copied' : 'failed';
}
