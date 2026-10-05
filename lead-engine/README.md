# Meska Lead Engine v3
One button: Odoo + Contact-Us sheet -> ranked call list, contact status, paid library, enrichment + WhatsApp drafts, quality %, Drive reports.
## Structure
See CLAUDE.md "Layout". Start with prompts/BUILD_BRIEF.md (to have Claude Code finish/extend) or prompts/MASTER_PROMPT.md (to run).
## Setup (15 min)
1. Install Claude Code; log in with claude.ai (Gmail/Drive connectors). Add Apollo MCP (`claude mcp add --transport http apollo <apollo mcp url>`; confirm URL in Apollo docs).
2. `cp config/local.example.json config/local.json` and fill in the Contact-Us sheet id and the quarter Drive folder id (git-ignored: this repo is public). `cp .env.example .env`; create the Odoo API key yourself. Test `python3 scripts/odoo_pull.py --list-fields`. Fails? Use the CSV workaround below.
3. `python3 tests/test_engine.py` (or `python3 -m pytest tests`) must pass.
4. Run: `./scripts/run.sh` (or a mode). Schedule: `./scripts/schedule.sh | crontab -`.
## Workarounds
`ODOO_CSV=leads.csv ./scripts/run.sh` (Odoo list > Action > Export: ID, Lead, Stage, Salesperson, Email, Phone, Expected Revenue, Created on, Notes) | `CONTACT_CSV=sheet.csv ./scripts/run.sh` | no Claude CLI -> offline scripts-only run (report still written) | Apollo down -> LinkedIn/PENDING.
## Test data
`tests/fixtures/contact_us_golden_anon.csv` holds the 58 untouched rows of the 2026-10-05 sheet with names, emails, phones, companies and people named in messages replaced by fake values (message wording, dates and triage labels unchanged), plus 3 synthetic handled rows. Pilot leads, `samples/` and the sample report use fake names and employers with the original scoring inputs. Never commit real exports: keep them in `out/` (git-ignored).
## Honest limits
Odoo note format is unverified (edit ALIASES in parse_notes.py after checking real notes). Scoring/triage are rules, tuned on the pilot (9 leads) and 58 sheet rows; re-tune with more data. No-Claude runs (cron without login, CI) still produce `out/DATE/report_<mode>.html` from scripts only. Contact status "contacted by me/other" needs chatter, which the API pull does not include yet: the skill fills it from the browser.
