#!/usr/bin/env bash
# Prints crontab lines (Cairo time) from config/settings.json. Install: ./scripts/schedule.sh | crontab -   (machine must be on and logged in to claude)
cd "$(dirname "$0")/.."; P="$(pwd)"
python3 - "$P" <<'PY'
import json, sys
s = json.load(open("config/settings.json"))
print("CRON_TZ=" + s["timezone"])
for mode, cron in s["schedule"].items(): print(f"{cron} cd {sys.argv[1]} && ./scripts/run.sh {mode.replace('_','-')} >> out/cron.log 2>&1")
PY
