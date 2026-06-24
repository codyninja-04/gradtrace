import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Paywall } from '@/components/pro/Paywall';
import { createClient } from '@/lib/supabase/server';

export default async function UpgradePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('has_pro_report')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.has_pro_report) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 ring-1 ring-line">
        <h1 className="text-xl font-semibold text-ink">You are already on Pro</h1>
        <p className="mt-1 text-sm text-muted">
          Your full report, action plan and share link are unlocked.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-ink">Upgrade to Pro</h1>
      <p className="mt-1 text-sm text-muted">
        One payment, everything unlocked. No subscription, no renewals.
      </p>
      <div className="mt-6">
        <Paywall
          userId={user.id}
          email={user.email}
          title="Everything you need to run your search"
        />
      </div>
    </div>
  );
}
