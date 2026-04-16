import type { TileData } from '../types';

interface TileGridProps {
  tiles: TileData[];
  gridSize: number;
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
}

export default function TileGrid({ tiles, gridSize, onCorrect, onWrong, disabled = false }: TileGridProps) {
  return (
    <div
      className="w-full aspect-square grid"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: 'clamp(4px, 1.4vw, 10px)',
      }}
    >
      {tiles.map(tile => (
        <button
          key={tile.id}
          disabled={disabled}
          onClick={() => tile.isOdd ? onCorrect() : onWrong()}
          className="w-full aspect-square rounded-[10px] border-none cursor-pointer shadow-sm transition-transform duration-100 hover:scale-95 active:scale-90 disabled:pointer-events-none"
          style={{ backgroundColor: tile.color }}
        />
      ))}
    </div>
  );
}
