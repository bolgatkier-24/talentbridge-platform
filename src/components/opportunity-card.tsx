import { Bookmark, CalendarClock, MapPin } from 'lucide-react'

import { DemoBadge, SkillChip } from '@/components/badges'
import { MatchPill } from '@/components/match-meter'
import type { Opportunity } from '@/lib/fixtures'
import { getEmployer } from '@/lib/fixtures'
import type { MatchResult } from '@/lib/matching'
import { cn } from '@/lib/utils'

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function OrgMark({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-lg bg-ink font-display text-sm font-bold text-white',
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function OpportunityCard({
  opportunity: o,
  match,
  saved,
  onOpen,
  onToggleSave,
}: {
  opportunity: Opportunity
  match?: MatchResult
  saved?: boolean
  onOpen?: () => void
  onToggleSave?: () => void
}) {
  const employer = getEmployer(o.employerId)
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border bg-card p-5 transition-shadow hover:shadow-lg hover:shadow-primary/5 motion-reduce:transition-none">
      <div className="mb-4 flex items-start gap-3">
        <OrgMark initials={employer?.initials ?? '?'} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-muted-foreground">{employer?.name}</p>
          <h3 className="text-lg font-bold leading-snug">
            {onOpen ? (
              <button
                type="button"
                onClick={onOpen}
                className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
              >
                {o.title}
              </button>
            ) : (
              o.title
            )}
          </h3>
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${o.title} from saved` : `Save ${o.title}`}
            className="relative z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Bookmark className={cn('size-5', saved && 'fill-primary text-primary')} />
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">{o.type}</span>
        <span className="rounded-full bg-muted px-2.5 py-1">{o.arrangement}</span>
        <span className="rounded-full bg-muted px-2.5 py-1">{o.experienceLevel}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {o.requiredSkills.map((s) => (
          <SkillChip
            key={s}
            skill={s}
            className={match?.matchedSkills.includes(s) ? 'border-primary/40 bg-primary/8 text-primary' : ''}
          />
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4" aria-hidden="true" />
            {o.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="size-4" aria-hidden="true" />
            Closes {formatDate(o.deadline)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t pt-3">
          {match ? <MatchPill match={match} /> : <span className="text-sm font-semibold">{o.stipend}</span>}
          <DemoBadge />
        </div>
      </div>
    </article>
  )
}
