import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ActionPlanBlock } from '@/components/dashboard/ActionPlanBlock';
import { CompanyMatchCard } from '@/components/dashboard/CompanyMatchCard';
import { ScoreDistributionChart, SkillGapChart } from '@/components/dashboard/ReportCharts';
import { SalaryBenchmark } from '@/components/dashboard/SalaryBenchmark';
import { createClient } from '@/lib/supabase/server';
import type { Company, SalaryAnalysis, StoredMatch, UserProfile } from '@/lib/types';

export default async function ReportPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: report } = await supabase
    .from('match_reports')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!report) notFound();

  const { data: companiesData } = await supabase
    .from('companies')
    .select('*')
    .eq('is_published', true);
  const companies = (companiesData ?? []) as unknown as Company[];
  const companyById = new Map(companies.map((c) => [c.id, c]));

  const matches = (report.matches as unknown as StoredMatch[]) ?? [];
  const salaryAnalysis = report.salary_analysis as unknown as SalaryAnalysis | null;
  const profile = report.profile_snapshot as unknown as UserProfile;

  const topMatches = matches.filter((m) => m.match_label === 'apply_now' || m.match_label === 'worth_applying');
  const stretchMatches = matches.filter((m) => m.match_label === 'stretch');

  // Build the skill gap: skills the strong-match companies commonly require,
  // flagged by whether the user already lists them.
  const lowerUserSkills = new Set(profile.skills.map((s) => s.toLowerCase()));
  const requiredFreq = new Map<string, number>();
  for (const m of topMatches) {
    const company = companyById.get(m.company_id);
    if (!company) continue;
    for (const skill of company.required_skills) {
      requiredFreq.set(skill, (requiredFreq.get(skill) ?? 0) + 1);
    }
  }
  const skillGap = Array.from(requiredFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([skill]) => ({ skill, have: lowerUserSkills.has(skill.toLowerCase()) }))
    .sort((a, b) => Number(b.have) - Number(a.have));

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">Your full match report</h1>
        <p className="mt-1 text-sm text-muted">
          {report.total_companies_scored ?? matches.length} companies scored on{' '}
          {new Date(report.created_at).toLocaleDateString('en-SG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          .
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {salaryAnalysis && <SalaryBenchmark analysis={salaryAnalysis} />}
        <ScoreDistributionChart matches={matches} />
      </div>

      <SkillGapChart skills={skillGap} />

      <ActionPlanBlock reportId={report.id} initialPlan={report.action_plan} />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Apply now and worth applying</h2>
        {topMatches.length === 0 ? (
          <p className="rounded-xl bg-white p-5 text-sm text-muted ring-1 ring-line">
            Nothing scored above 50 yet. Add more skills or internship detail to your profile, then
            regenerate.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {topMatches.map((m) => {
              const company = companyById.get(m.company_id);
              if (!company) return null;
              return <CompanyMatchCard key={m.company_id} match={m} company={company} />;
            })}
          </div>
        )}
      </section>

      {stretchMatches.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">Stretch targets</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {stretchMatches.map((m) => {
              const company = companyById.get(m.company_id);
              if (!company) return null;
              return <CompanyMatchCard key={m.company_id} match={m} company={company} />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
