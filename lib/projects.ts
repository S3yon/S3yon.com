// The extra layer on project timeline entries: a screenshot that previews the project's page,
// and for three of them the longer story that opens in place (problem, role, stack, outcome).
// Keyed by the entry's year, month and title, so lib/experience-data.ts stays untouched.
import type { FeedEntry } from './experience-data';

export interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
  // the page it shows, as it reads in the address bar
  host: string;
  url: string;
  // when it was captured
  taken: string;
}

export interface ProjectCase {
  name: string;
  problem: string;
  // what he did; left out where it is not recorded
  role?: string;
  team?: string;
  stack: string[];
  outcome: { big: string; label: string; detail?: string };
}

export interface Project {
  shot?: Shot;
  story?: ProjectCase;
}

// Captured at 1280x800, November 2026.
const SHOTS = {
  outfitted: {
    src: '/projects/outfitted.webp',
    width: 1280,
    height: 800,
    alt: 'The outfitted.ca home page: "Your wardrobe, digitized." beside a model in a white tee and grey joggers.',
    host: 'outfitted.ca',
    url: 'https://www.outfitted.ca/',
    taken: 'November 2026',
  },
  stancut: {
    src: '/projects/stancut.webp',
    width: 1280,
    height: 800,
    alt: 'The StanCut repository on GitHub: the Xcode project, the StanCut Pro app folder and a backend folder.',
    host: 'github.com/S3yon/StanCut',
    url: 'https://github.com/S3yon/StanCut',
    taken: 'November 2026',
  },
  hemostat: {
    src: '/projects/hemostat.webp',
    width: 1280,
    height: 800,
    alt: 'The HemoStat repository on GitHub: folders for agents, dashboard, monitoring and docs.',
    host: 'github.com/CommunityHackathons/HemoStat',
    url: 'https://github.com/CommunityHackathons/HemoStat',
    taken: 'November 2026',
  },
  pricevalve: {
    src: '/projects/pricevalve.webp',
    width: 1280,
    height: 800,
    alt: 'The PriceValve repository on GitHub: backend and frontend folders, and a note on Steam pricing recommendations.',
    host: 'github.com/rick-mingyu-liu/PriceValve',
    url: 'https://github.com/rick-mingyu-liu/PriceValve',
    taken: 'November 2026',
  },
} satisfies Record<string, Shot>;

const PROJECTS: Record<string, Project> = {
  '2026-March-Outfitted': {
    shot: SHOTS.outfitted,
    story: {
      name: 'Outfitted',
      problem:
        'Getting outfit ideas from the clothes you already own: upload them once, and the app builds outfits from your own closet.',
      role: 'After the event: made it an installable PWA, built the daily outfit suggestion, the share sheet, product search that adds items to the wardrobe and personalized "Find Items" picks, and polished the mobile try-on view.',
      team: 'With Adam (core dev) and Angus Bailey (UI)',
      stack: ['Next.js', 'Cloudinary', 'Google Gemini', 'Auth0'],
      outcome: { big: 'Live', label: 'at outfitted.ca', detail: 'Hit every sponsor track we aimed for.' },
    },
  },
  '2026-February-StanCut — Top 6': { shot: SHOTS.stancut },
  '2025-November-HemoStat — Most Impactful Award': {
    shot: SHOTS.hemostat,
    story: {
      name: 'HemoStat',
      problem: 'Critical Docker container health issues, caught and fixed by autonomous agents.',
      team: 'With four teammates',
      stack: ['Python', 'Docker', 'Redis', 'LangChain', 'Prometheus', 'Grafana', 'Streamlit'],
      outcome: {
        big: 'Most Impactful',
        label: 'Award, DevOps for GenAI',
        detail: '4 agents, built in 24 hours. Sheridan teams took 3 of the 4 top awards that event.',
      },
    },
  },
  '2025-September-Machine Learning Developer': {
    story: {
      name: 'Pediatric pneumonia screening',
      problem:
        'Screen children’s chest X-rays for pneumonia. A missed case (a false negative) is the error that matters most.',
      role: 'Machine Learning Developer on the research team: trained MobileNet models and compared them against larger networks, ran false-negative and image-quality analysis (blur, contrast, edge detail, sharpness), and tried CLAHE preprocessing.',
      stack: ['PyTorch', 'MobileNet', 'OpenCV', 'DGX, four V100 GPUs'],
      outcome: { big: '97.6%', label: 'accuracy, MobileNet baseline', detail: '95.8% sensitivity on 1,000 images.' },
    },
  },
  '2025-June-PriceValve': { shot: SHOTS.pricevalve },
};

export const projectOf = (e: FeedEntry): Project | undefined => PROJECTS[`${e.year}-${e.month}-${e.title}`];
