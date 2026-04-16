import { useEffect, useState } from 'react';

interface ComboDisplayProps {
  combo: number;
  triggerKey: number;
}

export default function ComboDisplay({ combo, triggerKey }: ComboDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (combo < 2) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [triggerKey, combo]);

  if (!visible || combo < 2) return null;

  return (
    <div
      key={triggerKey}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 animate-combo-pop w-full text-center px-4"
    >
      <div
        className="font-black text-orange-500 drop-shadow-lg leading-tight"
        style={{ fontSize: 'clamp(1.5rem, 8vw, 2.8rem)' }}
      >
        {combo}x COMBO!{combo >= 5 ? ' 🔥' : ''}
      </div>
    </div>
  );
}
