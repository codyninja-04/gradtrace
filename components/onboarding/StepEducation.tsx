'use client';

import { INSTITUTION_LABELS, type Institution, type InstitutionType } from '@/lib/types';
import type { StepProps } from './types';

const POLY: Institution[] = ['tp', 'sp', 'np', 'nyp', 'rp'];
const UNI: Institution[] = ['nus', 'ntu', 'smu', 'sit', 'sutd', 'sim'];
const OTHER: Institution[] = ['overseas', 'private', 'other'];

function institutionType(inst: Institution): InstitutionType {
  if (POLY.includes(inst)) return 'polytechnic';
  if (UNI.includes(inst)) return 'university';
  if (inst === 'overseas') return 'overseas';
  return 'private';
}

export function StepEducation({ draft, update }: StepProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Where did you study?</label>
        <div className="space-y-3">
          {[
            { heading: 'Polytechnics', items: POLY },
            { heading: 'Universities', items: UNI },
            { heading: 'Other', items: OTHER },
          ].map((group) => (
            <div key={group.heading}>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
                {group.heading}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((inst) => {
                  const active = draft.institution === inst;
                  return (
                    <button
                      key={inst}
                      type="button"
                      onClick={() =>
                        update({ institution: inst, institution_type: institutionType(inst) })
                      }
                      className={`rounded-full px-3 py-1.5 text-sm ring-1 ${
                        active
                          ? 'bg-primary text-white ring-primary'
                          : 'bg-white text-ink ring-line hover:bg-canvas'
                      }`}
                    >
                      {INSTITUTION_LABELS[inst]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Course</label>
          <input
            value={draft.course}
            onChange={(e) => update({ course: e.target.value })}
            placeholder="e.g. Diploma in Information Technology"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Graduation year</label>
          <input
            type="number"
            value={draft.graduation_year ?? ''}
            min={2000}
            max={currentYear + 6}
            onChange={(e) =>
              update({ graduation_year: e.target.value ? Number(e.target.value) : null })
            }
            placeholder={String(currentYear)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">GPA (optional)</label>
          <input
            type="number"
            step="0.01"
            value={draft.gpa ?? ''}
            onChange={(e) => update({ gpa: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 3.6"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={draft.has_honours}
            onChange={(e) => update({ has_honours: e.target.checked })}
            className="h-4 w-4 rounded border-line"
          />
          Graduated with honours / merit
        </label>
      </div>
    </div>
  );
}
