#!/usr/bin/env python3
"""Rule-based triage of the Contact-Us sheet rows. Deterministic: same input -> same output.
Usage: python scripts/triage.py --csv out/contact_us.csv [--since 2026-10-05T07:44:24Z] [--all] --out out/DATE
"""
import argparse, csv, io, json, re, sys
from pathlib import Path

FREE = set("gmail.com yahoo.com hotmail.com outlook.com icloud.com live.com ymail.com msn.com gamil.com "
           "proton.me protonmail.com aol.com me.com windowslive.com yahoo.co.uk hotmail.co.uk".split())

KW = {
 "complaint": r"complain|unprofessional|disrespect|شكوى|شكوي|سيء|refund|استرداد",
 "leak": r"competitor|منافس|reselling|resell|بيع الكورس|leak|مسرب",
 "customer_action": r"already paid|i paid|paid the|دفعت|دفعنا|تحويل|switch|change my|upgrade|receipt|إيصال|ايصال|no one contacted|nobody contacted|no one called|لم يتم التواصل|لم يتواصل|محدش كلمني|محدش اتصل|ماحدش كلمني",
 "corporate": r"employees|our team|my team|team members|(?<!your )company|corporate|for my company|staff|department|workforce|workflow|financial analysis|we.re looking to|our business|our sales|"
              r"proposal|quotation|quote|training for|group training|training session|upskill|"
              r"موظفين|الموظفين|شركة|شركتنا|شركتي|مجموعه|مجموعة|فريق|عرض سعر|تدريب لمجموع",
 "partnership": r"collaborat|partnership|partner with|joint |sponsor|talent pool|placement|hire an|hiring|"
                r"instructor|trainer|we help businesses|offer you|pitch|vendor|influencer|شراكة|تعاون",
 "partnership_strong": r"collaborat|partnership|partner with|joint |sponsor|talent pool|placement|instructor|influencer|platform architect|we help businesses|شراكة|تعاون",
 "job": r"job opening|job|vacanc|\bcv\b|resume|internship|فرصة عمل|وظيفة|التقديم على وظيفة|looking to join (?:your|the) team|contribute to your team|third-year|student at|computer science student|seeking (?:an )?opportunit|my skills",
 "b2c": r"co ?tact|diploma|course|program|دبلوم|كورس|دورة|learn|تعلم|price|سعر|cost|تكلفة|details|تفاصيل|"
        r"offline|online|اونلاين|اوفلاين|certificate|claude|copilot|ai\b|schedule|start|call me|call|contact|"
        r"تواصل|اتصال|واتساب|whatsapp|connect|information|more info|معلومات|منح|scholarship|\bwave\b|ويف|الدفعة|موعد",
}
JUNK_NAME = re.compile(r"^[\W\d_]*$")

FREE_PREFIX = ("gmail.","gmal.","gamil.","yahoo.","hotmail.","outlook.","icloud.","live.","ymail.","windowslive.","msn.","aol.","proton")

def is_free(dom):
    return dom in FREE or dom.startswith(FREE_PREFIX)

def domain(email):
    m = re.search(r"[\w.\-+]+@([\w.\-]+\.\w+)", email or "")
    return m.group(1).lower() if m else ""

def split_email_phone(cell):
    cell = cell or ""
    em = re.search(r"[\w.\-+]+@[\w.\-]+\.\w+", cell)
    ph = re.search(r"(\+?\d[\d\s\-]{7,}\d)", cell.replace(em.group(0), "") if em else cell)
    return (em.group(0).lower() if em else ""), (re.sub(r"[\s\-]", "", ph.group(1)) if ph else "")

def classify(msg, name, email_cell):
    m = (msg or "").lower()
    email, phone = split_email_phone(email_cell)
    dom = domain(email)
    business = bool(dom) and not is_free(dom)
    words = re.findall(r"\w+", m)
    for label in ("complaint", "leak"):
        if re.search(KW[label], m): return "complaint_or_report", email, phone, dom
    if re.search(KW["customer_action"], m): return "existing_customer_action", email, phone, dom
    if re.search(r"attendees|employees|موظفين|\bstaff\b|our team|my team|for (?:my|our) company|training session", m): return "corporate_training", email, phone, dom
    if re.search(KW["partnership_strong"], m): return "partnership", email, phone, dom
    if re.search(KW["partnership"], m) and not re.search(r"diploma|course|دبلوم|كورس", m): return "partnership", email, phone, dom
    if re.search(r"third-year|student at|computer science student|seeking (?:an )?opportunit|my skills|internship|\bcv\b|resume|فرصة عمل", m): return "job_seeker", email, phone, dom
    if re.search(KW["job"], m) and len(words) < 40: return "job_seeker", email, phone, dom
    corp_hit = bool(re.search(KW["corporate"], m))
    if corp_hit and (business or re.search(r"employees|team|موظفين|مجموع|staff|company|شركة|corporate", m)): return "corporate_training", email, phone, dom
    if business and re.search(KW["b2c"], m) and re.search(r"proposal|quotation|presentation|offers? for (?:orange|us)|b2b|corporate|special", m): return "corporate_training", email, phone, dom
    if business and corp_hit: return "corporate_training", email, phone, dom
    if business and re.search(KW["b2c"], m): return "b2c_corporate_domain", email, phone, dom
    if re.search(KW["b2c"], m): return "b2c_inquiry", email, phone, dom
    if re.search(KW["partnership"], m): return "partnership", email, phone, dom
    # nothing meaningful
    if len(words) >= 15: return "b2c_inquiry", email, phone, dom   # long but unclear: a human should read it
    return "junk_or_unclear", email, phone, dom

PRIORITY = {"existing_customer_action":0,"complaint_or_report":1,"corporate_training":2,"partnership":3,"b2c_corporate_domain":4,"b2c_inquiry":5,"job_seeker":6,"junk_or_unclear":7}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True)
    ap.add_argument("--since", default="")
    ap.add_argument("--all", action="store_true", help="include rows with a non-blank state")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    rows = list(csv.DictReader(open(a.csv, encoding="utf-8")))
    sel = []
    for r in rows:
        st = (r.get("state") or "").strip().lower()
        if not a.all and st: continue
        if a.since and r["Date"] <= a.since: continue
        label, email, phone, dom = classify(r.get("Message"), r.get("Name"), r.get("Email"))
        sel.append({"date": r["Date"], "name": (r.get("Name") or "").strip(), "email": email, "phone": phone,
                    "domain": dom, "business_domain": bool(dom) and not is_free(dom), "type": label,
                    "message": re.sub(r"\s+", " ", r.get("Message") or "").strip()[:400]})
    sel.sort(key=lambda x: (PRIORITY[x["type"]], x["date"]))
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    with open(out / "contact_us.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(sel[0].keys()) if sel else ["date"]); w.writeheader(); w.writerows(sel)
    counts = {}
    for s in sel: counts[s["type"]] = counts.get(s["type"], 0) + 1
    json.dump({"rows": len(sel), "by_type": counts}, open(out / "contact_us_summary.json", "w"), indent=2)
    print(json.dumps({"rows": len(sel), "by_type": counts}))

if __name__ == "__main__":
    main()
