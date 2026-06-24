'use client';

import { VISA_LABELS, type VisaStatus } from '@/lib/types';
import type { StepProps } from './types';

const VISA_HELP: Record<VisaStatus, string> = {
  citizen: 'No work pass needed. Widest set of options, including government roles.',
  pr: 'No work pass needed. Government and statutory roles are open to you too.',
  ep_holder: 'You need an Employment Pass. Only companies that sponsor EP can hire you.',
  s_pass_eligible:
    'You need an S Pass. The role must meet the MOM fixed monthly salary floor and the employer must have quota.',
  student_pass: 'You need a Letter of Consent or a work pass. Confirm with each employer.',
  ltvp: 'You need a Letter of Consent to work. Confirm with each employer.',
  unknown: 'Not sure yet? Pick this and we will keep visa scoring neutral for now.',
};

const ORDER: VisaStatus[] = [
  'citizen',
  'pr',
  's_pass_eligible',
  'ep_holder',
  'student_pass',
  'ltvp',
  'unknown',
];

export function StepVisa({ draft, update }: StepProps) {
  const needsNationality = draft.visa_status !== 'citizen' && draft.visa_status !== 'unknown';

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          What is your work eligibility in Singapore?
        </label>
        <p className="mb-3 text-sm text-muted">
          This is the single biggest filter on where you can realistically apply, so be accurate.
        </p>
        <div className="space-y-2">
          {ORDER.map((status) => {
            const active = draft.visa_status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => update({ visa_status: status })}
                className={`w-full rounded-lg border p-3 text-left ${
                  active ? 'border-primary bg-primary/5' : 'border-line bg-white hover:bg-canvas'
                }`}
              >
                <span className="text-sm font-medium text-ink">{VISA_LABELS[status]}</span>
                <span className="mt-0.5 block text-xs text-muted">{VISA_HELP[status]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {needsNationality && (
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Nationality (optional)</label>
          <input
            value={draft.nationality}
            onChange={(e) => update({ nationality: e.target.value })}
            placeholder="e.g. Malaysian, Indian, Chinese"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
}
