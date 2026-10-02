// Writes data/github.json (stars and last push per public repo) so the home page can show ratings.
// Runs before every build (npm "prebuild"). Offline or rate limited? The existing file is kept.
const fs = require("fs");
const path = require("path");

const USER = "AhmadIbrahiim";
const OUT = path.join(__dirname, "..", "data", "github.json");

async function main() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "site-sync" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`,
    { headers }
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const repos = await res.json();
  const out = {};
  repos
    .filter(r => !r.fork)
    .forEach(r => {
      out[r.name.toLowerCase()] = {
        stars: r.stargazers_count,
        pushed: r.pushed_at.slice(0, 10),
        url: r.html_url
      };
    });
  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`sync-github: ${Object.keys(out).length} repos written to data/github.json`);
}

main().catch(e => console.warn(`sync-github: kept the existing file (${e.message})`));
