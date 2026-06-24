'use client';

import { useState } from 'react';
import { ROLE_TYPE_OPTIONS, type StepProps } from './types';

const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'React',
  'Node.js',
  'SQL',
  'C++',
  'Go',
  'HTML/CSS',
  'AWS',
  'Docker',
  'Git',
  'Figma',
  'Excel',
  'Tableau',
  'Machine Learning',
];

export function StepSkills({ draft, update }: StepProps) {
  const [input, setInput] = useState('');

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (draft.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    update({ skills: [...draft.skills, trimmed] });
    setInput('');
  }

  function removeSkill(skill: string) {
    update({ skills: draft.skills.filter((s) => s !== skill) });
  }

  function toggleRole(value: string) {
    update({
      target_role_types: draft.target_role_types.includes(value)
        ? draft.target_role_types.filter((r) => r !== value)
        : [...draft.target_role_types, value],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Your skills</label>
        <p className="mb-3 text-sm text-muted">
          Add the tools and languages you can actually use. These are matched against what companies
          require for entry-level roles.
        </p>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(input);
              }
            }}
            placeholder="Type a skill and press Enter"
            className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => addSkill(input)}
            className="rounded-lg bg-primary px-4 text-sm font-medium text-white hover:opacity-90"
          >
            Add
          </button>
        </div>

        {draft.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {draft.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-worth-applying/10 px-3 py-1 text-sm text-worth-applying"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-worth-applying/70 hover:text-worth-applying"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Quick add
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_SKILLS.filter(
              (s) => !draft.skills.some((d) => d.toLowerCase() === s.toLowerCase())
            ).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="rounded-full bg-white px-3 py-1 text-sm text-muted ring-1 ring-line hover:bg-canvas hover:text-ink"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          What roles are you targeting?
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROLE_TYPE_OPTIONS.map((opt) => {
            const active = draft.target_role_types.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleRole(opt.value)}
                className={`rounded-full px-3 py-1.5 text-sm ring-1 ${
                  active
                    ? 'bg-primary text-white ring-primary'
                    : 'bg-white text-ink ring-line hover:bg-canvas'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
