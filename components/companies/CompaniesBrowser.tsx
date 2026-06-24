'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { COMPANY_TYPE_LABELS, type Company, type CompanyType } from '@/lib/types';

export function CompaniesBrowser({ companies }: { companies: Company[] }) {
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [type, setType] = useState('');
  const [polyOnly, setPolyOnly] = useState(false);
  const [sPassOnly, setSPassOnly] = useState(false);

  const industries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry))).sort(),
    [companies]
  );

  const filtered = companies.filter((c) => {
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (industry && c.industry !== industry) return false;
    if (type && c.company_type !== type) return false;
    if (polyOnly && !c.hires_poly_grads) return false;
    if (sPassOnly && !c.sponsors_s_pass) return false;
    return true;
  });

  const companyTypes = Object.keys(COMPANY_TYPE_LABELS) as CompanyType[];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-line">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search companies"
          className="min-w-[180px] flex-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
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
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="">All types</option>
          {companyTypes.map((t) => (
            <option key={t} value={t}>
              {COMPANY_TYPE_LABELS[t]}
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
          Hires poly
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={sPassOnly}
            onChange={(e) => setSPassOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line"
          />
          Sponsors S Pass
        </label>
      </div>

      <p className="mt-3 text-sm text-muted">{filtered.length} companies</p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/companies/${c.slug}`}
            className="rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate font-semibold text-ink">{c.name}</h3>
              <span className="shrink-0 text-xs text-muted">
                {COMPANY_TYPE_LABELS[c.company_type]}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">{c.industry}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.hires_poly_grads && (
                <span className="rounded-full bg-worth-applying/10 px-2 py-0.5 text-xs text-worth-applying">
                  Poly-friendly
                </span>
              )}
              {c.sponsors_s_pass && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  S Pass
                </span>
              )}
              {c.salary_p50 && (
                <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted ring-1 ring-line">
                  ~${c.salary_p50.toLocaleString()}/mo
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
