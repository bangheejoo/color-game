import { MAX_LEVEL } from '../utils/gameConfig';

interface HUDProps {
  level: number;
  score: number;
  timeLeft: number;
  combo: number;
}

export default function HUD({ level, score, timeLeft, combo }: HUDProps) {
  const isDanger = timeLeft <= 2;

  return (
    <div className="flex gap-2 w-full">
      <HUDBox label="레벨" value={`${level} / ${MAX_LEVEL}`} />
      <HUDBox label="점수" value={score.toLocaleString()} />
      <HUDBox
        label="시간"
        value={String(timeLeft)}
        className={isDanger ? 'text-[#F29199] animate-pulse-danger' : ''}
      />
      {combo >= 2 && (
        <HUDBox
          label="콤보"
          value={`${combo}x`}
          className="text-orange-500"
        />
      )}
    </div>
  );
}

function HUDBox({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl py-2 flex flex-col items-center gap-0.5">
      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <span className={`text-xl font-extrabold leading-none ${className}`}>{value}</span>
    </div>
  );
}
