'use client';

import { Fragment, useState } from 'react';

// Renders **bold** segments inside a line, leaving the rest as plain text.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Minimal Markdown renderer, just enough for the action plan output (headings,
// bullet and numbered lists, bold, paragraphs). Avoids pulling in a dependency.
function renderMarkdown(md: string) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => <li key={i}>{renderInline(item)}</li>);
    blocks.push(
      list.ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const content = renderInline(heading[2]);
      if (level === 3) blocks.push(<h3 key={blocks.length}>{content}</h3>);
      else blocks.push(<h2 key={blocks.length}>{content}</h2>);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }

    flushList();
    blocks.push(<p key={blocks.length}>{renderInline(line)}</p>);
  }

  flushList();
  return blocks;
}

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
