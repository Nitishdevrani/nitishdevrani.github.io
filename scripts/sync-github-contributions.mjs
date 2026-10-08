import { writeFile, rename } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const username = 'nitishdevrani';
const source = `https://github.com/users/${username}/contributions`;

// GitHub's public calendar includes counts in tooltips and intensity on cells.
// Reject incomplete responses rather than publishing misleading zero activity.
export function parseContributions(html) {
  const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
  const tips = new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(match => [attributes(match[1]).for, match[2].trim()]));
  const days = [...html.matchAll(/<td\b[^>]*data-date="[^"]+"[^>]*>/g)].map(([tag]) => {
    const attrs = attributes(tag);
    const count = /^(No|[\d,]+) contributions? on /.exec(tips.get(attrs.id) ?? '');
    const level = Number(attrs['data-level']);
    const date = attrs['data-date'];
    if (!count || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(level) || level < 0 || level > 4) {
      throw new Error('Unexpected GitHub contribution calendar format');
    }
    return { date, contributionCount: count[1] === 'No' ? 0 : Number(count[1].replaceAll(',', '')), level };
  }).sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 365 || days.length > 371) throw new Error('Incomplete GitHub contribution calendar');
  for (let index = 1; index < days.length; index++) {
    if (Date.parse(days[index].date) - Date.parse(days[index - 1].date) !== 86_400_000) {
      throw new Error('GitHub contribution calendar has missing or duplicate dates');
    }
  }
  return days;
}

async function main() {
  const response = await fetch(source, {
    headers: { Accept: 'text/html', 'Accept-Language': 'en-US', 'User-Agent': 'portfolio-contribution-sync' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);
  const days = parseContributions(await response.text());
  const age = Date.now() - Date.parse(days.at(-1).date);
  if (age < -86_400_000 || age > 2 * 86_400_000) throw new Error('GitHub returned an outdated calendar');
  const output = new URL('../src/data/github-contributions.json', import.meta.url);
  const temporary = new URL(`${output.href}.tmp`);
  await writeFile(temporary, `${JSON.stringify({ username, source, days }, null, 2)}\n`);
  await rename(temporary, output);
  console.log(`Updated ${username}: ${days.length} days through ${days.at(-1).date}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
