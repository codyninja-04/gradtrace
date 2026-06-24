import type { Company } from '@/lib/types';

const APPLY_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  company_website: 'company website',
  mycareersfuture: 'MyCareersFuture',
  referral_heavy: 'referral (this company hires heavily through referrals)',
};

export function CompanyRoles({ company }: { company: Company }) {
  if (company.common_entry_roles.length === 0) return null;

  const applyLabel = company.apply_via ? APPLY_LABELS[company.apply_via] ?? company.apply_via : null;

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-line">
      <h2 className="mb-3 text-sm font-semibold text-ink">Common entry-level roles</h2>
      <ul className="flex flex-wrap gap-2">
        {company.common_entry_roles.map((role) => (
          <li
            key={role}
            className="rounded-full bg-canvas px-3 py-1.5 text-sm text-ink ring-1 ring-line"
          >
            {role}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Apply{applyLabel ? ` via ${applyLabel}` : ''}
          </a>
        )}
        {!company.website && applyLabel && (
          <span className="text-sm text-muted">Best applied via {applyLabel}.</span>
        )}
      </div>
    </div>
  );
}
