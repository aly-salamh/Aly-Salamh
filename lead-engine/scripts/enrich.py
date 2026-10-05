#!/usr/bin/env python3
"""Enrichment glue. (1) merge enrichment.json (written by the skill from Apollo/LinkedIn: {id:{titles,company,company_employees,academic}}) into leads;
(2) write enrichment_list.csv for incomplete leads with LinkedIn URL + WhatsApp draft from templates/.
Usage: python scripts/enrich.py --leads out/DATE/leads_scored_input.json [--enrichment out/DATE/enrichment.json] --out out/DATE"""
import argparse, csv, json
from pathlib import Path
T = Path(__file__).resolve().parent.parent / "templates"
def is_arabic(s): return any("؀" <= c <= "ۿ" for c in (s or ""))
def draft(lead):
    ar = is_arabic(lead.get("name"))
    t = (T / ("whatsapp_ar.md" if ar else "whatsapp_en.md")).read_text(encoding="utf-8").split("---", 1)[-1].strip()
    return t.replace("{first_name}", (lead.get("name") or "").split(" ")[0]).replace("{program}", lead.get("program") or ("البرنامج" if ar else "the program"))
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--leads", required=True); ap.add_argument("--enrichment"); ap.add_argument("--out", required=True); a = ap.parse_args()
    leads = json.load(open(a.leads)); enr = json.load(open(a.enrichment)) if a.enrichment and Path(a.enrichment).exists() else {}
    for l in leads: l.update({k: v for k, v in enr.get(str(l["id"]), {}).items()})
    json.dump(leads, open(a.leads, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    rows = []
    for l in leads:
        missing = [k for k, c in (("title", not l.get("titles")), ("company", not l.get("company"))) if c]
        if missing: rows.append({"id": l["id"], "name": l["name"], "missing": "+".join(missing), "linkedin": l.get("linkedin", ""), "whatsapp_draft": draft(l)})
    Path(a.out).mkdir(parents=True, exist_ok=True)
    with open(Path(a.out) / "enrichment_list.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["id", "name", "missing", "linkedin", "whatsapp_draft"]); w.writeheader(); w.writerows(rows)
    print(len(rows), "incomplete leads")
if __name__ == "__main__": main()
