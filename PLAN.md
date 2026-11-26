# TalentBridge roadmap

TalentBridge moves young people from **“I have potential” → “I can prove my skills” → “I can be discovered” → “I can access opportunities.”**
The product ships in small milestones, so every step stays demo-ready. Each milestone after the first replaces part of `src/lib/fixtures.ts` with real, persisted data and leaves the screens as they are.

## ✅ Milestone 1: Product surface (done)
- Branded landing page: hero, how it works, talent and employer benefits, opportunities preview, proof of skill, final call to action, footer.
- Opportunities marketplace (`/opportunities`): search, filters for skill, type, location and work arrangement, a match score with a written explanation, a detail panel, and save/apply flows.
- Talent discovery for employers (`/talent`), with filters for verified skills, location and preference.
- Talent profile (`/talent/:id`): verified badges, proof-of-skill evidence, projects, education, experience, preferences, relevant opportunities, and contact/save actions.
- Dashboards (`/dashboard`): a talent view (completion, skills, proof submissions with a simulated review, recommendations, applications, saved items, messages) and an employer view (organisation, posted roles, ranked applicants, saved candidates).
- Rule-based matching in `src/lib/matching.ts`. Every record shown is demo data in `src/lib/fixtures.ts`, labelled with a “Demo” tag.

## Milestone 2: Data model and seed data
- Netlify Database (Postgres) with Drizzle in `db/schema.ts`: `users`, `talent_profiles`, `employer_profiles`, `skills`, `talent_skills`, `proof_submissions`, `opportunities`, `opportunity_skills`, `applications`, `saved_opportunities`, `saved_candidates`, `messages`, `notifications`, `reports`, with foreign keys and enums for statuses, types and arrangements.
- An `is_demo` flag on seeded rows, plus a seed script that loads the current fixtures.
- Server functions (`createServerFn`) for reads. The route loaders switch from fixtures to these functions.

## Milestone 3: Authentication, roles and onboarding
- Netlify Identity for sign-up, login, logout and password reset. Passwords are never stored or handled by app code.
- Roles (`talent`, `employer`, `admin`) in Identity app metadata, mirrored in `users.role`.
- Protected routes and role checks inside every server function.
- Onboarding after sign-up for each role: a talent profile wizard or an organisation profile wizard.

## Milestone 4: Talent profiles, skills and proof of skill
- Talents can create and edit their own profile and add or remove skills.
- Proof submissions are saved to the database, with optional evidence files in Netlify Blobs.
- Status lifecycle: pending → under review → verified or rejected. Only reviewers can change status.

## Milestone 5: Employers and opportunities
- Organisation profiles, plus forms to post, edit and close opportunities (with validation).
- Server-side opportunity search and filtering, and talent search for employers.

## Milestone 6: Applications, saving, messages and notifications
- Apply flow writes to `applications`. The talent and employer dashboards read from it, and employers can update an application's status.
- Saving opportunities and candidates.
- Employer ↔ talent messaging, plus notifications when a proof is verified, an application changes, or a message arrives.

## Milestone 7: Admin
- Proof review queue with approve/reject and a reviewer note.
- Management of users, opportunities and the skills taxonomy.
- Queue for reported content.

## Milestone 8: Hardening and the demo run-through
- Zod validation on every server function input, plus rate limiting on writes.
- Access-control tests and an end-to-end test of the 12-step demo flow (sign up → prove a skill → verified → discovered → apply → dashboard).
- Accessibility and responsive audit, plus loading skeletons for server-loaded screens.
