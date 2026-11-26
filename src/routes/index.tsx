import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Compass,
  Eye,
  FileCheck2,
  Filter,
  HeartHandshake,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  UserRound,
  Users,
} from 'lucide-react'

import { ProofStatusBadge, VerifiedSkillBadge } from '@/components/badges'
import { OpportunityCard } from '@/components/opportunity-card'
import { TalentAvatar } from '@/components/talent-card'
import { Button } from '@/components/ui/button'
import { getTalent, opportunities, talent } from '@/lib/fixtures'
import { cdnImage } from '@/lib/images'

export const Route = createFileRoute('/')({
  component: Home,
})

const journey = [
  'I have potential',
  'I can prove my skills',
  'I can be discovered',
  'I can access opportunities',
]

function Home() {
  const amara = getTalent('amara-okafor')!
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-accent/70 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-semibold text-brand-deep">
              <Sparkles className="size-4 text-brand-sage" aria-hidden="true" />
              Skills-first opportunities for young people
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Your talent deserves to be{' '}
              <span className="relative whitespace-nowrap text-primary">
                discovered.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 h-3 w-full text-brand-sage"
                  preserveAspectRatio="none"
                >
                  <path d="M2 9C80 3 220 2 298 7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              TalentBridge helps skilled young people show what they can actually do — and helps
              employers find them by ability, not just by résumé.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-7 text-base" asChild>
                <Link to="/opportunities">
                  Find Opportunities <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-ink px-7 text-base text-ink hover:bg-ink hover:text-white"
                asChild
              >
                <Link to="/talent">Hire Talent</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {talent.slice(0, 5).map((t) => (
                  <TalentAvatar key={t.id} t={t} size={40} className="size-10" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">1,240+ young people</strong> proving their
                skills this month
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src={cdnImage('hero.png', 1100)}
              srcSet={`${cdnImage('hero.png', 700)} 700w, ${cdnImage('hero.png', 1100)} 1100w, ${cdnImage('hero.png', 1500)} 1500w`}
              sizes="(min-width: 1024px) 560px, 100vw"
              alt="A young woman smiling while working on her laptop in a busy community workspace"
              width={1376}
              height={768}
              className="aspect-[4/3] w-full rounded-3xl object-cover object-[70%_center] shadow-2xl shadow-ink/15"
            />
            <div className="absolute -left-3 top-6 w-60 rounded-2xl border bg-card p-4 shadow-xl sm:-left-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Proof of skill
              </p>
              <p className="mb-3 text-sm font-bold leading-snug">Build an accessible job-board filter</p>
              <div className="flex items-center justify-between">
                <VerifiedSkillBadge skill="React" />
                <span className="text-xs text-muted-foreground">by Amara</span>
              </div>
            </div>
            <div className="absolute -bottom-6 right-3 flex w-64 items-center gap-3 rounded-2xl bg-ink p-4 text-white shadow-xl sm:right-6">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-bold">
                92%
              </div>
              <p className="text-sm leading-snug">
                <strong>Strong match</strong> — 4 of 4 required skills, 2 verified
              </p>
            </div>
          </div>
        </div>

        {/* Journey strip */}
        <div className="border-y bg-ink text-white">
          <ol className="mx-auto grid max-w-content grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
            {journey.map((step, i) => (
              <li key={step} className="flex items-center gap-3 py-5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold">
                  {i + 1}
                </span>
                <span className="font-display text-sm font-semibold sm:text-base">“{step}”</span>
                {i < journey.length - 1 && (
                  <ArrowRight className="ml-auto hidden size-4 text-brand-sage md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 2. How it works */}
      <section aria-labelledby="how" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading
          id="how"
          eyebrow="How TalentBridge works"
          title="Three steps from potential to opportunity"
          lead="No CV gatekeeping. No connections required. Just a clear path to show what you can do."
        />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: UserRound,
              title: 'Create your profile',
              body: "Tell us who you are, what you can do, and the kind of opportunity you're looking for.",
            },
            {
              icon: FileCheck2,
              title: 'Prove your skills',
              body: 'Complete practical challenges or submit real work demonstrating your abilities.',
            },
            {
              icon: Eye,
              title: 'Get discovered',
              body: 'Employers can discover talent based on demonstrated skills and relevant interests.',
            },
          ].map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border bg-card p-7">
              <span className="absolute right-6 top-5 font-display text-6xl font-extrabold text-muted">
                0{i + 1}
              </span>
              <span className="mb-6 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
                <s.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
              <p className="text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 + 4. Benefits */}
      <section aria-label="Benefits" className="mx-auto grid max-w-content gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:pb-28">
        <div className="rounded-3xl bg-secondary p-8 sm:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">For talent</p>
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Be seen for what you can do</h2>
          <BenefitList
            items={[
              { icon: BadgeCheck, title: 'Verified skill badges', body: 'Turn real work into proof employers trust.' },
              { icon: Target, title: 'Honest matching', body: 'See exactly why an opportunity fits — and what to learn next.' },
              { icon: Compass, title: 'Eight kinds of opportunity', body: 'Internships, jobs, apprenticeships, scholarships and more.' },
              { icon: HeartHandshake, title: 'Free, always', body: 'No fees for young people to join, prove or apply.' },
            ]}
          />
          <Button className="mt-8" size="lg" asChild>
            <Link to="/opportunities">
              Find Opportunities <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-sage">For employers</p>
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Discover the talent others overlook</h2>
          <BenefitList
            inverted
            items={[
              { icon: Search, title: 'Search by ability', body: 'Filter by verified skills, not job titles or degrees.' },
              { icon: FileCheck2, title: 'See the evidence', body: 'Open the actual work behind every verified badge.' },
              { icon: Filter, title: 'Less noise', body: 'Applicants arrive ranked by a transparent skills match.' },
              { icon: Users, title: 'Wider pipeline', body: 'Reach capable young people outside traditional networks.' },
            ]}
          />
          <Button className="mt-8 bg-white text-ink hover:bg-white/90" size="lg" asChild>
            <Link to="/talent">
              Hire Talent <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* 5. Opportunities preview */}
      <section aria-labelledby="opps" className="border-y bg-muted/50">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="opps"
              eyebrow="Opportunities"
              title="Open right now"
              lead="Real roles from organisations that hire on skills."
              align="left"
            />
            <Button variant="outline" asChild>
              <Link to="/opportunities">
                Browse all opportunities <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.slice(0, 3).map((o) => (
              <Link key={o.id} to="/opportunities" search={{ open: o.id }} className="block rounded-2xl">
                <OpportunityCard opportunity={o} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Proof of Skill */}
      <section aria-labelledby="proof" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="proof"
              eyebrow="Proof of Skill"
              title="A badge that means something"
              lead="Every verified badge on TalentBridge is backed by real work that a reviewer has checked. Employers can open the evidence in one click."
              align="left"
            />
            <ol className="mt-8 space-y-4">
              {[
                { s: 'pending' as const, t: 'Submit a challenge or real project with a link to your work.' },
                { s: 'under_review' as const, t: 'A reviewer checks the evidence against clear criteria.' },
                { s: 'verified' as const, t: 'The skill earns a verified badge on your profile.' },
              ].map((x) => (
                <li key={x.s} className="flex items-start gap-4">
                  <ProofStatusBadge status={x.s} />
                  <span className="text-muted-foreground">{x.t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-xl shadow-ink/5 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <TalentAvatar t={amara} size={56} className="size-14" />
              <div>
                <p className="font-bold">{amara.name}</p>
                <p className="text-sm text-muted-foreground">{amara.headline}</p>
              </div>
            </div>
            {amara.proofs.slice(0, 2).map((p) => (
              <div key={p.id} className="mb-4 rounded-xl border p-4 last:mb-0">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <VerifiedSkillBadge skill={p.skill} />
                  <span className="text-xs text-muted-foreground">Verified · {p.submittedAt}</span>
                </div>
                <p className="font-bold">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.evidence}</p>
              </div>
            ))}
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link to="/talent/$talentId" params={{ talentId: amara.id }}>
                View Amara’s full profile <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="relative mx-auto max-w-content overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
          <Lightbulb aria-hidden="true" className="absolute -left-6 -top-6 size-40 text-white/10" />
          <Briefcase aria-hidden="true" className="absolute -bottom-8 -right-4 size-44 text-white/10" />
          <h2 className="relative mx-auto max-w-2xl text-4xl font-extrabold sm:text-5xl">
            Ability is everywhere. Access shouldn’t be rare.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-primary-foreground/85">
            Show the world what you can do, or find the people who can do it.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-12 bg-white px-7 text-base text-ink hover:bg-white/90" asChild>
              <Link to="/opportunities">Find Opportunities</Link>
            </Button>
            <Button size="lg" className="h-12 bg-ink px-7 text-base text-white hover:bg-ink/90" asChild>
              <Link to="/talent">Hire Talent</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'center',
}: {
  id: string
  eyebrow: string
  title: string
  lead: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-bold text-ink sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">{lead}</p>
    </div>
  )
}

function BenefitList({
  items,
  inverted,
}: {
  items: { icon: typeof Search; title: string; body: string }[]
  inverted?: boolean
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {items.map((b) => (
        <li key={b.title}>
          <b.icon
            className={`mb-3 size-6 ${inverted ? 'text-brand-sage' : 'text-primary'}`}
            aria-hidden="true"
          />
          <h3 className="mb-1 font-bold">{b.title}</h3>
          <p className={inverted ? 'text-sm text-white/70' : 'text-sm text-muted-foreground'}>{b.body}</p>
        </li>
      ))}
    </ul>
  )
}
