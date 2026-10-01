"""Build agent/knowledge/site.md from the site's markdown (content/pages and content/posts).

Run before every deploy (agent/deploy.sh does). The output is git-ignored; the markdown
in content/ stays the single source of truth.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "knowledge" / "site.md"
ROUTES = OUT.with_name("routes.json")

# Pages that are not markdown files. Keep in sync with data/SiteConfig.js menuLinks.
FIXED_ROUTES = [
    ("/", "Home"),
    ("/#work", "Work: the projects section on the home page"),
    ("/blog/", "All writing"),
]

# The agent must never read out private contact details, even ones on a public page.
PHONE = re.compile(r"\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b")


def parse(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        return {}, text
    meta = dict(re.findall(r"^(\w+):\s*(.+)$", m.group(1), re.M))
    return {k: v.strip().strip("\"'") for k, v in meta.items()}, m.group(2)


def clean(body: str) -> str:
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", body)  # images
    body = re.sub(r"<[^>]+>", "", body)  # html
    body = re.sub(r"\[([^\]]+)\]\(mailto:[^)]*\)", r"\1", body)  # keep email text only
    body = PHONE.sub("[phone removed]", body)
    return re.sub(r"\n{3,}", "\n\n", body).strip()


def route(path: Path) -> tuple[str, str]:
    meta, _ = parse(path)
    return f"/{meta['slug']}/", meta.get("title", path.stem)


def section(path: Path, kind: str) -> str:
    meta, body = parse(path)
    title = meta.get("title", path.stem)
    slug = meta.get("slug", path.stem)
    date = f", written {meta['date']}" if "date" in meta else ""
    return f"## {kind}: {title} (site path /{slug}/{date})\n\n{clean(body)}\n"


def main() -> None:
    pages = sorted((ROOT / "content/pages").glob("*.md"))
    posts = sorted((ROOT / "content/posts").glob("*.md"), reverse=True)
    routes = FIXED_ROUTES + [route(p) for p in pages + posts]
    sitemap = "# Site map (exact paths for the navigate tool)\n\n" + "\n".join(
        f"- {path}  {title}" for path, title in routes
    )
    parts = [sitemap + "\n"]
    parts += [section(p, "Page") for p in pages] + [section(p, "Post") for p in posts]
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    ROUTES.write_text(json.dumps([r[0] for r in routes], indent=2), encoding="utf-8")
    text = OUT.read_text(encoding="utf-8")
    assert not PHONE.search(text), "phone number leaked into knowledge file"
    print(f"{OUT.relative_to(ROOT)}: {len(routes)} routes, {len(text):,} characters")


if __name__ == "__main__":
    main()
