#!/usr/bin/env python3
"""Generate a local Markdown cockpit; no network, chat, .obsidian or product actions."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess
import sys
import yaml

ROOT = Path(__file__).resolve().parents[1]
VAULT = ROOT / "docs"
EXEC = VAULT / "10-execution"
OUTPUT = EXEC / "cockpit-snapshot.md"
SESSION_STATES = {"active", "review", "complete", "blocked", "revision-requested"}
MESSAGE_STATES = {"open", "acknowledged", "resolved", "superseded"}

def metadata(path):
    match = re.match(r"\A---\n(.*?)\n---\n", path.read_text(), re.S)
    if not match:
        raise ValueError(f"Missing frontmatter: {path.name}")
    data = yaml.safe_load(match[1])
    if not isinstance(data, dict):
        raise ValueError(f"Invalid metadata: {path.name}")
    return data

def task_rows(text):
    rows = []
    for match in re.finditer(r"(?ms)^## (T-\d{3}) — ([^\n]+)\n(.*?)(?=^## |\Z)", text):
        task, title, body = match.groups()
        state = re.search(r"\*\*Status:\*\* ([^;\n]+)", body)
        if not state:
            raise ValueError(f"{task} has no status")
        rows.append((task, title, state[1]))
    if not rows or len({r[0] for r in rows}) != len(rows):
        raise ValueError("Missing or duplicate task rows")
    return rows

def gate_rows(text):
    rows = []
    for line in text.splitlines():
        if line.startswith("| GATE-"):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) != 4:
                raise ValueError("Invalid gate row")
            rows.append((cells[0], cells[2]))
    if not rows or len({r[0] for r in rows}) != len(rows):
        raise ValueError("Missing or duplicate gates")
    return rows

def records():
    result = []
    for folder, kind, states, field in [
        ("sessions", "session", SESSION_STATES, "session_state"),
        ("messages", "message", MESSAGE_STATES, "message_state")
    ]:
        for path in sorted((EXEC / folder).glob("*.md")):
            data = metadata(path)
            if data.get("record_type") != kind or data.get(field) not in states:
                raise ValueError(f"Invalid record type/state: {path.name}")
            required = ("title", "last_updated", "next_action", "branch", "agent", "record_basis") if kind == "session" else (
                "title", "last_updated", "next_action", "message_id", "sender", "recipient", "priority", "topic")
            if any(not data.get(key) for key in required):
                raise ValueError(f"Incomplete record: {path.name}")
            if kind == "session" and data["record_basis"] not in {"contemporaneous", "reconstructed"}:
                raise ValueError(f"Invalid evidence basis: {path.name}")
            if kind == "message" and data["priority"] not in {"P0", "P1", "P2", "P3"}:
                raise ValueError(f"Invalid priority: {path.name}")
            commit = data.get("artifact_commit")
            if commit and not re.fullmatch(r"[0-9a-f]{40}", str(commit)):
                raise ValueError(f"Invalid commit: {path.name}")
            result.append((path, data))
    ids = [d["message_id"] for _, d in result if d["record_type"] == "message"]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate message ID")
    for path, data in result:
        if data.get("in_reply_to") and data["in_reply_to"] not in ids:
            raise ValueError(f"Unknown reply target: {path.name}")
    return result

def assets():
    canvas = json.loads((VAULT / "Development.canvas").read_text())
    nodes, edges = canvas["nodes"], canvas["edges"]
    ids = [n["id"] for n in nodes]
    all_ids = ids + [e["id"] for e in edges]
    if len(all_ids) != len(set(all_ids)):
        raise ValueError("Duplicate Canvas node/edge ID")
    for n in nodes:
        if any(not isinstance(n[k], int) for k in ("x", "y", "width", "height")) or min(n["width"], n["height"]) <= 0:
            raise ValueError("Invalid Canvas geometry")
        if n["type"] == "file":
            path = (VAULT / n["file"]).resolve()
            if not path.is_relative_to(VAULT) or not path.is_file():
                raise ValueError(f"Missing/outside Canvas path: {n['file']}")
            if n.get("subpath") and not n["subpath"].startswith("#"):
                raise ValueError("Invalid Canvas subpath")
    for e in edges:
        if e["fromNode"] not in ids or e["toNode"] not in ids:
            raise ValueError("Dangling Canvas edge")
    base = yaml.safe_load((EXEC / "cockpit.base").read_text())
    view_names = [v["name"] for v in base["views"]]
    if len(view_names) != len(set(view_names)) or any(v["type"] != "table" for v in base["views"]):
        raise ValueError("Invalid Base view")
    for path in [VAULT / "Cockpit.md", EXEC / "agent-board.md"]:
        for link in re.findall(r"!\[\[([^\]]+)\]\]", path.read_text()):
            dest, _, fragment = link.partition("#")
            target = VAULT / dest
            if not target.suffix:
                target = target.with_suffix(".md")
            if not target.is_file():
                raise ValueError(f"Missing embed: {link}")
            if target.suffix == ".base" and fragment not in view_names:
                raise ValueError(f"Missing Base view: {link}")
    return len(nodes), len(edges), len(view_names)

def cell(value):
    return str(value).replace("|", r"\|").replace("\n", " ")

def render():
    items = records()
    sources = [EXEC / "backlog.md", EXEC / "development-readiness.md"] + [p for p, _ in items]
    digest = hashlib.sha256()
    for p in sources:
        digest.update(str(p.relative_to(VAULT)).encode())
        digest.update(p.read_bytes())
    date = max(str(metadata(p)["last_updated"]) for p in sources)
    q = chr(96)
    lines = [
        "---", 'title: "Generated development snapshot"', "status: proposed", "owner: Simon",
        "last_updated: " + date, "tags: [execution, cockpit, generated]",
        "related:", "  - cockpit-guide.md", "  - backlog.md", "  - development-readiness.md", "---", "",
        "# Build and review snapshot", "",
        "Generated from canonical local notes; **do not edit this file by hand**. Not live GitHub/agent state.",
        "Source fingerprint: " + q + digest.hexdigest() + q + ".",
        "Refresh: " + q + "python3 scripts/cockpit.py --write" + q + "; freshness: " + q + "python3 scripts/cockpit.py --check" + q + ".",
        "Live Bases views index record properties; this fallback changes only when regenerated.", "",
        "## Gates", "", "Exact canonical status; conditional readiness is not a pass percentage.", "",
        "| Gate | Status / blocker |", "|---|---|"
    ]
    for name, state in gate_rows(sources[1].read_text()):
        lines.append(f"| [{cell(name)}](development-readiness.md#named-gates-evidence-approver-blockers-and-unlocks) | {cell(state)} |")
    lines += ["", "## Build backlog", "", "| Task | Current recorded status |", "|---|---|"]
    for task, title, state in task_rows(sources[0].read_text()):
        lines.append(f"| [{task} — {cell(title)}](backlog.md#{task.lower()}) | {cell(state)} |")
    lines += ["", "## Session deliveries", "", "| Delivery | State | Next action |", "|---|---|---|"]
    for path, data in items:
        if data["record_type"] == "session":
            lines.append(f"| [{cell(data['title'])}]({path.relative_to(EXEC)}) | {cell(data['session_state'])} | {cell(data['next_action'])} |")
    lines += ["", "## Agent messages", "", "| Message | State / recipient | Next action |", "|---|---|---|"]
    for path, data in items:
        if data["record_type"] == "message":
            lines.append(f"| [{cell(data['title'])}]({path.relative_to(EXEC)}) | {cell(data['message_state'])} / {cell(data['recipient'])} | {cell(data['next_action'])} |")
    lines += ["", "## Evidence boundaries", "",
        "Record state is not online presence. Mock checks are not user/device evals. Commit presence is not integration.",
        "Review canonical evidence before changing gates. The dashboard does not grant authority or run task actions.", ""]
    return "\n".join(lines)

def git_status():
    def git(*args):
        return subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)
    print("LOCAL FETCHED REFS ONLY; no network fetch performed. Not a live GitHub report.")
    main = git("rev-parse", "--verify", "refs/remotes/origin/main")
    print("origin/main:", main.stdout.strip() if main.returncode == 0 else "unknown")
    for path, data in records():
        if data["record_type"] != "session":
            continue
        commit = data.get("artifact_commit")
        if not commit:
            print(path.name, "own delivery: inspect branch/file history; no artifact_commit recorded")
            continue
        exists = git("cat-file", "-e", commit + "^{commit}").returncode == 0
        if not exists or main.returncode:
            state = "UNKNOWN"
        else:
            rc = git("merge-base", "--is-ancestor", commit, main.stdout.strip()).returncode
            state = "IN MAIN" if rc == 0 else "NOT IN MAIN" if rc == 1 else "UNKNOWN"
        ref = "refs/remotes/origin/" + data["branch"]
        branch = git("rev-parse", "--verify", ref)
        rc = git("merge-base", "--is-ancestor", commit, ref).returncode if exists and branch.returncode == 0 else 2
        published = "recorded commit on fetched task ref" if rc == 0 else "not on fetched task ref" if rc == 1 else "task ref unknown"
        print(path.name, state, "/", published)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    for arg in ("write", "check", "git-status"):
        group.add_argument("--" + arg, action="store_true")
    args = parser.parse_args()
    try:
        if args.git_status:
            git_status()
            return 0
        content = render()
        if args.write:
            OUTPUT.write_text(content)
            print("Wrote docs/10-execution/cockpit-snapshot.md")
        if not OUTPUT.is_file() or OUTPUT.read_text() != content:
            raise ValueError("Snapshot stale or missing; run --write and review diff")
        n, e, v = assets()
        print(f"PASS: fresh snapshot; {len(records())} records; {n} Canvas nodes/{e} edges; {v} Base views and embeds")
        print("LIMIT: structural validation only; Obsidian renderer/human review unverified.")
        return 0
    except (ValueError, KeyError, OSError, yaml.YAMLError) as exc:
        print("FAIL:", exc, file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
