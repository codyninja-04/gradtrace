// Hand-authored Database type for the Supabase client generics, mirroring
// supabase/migrations/001_initial_schema.sql. Regenerate with the Supabase CLI
// if the schema grows:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts

import type { CompanyType, DataConfidence, VisaStatus } from '@/lib/types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          created_at: string;
          data_updated_at: string;
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
          last_verified_by: string | null;
          is_published: boolean;
          tags: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          data_updated_at?: string;
          name: string;
          slug: string;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          industry: string;
          company_type: CompanyType;
          cluster?: string | null;
          employee_count_range?: string | null;
          hires_poly_grads?: boolean;
          hires_uni_grads?: boolean;
          preferred_institutions?: string[];
          required_skills?: string[];
          nice_to_have_skills?: string[];
          sponsors_s_pass?: boolean;
          sponsors_ep?: boolean;
          s_pass_min_salary?: number | null;
          visa_notes?: string | null;
          salary_p25?: number | null;
          salary_p50?: number | null;
          salary_p75?: number | null;
          salary_notes?: string | null;
          common_entry_roles?: string[];
          typical_hiring_timeline?: string | null;
          interview_format?: string | null;
          apply_via?: string | null;
          data_confidence?: DataConfidence;
          last_verified_by?: string | null;
          is_published?: boolean;
          tags?: string[];
        };
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
        Relationships: [];
      };
      user_profiles: {
        Row: {
          user_id: string;
          updated_at: string;
          onboarding_complete: boolean;
          institution: string | null;
          institution_type: string | null;
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
        };
        Insert: {
          user_id: string;
          updated_at?: string;
          onboarding_complete?: boolean;
          institution?: string | null;
          institution_type?: string | null;
          course?: string | null;
          gpa?: number | null;
          graduation_year?: number | null;
          has_honours?: boolean | null;
          visa_status?: VisaStatus;
          nationality?: string | null;
          skills?: string[];
          internship_months?: number;
          internship_companies?: string[];
          has_freelance_work?: boolean;
          has_personal_projects?: boolean;
          project_urls?: string[];
          target_role_types?: string[];
          min_salary?: number | null;
          open_to_contract?: boolean;
          preferred_company_types?: string[];
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
        Relationships: [];
      };
      match_reports: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          profile_snapshot: Json;
          matches: Json;
          salary_analysis: Json;
          action_plan: string | null;
          total_companies_scored: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          profile_snapshot: Json;
          matches: Json;
          salary_analysis?: Json;
          action_plan?: string | null;
          total_companies_scored?: number | null;
        };
        Update: Partial<Database['public']['Tables']['match_reports']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
