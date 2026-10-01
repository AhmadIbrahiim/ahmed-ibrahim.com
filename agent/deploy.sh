#!/bin/sh
# Rebuild the knowledge file from the site's markdown, lint, then ship a new agent version.
set -e
cd "$(dirname "$0")"
python3 scripts/sync_knowledge.py
uv run ruff check src scripts
lk agent deploy
