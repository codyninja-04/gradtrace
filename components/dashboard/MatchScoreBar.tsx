export function MatchScoreBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-score-bar transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-sm font-semibold text-ink">
        {clamped}/100
      </span>
    </div>
  );
}
