import type {
  Company,
  CompanyMatch,
  MatchLabel,
  ScoreBreakdown,
  UserProfile,
} from '@/lib/types';

const POLY_INSTITUTIONS = ['tp', 'sp', 'np', 'nyp', 'rp'];
const UNI_INSTITUTIONS = ['nus', 'ntu', 'smu', 'sit', 'sutd', 'sim'];

// MOM fixed monthly salary floor for S Pass. Review after each Budget.
export const S_PASS_MINIMUM = 3150;

// Baseline figures for a Singapore poly fresh grad, used when we have no
// matched companies with salary data to aggregate from.
const POLY_BASELINE = { p25: 2400, p50: 2800, p75: 3400 };

/**
 * Deterministic match scoring. No AI is involved here, the score is fully
 * explainable from the breakdown so users can see exactly why a company ranks
 * where it does.
 */
export function calculateMatchScore(profile: UserProfile, company: Company): CompanyMatch {
  const breakdown: ScoreBreakdown = {
    institution_match: 0,
    visa_compatibility: 0,
    skills_match: 0,
    experience_match: 0,
  };
  const blockers: string[] = [];

  // ━━━ INSTITUTION MATCH (0-30 points) ━━━
  const isPolyGrad = !!profile.institution && POLY_INSTITUTIONS.includes(profile.institution);
  const isUniGrad = !!profile.institution && UNI_INSTITUTIONS.includes(profile.institution);

  if (profile.institution && company.preferred_institutions.includes(profile.institution)) {
    breakdown.institution_match = 30; // exact match, top preference
  } else if (isPolyGrad && company.hires_poly_grads) {
    breakdown.institution_match = 20;
  } else if (isUniGrad && company.hires_uni_grads) {
    breakdown.institution_match = 25;
  } else if (isPolyGrad && !company.hires_poly_grads) {
    breakdown.institution_match = 0;
    blockers.push(`${company.name} rarely hires polytechnic diploma holders for this role type`);
  } else {
    breakdown.institution_match = 10; // unknown / overseas
  }

  // ━━━ VISA COMPATIBILITY (0-25 points) ━━━
  // The most binary dimension, visa blockers are hard walls.
  switch (profile.visa_status) {
    case 'citizen':
    case 'pr':
      breakdown.visa_compatibility = 25; // no restrictions
      break;

    case 's_pass_eligible':
      if (company.sponsors_s_pass) {
        const sPassMin = company.s_pass_min_salary || S_PASS_MINIMUM;
        const expectedSalary = company.salary_p50 || 3000;
        if (expectedSalary >= sPassMin) {
          breakdown.visa_compatibility = 20;
        } else {
          breakdown.visa_compatibility = 10;
          blockers.push(`Role salary may be below the S Pass minimum of $${sPassMin}/month`);
        }
      } else {
        breakdown.visa_compatibility = 0;
        blockers.push(`${company.name} does not sponsor S Pass`);
      }
      break;

    case 'ep_holder':
      if (company.sponsors_ep) {
        breakdown.visa_compatibility = 22;
      } else {
        breakdown.visa_compatibility = 0;
        blockers.push(`${company.name} does not sponsor Employment Passes`);
      }
      break;

    case 'student_pass':
    case 'ltvp':
      breakdown.visa_compatibility = 5;
      blockers.push('Student pass holders need a Letter of Consent from MOM, confirm with each company');
      break;

    default:
      breakdown.visa_compatibility = 10;
  }

  // ━━━ SKILLS MATCH (0-25 points) ━━━
  if (company.required_skills.length > 0 && profile.skills.length > 0) {
    const lowerProfileSkills = profile.skills.map((s) => s.toLowerCase());
    const lowerRequired = company.required_skills.map((r) => r.toLowerCase());
    const lowerNice = company.nice_to_have_skills.map((r) => r.toLowerCase());

    const requiredMatches = lowerProfileSkills.filter((s) => lowerRequired.includes(s)).length;
    const niceMatches = lowerProfileSkills.filter((s) => lowerNice.includes(s)).length;

    const requiredRatio = requiredMatches / company.required_skills.length;
    breakdown.skills_match = Math.round(requiredRatio * 20) + Math.min(niceMatches * 2, 5);
    breakdown.skills_match = Math.min(breakdown.skills_match, 25);

    if (requiredRatio < 0.3) {
      blockers.push(
        `Skills gap: missing ${company.required_skills.length - requiredMatches} of ${company.required_skills.length} commonly required skills`
      );
    }
  } else {
    breakdown.skills_match = 12; // neutral when we have no data either way
  }

  // ━━━ EXPERIENCE MATCH (0-20 points) ━━━
  if (profile.internship_months >= 6) {
    breakdown.experience_match = 20;
  } else if (profile.internship_months >= 3) {
    breakdown.experience_match = 14;
  } else if (profile.internship_months > 0) {
    breakdown.experience_match = 8;
  } else if (profile.has_personal_projects) {
    breakdown.experience_match = 5; // no full internship, but has projects
  } else {
    breakdown.experience_match = 0;
    if (company.company_type === 'mnc') {
      blockers.push('Most MNCs prefer candidates with at least 3 months of internship experience');
    }
  }

  const totalScore = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

  let match_label: MatchLabel;
  if (totalScore >= 75) match_label = 'apply_now';
  else if (totalScore >= 50) match_label = 'worth_applying';
  else if (totalScore >= 30) match_label = 'stretch';
  else match_label = 'not_recommended';

  // Recommend roles based on the user's target plus what the company hires for.
  const recommended_roles =
    profile.target_role_types.length > 0
      ? company.common_entry_roles.filter((role) =>
          profile.target_role_types.some((target) =>
            role.toLowerCase().includes(target.replace(/_/g, ' ').toLowerCase())
          )
        )
      : company.common_entry_roles.slice(0, 2);

  return {
    company,
    score: totalScore,
    score_breakdown: breakdown,
    recommended_roles,
    match_label,
    blockers,
  };
}

export function calculateSalaryAnalysis(
  profile: UserProfile,
  topMatches: CompanyMatch[]
): {
  expected_p25: number;
  expected_p50: number;
  expected_p75: number;
  meets_s_pass_threshold: boolean;
  skills_for_p75: string[];
} {
  const relevantCompanies = topMatches
    .filter((m) => m.score >= 50 && m.company.salary_p50)
    .map((m) => m.company);

  if (relevantCompanies.length === 0) {
    return {
      expected_p25: POLY_BASELINE.p25,
      expected_p50: POLY_BASELINE.p50,
      expected_p75: POLY_BASELINE.p75,
      meets_s_pass_threshold:
        profile.visa_status === 'citizen' ||
        profile.visa_status === 'pr' ||
        POLY_BASELINE.p50 >= S_PASS_MINIMUM,
      skills_for_p75: [],
    };
  }

  const p25s = relevantCompanies.filter((c) => c.salary_p25).map((c) => c.salary_p25!);
  const p50s = relevantCompanies.filter((c) => c.salary_p50).map((c) => c.salary_p50!);
  const p75s = relevantCompanies.filter((c) => c.salary_p75).map((c) => c.salary_p75!);

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const roundTo100 = (n: number) => Math.round(n / 100) * 100;

  const expected_p50 = roundTo100(avg(p50s));

  // Skills from high-salary companies the user does not yet have.
  const highSalaryCompanies = relevantCompanies.filter(
    (c) => (c.salary_p75 || 0) >= expected_p50 * 1.15
  );
  const lowerProfileSkills = profile.skills.map((s) => s.toLowerCase());
  const missingSkills = highSalaryCompanies
    .flatMap((c) => c.required_skills)
    .filter((skill) => !lowerProfileSkills.includes(skill.toLowerCase()));

  const skillFreq = missingSkills.reduce<Record<string, number>>((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  const skills_for_p75 = Object.entries(skillFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([skill]) => skill);

  return {
    expected_p25: roundTo100(avg(p25s.length ? p25s : [expected_p50 * 0.85])),
    expected_p50,
    expected_p75: roundTo100(avg(p75s.length ? p75s : [expected_p50 * 1.2])),
    meets_s_pass_threshold: expected_p50 >= S_PASS_MINIMUM,
    skills_for_p75,
  };
}
