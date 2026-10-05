#!/usr/bin/env python3
"""Get the Contact-Us sheet as CSV. Tries, in order: local file arg -> public CSV export URL -> tells the skill to use Drive connector.
Usage: python scripts/fetch_sheet.py --out out/DATE/contact_raw.csv [--file path.csv]"""
import argparse, shutil, sys, urllib.request
from pathlib import Path
import config
SHEET = config.load().get("contact_sheet_id", "")
ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True); ap.add_argument("--file"); a = ap.parse_args()
Path(a.out).parent.mkdir(parents=True, exist_ok=True)
if a.file:
    shutil.copy(a.file, a.out); print("copied local file"); sys.exit(0)
if not SHEET:
    print("NO SHEET ID (set contact_sheet_id in config/local.json or CONTACT_SHEET_ID). WORKAROUND: Drive connector "
          f"download_file_content(exportMimeType=text/csv) -> save to {a.out}, or File > Download > CSV and pass --file.")
    sys.exit(2)
try:
    data = urllib.request.urlopen(f"https://docs.google.com/spreadsheets/d/{SHEET}/export?format=csv&gid=0", timeout=30).read()
    if data[:1] == b"<": raise ValueError("login page (sheet not public)")
    Path(a.out).write_bytes(data); print("downloaded via export URL"); sys.exit(0)
except Exception as e:
    print(f"DIRECT FETCH FAILED ({e}). WORKAROUND: Drive connector download_file_content(exportMimeType=text/csv) -> save to {a.out}, "
          "or File > Download > CSV from the sheet and pass --file.")
    sys.exit(2)
