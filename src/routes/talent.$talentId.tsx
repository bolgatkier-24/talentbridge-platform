import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Briefcase,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Heart,
  MapPin,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  DemoBadge,
  IdentityBadge,
  ProofStatusBadge,
  SkillChip,
  VerifiedSkillBadge,
} from '@/components/badges'
import { MatchPill } from '@/components/match-meter'
import { formatDate } from '@/components/opportunity-card'
import { TalentAvatar } from '@/components/talent-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getEmployer, getTalent, opportunities, verifiedSkills } from '@/lib/fixtures'
import { matchTalentToOpportunity } from '@/lib/matching'

export const Route = createFileRoute('/talent/$talentId')({
  loader: ({ params }) => {
    const t = getTalent(params.talentId)
    if (!t) throw notFound()
    return t
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.name} · TalentBridge` : 'Talent · TalentBridge' }],
  }),
  component: TalentProfilePage,
})

function TalentProfilePage() {
  const t = Route.useLoaderData()
  const verified = verifiedSkills(t)
  const claimed = t.skills.filter((s) => !verified.includes(s))
  const [contactOpen, setContactOpen] = useState(false)
  const [savedCandidate, setSavedCandidate] = useState(false)

  const topMatches = opportunities
    .map((o) => ({ o, m: matchTalentToOpportunity(t, o) }))
    .sort((a, b) => b.m.score - a.m.score)
    .slice(0, 3)

  const sortedProofs = [...t.proofs].sort((a, b) =>
    a.status === 'verified' && b.status !== 'verified' ? -1 : b.status === 'verified' && a.status !== 'verified' ? 1 : 0,
  )
  const firstName = t.name.split(' ')[0]

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:py-12">
      <Link to="/talent" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to talent
      </Link>

      {/* Header */}
      <section className="relative mb-8 overflow-hidden rounded-3xl border bg-card">
        <div className="h-28 bg-gradient-to-r from-brand-deep via-primary to-brand-sage sm:h-36" aria-hidden="true" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <TalentAvatar t={t} size={128} className="size-28 ring-4 sm:size-32" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{t.name}</h1>
                  {t.identityVerified && <IdentityBadge />}
                  <DemoBadge />
                </div>
                <p className="mt-1 text-lg font-semibold">{t.headline}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="size-4" aria-hidden="true" />{t.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="size-4" aria-hidden="true" />{t.availability}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                aria-pressed={savedCandidate}
                onClick={() => {
                  setSavedCandidate((s) => !s)
                  toast(savedCandidate ? 'Removed from saved candidates' : `${firstName} saved to your candidates`)
                }}
              >
                <Bookmark className={savedCandidate ? 'fill-primary text-primary' : ''} />
                {savedCandidate ? 'Saved' : 'Save'}
              </Button>
              <Button onClick={() => setContactOpen(true)}>
                <MessageSquare /> Contact {firstName}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          {/* Skills */}
          <section aria-labelledby="skills" className="rounded-2xl border bg-card p-6">
            <h2 id="skills" className="mb-1 text-xl font-bold">Skills</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Verified skills are backed by reviewed evidence below. Other skills are self-reported.
            </p>
            {verified.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Verified · {verified.length}</p>
                <div className="flex flex-wrap gap-2">
                  {verified.map((s) => <VerifiedSkillBadge key={s} skill={s} className="px-3 py-1.5 text-sm" />)}
                </div>
              </div>
            )}
            {claimed.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Self-reported</p>
                <div className="flex flex-wrap gap-2">
                  {claimed.map((s) => <SkillChip key={s} skill={s} className="px-3 py-1.5 text-sm" />)}
                </div>
              </div>
            )}
          </section>

          {/* Proof of skill */}
          <section aria-labelledby="proofs">
            <h2 id="proofs" className="mb-4 text-xl font-bold">Proof of skill</h2>
            {sortedProofs.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                {firstName} hasn’t submitted any proof yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {sortedProofs.map((p) => (
                  <li
                    key={p.id}
                    className={`rounded-2xl border bg-card p-5 ${p.status === 'verified' ? 'border-primary/40 ring-1 ring-primary/10' : ''}`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {p.status === 'verified' ? <VerifiedSkillBadge skill={p.skill} /> : <SkillChip skill={p.skill} />}
                        <ProofStatusBadge status={p.status} />
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" /> Submitted {formatDate(p.submittedAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{p.title}</h3>
                    <p className="mt-1 text-muted-foreground">{p.description}</p>
                    <div className="mt-3 rounded-xl bg-muted p-3 text-sm">
                      <span className="font-bold">Evidence: </span>{p.evidence}
                    </div>
                    {p.reviewerNote && (
                      <p className="mt-3 border-l-2 border-primary pl-3 text-sm italic text-muted-foreground">
                        Reviewer: “{p.reviewerNote}”
                      </p>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        View the work <ExternalLink className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Projects */}
          <section aria-labelledby="projects" className="rounded-2xl border bg-card p-6">
            <h2 id="projects" className="mb-4 text-xl font-bold">Portfolio & projects</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {t.projects.map((pr) => (
                <li key={pr.title} className="rounded-xl bg-muted p-4">
                  <p className="font-bold">{pr.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pr.summary}</p>
                  {pr.link && (
                    <a href={pr.link} target="_blank" rel="noreferrer noopener" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Open <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="mb-2 font-bold">About</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.bio}</p>
          </section>
          <section className="space-y-5 rounded-2xl border bg-card p-6 text-sm">
            <Detail icon={GraduationCap} title="Education">{t.education}</Detail>
            <Detail icon={Briefcase} title="Experience">
              <ul className="space-y-1.5">
                {t.experience.map((e) => (
                  <li key={e.role}><span className="font-semibold text-foreground">{e.role}</span> · {e.org} <span className="block text-xs">{e.period}</span></li>
                ))}
              </ul>
            </Detail>
            <Detail icon={Heart} title="Interests">{t.interests.join(' · ')}</Detail>
            <Detail icon={ArrowRight} title="Looking for">
              <div className="flex flex-wrap gap-1.5">
                {t.preferences.map((p) => <SkillChip key={p} skill={p} />)}
                {t.remotePreference.map((p) => <SkillChip key={p} skill={p} className="bg-muted" />)}
              </div>
            </Detail>
          </section>
          <section className="rounded-2xl bg-ink p-6 text-white">
            <h2 className="mb-1 font-bold">Relevant opportunities</h2>
            <p className="mb-4 text-sm text-white/60">Open roles where {firstName}’s skills fit best.</p>
            <ul className="space-y-3">
              {topMatches.map(({ o, m }) => (
                <li key={o.id}>
                  <Link
                    to="/opportunities"
                    search={{ open: o.id }}
                    className="block rounded-xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors hover:bg-white/10 motion-reduce:transition-none"
                  >
                    <p className="font-semibold">{o.title}</p>
                    <p className="mb-2 text-xs text-white/60">{getEmployer(o.employerId)?.name}</p>
                    <MatchPill match={m} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <ContactDialog name={firstName} open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  )
}

function Detail({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 flex items-center gap-2 font-bold"><Icon className="size-4 text-primary" aria-hidden="true" />{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  )
}

function ContactDialog({ name, open, onOpenChange }: { name: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [msg, setMsg] = useState('')
  const [error, setError] = useState<string | null>(null)
  function send(e: React.FormEvent) {
    e.preventDefault()
    if (msg.trim().length < 10) {
      setError('Write at least 10 characters so they know why you’re reaching out.')
      return
    }
    setError(null)
    setMsg('')
    onOpenChange(false)
    toast.success(`Message sent to ${name}`, { description: 'They’ll be notified on their dashboard.' })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={send} noValidate>
          <DialogHeader>
            <DialogTitle>Message {name}</DialogTitle>
            <DialogDescription>Mention the work that caught your eye — it makes a real difference.</DialogDescription>
          </DialogHeader>
          <div className="my-5 space-y-2">
            <Label htmlFor="contact-msg">Your message</Label>
            <Textarea id="contact-msg" rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} aria-invalid={!!error} aria-describedby="contact-err" />
            {error && <p id="contact-err" role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Send message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
