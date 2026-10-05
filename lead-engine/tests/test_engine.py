import csv, json, os, subprocess, sys, tempfile, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(R/"scripts"))
NOKEY = {**os.environ, "ODOO_API_KEY": ""}   # never reach the real Odoo from tests, even with a .env present
S = lambda *a, cwd=R, env=NOKEY: subprocess.run([sys.executable, *map(str, a)], capture_output=True, text=True, cwd=cwd, env=env)
GOLDEN_CSV = R/"tests/fixtures/contact_us_golden_anon.csv"
def rows(p): return list(csv.DictReader(open(p, encoding="utf-8")))
def test_pilot_order():
    out = tempfile.mkdtemp(); assert S(R/"scripts/score.py", "--in", R/"tests/pilot_leads.json", "--out", out).returncode == 0
    rs = rows(out + "/priority.csv")
    assert rs[0]["name"] == "Lina Fouad" and {r["name"] for r in rs if r["tier"] == "A"} >= {"Nadia Samir", "Hala Mansour", "Rania Zaki"}
    assert next(r for r in rs if r["name"] == "Mona Gaber")["status"] == "PAID BEFORE"
    assert next(r for r in rs if r["name"] == "Hesham Ragab")["tier"] == "D"
def test_triage_golden():
    out = tempfile.mkdtemp(); assert S(R/"scripts/triage.py", "--csv", GOLDEN_CSV, "--out", out).returncode == 0
    got = json.load(open(out + "/contact_us_summary.json")); want = json.load(open(R/"tests/fixtures/triage_golden.json"))
    assert got == want
def test_triage_state_filter():
    out = tempfile.mkdtemp(); assert S(R/"scripts/triage.py", "--csv", GOLDEN_CSV, "--all", "--out", out).returncode == 0
    assert json.load(open(out + "/contact_us_summary.json"))["rows"] == 61   # 58 untouched + 3 handled rows
    out = tempfile.mkdtemp(); S(R/"scripts/triage.py", "--csv", GOLDEN_CSV, "--since", "2026-10-03T00:00:00Z", "--out", out)
    assert {r["date"][:10] for r in rows(out + "/contact_us.csv")} <= {"2026-10-03", "2026-10-04", "2026-10-05"}
def test_triage_missed_callback():   # broken callback promise = urgent customer action, in either language
    import triage
    for m in ("تم الاتفاق على التواصل اليوم التالى تليفونيا ولم يتم التواصل حتى الان", "Your colleague promised a call back but no one called"):
        assert triage.classify(m, "x", "a@gmail.com")[0] == "existing_customer_action", m
def test_parse_notes():
    import parse_notes as p
    r = p.parse("LinkedIn: https://linkedin.com/in/x\nYears of experience: 10+ years\nPayment preference: Full payment\nWave: Upcoming wave\nSubmitted again")
    assert r["linkedin"].startswith("https://linkedin") and r["payment_pref_norm"] == "full" and r["readiness"] == "upcoming" and r["submitted_again"]
def test_parse_notes_html():   # Odoo 19 stores crm.lead.description as HTML
    import parse_notes as p
    r = p.parse("<p>LinkedIn: https://linkedin.com/in/x</p><p>Job title: Head of HR &amp; People<br/>Years of experience: 10+ years</p>")
    assert r["job_title"] == "Head of HR & People" and r["years_exp"] == "10+ years" and r["linkedin"] == "https://linkedin.com/in/x"
def test_scoring_edges():
    import score
    vd = score.score({"id": 1, "name": "A", "titles": ["Vice Dean"], "company": "Uni", "academic": True})
    assert vd["seniority"] == 26 and vd["company"] == 12
    same = score.score({"id": 2, "name": "Fady Wassef", "titles": ["Consultant"], "company": "Fady Wassef"})
    assert "no_company" in same["flags"] and "no_title" not in same["flags"]
    assert score.score({"id": 3, "name": "B", "price": "25,000.00", "company_employees": "12000"})["intent"] == 3
    assert score.score({"id": 4, "name": "C", "won": True, "titles": ["CEO"], "company": "X"})["tier"] == "WON"
    assert score.score({"id": 5, "name": "D", "contacted_by_other": "Youssef", "paid_before": True})["status"] == "CONTACTED BY OTHER"
    out = tempfile.mkdtemp(); pathlib.Path(out, "e.json").write_text("[]")
    assert S(R/"scripts/score.py", "--in", out + "/e.json", "--out", out).returncode == 0 and json.load(open(out + "/summary.json"))["leads"] == 0
def test_match_and_quality():
    import match
    m = match.match([{"name": "A", "date": "d", "type": "b2c_inquiry", "email": "X@y.com", "phone": ""}], [{"id": 1, "name": "A", "email": "x@y.com", "stage": "New"}])
    assert m and m[0]["odoo_id"] == 1
    m = match.match([{"name": "A", "date": "d", "type": "b2c_inquiry", "email": "", "phone": "+201000000012"}], [{"id": 2, "name": "A", "phone": "01000000012"}])
    assert m and m[0]["odoo_id"] == 2
def test_fallbacks():
    r = S(R/"scripts/odoo_pull.py", "--out", "/tmp/x.json"); assert r.returncode != 0 and "workaround" in (r.stdout + r.stderr).lower()
    out = tempfile.mkdtemp(); csvp = pathlib.Path(out, "e.csv"); csvp.write_text('ID,Lead,Stage,Expected Revenue\n1,T,New,"25,000.00"\n')
    assert S(R/"scripts/odoo_pull.py", "--from-csv", csvp, "--out", out + "/o.json").returncode == 0
    o = json.load(open(out + "/o.json"))[0]; assert o["id"] == 1 and o["price"] == 25000.0
    assert S(R/"scripts/fetch_sheet.py", "--out", out + "/c.csv", "--file", GOLDEN_CSV).returncode == 0 and pathlib.Path(out, "c.csv").exists()
    if not (R/"config/local.json").exists():   # with a real sheet id configured this would hit the network
        r = S(R/"scripts/fetch_sheet.py", "--out", out + "/c2.csv", env={**NOKEY, "CONTACT_SHEET_ID": ""})
        assert r.returncode == 2 and "WORKAROUND" in r.stdout
def test_enrich_drafts():
    out = tempfile.mkdtemp(); lp = pathlib.Path(out, "l.json")
    lp.write_text(json.dumps([{"id": 1, "name": "محمد سعيد"}, {"id": 2, "name": "Omar Fathy"}, {"id": 3, "name": "Nour Hassan"}], ensure_ascii=False), encoding="utf-8")
    pathlib.Path(out, "enr.json").write_text(json.dumps({"3": {"titles": ["CFO"], "company": "Global CX Group"}}))
    assert S(R/"scripts/enrich.py", "--leads", lp, "--enrichment", out + "/enr.json", "--out", out).returncode == 0
    en = {r["id"]: r for r in rows(out + "/enrichment_list.csv")}
    assert set(en) == {"1", "2"} and "the program" not in en["1"]["whatsapp_draft"] and "Aly Salamah" in en["2"]["whatsapp_draft"]
    assert json.load(open(lp, encoding="utf-8"))[2]["company"] == "Global CX Group"
def test_build_data_end_to_end():
    work = tempfile.mkdtemp(); d = pathlib.Path(work, "run")
    args = (R/"scripts/build_data.py", "--odoo-json", R/"samples/odoo_leads_sample.json", "--contact-csv", GOLDEN_CSV, "--outdir", d, "--mode", "run-all")
    r = S(*args, cwd=work); assert r.returncode == 0, r.stdout + r.stderr
    for f in ("priority.csv", "summary.json", "quality.json", "contact_us.csv", "enrichment_list.csv", "contact_matches.json", "report_run-all.html"): assert (d/f).exists(), f
    html = (d/"report_run-all.html").read_text(encoding="utf-8")
    for h in ("URGENT FLAGS", "Priority list", "High-Profile Library", "Quality", "B2B / partnership", "Enrichment list"): assert h in html
    pr = rows(d/"priority.csv"); assert [p["name"] for p in pr] == ["Lina Fouad", "Hesham Ragab"] and pr[1]["tier"] == "D"
    assert S(*args, cwd=work).returncode == 0 and json.load(open(pathlib.Path(work, "out/state.json")))["leads"]["900103"]["seen_runs"] == 2
def test_build_data_keeps_existing_fields():   # browser-read leads arrive with readiness/payment already set and no notes
    work = tempfile.mkdtemp(); d = pathlib.Path(work, "run")
    assert S(R/"scripts/build_data.py", "--odoo-json", R/"tests/pilot_leads.json", "--outdir", d, cwd=work).returncode == 0
    want = rows(d/"priority.csv")
    out = tempfile.mkdtemp(); S(R/"scripts/score.py", "--in", R/"tests/pilot_leads.json", "--out", out)
    assert [(r["name"], r["total"]) for r in want] == [(r["name"], r["total"]) for r in rows(out + "/priority.csv")]
def test_build_data_without_odoo():
    work = tempfile.mkdtemp(); d = pathlib.Path(work, "run")
    r = S(R/"scripts/build_data.py", "--contact-csv", GOLDEN_CSV, "--outdir", d, cwd=work)
    assert r.returncode == 0 and "WORKAROUND: no Odoo data" in r.stdout and (d/"report_run-all.html").exists()
def test_check_report_mismatch():
    out = pathlib.Path(tempfile.mkdtemp()); (out/"priority.csv").write_text("id\n1\n2\n"); (out/"summary.json").write_text('{"leads": 5}')
    assert S(R/"scripts/check_report.py", out).returncode == 1
    (out/"summary.json").write_text('{"leads": 2}'); assert S(R/"scripts/check_report.py", out).returncode == 0
if __name__ == "__main__":   # no pytest needed: python3 tests/test_engine.py
    fails = 0
    for n, f in [(n, f) for n, f in globals().items() if n.startswith("test_")]:
        try: f(); print("PASS", n)
        except Exception as e: fails += 1; print("FAIL", n, repr(e)[:300])
    sys.exit(1 if fails else 0)
