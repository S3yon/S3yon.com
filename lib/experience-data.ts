export type EntryKind = 'role' | 'project' | 'community' | 'education';

export interface FeedEntry {
  year: number;
  month: string;
  title: string;
  org?: string;
  orgUrl?: string;
  kind: EntryKind;
  current?: boolean;
  description: string;
  tags?: string[];
  links?: { label: string; url: string }[];
  // Org or event logo for the rail marker (from /public/logos). `logoFill` makes a square
  // logo fill the whole circle instead of sitting inside it.
  logo?: string;
  logoFill?: boolean;
}

// One chronological feed, newest first. Roles, projects, community and school
// all live in the same stream — the year headings carry the structure.
export const feed: FeedEntry[] = [
  {
    year: 2026,
    month: 'September',
    title: 'A Future Beyond Hackathons: Cross Collaboration in the Professional World',
    org: 'GDG Sheridan',
    logo: '/logos/gdgsheridan.png',
    orgUrl: 'https://www.gdgsheridan.com/',
    kind: 'community',
    description:
      'Shot headshots for everyone who came and filmed the event. Left with a lot of new connections and a better read on the industry.',
  },
  {
    year: 2026,
    month: 'September',
    title: 'Photographer',
    org: 'Hack the North',
    logo: '/logos/hackthenorth.png',
    orgUrl: 'https://www.linkedin.com/company/hack-the-north/',
    kind: 'community',
    description:
      "Back on staff for a second year, shooting photos and video across the weekend at Canada's biggest hackathon.",
  },
  {
    year: 2026,
    month: 'August',
    title: 'Lead Photographer',
    org: 'GDG Sheridan',
    logo: '/logos/gdgsheridan.png',
    orgUrl: 'https://www.gdgsheridan.com/',
    kind: 'role',
    current: true,
    description: 'Leading event photography for GDG Sheridan.',
  },
  {
    year: 2026,
    month: 'August',
    title: 'S:/HACKS Volunteer',
    org: 'Scotiabank',
    logo: '/logos/scotiabank.png',
    orgUrl: 'https://www.scotiabank.com/careers/en/careers/s-hacks.html',
    kind: 'community',
    description: "Volunteered at Scotiabank's S:/HACKS hackathon.",
  },
  {
    year: 2026,
    month: 'May',
    title: 'Software Engineer Intern',
    org: 'Scotiabank',
    logo: '/logos/scotiabank.png',
    orgUrl: 'https://www.scotiabank.com/careers/en/careers.html',
    kind: 'role',
    current: true,
    description:
      'Built end-of-day settlement reporting and workflow fixes for an internal trade settlement platform, and took an intern onboarding product from idea to working product with a team of five. This fall: an internal innovation project using AI to reduce manual compliance work.',
    tags: ['SQL', 'ServiceNow', 'Full-stack'],
  },
  {
    year: 2026,
    month: 'May',
    title: 'Photographer',
    org: 'HuskyHack',
    logo: '/logos/huskyhack.png',
    logoFill: true,
    orgUrl: 'https://huskyhack.ca/',
    kind: 'community',
    description: 'Shot the event for HuskyHack.',
  },
  {
    year: 2026,
    month: 'March',
    title: 'Outfitted',
    org: 'Hack Canada',
    logo: '/logos/outfitted.png',
    logoFill: true,
    orgUrl: 'https://hackcanada.org/',
    kind: 'project',
    description:
      'AI wardrobe assistant — upload your clothes, build a digital closet, and generate outfit combinations from your own style. Hit every sponsor track we aimed for.',
    tags: ['Next.js', 'Cloudinary', 'Google Gemini', 'Auth0'],
    links: [
      { label: 'Live site', url: 'https://www.outfitted.ca/' },
      { label: 'GitHub', url: 'https://github.com/S3yon/Outfitted' },
    ],
  },
  {
    year: 2026,
    month: 'February',
    title: 'StanCut — Top 6',
    org: 'Stan x HackAI Toronto',
    kind: 'project',
    description:
      'My first Swift project: a native iOS app backed by AWS Lambda and S3, built with a team over the weekend. Finished in the top 6.',
    tags: ['Swift', 'AWS Lambda', 'Amazon S3'],
    links: [{ label: 'GitHub', url: 'https://github.com/S3yon/StanCut' }],
  },
  {
    year: 2026,
    month: 'February',
    title: 'Job Search Week Volunteer',
    org: 'Sheridan Works',
    logo: '/logos/sheridan.png',
    kind: 'community',
    description:
      'Helped run the employer panel and speed interviews for co-op students at HMC, and shot headshots for every attendee.',
  },
  {
    year: 2026,
    month: 'January',
    title: 'AI Engineer',
    org: 'Sheridan Centre for Applied AI',
    logo: '/logos/sheridan.png',
    orgUrl: 'https://www.sheridancollege.ca/research/centres/applied-ai',
    kind: 'role',
    description:
      'Continued the pediatric pneumonia screening work under a new title, through April 2026.',
    tags: ['PyTorch', 'MobileNet'],
  },
  {
    year: 2025,
    month: 'December',
    title: 'Organizer',
    org: 'BearHacks',
    logo: '/logos/bearhacks.svg',
    orgUrl: 'https://www.bearhacks.com/',
    kind: 'community',
    description: 'Second term organizing BearHacks, through May 2026.',
  },
  {
    year: 2025,
    month: 'November',
    title: 'HemoStat — Most Impactful Award',
    org: 'DevOps for GenAI',
    orgUrl: 'https://www.linkedin.com/company/canada-devops-community-of-practice/',
    kind: 'project',
    description:
      'Multi-agent system with 4 autonomous agents that monitor and remediate Docker container health issues, with a production monitoring stack. Built in 24 hours.',
    tags: ['Python', 'Docker', 'Redis', 'LangChain', 'Prometheus', 'Grafana', 'Streamlit'],
    links: [{ label: 'GitHub', url: 'https://github.com/CommunityHackathons/HemoStat' }],
  },
  {
    year: 2025,
    month: 'November',
    title: 'Mentor',
    org: 'Sheridan Datathon',
    logo: '/logos/datathon.png',
    orgUrl: 'https://sheridandatathon.com/',
    kind: 'community',
    description:
      'Mentored teams through data science challenges — first time on the other side of a hackathon after competing in five.',
  },
  {
    year: 2025,
    month: 'September',
    title: 'Machine Learning Developer',
    org: 'Sheridan Centre for Applied AI',
    logo: '/logos/sheridan.png',
    orgUrl: 'https://www.sheridancollege.ca/research/centres/applied-ai',
    kind: 'role',
    description:
      'Built pediatric pneumonia screening models on chest X-rays. The MobileNet baseline reached 97.6% accuracy and 95.8% sensitivity on 1,000 images, trained on a DGX with four V100 GPUs.',
    tags: ['PyTorch', 'MobileNet', 'OpenCV'],
  },
  {
    year: 2025,
    month: 'September',
    title: 'Volunteer Staff',
    org: 'Hack the North',
    logo: '/logos/hackthenorth.png',
    orgUrl: 'https://www.linkedin.com/company/hack-the-north/',
    kind: 'community',
    description: "Supported Canada's largest hackathon — 1,000+ participants at Waterloo.",
  },
  {
    year: 2025,
    month: 'August',
    title: 'Orientation Volunteer',
    org: 'Sheridan College',
    logo: '/logos/sheridan.png',
    orgUrl: 'https://www.sheridancollege.ca',
    kind: 'community',
    description:
      'Welcomed new students across campuses during Fall Orientation with the Double Blue Crew.',
  },
  {
    year: 2025,
    month: 'July',
    title: '404cast',
    org: 'Hack404',
    logo: '/logos/hack404.png',
    logoFill: true,
    orgUrl: 'https://hack404.dev/',
    kind: 'project',
    description:
      'Guess-the-neighbourhood safety game built on real Toronto Police Service crime data and a predictive model, shipped as an offline-capable PWA.',
    tags: ['React', 'Vite', 'Node.js', 'MongoDB', 'Express', 'Google Maps API'],
    links: [{ label: 'DevPost', url: 'https://devpost.com/software/404cast' }],
  },
  {
    year: 2025,
    month: 'June',
    title: 'PriceValve',
    org: 'SpurHacks',
    kind: 'project',
    description:
      'Real-time dashboard that helps Steam developers find optimal pricing using regional data and market trends.',
    tags: ['Next.js', 'TypeScript', 'Express', 'Node.js', 'Tailwind CSS'],
    links: [
      { label: 'DevPost', url: 'https://devpost.com/software/pricevalve' },
      { label: 'GitHub', url: 'https://github.com/rick-mingyu-liu/PriceValve' },
    ],
  },
  {
    year: 2025,
    month: 'June',
    title: 'Executive',
    org: 'Sheridan Computer Science Club',
    orgUrl: 'https://www.linkedin.com/company/sheridan-cs-club/',
    kind: 'community',
    current: true,
    description:
      'Leading tech projects and programming competitions — 15+ events to grow student engagement.',
  },
  {
    year: 2025,
    month: 'June',
    title: 'Student Volunteer',
    org: 'Sheridan Student Union',
    logo: '/logos/ssu.png',
    logoFill: true,
    orgUrl: 'https://www.thessu.ca/',
    kind: 'community',
    description:
      'Helped run 10+ campus events reaching 250+ students, with participation up around 25%.',
  },
  {
    year: 2025,
    month: 'March',
    title: 'Organizer',
    org: 'BearHacks',
    logo: '/logos/bearhacks.svg',
    orgUrl: 'https://www.bearhacks.com/',
    kind: 'community',
    description:
      'Coordinated registration for 260+ participants at a hackathon sponsored by Perplexity, Scotiabank and Google.',
  },
  {
    year: 2025,
    month: 'February',
    title: 'ThyroTrack — 2nd Place',
    org: 'AI in Healthcare Hackathon',
    orgUrl: 'https://www.linkedin.com/company/aihsyorku/',
    kind: 'project',
    description:
      'Health monitoring app for thyroid patients tracking 10+ metrics, with an XGBoost model hitting 91% accuracy identifying issues.',
    tags: ['Python', 'XGBoost', 'Pandas', 'Scikit-Learn', 'Imblearn'],
  },
  {
    year: 2024,
    month: 'May',
    title: 'Software Development & Network Engineering',
    org: 'Sheridan College',
    logo: '/logos/sheridan.png',
    orgUrl:
      'https://www.sheridancollege.ca/programs/computer-systems-technology-software-development-and-network-engineering',
    kind: 'education',
    current: true,
    description: 'Advanced Diploma, 3.9 GPA. Graduating August 2027.',
  },
  {
    year: 2022,
    month: 'February',
    title: 'Rental Consultant',
    org: 'Vistek',
    logo: '/logos/vistek.png',
    logoFill: true,
    kind: 'role',
    description:
      'Handled customer requests, billing and inventory for high-volume camera rentals, and resolved database issues to keep operations running.',
  },
  {
    year: 2020,
    month: 'October',
    title: 'Technical Service Representative',
    org: 'Transcom',
    logo: '/logos/transcom.png',
    kind: 'role',
    description:
      'Supported 500+ users with remote diagnostics and structured troubleshooting, plus system hardening and security updates.',
  },
];

export const years = [...new Set(feed.map((e) => e.year))].sort((a, b) => b - a);

// Upcoming public events. The feed shows only the next one that hasn't happened yet, so
// past entries expire on their own. Dates are local (Toronto), YYYY-MM-DD.
export interface UpcomingEvent {
  date: string;
  title: string;
  detail?: string;
  url?: string;
}

export const upcoming: UpcomingEvent[] = [
  {
    date: '2026-10-04',
    title: 'Case Closed @ GDG Sheridan',
    detail: "Sheridan's one-day case competition across analytics, engineering and business strategy, judged by GTA industry leaders.",
    url: 'https://gdg.community.dev/events/details/google-gdg-on-campus-sheridan-college-trafalgar-road-campus-oakville-canada-presents-get-into-gear-case-closed-sheridans-official-case-study-competition/',
  },
  {
    date: '2026-10-16',
    title: 'Hack the Valley 11',
    detail: 'Hackathon at the University of Toronto Scarborough, October 16 to 18.',
    url: 'https://hackthevalley.io/',
  },
  {
    date: '2026-11-07',
    title: 'Sheridan Datathon 2026 @ GDG Sheridan',
    detail: '24-hour data hackathon for 250+ students at Sheridan HMC, turning real industry datasets into insights.',
    url: 'https://gdg.community.dev/events/details/google-gdg-on-campus-sheridan-college-trafalgar-road-campus-oakville-canada-presents-get-into-gear-sheridan-datathon-2026/',
  },
  {
    date: '2026-11-14',
    title: 'NASA Space Apps Challenge Toronto',
    detail: "NASA's global hackathon, Toronto local event at Centennial College Downsview, November 14 to 15.",
    url: 'https://www.spaceappschallenge.org/2026/local-events/toronto/',
  },
];
