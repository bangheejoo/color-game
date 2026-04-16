import { useState, useEffect } from 'react';
import RankTable from '../components/RankTable';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { buildShareMessage, shareOrCopy } from '../utils/shareUtils';
import type { LeaderboardTab } from '../types';

interface LeaderboardPageProps {
  onBack: () => void;
}

export default function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [tab, setTab] = useState<LeaderboardTab>('overall');
  const [shareMsg, setShareMsg] = useState('');
  const { overallRanks, todayRanks, comboRanks, loading, error, fetchOverallRanks, fetchTodayRanks, fetchComboRanks } = useLeaderboard();

  useEffect(() => {
    if (tab === 'overall') fetchOverallRanks();
    else if (tab === 'today') fetchTodayRanks();
    else fetchComboRanks();
  }, [tab, fetchOverallRanks, fetchTodayRanks, fetchComboRanks]);

  const handleShareTop = async () => {
    const entries = tab === 'overall' ? overallRanks : tab === 'today' ? todayRanks : comboRanks;
    const top = entries[0];
    if (!top) return;
    const msg = buildShareMessage({ score: top.score, level: top.levelReached, maxCombo: top.maxCombo, isPerfect: top.isPerfect, phase: 'cleared' });
    const res = await shareOrCopy(msg);
    if (res === 'copied') {
      setShareMsg('링크가 복사됐어요❤️ 친구에게 공유해 보세요!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const currentEntries = tab === 'overall' ? overallRanks : tab === 'today' ? todayRanks : comboRanks;

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
        <TabBtn active={tab === 'overall'} onClick={() => setTab('overall')}>종합순위</TabBtn>
        <TabBtn active={tab === 'today'} onClick={() => setTab('today')}>오늘의 순위</TabBtn>
        <TabBtn active={tab === 'combo'} onClick={() => setTab('combo')}>최고 콤보</TabBtn>
      </div>

      <RankTable
        entries={currentEntries}
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
          className="px-8 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #F29199, #F2BDC1)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          공유하기
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
