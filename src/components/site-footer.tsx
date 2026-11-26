import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed">
            A skills-first opportunity platform for young people who have the
            ability — and deserve the access.
          </p>
        </div>
        <FooterCol
          title="For talent"
          links={[
            { to: '/opportunities', label: 'Browse opportunities' },
            { to: '/dashboard', label: 'Your dashboard' },
            { to: '/talent/$talentId', label: 'Example profile', params: { talentId: 'amara-okafor' } },
          ]}
        />
        <FooterCol
          title="For employers"
          links={[
            { to: '/talent', label: 'Discover talent' },
            { to: '/opportunities', label: 'See live listings' },
          ]}
        />
        <div>
          <h2 className="mb-3 font-display text-sm font-semibold text-white">
            TalentBridge
          </h2>
          <ul className="space-y-2 text-sm">
            <li>Ability over résumé</li>
            <li>Transparent matching</li>
            <li>Verified proof of skill</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} TalentBridge. All rights reserved.</p>
          <p>Profiles and listings shown are demo data.</p>
        </div>
      </div>
    </footer>
  )
}

type FooterLink =
  | { to: '/opportunities' | '/dashboard' | '/talent'; label: string }
  | { to: '/talent/$talentId'; label: string; params: { talentId: string } }

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-sm font-semibold text-white">
        {title}
      </h2>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            {'params' in l ? (
              <Link to={l.to} params={l.params} className="hover:text-white">
                {l.label}
              </Link>
            ) : (
              <Link to={l.to} className="hover:text-white">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
