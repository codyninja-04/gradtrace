import Link from 'next/link';
import {
  COMPANY_TYPE_LABELS,
  MATCH_LABEL_TEXT,
  type Company,
  type MatchLabel,
  type StoredMatch,
} from '@/lib/types';
import { MatchScoreBar } from './MatchScoreBar';

const BORDER: Record<MatchLabel, string> = {
  apply_now: 'border-l-apply-now',
  worth_applying: 'border-l-worth-applying',
  stretch: 'border-l-stretch',
  not_recommended: 'border-l-not-recommended',
};

const BADGE: Record<MatchLabel, string> = {
  apply_now: 'bg-apply-now text-white',
  worth_applying: 'bg-worth-applying text-white',
  stretch: 'bg-stretch text-white',
  not_recommended: 'bg-not-recommended text-white',
};

function salaryRange(company: Company): string | null {
  if (company.salary_p25 && company.salary_p75) {
    return `$${company.salary_p25.toLocaleString()} - $${company.salary_p75.toLocaleString()}/month`;
  }
  if (company.salary_p50) return `~$${company.salary_p50.toLocaleString()}/month`;
  return null;
}

export function CompanyMatchCard({
  match,
  company,
}: {
  match: StoredMatch;
  company: Company;
}) {
  const range = salaryRange(company);

  return (
    <Link
      href={`/companies/${company.slug}`}
      className={`block rounded-xl border border-line border-l-4 bg-white p-4 transition-shadow hover:shadow-sm ${BORDER[match.match_label]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{company.name}</h3>
          <p className="text-xs text-muted">
            {company.industry} · {COMPANY_TYPE_LABELS[company.company_type]}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${BADGE[match.match_label]}`}
        >
          {MATCH_LABEL_TEXT[match.match_label]}
        </span>
      </div>

      <div className="mt-3">
        <MatchScoreBar score={match.score} />
      </div>

      <ul className="mt-3 space-y-1 text-sm">
        {company.hires_poly_grads && (
          <li className="text-worth-applying">Hires poly grads</li>
        )}
        {company.sponsors_s_pass && (
          <li className="text-worth-applying">
            Sponsors S Pass{' '}
            {company.s_pass_min_salary ? `($${company.s_pass_min_salary.toLocaleString()}/month min)` : ''}
          </li>
        )}
        {match.blockers.length > 0 && <li className="text-stretch">{match.blockers[0]}</li>}
      </ul>

      {match.recommended_roles.length > 0 && (
        <p className="mt-3 text-sm text-muted">
          Roles: <span className="text-ink">{match.recommended_roles.slice(0, 2).join(', ')}</span>
        </p>
      )}
      {range && <p className="mt-1 text-sm text-muted">Salary range: {range}</p>}
    </Link>
  );
}
