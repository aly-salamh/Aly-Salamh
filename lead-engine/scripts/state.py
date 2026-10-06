#!/usr/bin/env python3
"""Run memory: out/state.json keeps first/last seen and form counts per lead id, so repeat forms and trends survive between runs."""
import json, datetime
from pathlib import Path
P = Path("out/state.json")
def load():
    return json.load(open(P)) if P.exists() else {"runs": [], "leads": {}}
def update(st, lead_ids, today=None):
    today = today or datetime.date.today().isoformat(); rep = {}
    for i in lead_ids:
        e = st["leads"].setdefault(str(i), {"first_seen": today, "seen_runs": 0})
        e["seen_runs"] += 1; e["last_seen"] = today; rep[str(i)] = e["seen_runs"]
    st["runs"].append({"date": today, "leads": len(list(lead_ids))})
    return rep
def save(st):
    P.parent.mkdir(parents=True, exist_ok=True); json.dump(st, open(P, "w"), indent=1)
