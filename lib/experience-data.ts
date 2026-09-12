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
}

// One chronological feed, newest first. Roles, projects, community and school
// all live in the same stream — the year headings carry the structure.
export const feed: FeedEntry[] = [
  {
    year: 2026,
    month: 'August',
    title: 'Lead Photographer',
    org: 'GDG Sheridan',
    kind: 'role',
    current: true,
    description: 'Leading event photography for GDG Sheridan.',
  },
  {
    year: 2026,
    month: 'August',
    title: 'S:/HACKS Volunteer',
    org: 'Scotiabank',
    kind: 'community',
    description: "Volunteered at Scotiabank's S:/HACKS hackathon.",
  },
  {
    year: 2026,
    month: 'May',
    title: 'Software Engineer Intern',
    org: 'Scotiabank',
    kind: 'role',
    current: true,
    description:
      'Building and maintaining data pipelines with Apache Airflow, deploying services across Azure and GCP, and containerizing microservices with Kubernetes in a fintech production environment.',
    tags: ['Python', 'Apache Airflow', 'Kubernetes', 'Azure', 'Google Cloud', 'Docker'],
  },
  {
    year: 2026,
    month: 'May',
    title: 'Photographer',
    org: 'HuskyHack',
    kind: 'community',
    description: 'Shot the event for HuskyHack.',
  },
  {
    year: 2026,
    month: 'March',
    title: 'Outfitted',
    org: 'Hack Canada',
    kind: 'project',
    description:
      'AI wardrobe assistant — upload your clothes, build a digital closet, and generate outfit combinations from your own style. Hit every sponsor track we aimed for.',
    tags: ['Next.js', 'Cloudinary', 'Google Gemini', 'Auth0'],
  },
  {
    year: 2025,
    month: 'December',
    title: 'Organizer',
    org: 'BearHacks',
    orgUrl: 'https://www.bearhacks.com/',
    kind: 'community',
    description: 'Second term organizing BearHacks, through May 2026.',
  },
  {
    year: 2025,
    month: 'November',
    title: 'HemoStat — Most Impactful Award @ DevOps for GenAI',
    kind: 'project',
    description:
      'Multi-agent system with 4 autonomous agents that monitor and remediate Docker container health issues, with a production monitoring stack. Built in 24 hours.',
    tags: ['Python', 'Docker', 'Redis', 'LangChain', 'Prometheus', 'Grafana', 'Streamlit'],
    links: [{ label: 'GitHub', url: 'https://github.com/S3yon/HemoStat' }],
  },
  {
    year: 2025,
    month: 'November',
    title: 'Mentor',
    org: 'Sheridan Datathon',
    kind: 'community',
    description:
      'Mentored teams through data science challenges — first time on the other side of a hackathon after competing in five.',
  },
  {
    year: 2025,
    month: 'September',
    title: 'Machine Learning Developer',
    org: 'Sheridan Centre for Applied AI',
    orgUrl: 'https://www.sheridancollege.ca/research/centres/applied-ai',
    kind: 'role',
    description:
      'Developed diagnostic AI for telemedicine, reaching 97.2% accuracy on 6,000+ medical images and cutting false negatives from 42 to 5 through A/B tested augmentation. Deployed cross-platform with a FastAPI server, web client and mobile app.',
    tags: ['PyTorch', 'ResNet', 'MobileNet', 'OpenCV', 'FastAPI', 'Docker'],
  },
  {
    year: 2025,
    month: 'September',
    title: 'Volunteer Staff',
    org: 'Hack the North',
    orgUrl: 'https://www.linkedin.com/company/hack-the-north/',
    kind: 'community',
    description: "Supported Canada's largest hackathon — 1,000+ participants at Waterloo.",
  },
  {
    year: 2025,
    month: 'August',
    title: 'Orientation Volunteer',
    org: 'Sheridan College',
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
      { label: 'GitHub', url: 'https://github.com/S3yon/PriceValve' },
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
    orgUrl: 'https://www.bearhacks.com/',
    kind: 'community',
    description:
      'Coordinated registration for 260+ participants at a hackathon sponsored by Perplexity, Scotiabank and Google.',
  },
  {
    year: 2025,
    month: 'February',
    title: 'ThyroTrack — 2nd Place @ AI in Healthcare Hackathon',
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
    kind: 'role',
    description:
      'Handled customer requests, billing and inventory for high-volume camera rentals, and resolved database issues to keep operations running.',
  },
  {
    year: 2020,
    month: 'October',
    title: 'Technical Service Representative',
    org: 'Transcom',
    kind: 'role',
    description:
      'Supported 500+ users with remote diagnostics and structured troubleshooting, plus system hardening and security updates.',
  },
];

export const years = [...new Set(feed.map((e) => e.year))].sort((a, b) => b - a);
