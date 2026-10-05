# BUILD BRIEF: Meska Lead Engine (give this whole file to Claude Code as the first prompt)

## 1. Role and experience level
Act as a senior RevOps / sales-automation engineer (Python, CRM APIs, Claude Code skills, MCP). Assume expert operator; skip basics. Owner: Aly Salamah, Head of BD & Strategic Partnerships, Meska AI (Cairo). Direct, no filler. Arabic or English to match the message.

## 2. Task (one line)
Build a one-button tool that turns Odoo CRM leads + the website Contact-Us sheet into a ranked call list, contact status, paid-lead library, enrichment list with draft WhatsApp messages, and day/week quality reports saved to Drive.

## 3. Detailed objective
Run on demand (`./scripts/run.sh [mode]`) and on schedule. Outputs must be identical for identical inputs (deterministic scripts for classification and scoring; Claude only for connectors, judgement on ambiguous rows, and drafting).
Modes: run-all, start-of-day, end-of-day, start-of-week, end-of-week, contact-us, enrich, library, `lead <name|id>`.
Programs: AI Copilot Diploma (offline/online), Claude (Build Your First Agent), Microsoft, AI For HR. B2C first, B2B later.

## 4. Context
- CRM: Odoo 19 at https://meska.odoo.com, lead URL `/odoo/crm/<id>`. Pipeline mixes B2B and B2C stages (New, New B2C, Communicate, Interested, Qualified, First Meeting Done, Not Reached, Proposal Sent, Need Second Meeting, Will Pay, Direct Payment, Pay 50%, Won, Not Interested, Not Valid, etc.).
- Leads are assigned by Youssef Al Refaey; Odoo emails alysalama@meska.ai from notifications@meska.ai, subject `<Lead>: Call - new <Offline Diploma|Online Diploma|Claude B&F> request`. Activity note holds LinkedIn, years of experience, payment preference, wave, form source, campaign.
- Contact-Us sheet id in `config/local.json` (`contact_sheet_id`, git-ignored; columns Date, Message, Name, Email, state; blank state = untouched; email cell may contain "email phone"; state is hand-typed: Done, Not Valid, Paid, names).
- Drive: account alysalama@meska.ai, folder per quarter "Lead Engine - Q4 2026" (id in `config/local.json`); create Q1 2027 etc. on quarter change.

## 5. Tools, skills, resources
- Existing starter project: `lead-engine.zip` (scripts/triage.py, score.py, odoo_pull.py, fetch_sheet.py, build_data.py, check_report.py, run.sh, skill, tests). Extend it; do not rewrite.
- Claude Code skill: `.claude/skills/meska-lead-engine/SKILL.md`; project memory: `CLAUDE.md`.
- MCP/connectors (needs claude.ai login): Gmail, Google Drive, Apollo (`apollo_people_match` by linkedin_url only, no reveals). Browser: `claude --chrome` as Odoo fallback.
- Odoo 19 JSON-2 API: `POST {ODOO_URL}/json/2/{model}/{method}`, `Authorization: Bearer <key>`, optional `X-Odoo-Database`. Read-only methods only (search_read, fields_get).
- Headless: `claude -p "/meska-lead-engine run-all" --allowedTools ... --max-turns 60`.

## 6. Workflow (each step feeds the next)
1. Collect lead IDs: Gmail alerts since last report + Odoo overdue activities; de-duplicate (multiple alerts = repeat form).
2. Read Odoo: API (odoo_pull.py) -> CSV export (`--from-csv`) -> browser. Capture stage, history, notes, tags, chatter, revenue, who touched it.
3. Contact-Us sheet: fetch CSV, triage.py classifies (existing_customer_action, complaint_or_report, corporate_training, partnership, b2c_corporate_domain, b2c_inquiry, job_seeker, junk_or_unclear), match emails/phones against Odoo leads.
4. Enrich only missing company/title: Apollo by LinkedIn URL, then LinkedIn manually, else PENDING.
5. Score, tier, contact status (score.py).
6. Library: paid leads -> High-Profile Library with upsell/B2B/partnership angle; tier A -> corporate angle.
7. Write dated Google Docs to the quarter folder (`NN - Lead Engine Run - YYYY-MM-DD (<mode>)`).
8. Verify: `check_report.py` + read the doc back; counts, names, dates, numbers vs sources.
9. Reply: top actions, urgent flags, quality percentages, Drive link. No recap.

## 7. Standards
**Scoring (100):** seniority 0-30, company signal 0-20, experience 0-10, program history 0-20 (+5 multi-program/repeat), intent/ticket 0-10. Completeness is a flag, not points. Judge seniority from real roles (a vice dean tagged "entry" is senior).
**Tiers:** A corporate/B2B or partnership potential (70+, or 10k+ employees and 60+, or senior at 500+/academic and 60+); B high-value single deal (55-69 or paid before); C standard (35-54); D incomplete (no title and no company, or <35) -> enrichment list.
**Contact status (one per lead):** NEVER CONTACTED / CONTACTED BY ME / CONTACTED BY OTHER / REPEAT FORM / PAID BEFORE (also check first touch in the Contact-Us sheet). Unverifiable = say UNVERIFIED.
**Reports:** activity done vs overdue, new leads, tier mix, % big deals / B2B / high-profile / high companies and the opposite, repeat-form share, never-contacted count; weekly adds trends (small samples: say so).
**Always flag at top:** complaints naming staff or content-leak claims (do not contact named people); existing customers asking to switch/pay (verify payment first); expired time-bound requests; overdue promised callbacks; corporate inquiries unanswered for weeks; conflicting data.
**Drafts:** WhatsApp/email text is draft only, signed "Aly Salamah" (never Mario); Egyptian business Arabic for Arabic, plain direct English otherwise. Never send.
**Safety:** read-only in Odoo and the sheet; never print/log .env values; no Apollo emails/phones; PII stays in Odoo/Drive; no CAPTCHA/password handling (Aly signs in himself).
**Code:** Python 3 stdlib-first, deterministic, CLI flags, non-zero exit on failure with a "WORKAROUND:" message, golden tests (pilot ordering Lina Fouad > Nadia Samir > Hala Mansour > Rania Zaki; Mona Gaber = PAID BEFORE; Hesham Ragab = D), triage golden set from the live sheet.

## 8. Workarounds (never fail silently; state each used at top of the reply)
Odoo API/plan unavailable -> Odoo list export CSV -> browser read (resize 1400, one lead per tab, unverified if it fails). Sheet not public -> Drive download_file_content text/csv, or manual CSV. Apollo fails -> LinkedIn, else PENDING. Gmail empty -> Odoo activities. Drive write fails -> save HTML/markdown in out/DATE/. No Claude CLI -> offline triage + checks.

## 9. Build steps for Claude Code
1. Unzip starter, `python3 tests/test_engine.py`, read CLAUDE.md and the skill.
2. Create `.env` from `.env.example` (Aly creates the Odoo API key himself); run `odoo_pull.py --list-fields`; map Wave/Tags/LinkedIn custom fields; extend odoo_pull to parse the activity-note form data (LinkedIn, years, payment pref, wave, form source, campaign) into score.py inputs.
3. Add `enrich.py` stub that reads Apollo/LinkedIn results from JSON and merges titles/company into leads.
4. Add `report.py` generating the HTML for each mode (priority list, library, enrichment + WhatsApp drafts, quality %); skill uploads it to Drive.
5. Add state file `out/state.json` (last run date, leads seen, contact history) for repeat-form and trend detection.
6. Add tests for: each fallback path, triage golden set, scoring edge cases, check_report mismatch.
7. Schedule: start-of-day 08:30, end-of-day 17:30, start-of-week Sun 08:30, end-of-week Thu 17:30 (Cairo time).
8. Run `./scripts/run.sh run-all` against live data; verify output against Odoo for 3 leads before trusting it.
## 10. Acceptance criteria
One command produces: ranked priority list with tier + status + overdue days; Contact-Us triage with B2B priority table; library; enrichment list with drafts; quality percentages; Drive doc link; all numbers pass check_report; every failed step shows its workaround; nothing was sent or edited in Odoo.
## 11. Later phases
Paid-lead backfill (~300), quality analytics over time, B2B cycle, Odoo cross-check of Contact-Us corporate domains (B2B library).
