// Public GitHub contribution counts, read from the same HTML fragment the profile page
// uses (no token needed). Cached by the page's revalidate window. Returns null on any
// failure so the row simply hides instead of showing a wrong number.

export interface GithubStats {
  last30: number;
  thisYear: number;
  profileUrl: string;
}

const USER = 'S3yon';

export async function getGithubStats(now = new Date()): Promise<GithubStats | null> {
  try {
    const res = await fetch(`https://github.com/users/${USER}/contributions`, {
      headers: { 'User-Agent': 'seyons.com' },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Cell id -> date, then tooltip "N contributions on …" -> count, joined on the id.
    const dates = new Map<string, string>();
    for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[\d-]+)"/g)) {
      dates.set(m[2], m[1]);
    }
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/for="(contribution-day-component-[\d-]+)"[^>]*>\s*(No|\d[\d,]*) contributions?/g)) {
      const date = dates.get(m[1]);
      if (date) counts.set(date, m[2] === 'No' ? 0 : Number(m[2].replace(/,/g, '')));
    }
    if (counts.size < 300) return null;

    const today = now.toISOString().slice(0, 10);
    const cutoff = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);
    const yearStart = `${today.slice(0, 4)}-01-01`;
    let last30 = 0;
    let thisYear = 0;
    for (const [date, n] of counts) {
      if (date > today) continue;
      if (date > cutoff) last30 += n;
      if (date >= yearStart) thisYear += n;
    }
    return { last30, thisYear, profileUrl: `https://github.com/${USER}` };
  } catch {
    return null;
  }
}
