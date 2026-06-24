import Link from 'next/link';
import { SalaryTool, type SalaryRow } from '@/components/salary/SalaryTool';
import { createClient } from '@/lib/supabase/server';

// Public, no auth required. RLS allows reading published companies, so the
// standard anon client is enough here.
export default async function SalaryPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('companies')
    .select('industry, hires_poly_grads, salary_p25, salary_p50, salary_p75')
    .eq('is_published', true);

  const rows = (data ?? []) as unknown as SalaryRow[];

  return (
    <main className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold text-ink">
          GradTrace
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Get your match list
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-6">
        <h1 className="text-3xl font-bold text-ink">Singapore fresh-grad salary tool</h1>
        <p className="mt-2 text-muted">
          Real entry-level salary ranges from the companies in our database. Filter by industry and
          by whether the company actually hires poly grads.
        </p>

        <div className="mt-8">
          <SalaryTool rows={rows} />
        </div>

        <p className="mt-6 text-sm text-muted">
          Want this tied to your own profile, with a ranked company hit list and a 4-week plan?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Build your match list
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
