import { PRO_FEATURES, PRO_PRICE_LABEL } from '@/lib/pro';
import { UpgradeButton } from './UpgradeButton';

export function Paywall({
  userId,
  email,
  title = 'Unlock your full report',
  subtitle = 'A one-time payment, no subscription. This is a tool you use once or twice, so you only pay once.',
}: {
  userId: string;
  email?: string | null;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-white p-6 ring-1 ring-primary/10">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Pro
        </span>
        <span className="text-xs text-muted">One-time {PRO_PRICE_LABEL}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted">{subtitle}</p>

      <ul className="mt-4 space-y-2">
        {PRO_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink">
            <span className="mt-0.5 text-worth-applying">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <UpgradeButton userId={userId} email={email} />
      </div>
    </div>
  );
}
