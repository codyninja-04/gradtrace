'use client';

import { useState } from 'react';

export function ShareReportButton({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; fall back to selecting the visible input.
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-line">
      <h2 className="text-sm font-semibold text-ink">Share this report</h2>
      <p className="mt-0.5 text-xs text-muted">
        A private, read-only link. Anyone with it can view your report, so only send it to people you
        trust, like a mentor.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          readOnly
          value={shareUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-muted outline-none"
        />
        <button
          onClick={copy}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
