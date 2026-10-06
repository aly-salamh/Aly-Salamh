#!/usr/bin/env python3
"""Deterministic lead scoring (Playbook v1). Input: JSON list of lead dicts. Output: priority.csv + summary.json.
Usage: python scripts/score.py --in out/DATE/odoo_leads.json --out out/DATE
Lead dict keys (all optional except id,name): stage, titles[], company, company_employees, academic(bool),
years_exp, forms(int), programs(int), paid_before(bool), won(bool), readiness, payment_pref, price,
discount_form(bool), abandoned_cart(bool), contacted_by_me(bool), contacted_by_other(str), overdue_days,
seen_in_contact_us(bool), linkedin, email_domain
"""
import argparse, csv, json, re
from pathlib import Path

def num(v):
    """Odoo CSV exports give numbers as text ("25,000.00"); blanks/garbage count as 0."""
    try: return float(str(v).replace(",", "").strip() or 0)
    except ValueError: return 0

def seniority(titles):
    best, found = 0, False
    for t in titles or []:
        t = (t or "").lower(); found = found or bool(t.strip())
        if re.search(r"\bc[a-z]o\b|chief|founder|owner|president|chairman|managing director|ceo", t): best = max(best, 30)
        elif re.search(r"vice dean|\bdean\b|\bvp\b|vice president|director|head of|program director|professor|\bhead\b|group head", t): best = max(best, 26)
        elif re.search(r"senior manager|manager|lead\b|team lead|principal", t): best = max(best, 20)
        elif re.search(r"senior|specialist|consultant|engineer|architect|expert", t): best = max(best, 14)
        elif re.search(r"analyst|associate|coordinator|officer|executive", t): best = max(best, 8)
        elif re.search(r"student|intern|junior|fresh", t): best = max(best, 2)
        else: best = max(best, 5)
    return best, found

def company_pts(emp, academic, has_company):
    if emp:
        if emp >= 10000: return 20
        if emp >= 1000: return 16
        if emp >= 200: return 12
        if emp >= 50: return 8
        return 5
    if academic: return 12
    return 0

def exp_pts(s):
    s = (s or "").replace("–", "-").lower()
    if "10+" in s or "10 +" in s: return 10
    if re.search(r"7-10", s): return 8
    if re.search(r"5-7|3-6|5-10", s): return 5
    if re.search(r"2-5|^2", s): return 3
    if re.search(r"0-2", s): return 1
    return 0

ADV = {"interested","qualified","first meeting done","proposal sent","need second meeting","will pay","pay 50%"}

def history_pts(l):
    forms = max(int(l.get("forms") or 1), 1)
    pts = 5 * (forms - 1)
    if l.get("paid_before"): pts += 8
    if (l.get("stage") or "").lower() in ADV: pts += 4
    pts = min(pts, 20)
    if int(l.get("programs") or 1) >= 2 or forms >= 3 or (forms >= 2 and l.get("repeat_bonus", True)): pts += 5
    return pts

def intent_pts(l):
    pts = 0
    if (l.get("payment_pref") or "").lower() == "full": pts += 3
    r = (l.get("readiness") or "").lower()
    pts += {"upcoming": 4, "current_wave": 4, "discuss_upcoming": 3, "later": 1}.get(r, 0)
    if num(l.get("price")) >= 20000: pts += 3
    if l.get("discount_form"): pts += 3
    if l.get("abandoned_cart"): pts += 3
    return min(pts, 10)

def score(l):
    sen, has_title = seniority(l.get("titles"))
    comp = company_pts(num(l.get("company_employees")), l.get("academic"), bool(l.get("company")))
    exp = exp_pts(l.get("years_exp"))
    hist = history_pts(l)
    inten = intent_pts(l)
    total = sen + comp + exp + hist + inten
    flags = []
    if not has_title: flags.append("no_title")
    if not l.get("company") or (l.get("company","").strip().lower() == l.get("name","").strip().lower()): flags.append("no_company")
    emp = num(l.get("company_employees"))
    if l.get("won"):
        tier = "WON"
    elif "no_title" in flags and "no_company" in flags:
        tier = "D"
    elif total >= 70 or (emp >= 10000 and total >= 60) or (sen >= 26 and (emp >= 500 or l.get("academic")) and total >= 60):
        tier = "A"
    elif total >= 55 or l.get("paid_before"):
        tier = "B"
    elif total >= 35:
        tier = "C"
    else:
        tier = "D"
    if l.get("contacted_by_other"): status = "CONTACTED BY OTHER"
    elif l.get("paid_before") or l.get("won"): status = "PAID BEFORE"
    elif int(l.get("forms") or 1) >= 2: status = "REPEAT FORM" + (" + CONTACTED BY ME" if l.get("contacted_by_me") else "")
    elif l.get("contacted_by_me"): status = "CONTACTED BY ME"
    else: status = "NEVER CONTACTED"
    return dict(id=l.get("id"), name=l.get("name"), total=total, seniority=sen, company=comp, experience=exp,
                history=hist, intent=inten, tier=tier, status=status, flags=";".join(flags),
                overdue_days=int(num(l.get("overdue_days"))), stage=l.get("stage"))

FIELDS = ["id", "name", "total", "seniority", "company", "experience", "history", "intent", "tier", "status", "flags", "overdue_days", "stage"]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--in", dest="inp", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    leads = json.load(open(a.inp)); rows = [score(l) for l in leads]
    order = {"WON": 0, "A": 1, "B": 2, "C": 3, "D": 4}
    rows.sort(key=lambda r: (order[r["tier"]] if r["tier"] != "WON" else 5, -r["total"], -r["overdue_days"]))
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    with open(out / "priority.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else FIELDS); w.writeheader(); w.writerows(rows)
    n = len(rows); tiers = {}
    for r in rows: tiers[r["tier"]] = tiers.get(r["tier"], 0) + 1
    summ = {"leads": n, "tiers": tiers, "tier_pct": {k: round(100 * v / n) for k, v in tiers.items()},
            "never_contacted": sum(r["status"] == "NEVER CONTACTED" for r in rows),
            "repeat_form": sum("REPEAT FORM" in r["status"] for r in rows),
            "overdue": sum(1 for r in rows if r["overdue_days"] > 0)}
    json.dump(summ, open(out / "summary.json", "w"), indent=2); print(json.dumps(summ))

if __name__ == "__main__":
    main()
