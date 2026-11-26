import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Bookmark, Building2, CalendarClock, MapPin, Search, SearchX, Wallet, X } from 'lucide-react'
import { toast } from 'sonner'

import { ApplyDialog } from '@/components/apply-dialog'
import { DemoBadge, SkillChip } from '@/components/badges'
import { MatchBreakdown } from '@/components/match-meter'
import { OpportunityCard, OrgMark, formatDate } from '@/components/opportunity-card'
import { TalentAvatar } from '@/components/talent-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  ARRANGEMENTS,
  DEMO_TALENT_ID,
  OPPORTUNITY_TYPES,
  SKILLS,
  demoApplications,
  demoSavedOpportunityIds,
  getEmployer,
  getOpportunity,
  getTalent,
  opportunities,
} from '@/lib/fixtures'
import { matchTalentToOpportunity } from '@/lib/matching'
import { cn } from '@/lib/utils'

type OppSearch = { open?: string }

export const Route = createFileRoute('/opportunities')({
  validateSearch: (input: Record<string, unknown>): OppSearch => ({
    open: typeof input.open === 'string' ? input.open : undefined,
  }),
  head: () => ({ meta: [{ title: 'Opportunities · TalentBridge' }] }),
  component: OpportunitiesPage,
})

const ALL = 'all'
const locations = [...new Set(opportunities.map((o) => o.location))].sort()

function OpportunitiesPage() {
  const { open } = Route.useSearch()
  const navigate = useNavigate({ from: '/opportunities' })
  const me = getTalent(DEMO_TALENT_ID)!

  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState<string>(ALL)
  const [type, setType] = useState<string>(ALL)
  const [location, setLocation] = useState<string>(ALL)
  const [arrangements, setArrangements] = useState<string[]>([])
  const [showMatch, setShowMatch] = useState(true)
  const [saved, setSaved] = useState<string[]>(demoSavedOpportunityIds)
  const [applied, setApplied] = useState<string[]>(demoApplications.map((a) => a.opportunityId))
  const [applyOpen, setApplyOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = opportunities
      .filter((o) => {
        const emp = getEmployer(o.employerId)
        if (q && !`${o.title} ${o.description} ${emp?.name} ${o.requiredSkills.join(' ')}`.toLowerCase().includes(q))
          return false
        if (skill !== ALL && !o.requiredSkills.includes(skill as (typeof SKILLS)[number])) return false
        if (type !== ALL && o.type !== type) return false
        if (location !== ALL && o.location !== location) return false
        if (arrangements.length && !arrangements.includes(o.arrangement)) return false
        return true
      })
      .map((o) => ({ o, match: matchTalentToOpportunity(me, o) }))
    return showMatch ? list.sort((a, b) => b.match.score - a.match.score) : list
  }, [query, skill, type, location, arrangements, showMatch, me])

  const activeFilters = [skill, type, location].filter((v) => v !== ALL).length + arrangements.length + (query ? 1 : 0)
  function clearFilters() {
    setQuery('')
    setSkill(ALL)
    setType(ALL)
    setLocation(ALL)
    setArrangements([])
  }
  function toggleSave(id: string) {
    setSaved((s) => {
      const has = s.includes(id)
      toast(has ? 'Removed from saved' : 'Saved to your dashboard')
      return has ? s.filter((x) => x !== id) : [...s, id]
    })
  }

  const selected = open ? getOpportunity(open) : undefined
  const selectedMatch = selected ? matchTalentToOpportunity(me, selected) : undefined
  const selectedEmployer = selected ? getEmployer(selected.employerId) : undefined
  const setOpen = (id?: string) => navigate({ search: { open: id }, replace: true, resetScroll: false })

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">Opportunities</p>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Find where your skills fit</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Internships, jobs, apprenticeships, scholarships and more from organisations that hire on
            ability.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 pr-4">
          <TalentAvatar t={me} size={40} className="size-10" />
          <div className="text-sm">
            <p className="font-bold">
              Viewing as {me.name.split(' ')[0]} <DemoBadge className="ml-1" />
            </p>
            <label className="mt-1 flex items-center gap-2 text-muted-foreground">
              <Switch checked={showMatch} onCheckedChange={setShowMatch} aria-label="Sort by match score" />
              Sort by my match
            </label>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section aria-label="Search and filters" className="mb-6 rounded-2xl border bg-card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="relative">
            <Label htmlFor="opp-q" className="sr-only">
              Search opportunities
            </Label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="opp-q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, organisation or skill"
              className="h-11 pl-9"
            />
          </div>
          <FilterSelect label="Skill" value={skill} onChange={setSkill} options={[...SKILLS]} />
          <FilterSelect label="Type" value={type} onChange={setType} options={OPPORTUNITY_TYPES} />
          <FilterSelect label="Location" value={location} onChange={setLocation} options={locations} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Work arrangement:</span>
          {ARRANGEMENTS.map((a) => {
            const on = arrangements.includes(a)
            return (
              <button
                key={a}
                type="button"
                aria-pressed={on}
                onClick={() => setArrangements((s) => (on ? s.filter((x) => x !== a) : [...s, a]))}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors motion-reduce:transition-none',
                  on ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted',
                )}
              >
                {a}
              </button>
            )
          })}
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              <X /> Clear {activeFilters} filter{activeFilters > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </section>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {results.length} opportunit{results.length === 1 ? 'y' : 'ies'}
        {showMatch && results.length > 0 && ' · sorted by your match'}
      </p>

      {results.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <SearchX className="mb-4 size-10 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-xl font-bold">No opportunities match those filters</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Try removing a filter or searching for a broader skill.
          </p>
          <Button className="mt-6" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ o, match }) => (
            <OpportunityCard
              key={o.id}
              opportunity={o}
              match={showMatch ? match : undefined}
              saved={saved.includes(o.id)}
              onOpen={() => setOpen(o.id)}
              onToggleSave={() => toggleSave(o.id)}
            />
          ))}
        </div>
      )}

      {/* Detail */}
      <Sheet open={!!selected} onOpenChange={(v) => !v && setOpen(undefined)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected && selectedMatch && (
            <>
              <SheetHeader className="border-b pb-5">
                <div className="mb-3 flex items-center gap-3">
                  <OrgMark initials={selectedEmployer?.initials ?? '?'} />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">{selectedEmployer?.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedEmployer?.sector}</p>
                  </div>
                </div>
                <SheetTitle className="font-display text-2xl font-bold">{selected.title}</SheetTitle>
                <SheetDescription>
                  {selected.type} · {selected.arrangement} · {selected.experienceLevel}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-6">
                <ul className="grid grid-cols-2 gap-3 text-sm">
                  <Fact icon={MapPin} label="Location" value={selected.location} />
                  <Fact icon={CalendarClock} label="Deadline" value={formatDate(selected.deadline)} />
                  <Fact icon={Wallet} label="Pay / award" value={selected.stipend ?? 'Unpaid'} />
                  <Fact icon={Building2} label="Organisation" value={selectedEmployer?.location ?? ''} />
                </ul>
                <div>
                  <h3 className="mb-2 font-bold">About this opportunity</h3>
                  <p className="leading-relaxed text-muted-foreground">{selected.description}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-bold">Required skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.requiredSkills.map((s) => (
                      <SkillChip
                        key={s}
                        skill={s}
                        className={selectedMatch.matchedSkills.includes(s) ? 'border-primary/40 bg-primary/8 text-primary' : ''}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-bold">Why this matches you</h3>
                  <MatchBreakdown match={selectedMatch} />
                  {selectedMatch.missingSkills.length > 0 && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Close the gap: prove{' '}
                      <strong className="text-foreground">{selectedMatch.missingSkills.join(', ')}</strong>{' '}
                      from your{' '}
                      <Link to="/dashboard" className="font-semibold text-primary underline-offset-4 hover:underline">
                        dashboard
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </div>
              <SheetFooter className="sticky bottom-0 flex-row gap-2 border-t bg-background">
                <Button
                  variant="outline"
                  onClick={() => toggleSave(selected.id)}
                  aria-pressed={saved.includes(selected.id)}
                >
                  <Bookmark className={saved.includes(selected.id) ? 'fill-primary text-primary' : ''} />
                  {saved.includes(selected.id) ? 'Saved' : 'Save'}
                </Button>
                <Button className="flex-1" disabled={applied.includes(selected.id)} onClick={() => setApplyOpen(true)}>
                  {applied.includes(selected.id) ? 'Applied ✓' : 'Apply with my profile'}
                </Button>
              </SheetFooter>
              <ApplyDialog
                opportunity={selected}
                open={applyOpen}
                onOpenChange={setApplyOpen}
                onSubmitted={(id) => setApplied((a) => [...a, id])}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function FilterSelect({
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
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <li className="rounded-xl bg-muted p-3">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="font-bold">{value}</p>
    </li>
  )
}
