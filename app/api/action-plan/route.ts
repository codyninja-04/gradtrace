import { NextResponse } from 'next/server';
import { generateActionPlan } from '@/lib/claude/generate-action-plan';
import { calculateMatchScore, calculateSalaryAnalysis } from '@/lib/matching/calculate-score';
import { createClient } from '@/lib/supabase/server';
import type { Company, SalaryAnalysis, UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const reportId = body?.reportId as string | undefined;
  if (!reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });

  const { data: report } = await supabase
    .from('match_reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

  // Already generated, return what we have rather than spend another call.
  if (report.action_plan) {
    return NextResponse.json({ data: { action_plan: report.action_plan } });
  }

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('is_published', true);

  if (!companies?.length) {
    return NextResponse.json({ error: 'No companies in database' }, { status: 500 });
  }

  // Recompute matches from the snapshotted profile so the plan is consistent
  // with the report the user is looking at.
  const profile = report.profile_snapshot as unknown as UserProfile;
  const matches = (companies as unknown as Company[])
    .map((company) => calculateMatchScore(profile, company))
    .sort((a, b) => b.score - a.score);

  const salaryAnalysis = (report.salary_analysis as unknown as SalaryAnalysis | null) ??
    calculateSalaryAnalysis(profile, matches);

  let actionPlan: string;
  try {
    actionPlan = await generateActionPlan(profile, matches, salaryAnalysis);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Action plan generation failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  if (!actionPlan) {
    return NextResponse.json({ error: 'Empty action plan returned' }, { status: 502 });
  }

  await supabase
    .from('match_reports')
    .update({ action_plan: actionPlan })
    .eq('id', reportId)
    .eq('user_id', user.id);

  return NextResponse.json({ data: { action_plan: actionPlan } });
}
