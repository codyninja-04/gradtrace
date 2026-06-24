import { NextResponse } from 'next/server';
import { calculateMatchScore, calculateSalaryAnalysis } from '@/lib/matching/calculate-score';
import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/types';
import type { Company, StoredMatch, UserProfile } from '@/lib/types';

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile || !profile.onboarding_complete) {
    return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 });
  }

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('is_published', true);

  if (!companies?.length) {
    return NextResponse.json({ error: 'No companies in database' }, { status: 500 });
  }

  const typedProfile = profile as unknown as UserProfile;

  const matches = (companies as unknown as Company[])
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

  const { data: report, error } = await supabase
    .from('match_reports')
    .insert({
      user_id: user.id,
      profile_snapshot: profile as unknown as Json,
      matches: storedMatches as unknown as Json,
      salary_analysis: salaryAnalysis as unknown as Json,
      total_companies_scored: companies.length,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data: { matches, salaryAnalysis, reportId: report?.id },
  });
}
