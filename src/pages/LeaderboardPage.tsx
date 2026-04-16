import { useState, useEffect } from 'react';
import RankTable from '../components/RankTable';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { buildShareMessage, shareOrCopy } from '../utils/shareUtils';
import type { LeaderboardTab } from '../types';

interface LeaderboardPageProps {
  onBack: () => void;
}

export default function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [tab, setTab] = useState<LeaderboardTab>('today');
  const [shareMsg, setShareMsg] = useState('');
  const { todayRanks, comboRanks, loading, error, fetchTodayRanks, fetchComboRanks } = useLeaderboard();

  useEffect(() => {
    if (tab === 'today') fetchTodayRanks();
    else fetchComboRanks();
  }, [tab, fetchTodayRanks, fetchComboRanks]);

  const handleShareTop = async () => {
    const entries = tab === 'today' ? todayRanks : comboRanks;
    const top = entries[0];
    if (!top) return;
    const msg = buildShareMessage({ score: top.score, level: top.levelReached, maxCombo: top.maxCombo, isPerfect: top.isPerfect, phase: 'cleared' });
    const res = await shareOrCopy(msg);
    if (res === 'copied') {
      setShareMsg('클립보드에 복사됐어요!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[460px] animate-fade-in">
      <span
        className="inline-block text-[0.68rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background: '#F2D7D0' }}
      >
        Leaderboard
      </span>

      <h1 className="text-[clamp(1.9rem,6vw,2.8rem)] font-extrabold tracking-tight">
        순위<span style={{ color: '#F29199' }}>표</span>
      </h1>

      {/* 탭 */}
      <div className="flex w-full bg-gray-100 rounded-xl p-1">
        <TabBtn active={tab === 'today'} onClick={() => setTab('today')}>오늘의 순위</TabBtn>
        <TabBtn active={tab === 'combo'} onClick={() => setTab('combo')}>최고 콤보</TabBtn>
      </div>

      <RankTable
        entries={tab === 'today' ? todayRanks : comboRanks}
        tab={tab}
        loading={loading}
        error={error}
      />

      <div className="flex gap-2 flex-wrap justify-center w-full">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl text-sm font-bold border border-gray-200 bg-white transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          돌아가기
        </button>
        <button
          onClick={handleShareTop}
          className="px-8 py-3 rounded-xl text-sm font-bold border border-gray-200 bg-white transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          순위 공유
        </button>
      </div>

      {shareMsg && (
        <p className="text-xs text-emerald-600 font-semibold">{shareMsg}</p>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
        active ? 'bg-white shadow-sm text-[#0D0D0D]' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {children}
    </button>
  );
}
