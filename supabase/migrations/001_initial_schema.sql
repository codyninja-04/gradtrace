create extension if not exists "uuid-ossp";

-- The company database, the main moat of this product.
create table companies (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  data_updated_at timestamptz default now(),

  -- Identity
  name text not null,
  slug text unique not null, -- for URL
  website text,
  logo_url text,
  description text,

  -- Classification
  industry text not null, -- 'fintech', 'ecommerce', 'gaming', 'govtech', 'consulting', 'saas', etc.
  company_type text not null check (company_type in ('startup', 'scaleup', 'mnc', 'government', 'sme', 'statutory_board')),
  cluster text, -- 'singhealth', 'nhgp', 'dsta', etc. (for government/statutory)
  employee_count_range text, -- '1-10', '11-50', '51-200', '201-1000', '1000+'

  -- Hiring preferences (the core scoring inputs)
  hires_poly_grads boolean not null default false,
  hires_uni_grads boolean not null default true,
  preferred_institutions text[] default '{}', -- specific schools they prefer
  required_skills text[] default '{}', -- skills they commonly require for entry roles
  nice_to_have_skills text[] default '{}',

  -- Visa sponsorship
  sponsors_s_pass boolean not null default false,
  sponsors_ep boolean not null default false,
  s_pass_min_salary integer, -- MOM's minimum fixed monthly salary for S Pass
  visa_notes text, -- e.g. "Sponsors S Pass for tech roles only, not ops"

  -- Salary data (SGD/month)
  salary_p25 integer, -- 25th percentile for fresh entry roles
  salary_p50 integer, -- median
  salary_p75 integer, -- 75th percentile
  salary_notes text, -- e.g. "Includes performance bonus for certain roles"

  -- Hiring process
  common_entry_roles text[] default '{}',
  typical_hiring_timeline text, -- e.g. "2-4 weeks from application to offer"
  interview_format text, -- e.g. "1 HR screen + 1-2 technical rounds + hiring manager"
  apply_via text, -- 'linkedin', 'company_website', 'mycareersfuture', 'referral_heavy'

  -- Data quality
  data_confidence text default 'medium' check (data_confidence in ('high', 'medium', 'low')),
  last_verified_by text, -- internal note on source

  -- Discoverability
  is_published boolean default true,
  tags text[] default '{}'
);

-- User profiles (the other side of the match).
create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  updated_at timestamptz default now(),
  onboarding_complete boolean default false,

  -- Education
  institution text, -- 'tp', 'sp', 'np', 'nyp', 'rp', 'nus', 'ntu', 'smu', 'sit', 'sutd', 'sim', 'other'
  institution_type text check (institution_type in ('polytechnic', 'university', 'private', 'overseas')),
  course text,
  gpa numeric(3,2), -- optional
  graduation_year integer,
  has_honours boolean,

  -- Visa
  visa_status text not null default 'unknown'
    check (visa_status in ('citizen', 'pr', 'ep_holder', 's_pass_eligible', 'student_pass', 'ltvp', 'unknown')),
  nationality text, -- ISO country code

  -- Experience
  skills text[] default '{}',
  internship_months integer default 0,
  internship_companies text[] default '{}',
  has_freelance_work boolean default false,
  has_personal_projects boolean default false,
  project_urls text[] default '{}', -- GitHub, portfolio, etc.

  -- Preferences
  target_role_types text[] default '{}', -- 'software_engineer', 'data_analyst', 'business_analyst', etc.
  min_salary integer, -- their minimum acceptable salary
  open_to_contract boolean default false,
  preferred_company_types text[] default '{}',

  -- Optional context
  notes text -- anything else they want Claude to know for the action plan
);

-- Match reports (computed results stored here).
create table match_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  profile_snapshot jsonb not null, -- copy of profile at time of generation
  matches jsonb not null, -- [{company_id, company_name, score, score_breakdown, recommended_roles}]
  salary_analysis jsonb, -- {expected_range, p25, p50, skills_that_unlock_p75}
  action_plan text, -- Claude-generated markdown
  total_companies_scored integer
);

-- Indexes
create index idx_companies_industry on companies(industry);
create index idx_companies_type on companies(company_type);
create index idx_companies_poly on companies(hires_poly_grads) where hires_poly_grads = true;
create index idx_companies_s_pass on companies(sponsors_s_pass) where sponsors_s_pass = true;
create index idx_match_reports_user on match_reports(user_id, created_at desc);

-- RLS
alter table user_profiles enable row level security;
alter table match_reports enable row level security;

create policy "own_profile" on user_profiles for all using (auth.uid() = user_id);
create policy "own_reports" on match_reports for all using (auth.uid() = user_id);

-- Companies are read-only for all authenticated users.
alter table companies enable row level security;
create policy "companies_readable" on companies for select using (is_published = true);
