'use client';

import { useMemo, useState } from 'react';
import { S_PASS_MINIMUM } from '@/lib/matching/calculate-score';

export interface SalaryRow {
  industry: string;
  hires_poly_grads: boolean;
  salary_p25: number | null;
  salary_p50: number | null;
  salary_p75: number | null;
}

const roundTo100 = (n: number) => Math.round(n / 100) * 100;
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

export function SalaryTool({ rows }: { rows: SalaryRow[] }) {
  const industries = useMemo(
    () => Array.from(new Set(rows.map((r) => r.industry))).sort(),
    [rows]
  );

  const [polyOnly, setPolyOnly] = useState(false);
  const [industry, setIndustry] = useState('');

  const result = useMemo(() => {
    const filtered = rows.filter((r) => {
      if (polyOnly && !r.hires_poly_grads) return false;
      if (industry && r.industry !== industry) return false;
      return true;
    });

    const p25 = filtered.map((r) => r.salary_p25).filter((v): v is number => v != null);
    const p50 = filtered.map((r) => r.salary_p50).filter((v): v is number => v != null);
    const p75 = filtered.map((r) => r.salary_p75).filter((v): v is number => v != null);

    if (p50.length === 0) return null;
    return {
      count: filtered.length,
      p25: roundTo100(avg(p25.length ? p25 : p50)),
      p50: roundTo100(avg(p50)),
      p75: roundTo100(avg(p75.length ? p75 : p50)),
    };
  }, [rows, polyOnly, industry]);

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">All industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={polyOnly}
            onChange={(e) => setPolyOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line"
          />
          Only companies that hire poly grads
        </label>
      </div>

      {result ? (
        <div className="mt-6">
          <div className="flex items-end justify-between gap-2 text-center">
            <div className="flex-1">
              <p className="text-xs text-muted">25th percentile</p>
              <p className="text-xl font-semibold text-ink">${result.p25.toLocaleString()}</p>
            </div>
            <div className="flex-1 rounded-lg bg-canvas py-2">
              <p className="text-xs text-muted">Median</p>
              <p className="text-2xl font-bold text-primary">${result.p50.toLocaleString()}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted">75th percentile</p>
              <p className="text-xl font-semibold text-ink">${result.p75.toLocaleString()}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Fixed monthly, SGD. Based on {result.count} companies. The current S Pass salary floor is
            ${S_PASS_MINIMUM.toLocaleString()}/month.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-muted">
          No salary data for that combination yet.
        </p>
      )}
    </div>
  );
}
