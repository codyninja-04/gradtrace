'use client';

import { useState } from 'react';
import { renderMarkdown } from '@/components/markdown';

export function ActionPlanBlock({
  reportId,
  initialPlan,
}: {
  reportId: string;
  initialPlan: string | null;
}) {
  const [plan, setPlan] = useState<string | null>(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/action-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || 'Could not generate the action plan. Try again.');
      setLoading(false);
      return;
    }
    setPlan(body.data?.action_plan ?? '');
    setLoading(false);
  }

  if (plan) {
    return (
      <div className="rounded-xl bg-white p-5 ring-1 ring-line">
        <h2 className="text-lg font-semibold text-ink">Your 4-week action plan</h2>
        <div className="action-plan mt-2">{renderMarkdown(plan)}</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 text-center ring-1 ring-line">
      <h2 className="text-lg font-semibold text-ink">Get your 4-week action plan</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        A specific, week-by-week plan built around your real matches: which companies to apply to
        first, how to reach out, and what to build before you do.
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        onClick={generate}
        disabled={loading}
        className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Generating your plan...' : 'Generate my plan'}
      </button>
    </div>
  );
}
