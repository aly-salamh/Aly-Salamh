#!/usr/bin/env python3
"""Best-effort parser: Odoo lead note text (key: value lines) -> structured fields used by score.py.
Odoo note layout is not guaranteed; unknown keys are kept in `raw`. Adjust ALIASES after looking at real notes."""
import html, re
ALIASES = {
 "linkedin": ["linkedin", "linkedin profile", "linkedin url"],
 "years_exp": ["years of experience", "experience", "years of experience in your field"],
 "payment_pref": ["payment preference", "payment option", "payment plan", "payment"],
 "wave": ["wave", "cohort", "preferred wave"],
 "source": ["form source", "source", "form"],
 "campaign": ["campaign", "utm_campaign"],
 "job_title": ["job title", "title", "position", "current role"],
 "company": ["company", "company name", "organization", "organisation", "employer"],
 "department": ["department"],
}
def plain(text):
    """Odoo stores lead descriptions as HTML (<p>, <br/>, <li>): one line per block, tags dropped, entities decoded."""
    t = re.sub(r"(?i)<br\s*/?>|</(?:p|div|li|h\d)>", "\n", text or "")
    return html.unescape(re.sub(r"<[^>]+>", "", t))

def parse(text):
    kv = {}; text = plain(text)
    for line in text.splitlines():
        m = re.match(r"\s*[-•*]?\s*([^:：]{2,60})[:：]\s*(.+)", line)
        if m: kv[m.group(1).strip().lower()] = m.group(2).strip()
    out = {"raw": kv}
    for field, names in ALIASES.items():
        for n in names:
            if n in kv: out[field] = kv[n]; break
    if not out.get("linkedin"):
        m = re.search(r"https?://(?:[\w.]+\.)?linkedin\.com/[^\s<\"']+", text or "")
        if m: out["linkedin"] = m.group(0)
    low = (text or "").lower()
    out["submitted_again"] = "submitted again" in low or "repeat" in low
    pay = (out.get("payment_pref") or "").lower()
    out["payment_pref_norm"] = "full" if "full" in pay or "كامل" in pay else ("installments" if "install" in pay or "قسط" in pay else "")
    r = (out.get("wave") or "").lower()
    out["readiness"] = "current_wave" if "current" in r else "upcoming" if "upcoming" in r or "next" in r else "later" if "later" in r else ""
    return out
