# AGENTS.md

TalentBridge is a skills-first opportunity platform for young people who are underserved. It connects **talent**, who prove skills through reviewed evidence, with **employers**, who discover people by verified ability.

**Start every session by reading `PLAN.md`.** Milestone 1 (the product surface) is done. Continue with the next unchecked milestone.

## Stack
TanStack Start (React 19, TanStack Router, Vite 8), Tailwind CSS 4, shadcn/ui (Radix), lucide-react, and sonner toasts. It is deployed on Netlify. Server-side code should use TanStack Start server functions or API routes, not a separate Netlify Server: the framework's catch-all function handles every request. Use Netlify Database (Drizzle, `db/schema.ts`) for persistence, Netlify Identity for auth, and Netlify Blobs for evidence files.

## Key directories
```
src/
  routes/
    __root.tsx            HTML shell, fonts, global header/footer, skip link, metadata
    index.tsx             Landing page (all marketing sections)
    opportunities.tsx     Marketplace; ?open=<id> search param opens the detail sheet
    talent.index.tsx      Employer talent discovery
    talent.$talentId.tsx  Talent profile (loader throws notFound for unknown ids)
    dashboard.tsx         Talent + employer dashboards (tabs)
  components/
    ui/                   shadcn primitives — restyle through theme variables
    badges.tsx            VerifiedSkillBadge, SkillChip, ProofStatusBadge, IdentityBadge, DemoBadge
    match-meter.tsx       MatchPill + MatchBreakdown (explains the score)
    opportunity-card.tsx  OpportunityCard, OrgMark, formatDate
    talent-card.tsx       TalentCard, TalentAvatar
    apply-dialog.tsx      Validated application form (simulated submit)
    submit-proof-dialog.tsx Validated proof-of-skill form (simulated submit)
    logo.tsx, site-header.tsx, site-footer.tsx
  lib/
    fixtures.ts           ALL demo data + domain types (mirror the planned tables)
    matching.ts           Rule-based, explainable matching — keep it transparent
    images.ts             cdnImage() → /.netlify/images URLs
public/img/               Generated hero + portrait images (always serve via cdnImage)
```

## Conventions
- Brand: green is the primary/action colour (`--primary`), with `--brand-deep` and `--brand-sage` from the logo, `--ink` for black sections, and white or very light backgrounds. Headings use Bricolage Grotesque (`font-display`) and body text uses Lato. Use theme classes, not raw colours (except the amber "under review" badge).
- Verified skills always render with `VerifiedSkillBadge`. Demo records show `DemoBadge`.
- Forms validate on submit, show inline errors (`aria-invalid` plus a described-by message), show a pending state, and end with a success toast.
- Every list has an empty state. Icon-only buttons need an `aria-label`.
- Match scores must stay explainable. Never present them as AI.

## Non-obvious decisions
- Signed-in users are stubbed for now: the talent is `DEMO_TALENT_ID` (Amara) and the employer is `employers[1]` (OpenFields Labs). Milestone 3 replaces these with the Identity user.
- Writes (apply, save, contact, submit proof, "Simulate review") only update component state. Milestones 4–6 replace them with server functions. Keep the component props (`onSubmitted`, `onSubmit`) as the seam.
- The employer dashboard's "applicants" list is computed from match scores until the `applications` table exists.
- The logo is recreated as SVG in `logo.tsx`, from the uploaded brand mark.
