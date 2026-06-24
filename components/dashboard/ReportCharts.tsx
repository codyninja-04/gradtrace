'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { StoredMatch } from '@/lib/types';

const BUCKETS = [
  { label: '0-29', min: 0, max: 29, color: '#6B7280' },
  { label: '30-49', min: 30, max: 49, color: '#D97706' },
  { label: '50-74', min: 50, max: 74, color: '#16A34A' },
  { label: '75-100', min: 75, max: 100, color: '#166534' },
];

export function ScoreDistributionChart({ matches }: { matches: StoredMatch[] }) {
  const data = BUCKETS.map((b) => ({
    label: b.label,
    color: b.color,
    count: matches.filter((m) => m.score >= b.min && m.score <= b.max).length,
  }));

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-line">
      <h2 className="text-sm font-semibold text-ink">Match score distribution</h2>
      <p className="mt-0.5 text-xs text-muted">How the companies you were scored against stack up.</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SkillGapChart({
  skills,
}: {
  skills: { skill: string; have: boolean }[];
}) {
  if (skills.length === 0) return null;
  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-line">
      <h2 className="text-sm font-semibold text-ink">Skill gap</h2>
      <p className="mt-0.5 text-xs text-muted">
        Green is what you have. Outlined is what your top targets commonly ask for that you do not
        list yet.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s.skill}
            className={
              s.have
                ? 'rounded-full bg-worth-applying/10 px-2.5 py-1 text-xs text-worth-applying'
                : 'rounded-full px-2.5 py-1 text-xs text-muted ring-1 ring-line'
            }
          >
            {s.skill}
          </span>
        ))}
      </div>
    </div>
  );
}
