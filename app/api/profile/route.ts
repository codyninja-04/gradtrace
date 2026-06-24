import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  // Whitelist and coerce fields, never trust the client shape blindly.
  const row = {
    user_id: user.id,
    updated_at: new Date().toISOString(),
    onboarding_complete: Boolean(body.onboarding_complete),
    institution: body.institution ?? null,
    institution_type: body.institution_type ?? null,
    course: body.course || null,
    gpa: typeof body.gpa === 'number' ? body.gpa : null,
    graduation_year: typeof body.graduation_year === 'number' ? body.graduation_year : null,
    has_honours: Boolean(body.has_honours),
    visa_status: body.visa_status ?? 'unknown',
    nationality: body.nationality || null,
    skills: Array.isArray(body.skills) ? body.skills : [],
    internship_months: Number.isFinite(body.internship_months) ? body.internship_months : 0,
    internship_companies: Array.isArray(body.internship_companies)
      ? body.internship_companies
      : [],
    has_freelance_work: Boolean(body.has_freelance_work),
    has_personal_projects: Boolean(body.has_personal_projects),
    project_urls: Array.isArray(body.project_urls) ? body.project_urls : [],
    target_role_types: Array.isArray(body.target_role_types) ? body.target_role_types : [],
    min_salary: typeof body.min_salary === 'number' ? body.min_salary : null,
    open_to_contract: Boolean(body.open_to_contract),
    preferred_company_types: Array.isArray(body.preferred_company_types)
      ? body.preferred_company_types
      : [],
    notes: body.notes || null,
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
