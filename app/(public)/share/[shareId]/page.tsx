import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompanyMatchCard } from '@/components/dashboard/CompanyMatchCard';
import { ScoreDistributionChart, SkillGapChart } from '@/components/dashboard/ReportCharts';
import { SalaryBenchmark } from '@/components/dashboard/SalaryBenchmark';
import { renderMarkdown } from '@/components/markdown';
import { createServiceClient } from '@/lib/supabase/server';
import type { Company, SalaryAnalysis, StoredMatch, UserProfile } from '@/lib/types';

// Public, read-only report shared via an unguessable share_id. Rendered with the
// service-role client so it works without the viewer being logged in, while
// reports stay private when accessed by their normal id.
export default async function SharedReportPage({ params }: { params: { shareId: string } }) {
  const supabase = createServiceClient();

  const { data: report } = await supabase
    .from('match_reports')
    .select('*')
    .eq('share_id', params.shareId)
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

  const topMatches = matches.filter(
    (m) => m.match_label === 'apply_now' || m.match_label === 'worth_applying'
  );

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
    <main className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-ink">
            GradTrace
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Build your own
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-6 py-8">
        <div>
          <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-muted ring-1 ring-line">
            Shared report
          </span>
          <h1 className="mt-2 text-2xl font-bold text-ink">GradTrace match report</h1>
          <p className="mt-1 text-sm text-muted">
            {report.total_companies_scored ?? matches.length} Singapore companies scored on{' '}
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

        {report.action_plan && (
          <div className="rounded-xl bg-white p-5 ring-1 ring-line">
            <h2 className="text-lg font-semibold text-ink">4-week action plan</h2>
            <div className="action-plan mt-2">{renderMarkdown(report.action_plan)}</div>
          </div>
        )}

        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">Apply now and worth applying</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {topMatches.map((m) => {
              const company = companyById.get(m.company_id);
              if (!company) return null;
              return <CompanyMatchCard key={m.company_id} match={m} company={company} />;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
