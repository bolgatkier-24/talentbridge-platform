import { BadgeCheck, CircleDashed, Clock, ShieldCheck, XCircle } from 'lucide-react'

import type { ProofStatus } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export function VerifiedSkillBadge({
  skill,
  className,
}: {
  skill: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground',
        className,
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      {skill}
      <span className="sr-only">(verified)</span>
    </span>
  )
}

export function SkillChip({ skill, className }: { skill: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border bg-card px-2.5 py-1 text-xs font-semibold text-foreground/80',
        className,
      )}
    >
      {skill}
    </span>
  )
}

const statusMap: Record<ProofStatus, { label: string; icon: typeof Clock; cls: string }> = {
  pending: { label: 'Pending', icon: CircleDashed, cls: 'bg-muted text-muted-foreground' },
  under_review: { label: 'Under review', icon: Clock, cls: 'bg-amber-100 text-amber-900' },
  verified: { label: 'Verified', icon: BadgeCheck, cls: 'bg-primary/12 text-primary' },
  rejected: { label: 'Rejected', icon: XCircle, cls: 'bg-destructive/10 text-destructive' },
}

export function ProofStatusBadge({ status }: { status: ProofStatus }) {
  const s = statusMap[status]
  const Icon = s.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
        s.cls,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {s.label}
    </span>
  )
}

export function IdentityBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      ID verified
    </span>
  )
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border border-dashed border-brand-sage/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep',
        className,
      )}
      title="Demo data for illustration"
    >
      Demo
    </span>
  )
}
