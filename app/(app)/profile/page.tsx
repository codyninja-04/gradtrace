'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StepEducation } from '@/components/onboarding/StepEducation';
import { StepExperience } from '@/components/onboarding/StepExperience';
import { StepSkills } from '@/components/onboarding/StepSkills';
import { StepVisa } from '@/components/onboarding/StepVisa';
import { EMPTY_DRAFT, type ProfileDraft } from '@/components/onboarding/types';
import type { Institution, InstitutionType, VisaStatus } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [draft, setDraft] = useState<ProfileDraft>(EMPTY_DRAFT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<ProfileDraft>) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const { data } = await res.json();
        if (data) {
          setDraft({
            institution: (data.institution as Institution) ?? null,
            institution_type: (data.institution_type as InstitutionType) ?? null,
            course: data.course ?? '',
            graduation_year: data.graduation_year ?? null,
            gpa: data.gpa ?? null,
            has_honours: Boolean(data.has_honours),
            visa_status: (data.visa_status as VisaStatus) ?? 'unknown',
            nationality: data.nationality ?? '',
            skills: data.skills ?? [],
            target_role_types: data.target_role_types ?? [],
            internship_months: data.internship_months ?? 0,
            internship_companies: data.internship_companies ?? [],
            has_freelance_work: Boolean(data.has_freelance_work),
            has_personal_projects: Boolean(data.has_personal_projects),
            project_urls: data.project_urls ?? [],
            min_salary: data.min_salary ?? null,
            notes: data.notes ?? '',
          });
        }
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, onboarding_complete: true }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not save. Try again.');
      setSaving(false);
      return;
    }

    // Re-score against the updated profile so the dashboard reflects the change.
    await fetch('/api/match', { method: 'POST' }).catch(() => null);
    setMessage('Saved. Your match list has been refreshed.');
    setSaving(false);
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading your profile...</p>;
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl bg-white p-5 ring-1 ring-line">
      <h2 className="mb-4 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">Edit profile</h1>
      <p className="mt-1 text-sm text-muted">
        Update anything here and save to re-score every company against your new profile.
      </p>

      <div className="mt-6 space-y-4">
        <Section title="Education">
          <StepEducation draft={draft} update={update} />
        </Section>
        <Section title="Visa and work eligibility">
          <StepVisa draft={draft} update={update} />
        </Section>
        <Section title="Skills and target roles">
          <StepSkills draft={draft} update={update} />
        </Section>
        <Section title="Experience">
          <StepExperience draft={draft} update={update} />
        </Section>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-worth-applying">{message}</p>}

        <div className="sticky bottom-0 -mx-4 border-t border-line bg-canvas/95 px-4 py-3 backdrop-blur">
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-6"
          >
            {saving ? 'Saving and re-scoring...' : 'Save and re-score'}
          </button>
        </div>
      </div>
    </div>
  );
}
