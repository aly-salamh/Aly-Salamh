#!/usr/bin/env python3
"""Match Contact-Us rows to Odoo leads by email or phone (repeat-contact signal).
Usage: python scripts/match.py --contact out/DATE/contact_us.csv --leads out/DATE/odoo_leads.json --out out/DATE/contact_matches.json"""
import argparse, csv, json, re
def norm_phone(p): d = re.sub(r"\D", "", p or ""); return d[-10:] if len(d) >= 10 else ""
def match(rows, leads):
    by_email = {(l.get("email") or "").strip().lower(): l for l in leads if l.get("email")}
    by_phone = {norm_phone(l.get("phone")): l for l in leads if norm_phone(l.get("phone"))}
    out = []
    for r in rows:
        l = by_email.get((r.get("email") or "").strip().lower()) or by_phone.get(norm_phone(r.get("phone")))
        if l: out.append({"contact_name": r["name"], "contact_date": r["date"], "type": r["type"], "odoo_id": l["id"], "odoo_name": l["name"], "odoo_stage": l.get("stage")})
    return out
if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--contact", required=True); ap.add_argument("--leads", required=True); ap.add_argument("--out", required=True); a = ap.parse_args()
    m = match(list(csv.DictReader(open(a.contact, encoding="utf-8"))), json.load(open(a.leads)))
    json.dump(m, open(a.out, "w"), indent=1, ensure_ascii=False); print(len(m), "contact rows matched to Odoo leads")
