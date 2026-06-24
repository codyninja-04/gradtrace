export function OnboardingProgress({ step, total }: { step: number; total: number }) {
  const labels = ['Education', 'Visa', 'Skills', 'Experience'];
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-line'}`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">
        Step {step + 1} of {total}, {labels[step]}
      </p>
    </div>
  );
}
