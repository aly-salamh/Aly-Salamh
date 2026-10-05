#!/usr/bin/env python3
"""Read-only Odoo 19 JSON-2 pull of CRM leads. Key comes from .env (ODOO_URL, ODOO_DB, ODOO_API_KEY); never printed.
Usage: python scripts/odoo_pull.py --out out/DATE/odoo_leads.json [--days 14] [--list-fields]
Only calls search_read / fields_get. No writes."""
import argparse, json, os, sys, urllib.request, urllib.error
from datetime import date, timedelta
from pathlib import Path

def load_env():
    p = Path(__file__).resolve().parent.parent / ".env"
    if p.exists():
        for line in p.read_text().splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1); os.environ.setdefault(k.strip(), v.strip().strip('"'))

def call(model, method, body):
    url = f"{os.environ['ODOO_URL'].rstrip('/')}/json/2/{model}/{method}"
    h = {"Authorization": f"Bearer {os.environ['ODOO_API_KEY']}", "Content-Type": "application/json"}
    if os.environ.get("ODOO_DB"): h["X-Odoo-Database"] = os.environ["ODOO_DB"]
    req = urllib.request.Request(url, json.dumps(body).encode(), h)
    try:
        return json.load(urllib.request.urlopen(req, timeout=60))
    except urllib.error.HTTPError as e:
        sys.exit(f"Odoo API error {e.code}: {e.read().decode()[:300]} (API may be unavailable on this plan; use browser mode)")

def from_csv(src, out):
    import csv, re
    def pick(r, *names):
        for n in names:
            for k in r:
                if k and k.strip().lower() == n: return r[k]
        return ""
    res = []
    for r in csv.DictReader(open(src, encoding="utf-8-sig")):
        i = pick(r, "id", "external id"); p = pick(r, "expected revenue").replace(",", "").strip()
        res.append(dict(id=int(i) if i.isdigit() else i, name=pick(r, "lead", "opportunity", "name"), stage=pick(r, "stage"),
                        salesperson=pick(r, "salesperson"), email=pick(r, "email"), phone=pick(r, "phone"),
                        price=float(p) if re.fullmatch(r"-?\d+(\.\d+)?", p) else 0, created=pick(r, "created on", "creation date"),
                        company=pick(r, "company name", "customer", "contact name"), notes=pick(r, "notes", "internal notes")))
    Path(out).parent.mkdir(parents=True, exist_ok=True); json.dump(res, open(out, "w"), indent=1)
    print(f"{len(res)} leads from CSV")

def main():
    load_env()
    ap = argparse.ArgumentParser(); ap.add_argument("--out"); ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--list-fields", action="store_true")
    ap.add_argument("--from-csv", help="WORKAROUND: Odoo list-view Export CSV (CRM > list view > select all > Action > Export) instead of API")
    a = ap.parse_args()
    if a.from_csv: return from_csv(a.from_csv, a.out)
    if not os.environ.get("ODOO_API_KEY"): sys.exit("ODOO_API_KEY missing -> workaround: re-run with --from-csv <Odoo export.csv>, or let the skill read Odoo in the browser")
    if a.list_fields:
        f = call("crm.lead", "fields_get", {"attributes": ["string", "type"]})
        for k, v in sorted(f.items()): print(k, "|", v["string"], "|", v["type"])
        return
    since = (date.today() - timedelta(days=a.days)).isoformat()
    fields = ["id", "name", "partner_name", "email_from", "phone", "stage_id", "user_id", "tag_ids", "expected_revenue",
              "create_date", "write_date", "date_deadline", "description", "probability", "active"]
    rows = call("crm.lead", "search_read", {"domain": [["create_date", ">=", since]], "fields": fields, "limit": 500, "order": "create_date desc"})
    out = []
    for r in rows:
        out.append(dict(id=r["id"], name=r["name"], stage=(r["stage_id"] or [0, ""])[1], salesperson=(r["user_id"] or [0, ""])[1],
                        email=r.get("email_from"), phone=r.get("phone"), price=r.get("expected_revenue"), created=r["create_date"],
                        company=r.get("partner_name") or "", notes=(r.get("description") or "")[:2000]))
    Path(a.out).parent.mkdir(parents=True, exist_ok=True); json.dump(out, open(a.out, "w"), indent=1)
    print(f"{len(out)} leads since {since}")

if __name__ == "__main__":
    main()
