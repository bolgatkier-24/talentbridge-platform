import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BadgeCheck, Search, UserSearch, X } from 'lucide-react'

import { DemoBadge } from '@/components/badges'
import { OrgMark } from '@/components/opportunity-card'
import { TalentCard } from '@/components/talent-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { OPPORTUNITY_TYPES, SKILLS, employers, talent, verifiedSkills } from '@/lib/fixtures'
import type { Skill } from '@/lib/fixtures'

export const Route = createFileRoute('/talent/')({
  head: () => ({ meta: [{ title: 'Discover talent · TalentBridge' }] }),
  component: DiscoverTalent,
})

const ALL = 'all'
const locations = [...new Set(talent.map((t) => t.location))].sort()

function DiscoverTalent() {
  const org = employers[1]
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState<string>(ALL)
  const [location, setLocation] = useState<string>(ALL)
  const [pref, setPref] = useState<string>(ALL)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return talent
      .filter((t) => {
        const v = verifiedSkills(t)
        if (q && !`${t.name} ${t.headline} ${t.bio} ${t.skills.join(' ')} ${t.interests.join(' ')}`.toLowerCase().includes(q))
          return false
        if (skill !== ALL) {
          if (verifiedOnly ? !v.includes(skill as Skill) : !t.skills.includes(skill as Skill)) return false
        } else if (verifiedOnly && v.length === 0) return false
        if (location !== ALL && t.location !== location) return false
        if (pref !== ALL && !t.preferences.includes(pref as (typeof OPPORTUNITY_TYPES)[number])) return false
        return true
      })
      .sort((a, b) => verifiedSkills(b).length - verifiedSkills(a).length)
  }, [query, skill, location, pref, verifiedOnly])

  const active = [skill, location, pref].filter((v) => v !== ALL).length + (verifiedOnly ? 1 : 0) + (query ? 1 : 0)
  const clear = () => {
    setQuery('')
    setSkill(ALL)
    setLocation(ALL)
    setPref(ALL)
    setVerifiedOnly(false)
  }

  return (
    <div>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-content flex-col justify-between gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:py-16">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-sage">Discover talent</p>
            <h1 className="max-w-2xl text-4xl font-extrabold sm:text-5xl">
              Capable people your usual pipeline misses
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/70">
              Every profile leads with demonstrated ability. Filter by verified skills and open the
              evidence behind each badge.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 pr-4 ring-1 ring-white/10">
            <OrgMark initials={org.initials} className="bg-primary" />
            <div className="text-sm">
              <p className="font-bold">
                Hiring as {org.name} <DemoBadge className="ml-1 text-brand-sage" />
              </p>
              <p className="text-white/60">{org.sector} · {org.location}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <section aria-label="Search and filters" className="mb-6 rounded-2xl border bg-card p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="relative">
              <Label htmlFor="talent-q" className="sr-only">Search talent</Label>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="talent-q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, skill or interest"
                className="h-11 pl-9"
              />
            </div>
            <Picker label="Skill" value={skill} onChange={setSkill} options={[...SKILLS]} />
            <Picker label="Location" value={location} onChange={setLocation} options={locations} />
            <Picker label="Looking for" value={pref} onChange={setPref} options={OPPORTUNITY_TYPES} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
              <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
              Verified skills only
            </label>
            {active > 0 && (
              <Button variant="ghost" size="sm" onClick={clear} className="ml-auto">
                <X /> Clear filters
              </Button>
            )}
          </div>
        </section>

        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          {results.length} profile{results.length === 1 ? '' : 's'} · most verified skills first
        </p>

        {results.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
            <UserSearch className="mb-4 size-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-bold">No profiles match yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Try a related skill or turn off “Verified skills only” to see people still proving theirs.
            </p>
            <Button className="mt-6" onClick={clear}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TalentCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={`Filter by ${label.toLowerCase()}`} className="!h-11 w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Any {label.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
