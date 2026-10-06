#!/usr/bin/env python3
"""Whole deterministic chain. Every stage that fails prints a WORKAROUND line and the chain continues with what it has.
Exit code is check_report's (non-zero = numbers do not reconcile).
Usage: python scripts/build_data.py [--odoo-json F] [--contact-csv F] [--enrichment F] [--mode run-all] [--outdir out/DATE]"""
import argparse, datetime, json, subprocess, sys
from pathlib import Path
import state, parse_notes
H = Path(__file__).resolve().parent
sys.stdout.reconfigure(line_buffering=True)   # keep WORKAROUND lines in order with subprocess output
ap = argparse.ArgumentParser()
ap.add_argument("--odoo-json"); ap.add_argument("--contact-csv"); ap.add_argument("--enrichment"); ap.add_argument("--mode", default="run-all"); ap.add_argument("--since")
ap.add_argument("--outdir", help="default out/<today>")
a = ap.parse_args()
d = Path(a.outdir or Path("out") / datetime.date.today().isoformat()); d.mkdir(parents=True, exist_ok=True)
def run(*cmd):
    r = subprocess.run([sys.executable, *map(str, cmd)]); return r.returncode == 0
if a.contact_csv:
    c = [H / "triage.py", "--csv", a.contact_csv, "--out", d] + (["--since", a.since] if a.since else [])
    if not run(*c): print("WORKAROUND: triage failed -> skill classifies rows by hand")
raw = json.load(open(a.odoo_json, encoding="utf-8")) if a.odoo_json and Path(a.odoo_json).exists() else None
if raw:
    st = state.load(); state.update(st, [l["id"] for l in raw]); state.save(st)
    leads = []
    for l in raw:
        p = parse_notes.parse(l.get("notes", ""))
        # parsed note values fill gaps; fields the skill already wrote (titles, readiness, ...) are kept when the note lacks them
        l.update({"titles": [p["job_title"]] if p.get("job_title") else l.get("titles", []), "company": p.get("company") or l.get("company", ""),
                  "linkedin": p.get("linkedin") or l.get("linkedin", ""), "years_exp": p.get("years_exp") or l.get("years_exp", ""),
                  "payment_pref": p.get("payment_pref_norm") or l.get("payment_pref", ""),
                  "readiness": p.get("readiness") or l.get("readiness", ""), "forms": max(int(l.get("forms") or 1), 2 if p["submitted_again"] else 1),
                  "won": (l.get("stage") or "").lower() == "won", "paid_before": l.get("paid_before", False)})
        leads.append(l)
    inp = d / "leads_scored_input.json"; json.dump(leads, open(inp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    run(H / "enrich.py", "--leads", inp, *(["--enrichment", a.enrichment] if a.enrichment else []), "--out", d)
    if run(H / "score.py", "--in", inp, "--out", d):
        run(H / "quality.py", "--in", d / "priority.csv", "--leads", inp, "--out", d)
        if (d / "contact_us.csv").exists(): run(H / "match.py", "--contact", d / "contact_us.csv", "--leads", inp, "--out", d / "contact_matches.json")
    else:
        print("WORKAROUND: scoring failed -> skill scores the flagged leads by hand from leads_scored_input.json")
elif raw == []:
    print("WORKAROUND: Odoo returned 0 leads for the window -> widen --days or check Gmail alerts / overdue activities")
elif a.mode != "contact-us":
    print("WORKAROUND: no Odoo data -> skill reads Odoo in the browser, writes out/DATE/odoo_leads.json, then re-run build_data.py")
run(H / "report.py", "--dir", d, "--mode", a.mode)
ok = run(H / "check_report.py", d)
print("data ready in", d)
sys.exit(0 if ok else 1)
