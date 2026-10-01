"""Build agent/knowledge/site.md from the site's markdown (content/pages and content/posts).

Run before every deploy (agent/deploy.sh does). The output is git-ignored; the markdown
in content/ stays the single source of truth.
"""

import json
import os
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "knowledge" / "site.md"
ROUTES = OUT.with_name("routes.json")
LINKEDIN = Path(__file__).resolve().parents[1] / "knowledge-src" / "linkedin.md"
GITHUB_USER = "AhmadIbrahiim"
# Public repos that say little about his expertise (personal alert bots, empty templates, profile
# repo). The site repo is described by hand below because it contains this assistant.
SKIP_REPOS = {
    "ahmadibrahiim",
    "sylndr-alert",
    "vf-premium-numbers-alert",
    "react-router-starter-template",
    "ahmed-ibrahim.com",
    "Alexa-Cairo-Quran-Radio-24-7",
    "Jumia-one-task",
    "linkedin-scraper-update",
}

# Pages that are not markdown files. Keep in sync with data/SiteConfig.js menuLinks.
FIXED_ROUTES = [
    ("/", "Home"),
    ("/#work", "Work: the projects section on the home page"),
    ("/blog/", "All writing"),
]

# The agent must never say the name of the platform it runs on. Specific phrasings first, so the
# sentences still read naturally when spoken; the last rule catches anything left.
HIDDEN = [
    (
        r"LiveKit's new Answering Machine Detection",
        "A new answering machine detection model",
    ),
    (
        r"Yesterday LiveKit shipped Agents ([\d.]+)",
        r"Yesterday a major voice agent framework shipped version \1",
    ),
    (r"LiveKit's AMD model", "The framework's AMD model"),
    (r"LiveKit claims", "The framework's authors claim"),
    (r"LiveKit/WebRTC", "WebRTC"),
    (r", LiveKit,", ","),
    (r"LiveKit's", "the framework's"),
    (r"(?i)livekit", "the voice framework"),
    (r"(?i)cartesia( sonic)?[ \d.]*(tts)?", "a modern text-to-speech engine "),
]

EMOJI = re.compile("[\U0001f000-\U0001ffff\u2600-\u27bf\ufe0f]")

# The agent must never read out private contact details, even ones on a public page.
PHONE = re.compile(r"\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b")


def parse(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        return {}, text
    meta = dict(re.findall(r"^(\w+):\s*(.+)$", m.group(1), re.M))
    return {k: v.strip().strip("\"'") for k, v in meta.items()}, m.group(2)


def hide(text: str) -> str:
    for pattern, repl in HIDDEN:
        text = re.sub(pattern, repl, text)
    return re.sub(r" {2,}", " ", EMOJI.sub("", text)).strip()


def clean(body: str) -> str:
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", body)  # images
    body = re.sub(r"<[^>]+>", "", body)  # html
    body = re.sub(r"\[([^\]]+)\]\(mailto:[^)]*\)", r"\1", body)  # keep email text only
    body = PHONE.sub("[phone removed]", body)
    return hide(re.sub(r"\n{3,}", "\n\n", body).strip())


def route(path: Path) -> tuple[str, str]:
    meta, _ = parse(path)
    return f"/{meta['slug']}/", hide(meta.get("title", path.stem))


def section(path: Path, kind: str) -> str:
    meta, body = parse(path)
    title = hide(meta.get("title", path.stem))
    slug = meta.get("slug", path.stem)
    date = f", written {meta['date']}" if "date" in meta else ""
    return f"## {kind}: {title} (site path /{slug}/{date})\n\n{clean(body)}\n"


def github_section() -> str:
    """Latest open-source work, straight from GitHub so it never goes stale."""
    req = urllib.request.Request(
        f"https://api.github.com/users/{GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner",
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "site-assistant-sync",
        },
    )
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=20) as res:
            repos = json.load(res)
    except (
        Exception
    ) as e:  # offline or rate limited: the rest of the knowledge still ships
        print(f"warning: GitHub not fetched ({e})")
        return ""
    picked = [
        r
        for r in repos
        if not r["fork"]
        and not r["archived"]
        and r.get("description")
        and r["name"] not in SKIP_REPOS
    ][:8]
    lines = [
        "## Open source: Ahmed's latest projects on GitHub (github.com/AhmadIbrahiim, newest first)",
        "",
        "His personal site, ahmed-ibrahim.com, is open source too, and that includes this AI assistant. Anyone can read how it is built.",
        "",
    ]
    for r in picked:
        stars = r["stargazers_count"]
        meta = ", ".join(
            x
            for x in [
                r.get("language"),
                f"{stars:,} stars" if stars >= 5 else None,
                f"last updated {r['pushed_at'][:7]}",
            ]
            if x
        )
        desc = hide(r["description"])
        if desc.lower().startswith(r["name"].lower() + ":"):
            desc = desc[
                len(r["name"]) + 1 :
            ].strip()  # the name is already in front of it
        lines.append(f"- {r['name']} ({meta}): {desc}")
    return "\n".join(lines) + "\n"


def main() -> None:
    pages = sorted((ROOT / "content/pages").glob("*.md"))
    posts = sorted((ROOT / "content/posts").glob("*.md"), reverse=True)
    routes = FIXED_ROUTES + [route(p) for p in pages + posts]
    sitemap = "# Site map (exact paths for the navigate tool)\n\n" + "\n".join(
        f"- {path}  {title}" for path, title in routes
    )
    parts = [sitemap + "\n"]
    parts += [section(p, "Page") for p in pages]
    if LINKEDIN.exists():
        parts.append(hide(LINKEDIN.read_text(encoding="utf-8")) + "\n")
    parts.append(github_section())
    parts += [section(p, "Post") for p in posts]
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    ROUTES.write_text(json.dumps([r[0] for r in routes], indent=2), encoding="utf-8")
    text = OUT.read_text(encoding="utf-8")
    assert not PHONE.search(text), "phone number leaked into knowledge file"
    leaks = [
        ln
        for ln in text.splitlines()
        if ("livekit" in ln.lower() or "cartesia" in ln.lower())
        and not ln.startswith(("##", "- /"))
    ]
    assert not leaks, f"platform name leaked: {leaks[:1]}"
    print(f"{OUT.relative_to(ROOT)}: {len(routes)} routes, {len(text):,} characters")


if __name__ == "__main__":
    main()
