// Shared domain types for GradTrace. The match label strings here are kept in
// sync with the colour names in tailwind.config.ts.

export type Institution =
  | 'tp' | 'sp' | 'np' | 'nyp' | 'rp' // polytechnics
  | 'nus' | 'ntu' | 'smu' | 'sit' | 'sutd' | 'sim' // universities
  | 'overseas' | 'private' | 'other';

export type InstitutionType = 'polytechnic' | 'university' | 'private' | 'overseas';

export type VisaStatus =
  | 'citizen'
  | 'pr'
  | 'ep_holder'
  | 's_pass_eligible'
  | 'student_pass'
  | 'ltvp'
  | 'unknown';

export type CompanyType =
  | 'startup'
  | 'scaleup'
  | 'mnc'
  | 'government'
  | 'sme'
  | 'statutory_board';

export type DataConfidence = 'high' | 'medium' | 'low';

export type MatchLabel = 'apply_now' | 'worth_applying' | 'stretch' | 'not_recommended';

export interface UserProfile {
  user_id: string;
  institution: Institution | null;
  institution_type: InstitutionType | null;
  course: string | null;
  gpa: number | null;
  graduation_year: number | null;
  has_honours: boolean | null;
  visa_status: VisaStatus;
  nationality: string | null;
  skills: string[];
  internship_months: number;
  internship_companies: string[];
  has_freelance_work: boolean;
  has_personal_projects: boolean;
  project_urls: string[];
  target_role_types: string[];
  min_salary: number | null;
  open_to_contract: boolean;
  preferred_company_types: string[];
  notes: string | null;
  onboarding_complete: boolean;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  industry: string;
  company_type: CompanyType;
  cluster: string | null;
  employee_count_range: string | null;
  hires_poly_grads: boolean;
  hires_uni_grads: boolean;
  preferred_institutions: string[];
  required_skills: string[];
  nice_to_have_skills: string[];
  sponsors_s_pass: boolean;
  sponsors_ep: boolean;
  s_pass_min_salary: number | null;
  visa_notes: string | null;
  salary_p25: number | null;
  salary_p50: number | null;
  salary_p75: number | null;
  salary_notes: string | null;
  common_entry_roles: string[];
  typical_hiring_timeline: string | null;
  interview_format: string | null;
  apply_via: string | null;
  data_confidence: DataConfidence;
  tags: string[];
}

export interface ScoreBreakdown {
  institution_match: number; // 0-30
  visa_compatibility: number; // 0-25
  skills_match: number; // 0-25
  experience_match: number; // 0-20
}

export interface CompanyMatch {
  company: Company;
  score: number; // 0-100
  score_breakdown: ScoreBreakdown;
  recommended_roles: string[];
  match_label: MatchLabel;
  blockers: string[];
}

export interface SalaryAnalysis {
  expected_p25: number;
  expected_p50: number;
  expected_p75: number;
  meets_s_pass_threshold: boolean;
  skills_for_p75: string[];
}

// The shape stored inside match_reports.matches (a trimmed CompanyMatch without
// the full nested company record).
export interface StoredMatch {
  company_id: string;
  company_name: string;
  score: number;
  score_breakdown: ScoreBreakdown;
  match_label: MatchLabel;
  recommended_roles: string[];
  blockers: string[];
}

export interface MatchReport {
  id: string;
  user_id: string;
  created_at: string;
  profile_snapshot: UserProfile;
  matches: StoredMatch[];
  salary_analysis: SalaryAnalysis | null;
  action_plan: string | null;
  total_companies_scored: number | null;
}

// Human-readable labels shared across the UI.
export const INSTITUTION_LABELS: Record<Institution, string> = {
  tp: 'Temasek Polytechnic',
  sp: 'Singapore Polytechnic',
  np: 'Ngee Ann Polytechnic',
  nyp: 'Nanyang Polytechnic',
  rp: 'Republic Polytechnic',
  nus: 'NUS',
  ntu: 'NTU',
  smu: 'SMU',
  sit: 'SIT',
  sutd: 'SUTD',
  sim: 'SIM',
  overseas: 'Overseas university',
  private: 'Private university',
  other: 'Other',
};

export const VISA_LABELS: Record<VisaStatus, string> = {
  citizen: 'Singapore Citizen',
  pr: 'Permanent Resident',
  ep_holder: 'Employment Pass holder',
  s_pass_eligible: 'S Pass eligible',
  student_pass: 'Student Pass',
  ltvp: 'Long-Term Visit Pass',
  unknown: 'Not sure yet',
};

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  startup: 'Startup',
  scaleup: 'Scaleup',
  mnc: 'MNC',
  government: 'Government',
  sme: 'SME',
  statutory_board: 'Statutory Board',
};

export const MATCH_LABEL_TEXT: Record<MatchLabel, string> = {
  apply_now: 'Apply now',
  worth_applying: 'Worth applying',
  stretch: 'Stretch',
  not_recommended: 'Not recommended',
};
