import { MAX_LEVEL } from '../utils/gameConfig';

interface ProgressBarProps {
  level: number;
}

export default function ProgressBar({ level }: ProgressBarProps) {
  const pct = ((level - 1) / MAX_LEVEL) * 100;

  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #F29199, #F2BDC1)',
        }}
      />
    </div>
  );
}
