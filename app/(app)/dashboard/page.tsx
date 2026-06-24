import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardMatches } from '@/components/dashboard/DashboardMatches';
import { SalaryBenchmark } from '@/components/dashboard/SalaryBenchmark';
import { calculateMatchScore, calculateSalaryAnalysis } from '@/lib/matching/calculate-score';
import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/types';
import type { Company, SalaryAnalysis, StoredMatch, UserProfile } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile || !profile.onboarding_complete) redirect('/onboarding');

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('is_published', true);

  const companyList = (companies ?? []) as unknown as Company[];

  // Use the most recent report if present, otherwise compute one now so the
  // dashboard always has something to show.
  let { data: report } = await supabase
    .from('match_reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!report && companyList.length > 0) {
    const typedProfile = profile as unknown as UserProfile;
    const matches = companyList
      .map((company) => calculateMatchScore(typedProfile, company))
      .sort((a, b) => b.score - a.score);
    const salaryAnalysis = calculateSalaryAnalysis(typedProfile, matches);
    const storedMatches: StoredMatch[] = matches.map((m) => ({
      company_id: m.company.id,
      company_name: m.company.name,
      score: m.score,
      score_breakdown: m.score_breakdown,
      match_label: m.match_label,
      recommended_roles: m.recommended_roles,
      blockers: m.blockers,
    }));

    const { data: inserted } = await supabase
      .from('match_reports')
      .insert({
        user_id: user.id,
        profile_snapshot: profile as unknown as Json,
        matches: storedMatches as unknown as Json,
        salary_analysis: salaryAnalysis as unknown as Json,
        total_companies_scored: companyList.length,
      })
      .select()
      .single();
    report = inserted;
  }

  if (!report) {
    return (
      <div className="rounded-xl bg-white p-6 ring-1 ring-line">
        <p className="text-sm text-muted">
          No companies are loaded yet. Run the seed migration to populate the database.
        </p>
      </div>
    );
  }

  const storedMatches = (report.matches as unknown as StoredMatch[]) ?? [];
  const salaryAnalysis = report.salary_analysis as unknown as SalaryAnalysis | null;
  const isPro = Boolean(profile.has_pro_report);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Your personalized match list</h1>
          <p className="mt-1 text-sm text-muted">
            Scored {report.total_companies_scored ?? storedMatches.length} Singapore companies
            against your profile.
          </p>
        </div>
        <Link
          href={`/report/${report.id}`}
          className="hidden shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 md:inline-block"
        >
          Full report and action plan
        </Link>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="order-2 lg:order-1">
          <DashboardMatches
            matches={storedMatches}
            companies={companyList}
            reportId={report.id}
            isPro={isPro}
            userId={user.id}
            email={user.email}
          />
        </div>
        <div className="order-1 lg:order-2">
          {salaryAnalysis && <SalaryBenchmark analysis={salaryAnalysis} />}
        </div>
      </div>
    </div>
  );
}
