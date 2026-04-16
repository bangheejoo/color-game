import type { RankEntry, LeaderboardTab } from '../types';
import { buildRankShareMessage, shareOrCopy } from '../utils/shareUtils';
import { useState } from 'react';

interface RankTableProps {
  entries: RankEntry[];
  tab: LeaderboardTab;
  loading: boolean;
  error: string | null;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function RankTable({ entries, tab, loading, error }: RankTableProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleShare = async (entry: RankEntry, rank: number) => {
    const msg = buildRankShareMessage(rank, entry.nickname, entry.score, entry.maxCombo);
    const result = await shareOrCopy(msg);
    if (result === 'copied') {
      setCopiedIdx(rank);
      setTimeout(() => setCopiedIdx(null), 1500);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400">
        불러오는 중…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400">
        아직 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">#</th>
            <th className="py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-left">닉네임</th>
            {tab === 'today' ? (
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">점수</th>
            ) : (
              <th className="py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">콤보</th>
            )}
            <th className="py-2 px-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">레벨</th>
            <th className="py-2 px-3 w-8" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const rank = i + 1;
            return (
              <tr key={entry.id ?? i} className="border-t border-gray-100">
                <td className="py-2 px-3 font-bold text-center">
                  {rank <= 3 ? MEDAL[rank - 1] : rank}
                </td>
                <td className="py-2 px-3">
                  <span className="font-medium">{entry.nickname}</span>
                  {entry.isPerfect && (
                    <span className="ml-1.5 text-xs bg-[#F2D7D0] text-[#0D0D0D] font-bold px-1.5 py-0.5 rounded-full">
                      PERFECT
                    </span>
                  )}
                </td>
                {tab === 'today' ? (
                  <td className="py-2 px-3 font-extrabold text-right">{entry.score.toLocaleString()}</td>
                ) : (
                  <td className="py-2 px-3 font-extrabold text-right text-orange-500">{entry.maxCombo}x 🔥</td>
                )}
                <td className="py-2 px-3 text-gray-400 text-right text-xs">Lv.{entry.levelReached}</td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => handleShare(entry, rank)}
                    className="text-gray-400 hover:text-gray-700 transition-colors text-base"
                    title="공유"
                  >
                    {copiedIdx === rank ? '✓' : '↗'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
