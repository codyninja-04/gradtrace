import Anthropic from '@anthropic-ai/sdk';
import type { CompanyMatch, SalaryAnalysis, UserProfile } from '@/lib/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

/**
 * Claude is used for exactly one thing in GradTrace: turning a finished,
 * deterministic match result into a concrete 4-week action plan. The scoring
 * itself never touches an LLM.
 */
export async function generateActionPlan(
  profile: UserProfile,
  topMatches: CompanyMatch[],
  salaryAnalysis: SalaryAnalysis
): Promise<string> {
  const applyNow = topMatches.filter((m) => m.match_label === 'apply_now').slice(0, 5);
  const worthApplying = topMatches.filter((m) => m.match_label === 'worth_applying').slice(0, 8);
  const stretch = topMatches.filter((m) => m.match_label === 'stretch').slice(0, 3);

  const profileSummary = {
    institution: profile.institution,
    institution_type: profile.institution_type,
    graduation_year: profile.graduation_year,
    visa_status: profile.visa_status,
    skills: profile.skills,
    internship_months: profile.internship_months,
    target_roles: profile.target_role_types,
    expected_salary: salaryAnalysis.expected_p50,
    meets_s_pass: salaryAnalysis.meets_s_pass_threshold,
    skills_gap: salaryAnalysis.skills_for_p75,
    notes: profile.notes,
  };

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `You are a career coach who specializes in helping fresh graduates find jobs in Singapore. You give brutally specific, realistic advice. You understand:

- The real difference between polytechnic and university hiring pipelines in Singapore
- Which companies genuinely welcome poly diploma holders vs which ones say they do but filter them out
- How S Pass works (MOM fixed monthly salary threshold, quota system, employer levy)
- That fresh grads waste months applying to companies they have no chance at
- That LinkedIn cold messages sent by fresh grads in SG are often too formal and too long
- That NodeFlair and MyCareersFuture are better job sources than LinkedIn for SG fresh grads
- That a good GitHub portfolio can genuinely compensate for poly vs uni background in tech roles

Write a 4-week action plan in Markdown. Be specific:
- Name actual companies from the provided match list
- Give real LinkedIn outreach advice with actual message structure
- Suggest specific certifications or skills only if they're achievable in the timeframe
- Acknowledge the visa situation directly if it limits options
- Don't pad with generic "network and apply broadly" advice
- Structure as: Week 1, Week 2, Week 3, Week 4 with bullet points under each`,

    messages: [
      {
        role: 'user',
        content: `Generate a 4-week job search action plan.

Graduate profile: ${JSON.stringify(profileSummary, null, 2)}

Apply immediately (75+ match score): ${JSON.stringify(
          applyNow.map((m) => ({
            company: m.company.name,
            type: m.company.company_type,
            roles: m.recommended_roles,
          })),
          null,
          2
        )}

Worth applying (50-74 match): ${JSON.stringify(
          worthApplying.map((m) => ({ company: m.company.name, roles: m.recommended_roles })),
          null,
          2
        )}

Stretch targets (30-49 match): ${JSON.stringify(
          stretch.map((m) => ({ company: m.company.name, blocker: m.blockers[0] })),
          null,
          2
        )}

Skills they should build for higher salary: ${salaryAnalysis.skills_for_p75.join(', ')}

Make this specific to their exact situation. Don't use placeholder names.`,
      },
    ],
  });

  const first = response.content[0];
  return first && first.type === 'text' ? first.text : '';
}
