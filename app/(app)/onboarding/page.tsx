'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { StepEducation } from '@/components/onboarding/StepEducation';
import { StepExperience } from '@/components/onboarding/StepExperience';
import { StepSkills } from '@/components/onboarding/StepSkills';
import { StepVisa } from '@/components/onboarding/StepVisa';
import { EMPTY_DRAFT, type ProfileDraft } from '@/components/onboarding/types';

const TOTAL = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ProfileDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<ProfileDraft>) => setDraft((d) => ({ ...d, ...patch }));

  function canAdvance(): boolean {
    if (step === 0) return !!draft.institution;
    if (step === 1) return draft.visa_status !== 'unknown' || true; // unknown is allowed
    return true;
  }

  async function finish() {
    setSubmitting(true);
    setError(null);

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, onboarding_complete: true }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not save your profile. Try again.');
      setSubmitting(false);
      return;
    }

    // Kick off scoring, then send them to the dashboard.
    await fetch('/api/match', { method: 'POST' }).catch(() => null);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">Build your profile</h1>
      <p className="mt-1 text-sm text-muted">
        Four short steps. The more honest you are, the more useful your match list.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-line">
        <OnboardingProgress step={step} total={TOTAL} />

        {step === 0 && <StepEducation draft={draft} update={update} />}
        {step === 1 && <StepVisa draft={draft} update={update} />}
        {step === 2 && <StepSkills draft={draft} update={update} />}
        {step === 3 && <StepExperience draft={draft} update={update} />}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-40"
          >
            Back
          </button>

          {step < TOTAL - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={submitting}
              className="rounded-lg bg-apply-now px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Scoring companies...' : 'See my matches'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
