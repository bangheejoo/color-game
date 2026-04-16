interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | null;
}

export default function FeedbackOverlay({ type }: FeedbackOverlayProps) {
  if (!type) return null;

  const isCorrect = type === 'correct';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center text-6xl font-black rounded-xl pointer-events-none transition-opacity duration-100"
      style={{
        background: isCorrect ? 'rgba(206,242,232,0.8)' : 'rgba(242,145,153,0.45)',
        color: isCorrect ? '#059669' : '#dc2626',
      }}
    >
      {isCorrect ? '✓' : '✗'}
    </div>
  );
}
