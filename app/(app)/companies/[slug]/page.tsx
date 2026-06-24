import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompanyHeader } from '@/components/companies/CompanyHeader';
import { CompanyRoles } from '@/components/companies/CompanyRoles';
import { CompanyStats } from '@/components/companies/CompanyStats';
import { MatchScoreBar } from '@/components/dashboard/MatchScoreBar';
import { calculateMatchScore } from '@/lib/matching/calculate-score';
import { createClient } from '@/lib/supabase/server';
import { MATCH_LABEL_TEXT, type Company, type UserProfile } from '@/lib/types';

const ROWS = [
  { key: 'institution_match', label: 'Institution fit', max: 30 },
  { key: 'visa_compatibility', label: 'Visa compatibility', max: 25 },
  { key: 'skills_match', label: 'Skills match', max: 25 },
  { key: 'experience_match', label: 'Experience', max: 20 },
] as const;

export default async function CompanyDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: companyRow } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!companyRow) notFound();
  const company = companyRow as unknown as Company;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRow } = user
    ? await supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle()
    : { data: null };

  const match =
    profileRow && (profileRow as { onboarding_complete?: boolean }).onboarding_complete
      ? calculateMatchScore(profileRow as unknown as UserProfile, company)
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/companies" className="text-sm text-muted hover:text-ink">
        ← Back to companies
      </Link>

      <div className="mt-4 rounded-xl bg-white p-5 ring-1 ring-line">
        <CompanyHeader company={company} />
      </div>

      {match && (
        <div className="mt-4 rounded-xl bg-white p-5 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Your match</h2>
            <span className="text-sm font-medium text-ink">
              {MATCH_LABEL_TEXT[match.match_label]}
            </span>
          </div>
          <div className="mt-3">
            <MatchScoreBar score={match.score} />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-ink">Why this score?</h3>
          <div className="mt-2 space-y-2">
            {ROWS.map((row) => {
              const value = match.score_breakdown[row.key];
              return (
                <div key={row.key} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-sm text-muted">{row.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(value / row.max) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-sm text-ink">
                    {value}/{row.max}
                  </span>
                </div>
              );
            })}
          </div>

          {match.blockers.length > 0 && (
            <div className="mt-4 rounded-lg bg-stretch/10 p-3">
              <p className="text-xs font-medium text-stretch">Watch out for</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-ink">
                {match.blockers.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-4">
        <CompanyStats company={company} />
        <CompanyRoles company={company} />
      </div>
    </div>
  );
}
