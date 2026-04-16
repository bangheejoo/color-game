import { useState } from 'react';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import type { Screen, GameResult } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [result, setResult] = useState<GameResult | null>(null);

  const handleGameEnd = (r: GameResult) => {
    setResult(r);
    setScreen('result');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-dvh w-full px-4 py-6">
      {screen === 'start' && (
        <StartPage
          onStart={() => setScreen('game')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'game' && (
        <GamePage key={Date.now()} onGameEnd={handleGameEnd} />
      )}

      {screen === 'result' && result && (
        <ResultPage
          result={result}
          onRestart={() => setScreen('game')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardPage
          onBack={() => setScreen('start')}
          myResult={result}
        />
      )}
    </main>
  );
}
