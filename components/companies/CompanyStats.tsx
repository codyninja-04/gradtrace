import type { Company } from '@/lib/types';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

export function CompanyStats({ company }: { company: Company }) {
  const salary =
    company.salary_p25 && company.salary_p75
      ? `$${company.salary_p25.toLocaleString()} - $${company.salary_p75.toLocaleString()}/month`
      : company.salary_p50
        ? `~$${company.salary_p50.toLocaleString()}/month`
        : 'Not enough data';

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-line">
      <h2 className="mb-2 text-sm font-semibold text-ink">Key facts</h2>
      <Row label="Hires poly grads" value={company.hires_poly_grads ? 'Yes' : 'Rarely'} />
      <Row label="Hires uni grads" value={company.hires_uni_grads ? 'Yes' : 'No'} />
      <Row
        label="Sponsors S Pass"
        value={
          company.sponsors_s_pass
            ? company.s_pass_min_salary
              ? `Yes ($${company.s_pass_min_salary.toLocaleString()}/month min)`
              : 'Yes'
            : 'No'
        }
      />
      <Row label="Sponsors EP" value={company.sponsors_ep ? 'Yes' : 'No'} />
      <Row label="Entry salary range" value={salary} />
      {company.salary_notes && <Row label="Salary notes" value={company.salary_notes} />}
      {company.visa_notes && <Row label="Visa notes" value={company.visa_notes} />}
      {company.typical_hiring_timeline && (
        <Row label="Hiring timeline" value={company.typical_hiring_timeline} />
      )}
      {company.interview_format && (
        <Row label="Interview format" value={company.interview_format} />
      )}
      {company.required_skills.length > 0 && (
        <Row label="Commonly required" value={company.required_skills.join(', ')} />
      )}
      {company.nice_to_have_skills.length > 0 && (
        <Row label="Nice to have" value={company.nice_to_have_skills.join(', ')} />
      )}
    </div>
  );
}
