import type { RankEntry, LeaderboardTab } from '../types';

interface RankTableProps {
  entries: RankEntry[];
  tab: LeaderboardTab;
  loading: boolean;
  error: string | null;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const SKELETON_ROWS = 5;

function SkeletonRow({ i }: { i: number }) {
  return (
    <tr className="border-t border-gray-100 animate-pulse">
      <td className="py-2.5 px-2 w-8">
        <div className="h-4 w-4 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="py-2.5 px-2">
        <div className={`h-3.5 bg-gray-200 rounded ${i % 3 === 0 ? 'w-20' : i % 3 === 1 ? 'w-16' : 'w-24'}`} />
      </td>
      <td className="py-2.5 px-2 w-20">
        <div className="h-3.5 w-14 bg-gray-200 rounded ml-auto" />
      </td>
      <td className="py-2.5 px-2 w-14">
        <div className="h-3 w-8 bg-gray-200 rounded ml-auto" />
      </td>
    </tr>
  );
}

export default function RankTable({ entries, tab, loading, error }: RankTableProps) {
  if (loading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-center w-8">#</th>
              <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-left">닉네임</th>
              <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-right w-20">
                {tab === 'combo' ? '콤보' : '점수'}
              </th>
              <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-right w-14">레벨</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROWS }, (_, i) => <SkeletonRow key={i} i={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 text-center text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
        아직 기록이 없어요 😭<br />가장 먼저 기록을 남겨볼까요?
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-center w-8">#</th>
            <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-left">닉네임</th>
            <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-right w-20">
              {tab === 'combo' ? '콤보' : '점수'}
            </th>
            <th className="py-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 text-right w-14">레벨</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const rank = i + 1;
            return (
              <tr key={entry.id ?? i} className="border-t border-gray-100">
                <td className="py-2.5 px-2 font-bold text-center text-sm w-8">
                  {rank <= 3 ? MEDAL[rank - 1] : rank}
                </td>
                <td className="py-2.5 px-2 min-w-0">
                  <div className="flex flex-row items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-sm truncate">{entry.nickname}</span>
                    {entry.isPerfect && (
                      <span className="text-[0.6rem] bg-[#F2D7D0] text-[#0D0D0D] font-bold px-1.5 py-0.5 rounded-full shrink-0 leading-tight whitespace-nowrap">
                        ✨
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-2 text-right w-20">
                  {tab === 'combo' ? (
                    <span className="font-extrabold text-sm text-orange-500 tabular-nums">{entry.maxCombo}x 🔥</span>
                  ) : (
                    <span className="font-extrabold text-sm tabular-nums">{entry.score.toLocaleString()}</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-right text-gray-400 text-xs w-14 whitespace-nowrap">
                  Lv.{entry.levelReached}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
