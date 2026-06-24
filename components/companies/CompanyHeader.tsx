import { COMPANY_TYPE_LABELS, type Company } from '@/lib/types';

export function CompanyHeader({ company }: { company: Company }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-canvas text-xl font-bold text-ink ring-1 ring-line">
        {company.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-ink">{company.name}</h1>
        <p className="text-sm text-muted">
          {company.industry} · {COMPANY_TYPE_LABELS[company.company_type]}
          {company.employee_count_range ? ` · ${company.employee_count_range} staff` : ''}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {company.hires_poly_grads && (
            <span className="rounded-full bg-worth-applying/10 px-2.5 py-0.5 text-xs text-worth-applying">
              Hires poly grads
            </span>
          )}
          {company.sponsors_s_pass && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
              Sponsors S Pass
            </span>
          )}
          {company.sponsors_ep && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
              Sponsors EP
            </span>
          )}
          <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-muted ring-1 ring-line">
            Data confidence: {company.data_confidence}
          </span>
        </div>
        {company.description && <p className="mt-3 text-sm text-ink">{company.description}</p>}
      </div>
    </div>
  );
}
