-- Pro unlock (one-time $15 payment via Stripe) and shareable reports.

-- Set true by the Stripe webhook once a user completes the one-time payment.
alter table user_profiles
  add column if not exists has_pro_report boolean not null default false;

-- Unguessable token for the public, read-only "share with a mentor" report link.
-- A Pro-only feature, but the column lives on every report for simplicity.
alter table match_reports
  add column if not exists share_id uuid not null default uuid_generate_v4();

create unique index if not exists idx_match_reports_share on match_reports(share_id);

-- The share page is rendered server-side with the service-role client keyed by
-- this token, so no public RLS policy is needed and reports stay private by id.
