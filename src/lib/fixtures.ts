/**
 * DEMO DATA — every record in this file is fictional and exists so the
 * product surface can be explored before the database lands (see PLAN.md,
 * milestone 2). Swap these exports for server-function loaders backed by
 * Netlify Database; the types below mirror the planned tables.
 */

export type ProofStatus = 'pending' | 'under_review' | 'verified' | 'rejected'
export type OpportunityType =
  | 'Internship'
  | 'Job'
  | 'Freelance'
  | 'Apprenticeship'
  | 'Volunteer'
  | 'Project'
  | 'Scholarship'
  | 'Mentorship'
export type WorkArrangement = 'Remote' | 'Hybrid' | 'On-site'
export type ExperienceLevel = 'No experience' | 'Entry' | 'Intermediate'

export const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Internship',
  'Job',
  'Freelance',
  'Apprenticeship',
  'Volunteer',
  'Project',
  'Scholarship',
  'Mentorship',
]
export const ARRANGEMENTS: WorkArrangement[] = ['Remote', 'Hybrid', 'On-site']
export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'No experience',
  'Entry',
  'Intermediate',
]

export const SKILLS = [
  'React',
  'JavaScript',
  'Python',
  'Data analysis',
  'Excel',
  'UI design',
  'Figma',
  'Copywriting',
  'Social media',
  'Video editing',
  'Customer support',
  'Bookkeeping',
  'Graphic design',
  'SQL',
  'Public speaking',
  'Project coordination',
  'Photography',
  'Solar installation',
] as const
export type Skill = (typeof SKILLS)[number]

export interface ProofSubmission {
  id: string
  skill: Skill
  title: string
  description: string
  evidence: string
  link?: string
  submittedAt: string
  status: ProofStatus
  reviewerNote?: string
}

export interface TalentProfile {
  id: string
  name: string
  photo: string
  location: string
  remotePreference: WorkArrangement[]
  headline: string
  bio: string
  skills: Skill[]
  education: string
  interests: string[]
  experience: { role: string; org: string; period: string }[]
  projects: { title: string; summary: string; link?: string }[]
  availability: string
  preferences: OpportunityType[]
  experienceLevel: ExperienceLevel
  proofs: ProofSubmission[]
  identityVerified: boolean
}

export interface Employer {
  id: string
  name: string
  sector: string
  location: string
  about: string
  initials: string
}

export interface Opportunity {
  id: string
  title: string
  employerId: string
  description: string
  type: OpportunityType
  requiredSkills: Skill[]
  location: string
  arrangement: WorkArrangement
  experienceLevel: ExperienceLevel
  deadline: string
  stipend?: string
  postedAt: string
  tags: string[]
}

export interface Application {
  id: string
  opportunityId: string
  status: 'Submitted' | 'Viewed' | 'Shortlisted' | 'Interview'
  appliedAt: string
}

export interface Message {
  id: string
  from: string
  org: string
  preview: string
  sentAt: string
  unread: boolean
}

export const employers: Employer[] = [
  {
    id: 'greenline-solar',
    name: 'Greenline Solar Co.',
    sector: 'Clean energy',
    location: 'Accra, Ghana',
    about: 'Bringing off-grid solar to rural communities across West Africa.',
    initials: 'GS',
  },
  {
    id: 'openfields-labs',
    name: 'OpenFields Labs',
    sector: 'Software',
    location: 'Lagos, Nigeria',
    about: 'A product studio building tools for small businesses.',
    initials: 'OF',
  },
  {
    id: 'civic-data-collective',
    name: 'Civic Data Collective',
    sector: 'Non-profit',
    location: 'Remote',
    about: 'Open data projects that make local government easier to understand.',
    initials: 'CD',
  },
  {
    id: 'brightpath-foundation',
    name: 'Brightpath Foundation',
    sector: 'Education',
    location: 'Nairobi, Kenya',
    about: 'Scholarships and mentorship for first-generation learners.',
    initials: 'BF',
  },
  {
    id: 'kora-studio',
    name: 'Kora Creative Studio',
    sector: 'Media',
    location: 'Johannesburg, South Africa',
    about: 'An agency telling stories for brands with a social mission.',
    initials: 'KS',
  },
  {
    id: 'mesa-market',
    name: 'Mesa Market',
    sector: 'Retail & e-commerce',
    location: 'Bogotá, Colombia',
    about: 'An online marketplace for independent makers.',
    initials: 'MM',
  },
]

export const opportunities: Opportunity[] = [
  {
    id: 'frontend-intern-openfields',
    title: 'Frontend Developer Intern',
    employerId: 'openfields-labs',
    description:
      'Join a small product team shipping features to 4,000 small businesses. You will build React components, fix bugs with a mentor, and demo your work every Friday. No degree required — show us something you have built.',
    type: 'Internship',
    requiredSkills: ['React', 'JavaScript', 'UI design', 'Figma'],
    location: 'Lagos, Nigeria',
    arrangement: 'Hybrid',
    experienceLevel: 'No experience',
    deadline: '2026-12-20',
    stipend: '₦180,000 / month',
    postedAt: '2026-11-18',
    tags: ['Mentored', 'Paid'],
  },
  {
    id: 'data-fellow-civic',
    title: 'Open Data Fellow',
    employerId: 'civic-data-collective',
    description:
      'Clean and visualise public budget data so residents can see where their money goes. Twelve weeks, fully remote, with a published case study at the end.',
    type: 'Project',
    requiredSkills: ['Python', 'Data analysis', 'SQL', 'Excel'],
    location: 'Anywhere',
    arrangement: 'Remote',
    experienceLevel: 'Entry',
    deadline: '2026-12-12',
    stipend: '$1,200 total',
    postedAt: '2026-11-20',
    tags: ['Remote', 'Portfolio piece'],
  },
  {
    id: 'solar-apprentice-greenline',
    title: 'Solar Installation Apprentice',
    employerId: 'greenline-solar',
    description:
      'Learn to install and maintain home solar systems alongside senior technicians. Training, safety certification and a guaranteed interview for a full-time technician role.',
    type: 'Apprenticeship',
    requiredSkills: ['Solar installation', 'Customer support'],
    location: 'Accra, Ghana',
    arrangement: 'On-site',
    experienceLevel: 'No experience',
    deadline: '2027-01-08',
    stipend: 'GH₵2,400 / month',
    postedAt: '2026-11-15',
    tags: ['Certification', 'Paid'],
  },
  {
    id: 'social-freelance-kora',
    title: 'Social Media Content Creator',
    employerId: 'kora-studio',
    description:
      'Create short-form video and captions for three non-profit clients. Flexible hours, paid per deliverable, with creative direction from our senior team.',
    type: 'Freelance',
    requiredSkills: ['Social media', 'Video editing', 'Copywriting'],
    location: 'Johannesburg, South Africa',
    arrangement: 'Remote',
    experienceLevel: 'Entry',
    deadline: '2026-12-05',
    stipend: 'R1,500 per piece',
    postedAt: '2026-11-21',
    tags: ['Flexible hours'],
  },
  {
    id: 'brightpath-scholarship',
    title: 'Brightpath Tech Futures Scholarship',
    employerId: 'brightpath-foundation',
    description:
      'Full tuition for a 9-month software or data bootcamp, plus a laptop and monthly data bundle. Selection is based on a practical challenge, not grades.',
    type: 'Scholarship',
    requiredSkills: ['JavaScript', 'Python'],
    location: 'Nairobi, Kenya',
    arrangement: 'Hybrid',
    experienceLevel: 'No experience',
    deadline: '2027-01-15',
    postedAt: '2026-11-10',
    tags: ['Laptop included', 'First-generation'],
  },
  {
    id: 'support-associate-mesa',
    title: 'Customer Support Associate',
    employerId: 'mesa-market',
    description:
      'Help makers and buyers solve problems over chat and email. Full-time, Spanish and English, with a clear path to team lead.',
    type: 'Job',
    requiredSkills: ['Customer support', 'Copywriting', 'Excel'],
    location: 'Bogotá, Colombia',
    arrangement: 'Remote',
    experienceLevel: 'Entry',
    deadline: '2026-12-18',
    stipend: 'COP 3.2M / month',
    postedAt: '2026-11-19',
    tags: ['Full-time', 'Bilingual'],
  },
  {
    id: 'design-mentorship-openfields',
    title: 'Product Design Mentorship',
    employerId: 'openfields-labs',
    description:
      'Six one-to-one sessions with a senior product designer. Bring a project; leave with a portfolio-ready case study and honest feedback.',
    type: 'Mentorship',
    requiredSkills: ['UI design', 'Figma'],
    location: 'Anywhere',
    arrangement: 'Remote',
    experienceLevel: 'No experience',
    deadline: '2026-12-30',
    postedAt: '2026-11-22',
    tags: ['1:1', 'Free'],
  },
  {
    id: 'bookkeeping-volunteer-brightpath',
    title: 'Volunteer Bookkeeper',
    employerId: 'brightpath-foundation',
    description:
      'Keep records for our community library programme, 4 hours a week. A reference letter and finance training are included.',
    type: 'Volunteer',
    requiredSkills: ['Bookkeeping', 'Excel'],
    location: 'Nairobi, Kenya',
    arrangement: 'On-site',
    experienceLevel: 'No experience',
    deadline: '2026-12-28',
    postedAt: '2026-11-12',
    tags: ['Reference letter'],
  },
  {
    id: 'junior-analyst-greenline',
    title: 'Junior Data Analyst',
    employerId: 'greenline-solar',
    description:
      'Turn field reports from 300 installations into dashboards that guide where we expand next. You will own the weekly impact report.',
    type: 'Job',
    requiredSkills: ['Data analysis', 'Excel', 'SQL', 'Python'],
    location: 'Accra, Ghana',
    arrangement: 'Hybrid',
    experienceLevel: 'Intermediate',
    deadline: '2027-01-03',
    stipend: 'GH₵5,800 / month',
    postedAt: '2026-11-17',
    tags: ['Full-time', 'Impact'],
  },
  {
    id: 'photo-project-kora',
    title: 'Community Photography Project',
    employerId: 'kora-studio',
    description:
      'Document five neighbourhood enterprises for a brand campaign. Equipment provided; credited publication guaranteed.',
    type: 'Project',
    requiredSkills: ['Photography', 'Graphic design'],
    location: 'Johannesburg, South Africa',
    arrangement: 'On-site',
    experienceLevel: 'Entry',
    deadline: '2026-12-10',
    stipend: 'R6,000 total',
    postedAt: '2026-11-23',
    tags: ['Credited'],
  },
]

export const talent: TalentProfile[] = [
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    photo: 'amara.png',
    location: 'Lagos, Nigeria',
    remotePreference: ['Remote', 'Hybrid'],
    headline: 'Self-taught frontend developer',
    bio: 'I taught myself to code on a shared phone and a library computer. I build fast, simple websites for local businesses and I want my first role in a product team.',
    skills: ['React', 'JavaScript', 'UI design', 'Figma', 'Copywriting'],
    education: 'Secondary school certificate · freeCodeCamp Responsive Web Design',
    interests: ['Fintech', 'Small business tools', 'Accessibility'],
    experience: [
      { role: 'Freelance web builder', org: 'Self-employed', period: '2024 – now' },
      { role: 'Volunteer tutor', org: 'Yaba Community Library', period: '2023 – 2024' },
    ],
    projects: [
      {
        title: 'Mama Nkechi’s Kitchen ordering site',
        summary: 'WhatsApp-linked menu that doubled weekend orders for a local caterer.',
        link: 'https://example.com/demo/mama-nkechi',
      },
      {
        title: 'Lagos bus fare calculator',
        summary: 'Offline-first PWA used by 600+ commuters.',
      },
    ],
    availability: 'Available from January · 30 hrs/week',
    preferences: ['Internship', 'Job', 'Mentorship'],
    experienceLevel: 'No experience',
    identityVerified: true,
    proofs: [
      {
        id: 'p-amara-1',
        skill: 'React',
        title: 'Build an accessible job-board filter',
        description: 'TalentBridge frontend challenge: a filterable list with keyboard support and URL state.',
        evidence: 'Live demo + GitHub repository with tests. Reviewer confirmed keyboard navigation and screen-reader labels.',
        link: 'https://example.com/demo/amara-filter',
        submittedAt: '2026-10-28',
        status: 'verified',
        reviewerNote: 'Clean component structure and excellent accessibility work.',
      },
      {
        id: 'p-amara-2',
        skill: 'UI design',
        title: 'Redesign a market vendor checkout',
        description: 'Figma prototype reducing checkout from 5 steps to 2.',
        evidence: 'Figma file, usability notes from 4 testers.',
        link: 'https://example.com/demo/amara-checkout',
        submittedAt: '2026-11-04',
        status: 'verified',
      },
      {
        id: 'p-amara-3',
        skill: 'Copywriting',
        title: 'Landing page copy for a caterer',
        description: 'Rewrote menu and landing copy; tracked conversion.',
        evidence: 'Before/after screenshots and order analytics.',
        submittedAt: '2026-11-20',
        status: 'under_review',
      },
    ],
  },
  {
    id: 'diego-ramirez',
    name: 'Diego Ramírez',
    photo: 'diego.png',
    location: 'Bogotá, Colombia',
    remotePreference: ['Remote'],
    headline: 'Bilingual support & ops problem-solver',
    bio: 'I ran customer service for my family’s shop and handled 200+ online orders a month. I love fixing messy processes.',
    skills: ['Customer support', 'Excel', 'Copywriting', 'Social media'],
    education: 'Técnico en Gestión Comercial (in progress)',
    interests: ['E-commerce', 'Operations'],
    experience: [{ role: 'Online orders lead', org: 'Ramírez Hogar', period: '2022 – now' }],
    projects: [{ title: 'Returns tracker', summary: 'Excel workbook that cut refund time from 9 days to 3.' }],
    availability: 'Available now · full-time',
    preferences: ['Job', 'Freelance'],
    experienceLevel: 'Entry',
    identityVerified: true,
    proofs: [
      {
        id: 'p-diego-1',
        skill: 'Customer support',
        title: 'Resolve 5 difficult support tickets',
        description: 'Scenario-based challenge in English and Spanish.',
        evidence: 'Written responses scored by two reviewers.',
        submittedAt: '2026-10-30',
        status: 'verified',
      },
      {
        id: 'p-diego-2',
        skill: 'Excel',
        title: 'Order data clean-up',
        description: 'Clean a 2,000-row order export and summarise trends.',
        evidence: 'Workbook with pivot tables.',
        submittedAt: '2026-11-21',
        status: 'pending',
      },
    ],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    photo: 'priya.png',
    location: 'Nairobi, Kenya',
    remotePreference: ['Remote', 'Hybrid', 'On-site'],
    headline: 'Data storyteller with Python & SQL',
    bio: 'I left university after one year to support my family, then learned data analysis through free courses. I turn spreadsheets into decisions.',
    skills: ['Python', 'Data analysis', 'SQL', 'Excel', 'Public speaking'],
    education: 'One year BSc Statistics · Google Data Analytics Certificate',
    interests: ['Public health', 'Civic tech', 'Education'],
    experience: [{ role: 'Data volunteer', org: 'Kibera Health Clinic', period: '2025 – now' }],
    projects: [
      {
        title: 'Clinic wait-time dashboard',
        summary: 'Reduced average wait by 22 minutes after reorganising shifts.',
        link: 'https://example.com/demo/priya-clinic',
      },
    ],
    availability: 'Available from December · 20–40 hrs/week',
    preferences: ['Project', 'Job', 'Scholarship'],
    experienceLevel: 'Entry',
    identityVerified: true,
    proofs: [
      {
        id: 'p-priya-1',
        skill: 'Data analysis',
        title: 'Budget transparency analysis',
        description: 'Analyse a county budget dataset and present three insights.',
        evidence: 'Jupyter notebook and 5-slide summary.',
        link: 'https://example.com/demo/priya-budget',
        submittedAt: '2026-10-15',
        status: 'verified',
      },
      {
        id: 'p-priya-2',
        skill: 'SQL',
        title: 'Write 10 analytical SQL queries',
        description: 'Timed challenge on a retail dataset.',
        evidence: 'Query file, 10/10 correct.',
        submittedAt: '2026-10-22',
        status: 'verified',
      },
      {
        id: 'p-priya-3',
        skill: 'Python',
        title: 'Automate a weekly report',
        description: 'Script that generates a PDF report from CSVs.',
        evidence: 'Repository and sample output.',
        submittedAt: '2026-11-02',
        status: 'verified',
      },
    ],
  },
  {
    id: 'kwame-asante',
    name: 'Kwame Asante',
    photo: 'kwame.png',
    location: 'Accra, Ghana',
    remotePreference: ['On-site', 'Hybrid'],
    headline: 'Hands-on solar & electrical tinkerer',
    bio: 'I built a solar charging station for my street from salvaged panels. I want to turn this into a career in clean energy.',
    skills: ['Solar installation', 'Customer support', 'Project coordination'],
    education: 'WASSCE · Community electrical workshop',
    interests: ['Clean energy', 'Hardware'],
    experience: [{ role: 'Phone repair assistant', org: 'Makola Market', period: '2023 – now' }],
    projects: [{ title: 'Street solar charging station', summary: 'Serves 40 households daily.' }],
    availability: 'Available now',
    preferences: ['Apprenticeship', 'Job'],
    experienceLevel: 'No experience',
    identityVerified: false,
    proofs: [
      {
        id: 'p-kwame-1',
        skill: 'Solar installation',
        title: 'Document a 200W off-grid build',
        description: 'Video walkthrough of wiring, safety and load calculations.',
        evidence: '8-minute video + wiring diagram.',
        link: 'https://example.com/demo/kwame-solar',
        submittedAt: '2026-11-08',
        status: 'verified',
      },
    ],
  },
  {
    id: 'lina-haddad',
    name: 'Lina Haddad',
    photo: 'lina.png',
    location: 'Amman, Jordan',
    remotePreference: ['Remote'],
    headline: 'Video editor & visual storyteller',
    bio: 'I edit short documentaries on my phone and laptop for community groups. I want to work with mission-driven brands.',
    skills: ['Video editing', 'Social media', 'Graphic design', 'Photography'],
    education: 'Diploma in Media Studies',
    interests: ['Storytelling', 'Non-profits', 'Refugee advocacy'],
    experience: [{ role: 'Volunteer media lead', org: 'Youth Voices Amman', period: '2024 – now' }],
    projects: [{ title: '“Our Bakery” mini-doc', summary: '120k views across platforms.' }],
    availability: 'Part-time · evenings',
    preferences: ['Freelance', 'Project', 'Mentorship'],
    experienceLevel: 'Entry',
    identityVerified: true,
    proofs: [
      {
        id: 'p-lina-1',
        skill: 'Video editing',
        title: '60-second brand story edit',
        description: 'Edit provided raw footage into a vertical story.',
        evidence: 'Final MP4 and project file.',
        submittedAt: '2026-11-01',
        status: 'verified',
      },
      {
        id: 'p-lina-2',
        skill: 'Social media',
        title: 'Two-week content calendar',
        description: 'Plan for a youth charity campaign.',
        evidence: 'Calendar + 6 mock posts.',
        submittedAt: '2026-11-19',
        status: 'under_review',
      },
    ],
  },
  {
    id: 'jonah-miller',
    name: 'Jonah Miller',
    photo: 'jonah.png',
    location: 'Cleveland, USA',
    remotePreference: ['Remote', 'Hybrid'],
    headline: 'Junior JavaScript developer & game modder',
    bio: 'Dropped out of high school, earned my GED, and have been building browser games and Discord bots ever since.',
    skills: ['JavaScript', 'Python', 'React'],
    education: 'GED · The Odin Project',
    interests: ['Games', 'Developer tools'],
    experience: [{ role: 'Warehouse associate', org: 'Lakeside Logistics', period: '2024 – now' }],
    projects: [{ title: 'Community Discord bot', summary: 'Moderation bot running on 30 servers.' }],
    availability: 'Available from February',
    preferences: ['Apprenticeship', 'Internship', 'Scholarship'],
    experienceLevel: 'No experience',
    identityVerified: false,
    proofs: [
      {
        id: 'p-jonah-1',
        skill: 'JavaScript',
        title: 'Build a browser puzzle game',
        description: 'Original logic puzzle with level editor.',
        evidence: 'Playable link and repository.',
        link: 'https://example.com/demo/jonah-puzzle',
        submittedAt: '2026-11-12',
        status: 'pending',
      },
    ],
  },
]

/** The signed-in talent user for the demo dashboard (auth arrives in milestone 3). */
export const DEMO_TALENT_ID = 'amara-okafor'

export const demoApplications: Application[] = [
  { id: 'a1', opportunityId: 'design-mentorship-openfields', status: 'Shortlisted', appliedAt: '2026-11-22' },
  { id: 'a2', opportunityId: 'brightpath-scholarship', status: 'Viewed', appliedAt: '2026-11-14' },
]

export const demoSavedOpportunityIds = ['frontend-intern-openfields', 'social-freelance-kora']

export const demoMessages: Message[] = [
  {
    id: 'm1',
    from: 'Tolu Adeyemi',
    org: 'OpenFields Labs',
    preview: 'Loved your accessible filter challenge — are you free for a quick call this week?',
    sentAt: '2026-11-24',
    unread: true,
  },
  {
    id: 'm2',
    from: 'Brightpath Foundation',
    org: 'Brightpath Foundation',
    preview: 'Your scholarship application has been viewed by the selection panel.',
    sentAt: '2026-11-18',
    unread: false,
  },
]

export function getEmployer(id: string) {
  return employers.find((e) => e.id === id)
}
export function getTalent(id: string) {
  return talent.find((t) => t.id === id)
}
export function getOpportunity(id: string) {
  return opportunities.find((o) => o.id === id)
}
export function verifiedSkills(t: TalentProfile): Skill[] {
  return [...new Set(t.proofs.filter((p) => p.status === 'verified').map((p) => p.skill))]
}
