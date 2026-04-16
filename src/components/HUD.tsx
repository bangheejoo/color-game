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
    <div className="flex gap-1.5 w-full">
      {/* 레벨 */}
      <HUDBox label="레벨">
        <span className="text-base font-extrabold leading-none tabular-nums">
          {level}
          <span className="text-xs font-bold text-gray-400"> /{MAX_LEVEL}</span>
        </span>
      </HUDBox>

      {/* 점수 — 가장 넓게 */}
      <HUDBox label="점수" wide>
        <span className="text-base font-extrabold leading-none tabular-nums">
          {score.toLocaleString()}
        </span>
      </HUDBox>

      {/* 시간 */}
      <HUDBox label="시간">
        <span className={`text-base font-extrabold leading-none tabular-nums ${isDanger ? 'text-[#F29199] animate-pulse-danger' : ''}`}>
          {timeLeft}
        </span>
      </HUDBox>

      {/* 콤보 — 2연속부터 표시 */}
      {combo >= 2 && (
        <HUDBox label="콤보">
          <span className="text-base font-extrabold leading-none tabular-nums text-orange-500">
            {combo}x
          </span>
        </HUDBox>
      )}
    </div>
  );
}

function HUDBox({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`${wide ? 'flex-[2]' : 'flex-1'} min-w-0 bg-white border border-gray-200 rounded-xl py-2 px-1 flex flex-col items-center gap-0.5`}>
      <span className="text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{label}</span>
      {children}
    </div>
  );
}
