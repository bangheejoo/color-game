import { useEffect, useState } from 'react';

interface ComboDisplayProps {
  combo: number;
  triggerKey: number;
}

function getComboLabel(combo: number) {
  if (combo >= 15) return { emoji: '🌈', label: '레전드!!', color: '#a855f7' };
  if (combo >= 10) return { emoji: '🔥', label: '천재다!!', color: '#f97316' };
  if (combo >= 7)  return { emoji: '💫', label: '대박!!',  color: '#F29199' };
  if (combo >= 5)  return { emoji: '⭐', label: '굿굿!!',  color: '#F29199' };
  if (combo >= 3)  return { emoji: '✨', label: '콤보!',   color: '#F29199' };
  return                  { emoji: '✨', label: '콤보!',   color: '#F29199' };
}

export default function ComboDisplay({ combo, triggerKey }: ComboDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (combo < 2) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 850);
    return () => clearTimeout(t);
  }, [triggerKey, combo]);

  if (!visible || combo < 2) return null;

  const { emoji, label, color } = getComboLabel(combo);

  return (
    <div
      key={triggerKey}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 animate-combo-pop"
    >
      <div
        className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl shadow-xl"
        style={{ background: 'white', opacity: 0.7, border: `2.5px solid ${color}` }}
      >
        <span className="text-2xl leading-none">{emoji}</span>
        <span
          className="text-3xl font-black leading-tight tabular-nums"
          style={{ color, fontFamily: 'var(--font-title)' }}
        >
          {combo}x
        </span>
        <span className="text-[0.65rem] font-bold tracking-widest uppercase" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}
