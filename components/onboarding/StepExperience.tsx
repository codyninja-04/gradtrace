'use client';

import { useState } from 'react';
import type { StepProps } from './types';

export function StepExperience({ draft, update }: StepProps) {
  const [companyInput, setCompanyInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  function addCompany() {
    const v = companyInput.trim();
    if (!v || draft.internship_companies.includes(v)) return;
    update({ internship_companies: [...draft.internship_companies, v] });
    setCompanyInput('');
  }

  function addUrl() {
    const v = urlInput.trim();
    if (!v || draft.project_urls.includes(v)) return;
    update({ project_urls: [...draft.project_urls, v] });
    setUrlInput('');
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Total internship experience
        </label>
        <p className="mb-2 text-sm text-muted">
          Add up all your internships in months. This carries real weight, especially for MNCs.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={18}
            value={draft.internship_months}
            onChange={(e) => update({ internship_months: Number(e.target.value) })}
            className="flex-1 accent-primary"
          />
          <span className="w-20 text-sm font-medium text-ink">
            {draft.internship_months} {draft.internship_months === 1 ? 'month' : 'months'}
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Internship companies (optional)
        </label>
        <div className="flex gap-2">
          <input
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCompany();
              }
            }}
            placeholder="e.g. DBS, a local startup"
            className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={addCompany}
            className="rounded-lg bg-primary px-4 text-sm font-medium text-white hover:opacity-90"
          >
            Add
          </button>
        </div>
        {draft.internship_companies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {draft.internship_companies.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-ink ring-1 ring-line"
              >
                {c}
                <button
                  type="button"
                  onClick={() =>
                    update({
                      internship_companies: draft.internship_companies.filter((x) => x !== c),
                    })
                  }
                  aria-label={`Remove ${c}`}
                  className="text-muted hover:text-ink"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 rounded-lg border border-line bg-white p-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={draft.has_personal_projects}
            onChange={(e) => update({ has_personal_projects: e.target.checked })}
            className="h-4 w-4 rounded border-line"
          />
          I have personal projects
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-line bg-white p-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={draft.has_freelance_work}
            onChange={(e) => update({ has_freelance_work: e.target.checked })}
            className="h-4 w-4 rounded border-line"
          />
          I have freelance or paid work
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Portfolio links (optional)
        </label>
        <p className="mb-2 text-sm text-muted">
          GitHub or a portfolio site can genuinely close the poly versus uni gap in tech roles.
        </p>
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="https://github.com/yourname"
            className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={addUrl}
            className="rounded-lg bg-primary px-4 text-sm font-medium text-white hover:opacity-90"
          >
            Add
          </button>
        </div>
        {draft.project_urls.length > 0 && (
          <ul className="mt-2 space-y-1">
            {draft.project_urls.map((u) => (
              <li key={u} className="flex items-center justify-between text-sm">
                <span className="truncate text-primary">{u}</span>
                <button
                  type="button"
                  onClick={() => update({ project_urls: draft.project_urls.filter((x) => x !== u) })}
                  className="ml-2 text-muted hover:text-ink"
                  aria-label={`Remove ${u}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Minimum salary you would accept (optional)
          </label>
          <input
            type="number"
            value={draft.min_salary ?? ''}
            onChange={(e) => update({ min_salary: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 3000"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Anything else for your action plan? (optional)
        </label>
        <textarea
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={3}
          placeholder="e.g. I want to move into data, I can only start in August, I prefer smaller teams"
          className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
