'use client';

import { COMPANY_TYPE_LABELS, type CompanyType } from '@/lib/types';

export interface DashboardFilters {
  industry: string;
  companyType: string;
  visaSafeOnly: boolean;
  minScore: number;
}

export function CategoryFilter({
  filters,
  industries,
  onChange,
}: {
  filters: DashboardFilters;
  industries: string[];
  onChange: (patch: Partial<DashboardFilters>) => void;
}) {
  const companyTypes = Object.keys(COMPANY_TYPE_LABELS) as CompanyType[];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-line">
      <select
        value={filters.industry}
        onChange={(e) => onChange({ industry: e.target.value })}
        className="rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary"
      >
        <option value="">All industries</option>
        {industries.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
          </option>
        ))}
      </select>

      <select
        value={filters.companyType}
        onChange={(e) => onChange({ companyType: e.target.value })}
        className="rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary"
      >
        <option value="">All company types</option>
        {companyTypes.map((t) => (
          <option key={t} value={t}>
            {COMPANY_TYPE_LABELS[t]}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={filters.visaSafeOnly}
          onChange={(e) => onChange({ visaSafeOnly: e.target.checked })}
          className="h-4 w-4 rounded border-line"
        />
        Visa-safe only
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        Min score
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={filters.minScore}
          onChange={(e) => onChange({ minScore: Number(e.target.value) })}
          className="accent-primary"
        />
        <span className="w-6 text-right text-muted">{filters.minScore}</span>
      </label>
    </div>
  );
}
