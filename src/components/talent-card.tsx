import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

import { DemoBadge, IdentityBadge, SkillChip, VerifiedSkillBadge } from '@/components/badges'
import type { TalentProfile } from '@/lib/fixtures'
import { verifiedSkills } from '@/lib/fixtures'
import { cdnImage } from '@/lib/images'

export function TalentAvatar({
  t,
  size = 64,
  className = 'size-16',
}: {
  t: TalentProfile
  size?: number
  className?: string
}) {
  return (
    <img
      src={cdnImage(t.photo, size * 2)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className={`${className} shrink-0 rounded-full object-cover ring-2 ring-background`}
    />
  )
}

export function TalentCard({ t }: { t: TalentProfile }) {
  const verified = verifiedSkills(t)
  const others = t.skills.filter((s) => !verified.includes(s))
  return (
    <article className="relative flex h-full flex-col rounded-2xl border bg-card p-5 transition-shadow hover:shadow-lg hover:shadow-primary/5 motion-reduce:transition-none">
      <div className="mb-4 flex items-start gap-4">
        <TalentAvatar t={t} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold">
            <Link
              to="/talent/$talentId"
              params={{ talentId: t.id }}
              className="after:absolute after:inset-0 after:rounded-2xl"
            >
              {t.name}
            </Link>
          </h3>
          <p className="text-sm font-semibold text-foreground/80">{t.headline}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {t.location}
          </p>
        </div>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{t.bio}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {verified.map((s) => (
          <VerifiedSkillBadge key={s} skill={s} />
        ))}
        {others.slice(0, 3).map((s) => (
          <SkillChip key={s} skill={s} />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
        <span className="font-semibold">
          <span className="text-primary">{verified.length}</span> verified skill
          {verified.length === 1 ? '' : 's'}
        </span>
        <span className="flex items-center gap-2">
          {t.identityVerified && <IdentityBadge />}
          <DemoBadge />
        </span>
      </div>
    </article>
  )
}
