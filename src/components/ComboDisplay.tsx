import { useEffect, useState } from 'react';

interface ComboDisplayProps {
  combo: number;
  triggerKey: number; // 변경될 때마다 애니메이션 재실행
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 animate-combo-pop"
    >
      <div className="text-center">
        <div className="text-5xl font-black text-orange-500 drop-shadow-lg">
          {combo}x COMBO!
        </div>
        {combo >= 5 && (
          <div className="text-2xl mt-1">🔥</div>
        )}
      </div>
    </div>
  );
}
