'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Company, StoredMatch } from '@/lib/types';
import { CategoryFilter, type DashboardFilters } from './CategoryFilter';
import { CompanyMatchCard } from './CompanyMatchCard';

const VISA_SAFE_LABELS = new Set(['apply_now', 'worth_applying']);

export function DashboardMatches({
  matches,
  companies,
  reportId,
}: {
  matches: StoredMatch[];
  companies: Company[];
  reportId: string;
}) {
  const companyById = useMemo(() => {
    const map = new Map<string, Company>();
    for (const c of companies) map.set(c.id, c);
    return map;
  }, [companies]);

  const industries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry))).sort(),
    [companies]
  );

  const [filters, setFilters] = useState<DashboardFilters>({
    industry: '',
    companyType: '',
    visaSafeOnly: false,
    minScore: 0,
  });

  const update = (patch: Partial<DashboardFilters>) => setFilters((f) => ({ ...f, ...patch }));

  // A match is "visa-blocked" if any blocker mentions a pass it cannot clear.
  const isVisaBlocked = (m: StoredMatch) =>
    m.blockers.some((b) => /S Pass|Employment Pass|Letter of Consent/i.test(b));

  const visible = matches.filter((m) => {
    const company = companyById.get(m.company_id);
    if (!company) return false;
    if (filters.industry && company.industry !== filters.industry) return false;
    if (filters.companyType && company.company_type !== filters.companyType) return false;
    if (m.score < filters.minScore) return false;
    if (filters.visaSafeOnly && isVisaBlocked(m)) return false;
    return true;
  });

  const counts = {
    applyNow: matches.filter((m) => m.match_label === 'apply_now').length,
    worth: matches.filter((m) => m.match_label === 'worth_applying').length,
    stretch: matches.filter((m) => m.match_label === 'stretch').length,
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Apply now" value={counts.applyNow} color="text-apply-now" />
        <Stat label="Worth trying" value={counts.worth} color="text-worth-applying" />
        <Stat label="Stretch targets" value={counts.stretch} color="text-stretch" />
      </div>

      <CategoryFilter filters={filters} industries={industries} onChange={update} />

      {visible.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-muted ring-1 ring-line">
          No companies match these filters. Try loosening them.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visible.map((m) => {
            const company = companyById.get(m.company_id)!;
            return <CompanyMatchCard key={m.company_id} match={m} company={company} />;
          })}
        </div>
      )}

      <div className="pb-safe sticky bottom-0 -mx-4 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Link
          href={`/report/${reportId}`}
          className="block rounded-lg bg-primary py-3 text-center text-sm font-medium text-white"
        >
          Open full report and action plan
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center ring-1 ring-line">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
