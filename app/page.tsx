import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Public landing page. Signed-in users are sent straight to their dashboard.
export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold text-ink">GradTrace</span>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/salary" className="text-muted hover:text-ink">
            Salary tool
          </Link>
          <Link href="/login" className="text-muted hover:text-ink">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
        <p className="mb-4 inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
          Built for Singapore fresh grads, poly and uni
        </p>
        <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Stop applying to companies you have no shot at.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          GradTrace scores real Singapore employers against your education, skills, internship
          experience and visa status. You get a ranked, honest hit list and a 4-week plan, instead of
          spraying 200 applications into the void.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:opacity-90"
          >
            Build my match list
          </Link>
          <Link
            href="/salary"
            className="rounded-lg bg-white px-6 py-3 font-medium text-ink ring-1 ring-line hover:bg-canvas"
          >
            Try the salary tool
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-6 pb-20 sm:grid-cols-3">
        {[
          {
            title: 'Honest scoring',
            body: 'A transparent 0 to 100 score across institution fit, visa, skills and experience. No black box.',
          },
          {
            title: 'Poly-aware',
            body: 'We know which companies actually hire diploma holders versus the ones that quietly filter them out.',
          },
          {
            title: 'Visa-real',
            body: 'S Pass and EP eligibility is treated as a hard wall, because that is how hiring actually works here.',
          },
        ].map((card) => (
          <div key={card.title} className="rounded-xl bg-white p-5 ring-1 ring-line">
            <h3 className="font-semibold text-ink">{card.title}</h3>
            <p className="mt-2 text-sm text-muted">{card.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
