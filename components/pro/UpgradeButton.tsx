'use client';

import { useState } from 'react';
import { buildUpgradeUrl, PRO_PRICE_LABEL } from '@/lib/pro';

export function UpgradeButton({
  userId,
  email,
  label,
  className,
}: {
  userId: string;
  email?: string | null;
  label?: string;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const url = buildUpgradeUrl(userId, email);
  const text = label ?? `Unlock Pro for ${PRO_PRICE_LABEL}`;
  const classes =
    className ??
    'inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90';

  function go() {
    if (!url) {
      setError('Payments are not configured yet. Set NEXT_PUBLIC_STRIPE_PAYMENT_LINK.');
      return;
    }
    window.location.href = url;
  }

  return (
    <span>
      <button onClick={go} className={classes}>
        {text}
      </button>
      {error && <span className="mt-2 block text-xs text-red-600">{error}</span>}
    </span>
  );
}
