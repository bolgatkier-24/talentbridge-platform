# TalentBridge

**Your talent deserves to be discovered.**

TalentBridge is a skills-first opportunity platform for young people who are underserved: people who have skills but lack traditional credentials, connections or access. Talent proves what they can do through practical challenges and real work. Employers discover them by verified ability, not by résumé.

## What's in the app today

| Page | Path | What it shows |
| --- | --- | --- |
| Landing | `/` | Brand story, how it works, benefits, opportunities preview, proof of skill |
| Opportunities | `/opportunities` | Search and filters (skill, type, location, arrangement), explainable match score, detail panel, save and apply |
| Discover talent | `/talent` | Employer search across profiles, with a "verified skills only" filter |
| Talent profile | `/talent/:id` | Verified badges, proof-of-skill evidence, portfolio, relevant opportunities, contact |
| Dashboard | `/dashboard` | Talent view and employer view |

All profiles, organisations and listings are **demo data** (`src/lib/fixtures.ts`), marked in the UI with a "Demo" tag. Actions like applying, saving, messaging and submitting proof work in the interface, but nothing is saved yet. Persistence, accounts and admin come next (see the roadmap).

## Matching

Matching is a transparent, rule-based score, not an AI model. It is defined in `src/lib/matching.ts`:

- Skills: 55%. Verified skills count fully; self-reported skills count 60%.
- Opportunity type preference: 15%
- Location or remote fit: 15%
- Experience level: 10%
- Interests: 5%

Each score comes with a plain explanation, for example: "Strong match because you have 4 of the 5 required skills, 2 of them verified."

## Tech stack

- **TanStack Start** (React 19, TanStack Router) with file-based routes in `src/routes`
- **Tailwind CSS 4** with theme variables in `src/styles.css` (green / white / black)
- **shadcn/ui** components (Radix) in `src/components/ui`
- **Netlify** hosting, with images served through the Netlify Image CDN
- Planned: **Netlify Database** (Postgres + Drizzle), **Netlify Identity** (auth and roles), and **Netlify Blobs** (evidence files)

## Running locally

```bash
pnpm install
netlify dev        # or: pnpm dev (Vite only, port 3000)
```

Other scripts: `pnpm typecheck`, `pnpm lint`, `pnpm test`.

No environment variables are needed yet. Once the database and Identity are added, Netlify provides their connection details automatically. Secrets are never committed.

## Deploying

The site deploys to Netlify from the connected Git repository. The build command is `vite build` and the publish directory is `dist/client`, as configured in `netlify.toml`.

## Roadmap

See [PLAN.md](./PLAN.md). The next milestones are:

1. Database schema and seed data
2. Authentication, roles and onboarding
3. Saved profiles, skills and proof of skill
4. Employer opportunity posting
5. Applications, messages and notifications
6. Admin review tools
7. Hardening and an end-to-end test of the demo flow
