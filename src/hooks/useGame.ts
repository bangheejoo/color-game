import { useState, useCallback, useRef } from 'react';
import { buildTiles } from '../utils/colorUtils';
import { calcScore, PERFECT_BONUS } from '../utils/scoreUtils';
import { getGridSize, MAX_LEVEL, TIME_PER_LEVEL } from '../utils/gameConfig';
import { useTimer } from './useTimer';
import type { GameState, GameResult } from '../types';

const INITIAL_STATE: GameState = {
  level: 1,
  score: 0,
  combo: 0,
  maxCombo: 0,
  isPerfect: true,
  timeLeft: TIME_PER_LEVEL,
  tiles: [],
  gridSize: 3,
  oddIndex: 0,
  phase: 'playing',
  shaking: false,
  comboPopKey: 0,
};

interface UseGameOptions {
  onGameEnd: (result: GameResult) => void;
}

export function useGame({ onGameEnd }: UseGameOptions) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // 현재 상태를 ref로도 유지 (타이머 콜백에서 stale closure 방지)
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── 새 타일 생성 ────────────────────────────────────
  const buildLevel = useCallback((level: number) => {
    const gridSize = getGridSize(level);
    const { tiles, oddIndex } = buildTiles(level, gridSize);
    return { tiles, gridSize, oddIndex };
  }, []);

  // ── 타이머 콜백 ─────────────────────────────────────
  const handleTick = useCallback((remaining: number) => {
    setState(s => ({ ...s, timeLeft: remaining }));
  }, []);

  const handleExpire = useCallback(() => {
    const s = stateRef.current;
    onGameEnd({
      score: s.score,
      level: s.level,
      maxCombo: s.maxCombo,
      isPerfect: false, // 45레벨 완주하지 않으면 퍼펙트 불가
      phase: 'timeout',
    });
    setState(s => ({ ...s, phase: 'timeout' }));
  }, [onGameEnd]);

  const { start: startTimer, stop: stopTimer } = useTimer({
    initialSeconds: TIME_PER_LEVEL,
    onTick: handleTick,
    onExpire: handleExpire,
  });

  // ── 게임 시작 ────────────────────────────────────────
  const startGame = useCallback(() => {
    const { tiles, gridSize, oddIndex } = buildLevel(1);
    setState({
      ...INITIAL_STATE,
      tiles,
      gridSize,
      oddIndex,
    });
    startTimer(TIME_PER_LEVEL);
  }, [buildLevel, startTimer]);

  // ── 정답 타일 클릭 ───────────────────────────────────
  const onCorrect = useCallback(() => {
    stopTimer();
    setState(prev => {
      const newCombo = prev.combo + 1;
      const gained = calcScore(prev.timeLeft, prev.combo);
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);
      const nextLevel = prev.level + 1;

      if (nextLevel > MAX_LEVEL) {
        // 45레벨 클리어
        const bonus = prev.isPerfect ? PERFECT_BONUS : 0;
        const finalScore = prev.score + gained + bonus;
        onGameEnd({
          score: finalScore,
          level: prev.level,
          maxCombo: newMaxCombo,
          isPerfect: prev.isPerfect,
          phase: 'cleared',
        });
        return { ...prev, score: finalScore, combo: newCombo, maxCombo: newMaxCombo, phase: 'cleared', comboPopKey: prev.comboPopKey + 1 };
      }

      const { tiles, gridSize, oddIndex } = buildLevel(nextLevel);
      return {
        ...prev,
        level: nextLevel,
        score: prev.score + gained,
        combo: newCombo,
        maxCombo: newMaxCombo,
        timeLeft: TIME_PER_LEVEL,
        tiles,
        gridSize,
        oddIndex,
        comboPopKey: prev.comboPopKey + 1,
      };
    });

    // 다음 레벨 타이머 시작 (setState 후 약간 지연)
    setTimeout(() => {
      if (stateRef.current.phase === 'playing') {
        startTimer(TIME_PER_LEVEL);
      }
    }, 0);
  }, [stopTimer, startTimer, buildLevel, onGameEnd]);

  // ── 오답 타일 클릭 ───────────────────────────────────
  const onWrong = useCallback(() => {
    setState(prev => ({
      ...prev,
      combo: 0,
      isPerfect: false,
      shaking: true,
    }));
    // 흔들림 애니메이션 후 초기화
    setTimeout(() => {
      setState(prev => ({ ...prev, shaking: false }));
    }, 400);
  }, []);

  return { state, startGame, onCorrect, onWrong };
}
