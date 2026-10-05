#!/usr/bin/env python3
"""Lead-quality percentages (definitions in config/settings.json). Usage: python scripts/quality.py --in out/DATE/priority.csv [--leads leads.json] --out out/DATE"""
import argparse, csv, json
from score import num
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--in", dest="inp", required=True); ap.add_argument("--leads"); ap.add_argument("--out", required=True); a = ap.parse_args()
    rows = list(csv.DictReader(open(a.inp, encoding="utf-8"))); n = len(rows) or 1
    price = {str(l["id"]): (l.get("price") or 0) for l in json.load(open(a.leads))} if a.leads else {}
    def pct(f): c = sum(1 for r in rows if f(r)); return {"count": c, "pct": round(100 * c / n)}
    q = {"leads": len(rows),
         "big_deals": pct(lambda r: r["tier"] == "A" or num(price.get(r["id"])) >= 20000),
         "b2b": pct(lambda r: r["tier"] == "A"),
         "high_profile": pct(lambda r: int(r["seniority"]) >= 26),
         "high_companies": pct(lambda r: int(r["company"]) >= 16),
         "opposite_incomplete_or_low": pct(lambda r: r["tier"] == "D"),
         "repeat_form": pct(lambda r: "REPEAT FORM" in r["status"]),
         "never_contacted": pct(lambda r: r["status"] == "NEVER CONTACTED"),
         "note": "Small samples (<30 leads): do not over-conclude."}
    json.dump(q, open(f"{a.out}/quality.json", "w"), indent=1); print(json.dumps(q))
if __name__ == "__main__": main()
