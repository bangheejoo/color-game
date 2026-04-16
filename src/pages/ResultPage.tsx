import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { buildShareMessage, shareOrCopy } from '../utils/shareUtils';
import { MAX_LEVEL } from '../utils/gameConfig';
import type { GameResult } from '../types';

interface ResultPageProps {
  result: GameResult;
  onRestart: () => void;
  onLeaderboard: () => void;
}

export default function ResultPage({ result, onRestart, onLeaderboard }: ResultPageProps) {
  const { saveScore } = useLeaderboard();
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  const isCleared = result.phase === 'cleared';
  const shareText = buildShareMessage(result);

  const handleSave = async () => {
    if (!nickname.trim()) return;
    setSaving(true);
    const ok = await saveScore(nickname, result.score, result.level, result.maxCombo, result.isPerfect);
    setSaving(false);
    if (ok) setSaved(true);
  };

  const handleShare = async () => {
    const res = await shareOrCopy(shareText);
    if (res === 'copied') {
      setShareMsg('링크가 복사됐어요❤️ 친구에게 공유해 보세요!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[460px] text-center animate-fade-in">
      <span
        className="inline-block text-[0.68rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background: '#F2D7D0' }}
      >
        Result
      </span>

      {/* 타이틀 */}
      <h1 className="text-[clamp(1.9rem,6vw,2.8rem)] font-extrabold tracking-tight">
        {isCleared ? '🎉 CLEAR!' : '⏰ TIME OVER'}
      </h1>

      {/* 퍼펙트 뱃지 */}
      {isCleared && result.isPerfect && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full animate-perfect-glow"
          style={{ background: '#F2BDC1' }}
        >
          <span className="text-lg">✨</span>
          <span className="font-extrabold text-sm tracking-wide">PERFECT CLEAR! +5,000점</span>
          <span className="text-lg">✨</span>
        </div>
      )}

      <p className="text-gray-500 text-sm font-semibold">
        {isCleared
          ? `${MAX_LEVEL}레벨을 모두 완료했습니다!`
          : `${result.level}레벨에서 멈췄어요! 다시 도전해볼까요?`}
      </p>

      {/* 결과 카드 */}
      <div className="w-full bg-white border border-gray-200 rounded-xl px-6 py-5 flex flex-col gap-3">
        <ResultRow label="최종 점수" value={result.score.toLocaleString()} bold />
        <hr className="border-gray-300" />
        <ResultRow label="최종 레벨" value={`Lv.${result.level}`} />
        <ResultRow label="최고 콤보" value={`${result.maxCombo}🔥`} />
      </div>

      {/* 닉네임 저장 (항상 표시) */}
      <div className="flex flex-col gap-2 items-center w-full">
        {!saved ? (
          <>
            <p className="text-xs text-gray-400">닉네임을 입력하고 기록을 저장해 보세요</p>
            <div className="flex gap-2 w-full">
              <input
                type="text"
                maxLength={6}
                placeholder="닉네임 (최대 6자)"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#F29199] transition-colors"
              />
              <button
                onClick={handleSave}
                disabled={saving || !nickname.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-colors"
                style={{ background: '#0D0D0D' }}
              >
                {saving ? '저장 중…' : '저장'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm font-semibold text-emerald-600">✓ 기록이 저장되었습니다!</p>
        )}
      </div>

      {/* 버튼 — 2행 그리드: 다시하기+순위표 / 공유 풀너비 */}
      <div className="flex flex-col gap-2 w-full">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRestart}
            className="py-3 rounded-xl text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            style={{ background: '#0D0D0D' }}
          >
            다시하기
          </button>
          <button
            onClick={onLeaderboard}
            className="py-3 rounded-xl text-sm font-bold border border-gray-200 bg-white transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            순위표
          </button>
        </div>
        <button
          onClick={handleShare}
          className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #F29199, #F2BDC1)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          친구에게 공유하기
        </button>
      </div>

      {shareMsg && (
        <p className="text-xs text-emerald-600 font-semibold">{shareMsg}</p>
      )}
    </div>
  );
}

function ResultRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>{label}</span>
      <span className={bold ? 'font-extrabold text-lg text-[#0D0D0D]' : 'font-bold text-[#0D0D0D]'}>
        {value}
      </span>
    </div>
  );
}
