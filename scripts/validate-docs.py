#!/usr/bin/env python3
"""Read-only documentation checks. Python 3 + PyYAML; no runtime or legal proof."""
from pathlib import Path
import collections, datetime, hashlib, re, subprocess, sys
from urllib.parse import unquote, urlsplit
from html.parser import HTMLParser
try:
    import yaml
except ImportError:
    sys.exit("PyYAML required; do not install without authorization.")
ROOT=Path(__file__).resolve().parents[1]
errors=[]; counts=collections.Counter()
def fail(message): errors.append(message)
def rel(p): return str(p.relative_to(ROOT))
def git(*args): return subprocess.check_output(["git",*args],cwd=ROOT).decode()
paths=sorted({ROOT/p for p in git("ls-files","--cached","--others","--exclude-standard").splitlines() if p.endswith(".md")})
preserved={
"docs/00-vision/dream-book.pdf":"6524a06676c0926e78853769bc7fd6dd595bdd1fdf0d86a2683f52f23dbae7f4",
"docs/00-vision/dream-book.tex":"6e6623afdfa857e997ed2e7cb5e8cafb66e49fd4632002c7ef800026dac373cf",
"docs/08-research/source-material/initialization-handoff.md":"80f9a4a56824ed9639d09292d4faf089b51fb4e6eccc55f467734288cf628d1d",
"docs/08-research/source-material/planning-conversation.md":"d1d4edd3419123df3a3470720d2fda1932c68ba38fdd40df62c9a8aa003106d5"}
texts={p:p.read_text() for p in paths}
def body(text):
    if text.startswith("---\n"): text=text.split("---",2)[2]
    return re.sub(r"(?ms)^("+chr(96)+r"{3,}|~{3,})[^\n]*\n.*?^\1[ \t]*$","",text)
def anchors(text):
    found=set(re.findall(r'<a\s+id="([^"]+)"',text)); used=collections.Counter()
    for h in re.findall(r"(?m)^#{1,6}\s+(.+?)\s*#*$",body(text)):
        h=re.sub(r"\[([^\]]+)\]\([^)]+\)",r"\1",h)
        slug=re.sub(r"[^\w\- ]","",h.lower()).replace(" ","-")
        num=used[slug]; used[slug]+=1
        found.add(slug+(f"-{num}" if num else ""))
    return found
anchor_map={p:anchors(t) for p,t in texts.items()}
def link(source,raw,kind="link"):
    raw=raw.strip().strip("<>")
    if raw.startswith(("http:","https:","mailto:","data:")):
        counts["external_links_not_fetched"]+=1; return
    raw=re.split(r'\s+["\']',raw)[0]; url=urlsplit(raw)
    target=(source.parent/unquote(url.path)).resolve() if url.path else source
    counts["local_links"]+=1
    if not target.exists(): fail(f"{rel(source)}: missing {kind} {raw}")
    elif url.fragment and target.suffix==".md" and target in anchor_map:
        if unquote(url.fragment) not in anchor_map[target]: fail(f"{rel(source)}: missing anchor {raw}")
changed=set(git("diff","--name-only","ddaacf1","--").splitlines())|set(git("ls-files","--others","--exclude-standard").splitlines())
for p,text in texts.items():
    name=rel(p)
    if name in preserved:
        counts["preserved_markdown_exempt"]+=1; continue
    counts["markdown"]+=1
    if not text.startswith("---\n") or text.count("---")<2:
        fail(f"{name}: missing frontmatter"); continue
    try: meta=yaml.safe_load(text.split("---",2)[1])
    except yaml.YAMLError as exc:
        fail(f"{name}: invalid YAML {exc}"); continue
    if not isinstance(meta,dict): fail(f"{name}: metadata not map"); continue
    for key in ["title","status","owner","last_updated","tags","related"]:
        if key not in meta: fail(f"{name}: missing metadata {key}")
    if meta.get("status") not in {"draft","proposed","review","accepted","deprecated"}: fail(f"{name}: bad status")
    date=meta.get("last_updated")
    if not isinstance(date,datetime.date): fail(f"{name}: invalid date {date}")
    elif date>datetime.date.today(): fail(f"{name}: future date")
    if name in changed and isinstance(date,datetime.date) and date<datetime.date(2026,9,13): fail(f"{name}: changed package file date predates mission")
    for key in ["tags","related"]:
        if not isinstance(meta.get(key),list): fail(f"{name}: {key} not list")
    for target in meta.get("related",[]): link(p,target,"related path")
    clean=body(text)
    for match in re.finditer(r"!?\[[^\]\n]*\]\(([^)\n]+)\)",clean): link(p,match[1])
    for a,n in collections.Counter(re.findall(r'<a\s+id="([^"]+)"',text)).items():
        if n>1: fail(f"{name}: duplicate anchor {a}")
    width=None
    for line in clean.splitlines():
        if line.startswith("|") and line.rstrip().endswith("|"):
            cells=len(re.findall(r"(?<!\\)\|",line))-1
            if width is None: width=cells
            elif cells!=width: fail(f"{name}: table columns {cells} expected {width}: {line[:100]}")
        else: width=None
owners=[
("requirements","docs/01-product/prd.md",r"(?m)^\| (PRD-(?:OUT|FR|ACC|SAF|PRV|NFR|DST)-\d{3})\s*\|",48),
("use_cases","docs/01-product/use-cases.md",r"(?m)^## (UC-\d{3}) ",25),
("journeys","docs/01-product/user-journeys.md",r"(?m)^## (J-\d{3}) ",8),
("screens","docs/02-design/product-design-spec.md",r"(?m)^### (SCR-\d{3}) ",15),
("components","docs/02-design/design-system.md",r"(?m)^### (CMP-\d{3}) ",9),
("capabilities","docs/03-agent/tool-contracts.md",r"(?m)^\| (CAP-\d{2}) ",14),
("evals","docs/06-evals/canonical-tasks.md",r"(?m)^## (EVAL-\d{3}) ",17),
("research","docs/08-research/research-plan.md",r"(?m)^## (RES-\d{2}) ",9),
("tasks","docs/10-execution/backlog.md",r"(?m)^## (T-\d{3}) ",13),
("territories","docs/02-design/brand-and-visual-identity.md",r"(?m)^### (IDT-\d{2}) ",4),
("names","docs/02-design/naming-exploration.md",r"(?m)^\| (NAME-\d{3}) ",81)]
definitions={}
for label,owner,pattern,expected in owners:
    ids=re.findall(pattern,(ROOT/owner).read_text()); counts[label]=len(ids); definitions[label]=set(ids)
    if len(ids)!=expected or len(set(ids))!=len(ids): fail(f"{owner}: expected {expected} unique {label}, got {len(ids)} / {len(set(ids))}")
trace=(ROOT/"docs/01-product/traceability.md").read_text()
ids=re.findall(r'<a id="(prd-[^"]+)"',trace); counts["trace_rows"]=len(ids)
if {i.upper() for i in ids}!=definitions["requirements"] or len(ids)!=48: fail("PRD/trace IDs differ")
for line in trace.splitlines():
    if '<a id="prd-' in line:
        for key in ["PROB-","JOB-","UC-","J-","SCR-","CMP-","system-overview.md#","tool-contracts.md","action-policy.md","T-","EVAL-","RES-","not implemented","unrun"]:
            if key not in line: fail(f"Trace missing {key}: {line[:80]}")
naming=(ROOT/"docs/02-design/naming-exploration.md").read_text()
longlist=re.findall(r"(?m)^\d+\. (.+)$",naming.split("## Earlier scored set")[0])
counts["longlist"]=len(longlist)
if len(longlist)!=30 or len(set(longlist))!=30: fail("Need 30 unique longlist names")
short=naming.split("## Current scored shortlist")[1].split("### Follow-up screening")[0]; sn=[]
weights=[12,8,8,10,12,12,10,6,8,5,4,5]
for line in short.splitlines():
    cells=[x.strip() for x in line.strip("|").split("|")]
    if len(cells)==15 and all(x.isdigit() for x in cells[1:13]):
        sn.append(cells[0]); actual=sum(int(x)*w for x,w in zip(cells[1:13],weights))/5
        if abs(actual-float(cells[13]))>.051: fail("Naming score wrong: "+cells[0])
counts["shortlist"]=len(sn)
if len(sn)!=12 or len(set(sn))!=12 or not set(sn)<=set(longlist): fail("Need 12 unique shortlisted longlist names")
def lum(c):
    v=[int(c[i:i+2],16)/255 for i in (1,3,5)]
    v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v]
    return sum(x*w for x,w in zip(v,[.2126,.7152,.0722]))
brand=(ROOT/"docs/02-design/brand-and-visual-identity.md").read_text()
for fg,bg,ratio in re.findall(r"\| (#[A-Fa-f0-9]{6}) / (#[A-Fa-f0-9]{6}) \|[^|]+\| ([0-9.]+):1 \|",brand):
    a,b=sorted([lum(fg),lum(bg)])
    if abs((b+.05)/(a+.05)-float(ratio))>.011: fail(f"Contrast wrong {fg}/{bg}")
    counts["contrast_pairs"]+=1
if counts["contrast_pairs"]!=36: fail("Expected 36 contrast pairs")
index=(ROOT/"docs/09-decisions/README.md").read_text(); adrs=sorted((ROOT/"docs/09-decisions").glob("ADR-*.md"))
counts["adrs"]=len(adrs)
for p in adrs:
    meta=yaml.safe_load(p.read_text().split("---",2)[1])
    if f"]({p.name}) | {meta['status']} |" not in index: fail("ADR missing/status mismatch "+p.name)
    if int(p.name[4:8])<=8 and git("diff","ddaacf1","--",rel(p)).strip(): fail("Historical ADR modified "+p.name)
if len(adrs)!=11: fail("Expected 11 ADRs")
for path,digest in preserved.items():
    if hashlib.sha256((ROOT/path).read_bytes()).hexdigest()!=digest: fail("Preserved source changed "+path)
    counts["source_hashes"]+=1
if git("status","--porcelain","--","docs/.obsidian").strip(): fail("Obsidian state changed")
if git("ls-files","docs/.obsidian/*.json").strip(): fail("Obsidian JSON tracked")
class BoardParser(HTMLParser):
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag in {"script","iframe"} or "src" in d: fail("Board active/external resources")
        if tag=="a" and "href" in d: link(ROOT/"docs/02-design/identity-review.html",d["href"])
board=(ROOT/"docs/02-design/identity-review.html").read_text(); BoardParser().feed(board)
if board.count('class="territory"')!=4 or board.count('class="screen"')!=8: fail("Need four board territories/eight screens")
counts["board_territories"]=4
design=(ROOT/"docs/02-design/product-design-spec.md").read_text()
state_table=design.split("## Authoritative interaction-state model")[1].split("**Race rule:**")[0]
state_rows=[line for line in state_table.splitlines() if line.startswith("| ")][1:]
counts["interaction_states"]=len(state_rows)
if len(state_rows)!=19: fail("Expected 19 interaction states")
readiness=(ROOT/"docs/10-execution/development-readiness.md").read_text()
gates=re.findall(r"(?m)^\| (GATE-\d{2}) ",readiness)
counts["gates"]=len(gates)
if len(gates)!=9 or len(set(gates))!=9: fail("Expected nine unique readiness gates")
prd=(ROOT/"docs/01-product/prd.md").read_text()
for line in prd.splitlines():
    if re.match(r"^\| PRD-",line):
        cells=[c.strip() for c in line.strip("|").split("|")]
        status=cells[1].split(" / ")[-1]
        if status not in {"confirmed","proposed","evidence-needed","blocked"}: fail("Invalid requirement status: "+cells[0])
        if cells[1].startswith("MVP / "): counts["mvp_requirements"]+=1
for e in errors: print("ERROR:",e)
print("COUNTS:",", ".join(f"{k}={v}" for k,v in sorted(counts.items())))
print(f"RESULT: {'FAIL' if errors else 'PASS'} ({len(errors)} errors)")
print("LIMITS: local metadata/links/anchors/tables/IDs/arithmetic/source checks; external URLs not fetched; no runtime/user/Android/policy/legal proof.")
sys.exit(bool(errors))
