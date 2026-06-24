import { CompaniesBrowser } from '@/components/companies/CompaniesBrowser';
import { createClient } from '@/lib/supabase/server';
import type { Company } from '@/lib/types';

export default async function CompaniesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('companies')
    .select('*')
    .eq('is_published', true)
    .order('name');

  const companies = (data ?? []) as unknown as Company[];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-ink">Companies</h1>
      <p className="mt-1 text-sm text-muted">
        Browse every company in the database, with the facts that actually decide whether you should
        apply.
      </p>
      <div className="mt-6">
        <CompaniesBrowser companies={companies} />
      </div>
    </div>
  );
}
