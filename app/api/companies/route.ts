import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { CompanyType } from '@/lib/types';

// GET /api/companies?industry=fintech&type=mnc&poly=true&s_pass=true&q=shopee
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  let query = supabase.from('companies').select('*').eq('is_published', true);

  const industry = searchParams.get('industry');
  const type = searchParams.get('type');
  const poly = searchParams.get('poly');
  const sPass = searchParams.get('s_pass');
  const q = searchParams.get('q');

  if (industry) query = query.eq('industry', industry);
  if (type) query = query.eq('company_type', type as CompanyType);
  if (poly === 'true') query = query.eq('hires_poly_grads', true);
  if (sPass === 'true') query = query.eq('sponsors_s_pass', true);
  if (q) query = query.ilike('name', `%${q}%`);

  const { data, error } = await query.order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
