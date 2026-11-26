import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Briefcase,
  CheckCircle2,
  Circle,
  FilePlus2,
  Inbox,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'

import { DemoBadge, ProofStatusBadge, SkillChip, VerifiedSkillBadge } from '@/components/badges'
import { MatchPill } from '@/components/match-meter'
import { OrgMark, formatDate } from '@/components/opportunity-card'
import { SubmitProofDialog } from '@/components/submit-proof-dialog'
import { TalentAvatar } from '@/components/talent-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DEMO_TALENT_ID,
  demoApplications,
  demoMessages,
  demoSavedOpportunityIds,
  employers,
  getEmployer,
  getOpportunity,
  getTalent,
  opportunities,
  talent,
  verifiedSkills,
} from '@/lib/fixtures'
import type { ProofSubmission, TalentProfile } from '@/lib/fixtures'
import { matchTalentToOpportunity } from '@/lib/matching'

export const Route = createFileRoute('/dashboard')({
  head: () => ({ meta: [{ title: 'Dashboard · TalentBridge' }] }),
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:py-12">
      <Tabs defaultValue="talent">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <DemoBadge /> Preview each role’s dashboard with demo accounts.
          </p>
          <TabsList>
            <TabsTrigger value="talent">Talent view</TabsTrigger>
            <TabsTrigger value="employer">Employer view</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="talent"><TalentDashboard /></TabsContent>
        <TabsContent value="employer"><EmployerDashboard /></TabsContent>
      </Tabs>
    </div>
  )
}

function completion(t: TalentProfile) {
  const checks = [
    { label: 'Photo and bio', done: !!t.photo && t.bio.length > 0 },
    { label: 'At least 3 skills', done: t.skills.length >= 3 },
    { label: 'Education & experience', done: !!t.education && t.experience.length > 0 },
    { label: 'Portfolio project', done: t.projects.length > 0 },
    { label: 'Opportunity preferences', done: t.preferences.length > 0 },
    { label: 'One verified skill', done: verifiedSkills(t).length > 0 },
    { label: 'Identity verification', done: t.identityVerified },
  ]
  return { checks, pct: Math.round((checks.filter((c) => c.done).length / checks.length) * 100) }
}

function TalentDashboard() {
  const base = getTalent(DEMO_TALENT_ID)!
  const [proofs, setProofs] = useState<ProofSubmission[]>(base.proofs)
  const [proofOpen, setProofOpen] = useState(false)
  const me: TalentProfile = { ...base, proofs }
  const verified = verifiedSkills(me)
  const { checks, pct } = completion(me)
  const recommended = opportunities
    .map((o) => ({ o, m: matchTalentToOpportunity(me, o) }))
    .filter(({ o }) => !demoApplications.some((a) => a.opportunityId === o.id))
    .sort((a, b) => b.m.score - a.m.score)
    .slice(0, 3)

  function simulateReview(id: string) {
    setProofs((ps) => ps.map((p) => (p.id === id ? { ...p, status: 'verified' as const, reviewerNote: 'Verified in demo review.' } : p)))
    const p = proofs.find((x) => x.id === id)
    toast.success(`${p?.skill} is now verified`, { description: 'The badge now appears on your public profile.' })
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <TalentAvatar t={me} size={80} className="size-20" />
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">Welcome back, {me.name.split(' ')[0]}</h1>
          <p className="mt-1 text-white/70">
            You have <strong className="text-white">{verified.length} verified skills</strong> and{' '}
            <strong className="text-white">{recommended.filter((r) => r.m.score >= 75).length} strong matches</strong> waiting.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-white text-ink hover:bg-white/90" asChild>
            <Link to="/talent/$talentId" params={{ talentId: me.id }}>View public profile</Link>
          </Button>
          <Button onClick={() => setProofOpen(true)}><Plus /> Prove a skill</Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BadgeCheck} label="Verified skills" value={verified.length} />
        <Stat icon={FilePlus2} label="Proof submissions" value={proofs.length} />
        <Stat icon={Briefcase} label="Applications" value={demoApplications.length} />
        <Stat icon={MessageSquare} label="Unread messages" value={demoMessages.filter((m) => m.unread).length} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          {/* Proofs */}
          <Panel title="Proof-of-skill submissions" action={<Button size="sm" variant="outline" onClick={() => setProofOpen(true)}><Plus /> New</Button>}>
            {proofs.length === 0 ? (
              <Empty icon={FilePlus2} text="No proof yet. Submit your first challenge to earn a verified badge." />
            ) : (
              <ul className="divide-y">
                {proofs.map((p) => (
                  <li key={p.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        {p.status === 'verified' ? <VerifiedSkillBadge skill={p.skill} /> : <SkillChip skill={p.skill} />}
                        <ProofStatusBadge status={p.status} />
                      </div>
                      <p className="font-bold">{p.title}</p>
                      <p className="text-xs text-muted-foreground">Submitted {formatDate(p.submittedAt)}</p>
                    </div>
                    {p.status !== 'verified' && p.status !== 'rejected' && (
                      <Button size="sm" variant="ghost" onClick={() => simulateReview(p.id)} className="self-start sm:self-center">
                        <Wand2 /> Simulate review
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Recommended */}
          <Panel title="Recommended for you" action={<Button size="sm" variant="ghost" asChild><Link to="/opportunities">See all <ArrowRight /></Link></Button>}>
            <ul className="space-y-3">
              {recommended.map(({ o, m }) => (
                <li key={o.id}>
                  <Link to="/opportunities" search={{ open: o.id }} className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/60 motion-reduce:transition-none">
                    <OrgMark initials={getEmployer(o.employerId)?.initials ?? '?'} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{o.title}</p>
                      <p className="text-sm text-muted-foreground">{m.summary}</p>
                    </div>
                    <MatchPill match={m} className="hidden sm:inline-flex" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Applications */}
          <Panel title="Applications">
            {demoApplications.length === 0 ? (
              <Empty icon={Briefcase} text="You haven’t applied yet. Strong matches are a great place to start." />
            ) : (
              <ul className="divide-y">
                {demoApplications.map((a) => {
                  const o = getOpportunity(a.opportunityId)!
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-bold">{o.title}</p>
                        <p className="text-sm text-muted-foreground">{getEmployer(o.employerId)?.name} · Applied {formatDate(a.appliedAt)}</p>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">{a.status}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Profile completion">
            <div className="mb-4 flex items-end justify-between">
              <span className="font-display text-4xl font-bold text-primary tabular-nums">{pct}%</span>
              <span className="text-sm text-muted-foreground">{checks.filter((c) => c.done).length}/{checks.length} steps</span>
            </div>
            <Progress value={pct} aria-label="Profile completion" className="mb-4" />
            <ul className="space-y-2 text-sm">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.done ? <CheckCircle2 className="size-4 text-primary" aria-label="Done" /> : <Circle className="size-4 text-muted-foreground" aria-label="To do" />}
                  <span className={c.done ? '' : 'text-muted-foreground'}>{c.label}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {verified.map((s) => <VerifiedSkillBadge key={s} skill={s} />)}
              {me.skills.filter((s) => !verified.includes(s)).map((s) => <SkillChip key={s} skill={s} />)}
            </div>
          </Panel>
          <Panel title="Saved">
            <ul className="space-y-2">
              {demoSavedOpportunityIds.map((id) => {
                const o = getOpportunity(id)!
                return (
                  <li key={id}>
                    <Link to="/opportunities" search={{ open: id }} className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-muted">
                      <Bookmark className="size-4 fill-primary text-primary" aria-hidden="true" />
                      <span className="font-semibold">{o.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Panel>
          <Panel title="Messages">
            <ul className="space-y-3">
              {demoMessages.map((m) => (
                <li key={m.id} className="rounded-xl bg-muted p-3 text-sm">
                  <p className="flex items-center justify-between font-bold">
                    {m.from}
                    {m.unread && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.org} · {formatDate(m.sentAt)}</p>
                  <p className="mt-1 text-muted-foreground">{m.preview}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>

      <SubmitProofDialog open={proofOpen} onOpenChange={setProofOpen} onSubmit={(p) => setProofs((ps) => [p, ...ps])} />
    </div>
  )
}

function EmployerDashboard() {
  const org = employers[1]
  const posted = opportunities.filter((o) => o.employerId === org.id)
  const applicantsFor = (oppId: string) =>
    talent
      .map((t) => ({ t, m: matchTalentToOpportunity(t, getOpportunity(oppId)!) }))
      .filter(({ m }) => m.score >= 45)
      .sort((a, b) => b.m.score - a.m.score)
  const savedCandidates = [getTalent('amara-okafor')!, getTalent('jonah-miller')!]

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
        <OrgMark initials={org.initials} className="size-16 bg-primary text-xl" />
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-ink">{org.name}</h1>
          <p className="mt-1 text-muted-foreground">{org.about}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild><Link to="/talent"><Users /> Discover talent</Link></Button>
          <Button onClick={() => toast('Posting opportunities arrives with employer accounts.', { description: 'See the roadmap for milestone 5.' })}>
            <Plus /> Post opportunity
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Briefcase} label="Open opportunities" value={posted.length} />
        <Stat icon={Inbox} label="Applicants" value={posted.reduce((n, o) => n + applicantsFor(o.id).length, 0)} />
        <Stat icon={Bookmark} label="Saved candidates" value={savedCandidates.length} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {posted.map((o) => {
            const apps = applicantsFor(o.id)
            return (
              <Panel key={o.id} title={o.title} action={<span className="text-sm text-muted-foreground">Closes {formatDate(o.deadline)}</span>}>
                <p className="mb-4 flex flex-wrap gap-1.5">{o.requiredSkills.map((s) => <SkillChip key={s} skill={s} />)}</p>
                {apps.length === 0 ? (
                  <Empty icon={Inbox} text="No applicants yet. Invite matching talent from Discover." />
                ) : (
                  <ul className="divide-y">
                    {apps.map(({ t, m }) => (
                      <li key={t.id}>
                        <Link to="/talent/$talentId" params={{ talentId: t.id }} className="flex items-center gap-3 py-3 hover:bg-muted/50">
                          <TalentAvatar t={t} size={40} className="size-10" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold">{t.name}</p>
                            <p className="truncate text-sm text-muted-foreground">{m.summary}</p>
                          </div>
                          <MatchPill match={m} className="hidden sm:inline-flex" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            )
          })}
        </div>
        <aside className="space-y-6">
          <Panel title="Saved candidates">
            <ul className="space-y-3">
              {savedCandidates.map((t) => (
                <li key={t.id}>
                  <Link to="/talent/$talentId" params={{ talentId: t.id }} className="flex items-center gap-3 rounded-lg p-1 hover:bg-muted">
                    <TalentAvatar t={t} size={40} className="size-10" />
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{verifiedSkills(t).length} verified skills</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <Sparkles className="mb-3 size-6" aria-hidden="true" />
            <p className="font-display text-lg font-bold">68% of your top matches have no degree.</p>
            <p className="mt-1 text-sm text-primary-foreground/80">That’s talent a CV filter would have missed.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Icon className="mb-3 size-5 text-primary" aria-hidden="true" />
      <p className="font-display text-3xl font-bold tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Empty({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed px-4 py-10 text-center">
      <Icon className="mb-3 size-8 text-muted-foreground" aria-hidden="true" />
      <p className="max-w-xs text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
