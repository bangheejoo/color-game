import { useState, useEffect } from 'react';
import HUD from '../components/HUD';
import ProgressBar from '../components/ProgressBar';
import TileGrid from '../components/TileGrid';
import FeedbackOverlay from '../components/FeedbackOverlay';
import ComboDisplay from '../components/ComboDisplay';
import { useGame } from '../hooks/useGame';
import type { GameResult } from '../types';

interface GamePageProps {
  onGameEnd: (result: GameResult) => void;
}

export default function GamePage({ onGameEnd }: GamePageProps) {
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [tileDisabled, setTileDisabled] = useState(false);

  const { state, startGame, onCorrect, onWrong } = useGame({ onGameEnd });

  // 게임 시작
  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCorrect = () => {
    if (tileDisabled) return;
    setTileDisabled(true);
    setFeedback('correct');
    onCorrect();
    setTimeout(() => {
      setFeedback(null);
      setTileDisabled(false);
    }, 350);
  };

  const handleWrong = () => {
    if (tileDisabled) return;
    setFeedback('wrong');
    onWrong();
    setTimeout(() => setFeedback(null), 400);
  };

  return (
    <div
      className={`flex flex-col items-center gap-3 w-full max-w-[460px] animate-fade-in ${state.shaking ? 'animate-shake' : ''}`}
    >
      <HUD
        level={state.level}
        score={state.score}
        timeLeft={state.timeLeft}
        combo={state.combo}
      />

      <ProgressBar level={state.level} />

      <div className="relative w-full">
        <TileGrid
          tiles={state.tiles}
          gridSize={state.gridSize}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          disabled={tileDisabled || state.phase !== 'playing'}
        />
        <FeedbackOverlay type={feedback} />
        <ComboDisplay combo={state.combo} triggerKey={state.comboPopKey} />
      </div>
    </div>
  );
}
