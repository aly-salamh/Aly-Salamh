#!/usr/bin/env python3
"""Build the report HTML for a mode from out/DATE data files. The skill uploads it to Drive as a Google Doc (HTML import).
Usage: python scripts/report.py --dir out/DATE --mode run-all"""
import argparse, csv, html, json
from pathlib import Path
def table(rows, cols):
    if not rows: return "<p><i>None</i></p>"
    h = "".join(f"<th>{html.escape(c)}</th>" for c in cols)
    b = "".join("<tr>" + "".join(f"<td>{html.escape(str(r.get(c, '')))}</td>" for c in cols) + "</tr>" for r in rows)
    return f"<table border=1 cellpadding=4 style='border-collapse:collapse'><tr>{h}</tr>{b}</table>"
def rd(p): return list(csv.DictReader(open(p, encoding="utf-8"))) if p.exists() else []
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--dir", required=True); ap.add_argument("--mode", default="run-all"); a = ap.parse_args(); d = Path(a.dir)
    pr = rd(d / "priority.csv"); cu = rd(d / "contact_us.csv"); en = rd(d / "enrichment_list.csv")
    q = json.load(open(d / "quality.json")) if (d / "quality.json").exists() else {}
    mt = json.load(open(d / "contact_matches.json", encoding="utf-8")) if (d / "contact_matches.json").exists() else []
    for i, r in enumerate(pr, 1): r["rank"] = i
    lib = [r for r in pr if r["status"] == "PAID BEFORE" or r["tier"] == "WON"]
    urgent = [r for r in cu if r["type"] in ("existing_customer_action", "complaint_or_report")]
    b2b = [r for r in cu if r["type"] in ("corporate_training", "partnership", "b2c_corporate_domain")]
    parts = [f"<h1>Lead Engine Run - {d.name} ({a.mode})</h1><p>Prepared for Aly Salamah. Read-only analysis; drafts are not sent.</p>"]
    if urgent: parts += ["<h2>URGENT FLAGS</h2>", table(urgent, ["date", "name", "type", "message"])]
    parts += ["<h2>Priority list</h2>", table(pr, ["rank", "id", "name", "total", "tier", "status", "overdue_days", "flags"])]
    parts += ["<h2>High-Profile Library (paid)</h2>", table(lib, ["id", "name", "total", "status"])]
    parts += ["<h2>Quality</h2>", "<pre>" + html.escape(json.dumps(q, indent=1)) + "</pre>"]
    parts += ["<h2>Contact-Us: B2B / partnership priority</h2>", table(b2b, ["date", "name", "domain", "type", "message"])]
    parts += ["<h2>Contact-Us rows already in Odoo (repeat contact)</h2>", table(mt, ["contact_date", "contact_name", "type", "odoo_id", "odoo_name", "odoo_stage"])]
    parts += ["<h2>Enrichment list + WhatsApp drafts</h2>", table(en, ["id", "name", "missing", "linkedin", "whatsapp_draft"])]
    (d / f"report_{a.mode}.html").write_text("<html><meta charset=utf-8><body style='font-family:Arial'>" + "".join(parts) + "</body></html>", encoding="utf-8")
    print("wrote", d / f"report_{a.mode}.html")
if __name__ == "__main__": main()
