#!/usr/bin/env python3
"""Verification gate: counts in summary files must match the CSVs."""
import csv, json, sys
from pathlib import Path
d = Path(sys.argv[1]); ok = True
for csvf, sj, key in (("priority.csv", "summary.json", "leads"), ("contact_us.csv", "contact_us_summary.json", "rows")):
    if (d / csvf).exists() and (d / sj).exists():
        n = sum(1 for _ in csv.DictReader(open(d / csvf, encoding="utf-8")))
        s = json.load(open(d / sj))[key]
        print(csvf, n, "==", s, "OK" if n == s else "MISMATCH"); ok &= n == s
sys.exit(0 if ok else 1)
