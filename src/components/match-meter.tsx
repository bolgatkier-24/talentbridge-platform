import { Check, X } from 'lucide-react'

import type { MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

export function MatchPill({ match, className }: { match: MatchResult; className?: string }) {
  const tone =
    match.score >= 75
      ? 'bg-primary text-primary-foreground'
      : match.score >= 55
        ? 'bg-secondary text-secondary-foreground'
        : 'bg-muted text-muted-foreground'
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', tone, className)}
    >
      <span className="tabular-nums">{match.score}%</span>
      <span className="font-semibold opacity-90">{match.label}</span>
    </span>
  )
}

export function MatchBreakdown({ match }: { match: MatchResult }) {
  return (
    <div className="rounded-xl border bg-secondary/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold">{match.summary}</p>
        <span className="font-display text-2xl font-bold tabular-nums text-primary">
          {match.score}%
        </span>
      </div>
      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-border"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={match.score}
        aria-label="Match score"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${match.score}%` }} />
      </div>
      <ul className="space-y-1.5 text-sm">
        {match.reasons.map((r) => (
          <li key={r.text} className="flex items-start gap-2">
            {r.ok ? (
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-label="Meets" />
            ) : (
              <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="Doesn't meet" />
            )}
            <span className={r.ok ? '' : 'text-muted-foreground'}>{r.text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Rule-based score: skills 55%, type 15%, location 15%, experience 10%, interests 5%. Verified
        skills count more than claimed ones.
      </p>
    </div>
  )
}
