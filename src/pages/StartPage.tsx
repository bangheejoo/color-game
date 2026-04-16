interface StartPageProps {
  onStart: () => void;
  onLeaderboard: () => void;
}

export default function StartPage({ onStart, onLeaderboard }: StartPageProps) {
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[460px] text-center animate-fade-in">
      <span
        className="inline-block text-[0.68rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background: '#F2D7D0' }}
      >
        Color Game
      </span>

      <h1 className="text-[clamp(1.9rem,6vw,2.8rem)] font-extrabold tracking-tight leading-snug">
        다른 색을<br />
        <span style={{ color: '#F29199' }}>찾아라🔎</span>
      </h1>

      <p className="text-gray-500 text-sm font-semibold max-w-[280px] leading-relaxed">
        다른 색의 타일 하나를 찾아보세요!
      </p>

      <div
        className="flex items-center gap-1.5 text-xs text-gray-400"
      >
        <span
          className="text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: '#CEF2E8' }}
        >
          Tip
        </span>
        레벨마다 제한시간 5초, 45레벨까지 도전해보세요!
      </div>

      <div className="flex gap-2 flex-wrap justify-center w-full mt-2">
        <button
          onClick={onStart}
          className="px-8 py-3 rounded-xl text-[0.95rem] font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          style={{ background: '#0D0D0D' }}
        >
          시작하기
        </button>
        <button
          onClick={onLeaderboard}
          className="px-8 py-3 rounded-xl text-[0.95rem] font-bold border border-gray-200 bg-white transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          순위보기
        </button>
      </div>
    </div>
  );
}
