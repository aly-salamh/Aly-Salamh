#!/usr/bin/env bash
# The button. Usage: ./scripts/run.sh [mode]   Every step has a fallback; the run never dies silently.
# Steps A-B2 are deterministic scripts and always run; step C (Gmail/Drive/Apollo/judgement) needs the claude CLI.
cd "$(dirname "$0")/.."
MODE="${1:-run-all}"; D="out/$(date +%F)"; mkdir -p "$D"
note() { echo "[engine] $*"; }
# Step A: Odoo (workaround chain: API -> CSV export -> skill reads Odoo in browser)
if [ "$MODE" = "contact-us" ]; then note "contact-us mode -> Odoo pull skipped"
elif python3 scripts/odoo_pull.py --out "$D/odoo_leads.json" 2>"$D/odoo.err"; then note "Odoo via API ok"
elif [ -n "${ODOO_CSV:-}" ] && python3 scripts/odoo_pull.py --from-csv "$ODOO_CSV" --out "$D/odoo_leads.json"; then note "WORKAROUND: Odoo via CSV export"
else note "WORKAROUND: Odoo API unavailable ($(head -c 150 "$D/odoo.err")) -> skill reads Odoo in the browser"; fi
# Step B: sheet (workaround: skill uses Drive connector); build_data runs triage on it
python3 scripts/fetch_sheet.py --out "$D/contact_raw.csv" ${CONTACT_CSV:+--file "$CONTACT_CSV"} || note "WORKAROUND: sheet fetch failed -> skill uses Drive connector"
# Step B2: deterministic chain (triage, parse notes, enrich, score, quality, match, report, check)
python3 scripts/build_data.py --outdir "$D" $( [ -f "$D/odoo_leads.json" ] && echo --odoo-json "$D/odoo_leads.json" ) \
  $( [ -f "$D/contact_raw.csv" ] && echo --contact-csv "$D/contact_raw.csv" ) --mode "$MODE"; RC=$?
[ $RC -eq 0 ] || note "build_data/check_report reported errors (exit $RC)"
if ! command -v claude >/dev/null; then
  note "WORKAROUND: Claude CLI not found -> OFFLINE run (scripts only, no Gmail/Drive/Apollo). Report: $D/report_$MODE.html"
  exit $RC
fi
# Step C: Claude does Gmail/Drive/Apollo/judgement; Apollo is optional.
claude -p "/meska-lead-engine $MODE. Pre-built data (if present) is in $D. If any tool/step fails, use the documented workaround and say so at the top of the reply; never stop silently." \
  --allowedTools "Bash(python3 scripts/*)" "Read" "Write" "mcp__Gmail__search_threads" "mcp__Gmail__get_message" "mcp__Gmail__get_thread" \
  "mcp__Google_Drive__search_files" "mcp__Google_Drive__download_file_content" "mcp__Google_Drive__create_file" "mcp__Google_Drive__list_recent_files" \
  "mcp__Apollo_io__apollo_people_match" --max-turns 60 --output-format text | tee "$D/last-run.txt"
