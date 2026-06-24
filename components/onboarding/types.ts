import type { Institution, InstitutionType, VisaStatus } from '@/lib/types';

// Working shape while the user fills in onboarding. Everything is optional and
// permissive here, then normalised before it is sent to /api/profile.
export interface ProfileDraft {
  institution: Institution | null;
  institution_type: InstitutionType | null;
  course: string;
  graduation_year: number | null;
  gpa: number | null;
  has_honours: boolean;

  visa_status: VisaStatus;
  nationality: string;

  skills: string[];
  target_role_types: string[];

  internship_months: number;
  internship_companies: string[];
  has_freelance_work: boolean;
  has_personal_projects: boolean;
  project_urls: string[];
  min_salary: number | null;
  notes: string;
}

export interface StepProps {
  draft: ProfileDraft;
  update: (patch: Partial<ProfileDraft>) => void;
}

export const EMPTY_DRAFT: ProfileDraft = {
  institution: null,
  institution_type: null,
  course: '',
  graduation_year: null,
  gpa: null,
  has_honours: false,
  visa_status: 'unknown',
  nationality: '',
  skills: [],
  target_role_types: [],
  internship_months: 0,
  internship_companies: [],
  has_freelance_work: false,
  has_personal_projects: false,
  project_urls: [],
  min_salary: null,
  notes: '',
};

export const ROLE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'data_analyst', label: 'Data Analyst' },
  { value: 'data_engineer', label: 'Data Engineer' },
  { value: 'business_analyst', label: 'Business Analyst' },
  { value: 'product', label: 'Product' },
  { value: 'ux_designer', label: 'UX Designer' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'qa', label: 'QA / Test' },
];
