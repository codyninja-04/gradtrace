'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Stripe redirects here after a successful payment. The unlock itself happens
// asynchronously in the webhook, so we poll the profile until it lands.
export default function UpgradeSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'done' | 'slow'>('checking');

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (res.ok) {
          const { data } = await res.json();
          if (!cancelled && data?.has_pro_report) {
            setStatus('done');
            router.refresh();
            return;
          }
        }
      } catch {
        // ignore and retry
      }

      if (cancelled) return;
      if (attempts >= 15) {
        setStatus('slow');
        return;
      }
      setTimeout(poll, 2000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 text-center ring-1 ring-line">
      {status === 'done' ? (
        <>
          <h1 className="text-xl font-semibold text-ink">You are on Pro</h1>
          <p className="mt-1 text-sm text-muted">
            Your full report, 4-week action plan and share link are unlocked.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Go to my dashboard
          </Link>
        </>
      ) : status === 'slow' ? (
        <>
          <h1 className="text-xl font-semibold text-ink">Almost there</h1>
          <p className="mt-1 text-sm text-muted">
            Your payment went through. The unlock is taking a little longer than usual to confirm.
            Refresh in a moment, or head to your dashboard.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Go to my dashboard
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-ink">Confirming your payment...</h1>
          <p className="mt-1 text-sm text-muted">
            Thanks for upgrading. We are unlocking your account now, this usually takes a few seconds.
          </p>
        </>
      )}
    </div>
  );
}
