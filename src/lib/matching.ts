import type { Opportunity, TalentProfile } from '@/lib/fixtures'
import { verifiedSkills } from '@/lib/fixtures'

/**
 * Transparent, rule-based matching. No machine learning: every point in the
 * score comes from a rule a person can read and argue with.
 *
 * Weights (total 100):
 *   Skills ............ 55  (verified skills count fully, claimed skills count 60%)
 *   Opportunity type .. 15
 *   Work arrangement .. 15  (remote always fits; otherwise same city or accepted arrangement)
 *   Experience level .. 10
 *   Interests ......... 5
 */
export interface MatchResult {
  score: number
  label: 'Strong match' | 'Good match' | 'Partial match' | 'Low match'
  summary: string
  reasons: { ok: boolean; text: string }[]
  matchedSkills: string[]
  missingSkills: string[]
}

const LEVEL_ORDER = ['No experience', 'Entry', 'Intermediate'] as const

export function matchTalentToOpportunity(
  t: TalentProfile,
  o: Opportunity,
): MatchResult {
  const verified = new Set(verifiedSkills(t))
  const claimed = new Set(t.skills)
  const req = o.requiredSkills
  const matchedSkills = req.filter((s) => claimed.has(s) || verified.has(s))
  const missingSkills = req.filter((s) => !matchedSkills.includes(s))
  const verifiedMatches = req.filter((s) => verified.has(s))

  const skillPoints = req.length
    ? req.reduce((sum, s) => sum + (verified.has(s) ? 1 : claimed.has(s) ? 0.6 : 0), 0) /
      req.length
    : 1
  const typeOk = t.preferences.includes(o.type)
  const sameCity = o.location.split(',')[0] === t.location.split(',')[0]
  const arrangementOk =
    o.arrangement === 'Remote'
      ? true
      : sameCity && t.remotePreference.includes(o.arrangement)
  const levelOk =
    LEVEL_ORDER.indexOf(t.experienceLevel) >= LEVEL_ORDER.indexOf(o.experienceLevel)
  const interestOk = t.interests.some((i) =>
    (o.description + o.tags.join(' ')).toLowerCase().includes(i.toLowerCase().split(' ')[0]),
  )

  const score = Math.round(
    skillPoints * 55 +
      (typeOk ? 15 : 0) +
      (arrangementOk ? 15 : 0) +
      (levelOk ? 10 : 0) +
      (interestOk ? 5 : 0),
  )
  const label =
    score >= 75 ? 'Strong match' : score >= 55 ? 'Good match' : score >= 35 ? 'Partial match' : 'Low match'

  const reasons = [
    {
      ok: matchedSkills.length > 0,
      text: `You have ${matchedSkills.length} of ${req.length} required skills${
        verifiedMatches.length ? ` (${verifiedMatches.length} verified)` : ''
      }`,
    },
    {
      ok: typeOk,
      text: typeOk
        ? `${o.type} is one of your preferred opportunity types`
        : `${o.type} isn’t in your preferred types`,
    },
    {
      ok: arrangementOk,
      text:
        o.arrangement === 'Remote'
          ? 'Remote — works from your location'
          : arrangementOk
            ? `${o.arrangement} in ${o.location.split(',')[0]}, where you are based`
            : `${o.arrangement} in ${o.location} — outside your location or preference`,
    },
    {
      ok: levelOk,
      text: levelOk
        ? `Open to your experience level (${o.experienceLevel})`
        : `Asks for ${o.experienceLevel} experience`,
    },
  ]
  if (interestOk) reasons.push({ ok: true, text: 'Relates to one of your interests' })

  const summary = `${label} because you have ${matchedSkills.length} of the ${req.length} required skills${
    verifiedMatches.length ? `, ${verifiedMatches.length} of them verified` : ''
  }.`

  return { score, label, summary, reasons, matchedSkills, missingSkills }
}
