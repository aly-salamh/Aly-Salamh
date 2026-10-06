#!/usr/bin/env python3
"""Settings loader: config/settings.json, overlaid by git-ignored config/local.json (sheet/folder IDs), then env CONTACT_SHEET_ID."""
import json, os
from pathlib import Path
C = Path(__file__).resolve().parent.parent / "config"
def load():
    s = json.load(open(C / "settings.json", encoding="utf-8"))
    if (C / "local.json").exists(): s.update(json.load(open(C / "local.json", encoding="utf-8")))
    if os.environ.get("CONTACT_SHEET_ID"): s["contact_sheet_id"] = os.environ["CONTACT_SHEET_ID"]
    return s
