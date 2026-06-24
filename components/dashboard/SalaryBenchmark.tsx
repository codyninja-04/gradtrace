import type { SalaryAnalysis } from '@/lib/types';

export function SalaryBenchmark({ analysis }: { analysis: SalaryAnalysis }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-line">
      <h3 className="text-sm font-semibold text-ink">Your expected salary range</h3>
      <p className="mt-1 text-xs text-muted">
        Based on the companies you match well with. Fixed monthly, SGD.
      </p>

      <div className="mt-4 flex items-end justify-between gap-2 text-center">
        <div className="flex-1">
          <p className="text-xs text-muted">25th</p>
          <p className="text-lg font-semibold text-ink">
            ${analysis.expected_p25.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-canvas py-1">
          <p className="text-xs text-muted">Median</p>
          <p className="text-xl font-bold text-primary">
            ${analysis.expected_p50.toLocaleString()}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted">75th</p>
          <p className="text-lg font-semibold text-ink">
            ${analysis.expected_p75.toLocaleString()}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs">
        {analysis.meets_s_pass_threshold ? (
          <span className="text-worth-applying">
            Your expected median clears the current S Pass salary floor.
          </span>
        ) : (
          <span className="text-stretch">
            Your expected median is below the current S Pass salary floor, which can limit some
            sponsored roles.
          </span>
        )}
      </p>

      {analysis.skills_for_p75.length > 0 && (
        <div className="mt-3 border-t border-line pt-3">
          <p className="text-xs font-medium text-ink">Skills that would push you toward the 75th:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {analysis.skills_for_p75.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-canvas px-2.5 py-1 text-xs text-ink ring-1 ring-line"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
