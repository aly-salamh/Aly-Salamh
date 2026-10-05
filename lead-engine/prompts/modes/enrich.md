# Mode: enrich
Incomplete leads only: list from enrichment_list.csv, Apollo by LinkedIn URL (no reveals) then LinkedIn, write enrichment.json, rerun build_data.py.
Command: `./scripts/run.sh enrich`  (or `claude -p "/meska-lead-engine enrich"`)
Follows prompts/MASTER_PROMPT.md. Outputs: out/DATE/report_enrich.html + Drive doc.
