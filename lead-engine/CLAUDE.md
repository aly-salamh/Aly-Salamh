# Meska Lead Engine (Aly Salamah, BD & Strategic Partnerships)
Read first: prompts/MASTER_PROMPT.md. Skill: /meska-lead-engine [mode]. Modes: prompts/modes/.
## Layout
scripts/ deterministic code (odoo_pull, fetch_sheet, triage, parse_notes, match, enrich, score, quality, state, report, build_data, check_report, run.sh, schedule.sh) | config/settings.json + config/local.json (sheet/folder ids, git-ignored) | templates/ (WhatsApp AR/EN) | tests/ | samples/ | out/DATE/ (generated, git-ignored)
## Rules
Read-only in Odoo and the Contact-Us sheet. Never send/reply/forward (denied in .claude/settings.json). Drafts signed "Aly Salamah". Never print or read .env. No Apollo email/phone reveals. Verify numbers (check_report.py) before reporting.
## Workarounds (state the one used, one line)
Odoo API fails -> Odoo list export CSV (`odoo_pull.py --from-csv`) -> browser read, write out/DATE/odoo_leads.json. Sheet fetch 401 -> Drive download_file_content text/csv or manual CSV. Apollo fails -> LinkedIn, else PENDING. Gmail empty -> Odoo overdue activities. Drive write fails -> keep out/DATE/report_*.html and attach. No claude CLI -> run.sh still runs every script step and writes the report (offline).
## Commands
`python3 tests/test_engine.py` (or pytest) | `./scripts/run.sh [mode]` | `./scripts/schedule.sh | crontab -` | `python3 scripts/odoo_pull.py --list-fields`
## Open items for the builder
Never commit real lead/sheet exports (public repo; fixtures are anonymized). Map real Odoo note keys in scripts/parse_notes.py ALIASES; confirm Apollo MCP URL; confirm Odoo API availability.
