#!/usr/bin/env python3
"""Read-only PR/session coverage check. No claim of semantic review or approval."""
import argparse
from pathlib import Path
import re
import subprocess
import sys
import yaml

ROOT = Path(__file__).resolve().parents[1]
SESSIONS = "docs/10-execution/sessions/"
SNAPSHOT = "docs/10-execution/cockpit-snapshot.md"
EXEMPT_PATHS = {"README.md", "docs/README.md"}


def git(root, *args):
    return subprocess.check_output(["git", *args], cwd=root).decode()


def resolve(root, ref):
    return git(root, "rev-parse", "--verify", "--end-of-options", ref + "^{commit}").strip()


def coverage_errors(changed, records):
    required = set(changed) - {SNAPSHOT}
    covered = set()
    errors = []
    for path, meta in records.items():
        if path not in changed:
            continue
        if (meta.get("record_type") != "session"
                or meta.get("record_basis") != "contemporaneous"
                or meta.get("session_state") not in {"review", "complete", "blocked", "revision-requested"}):
            errors.append(f"{path}: needs a contemporaneous handoff, not an active/historical record")
            continue
        paths = meta.get("changed_paths")
        if not isinstance(paths, list) or not paths or not all(isinstance(p, str) for p in paths):
            errors.append(f"{path}: changed_paths must list exact repository-relative paths")
            continue
        if any(p.startswith("/") or ".." in Path(p).parts or "*" in p for p in paths):
            errors.append(f"{path}: absolute, parent and wildcard coverage is not allowed")
            continue
        if not str(meta.get("next_action", "")).strip():
            errors.append(f"{path}: missing next action")
        covered.update(paths)
        covered.add(path)
    missing = required - covered
    if missing:
        errors.append("Missing changed-session coverage: " + ", ".join(sorted(missing)))
    return errors


def trivial_exemption(changed, numstat, messages):
    """Only small navigation/readme changes; a human must still assess triviality."""
    if not changed or not set(changed) <= EXEMPT_PATHS:
        return False
    count = 0
    for line in numstat.splitlines():
        added, removed, _ = line.split("\t", 2)
        if not added.isdecimal() or not removed.isdecimal():
            return False
        count += int(added) + int(removed)
    return 0 < count <= 20 and bool(re.search(r"(?m)^Handoff-Exempt: \S.{9,}$", messages))


def check(root, base, head=None):
    base = resolve(root, base)
    target = resolve(root, head) if head else None
    ancestor = git(root, "merge-base", base, target or "HEAD").strip()
    revision = [ancestor] + ([target] if target else [])
    changed = set(filter(None, git(root, "diff", "--no-renames", "--name-only", "-z", *revision, "--").split("\0")))
    if target is None:
        changed.update(filter(None, git(root, "ls-files", "--others", "--exclude-standard", "-z").split("\0")))
    if not changed:
        return []
    records = {}
    for path in sorted(changed):
        if path.startswith(SESSIONS) and path.endswith(".md"):
            if target:
                if subprocess.run(["git", "cat-file", "-e", f"{target}:{path}"], cwd=root,
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode:
                    continue  # A deletion must be covered by another changed record.
            elif not (root / path).exists():
                continue
            try:
                content = git(root, "show", f"{target}:{path}") if target else (root / path).read_text()
                if not content.startswith("---\n"):
                    raise ValueError("missing frontmatter")
                meta = yaml.safe_load(content.split("---", 2)[1])
                records[path] = meta if isinstance(meta, dict) else {}
            except (OSError, ValueError, yaml.YAMLError, subprocess.CalledProcessError):
                records[path] = {}
    errors = coverage_errors(changed, records)
    if errors and target and trivial_exemption(
            changed, git(root, "diff", "--numstat", *revision, "--"),
            git(root, "log", "--format=%B", f"{ancestor}..{target}")):
        print("Explicit small README exemption; human review still required.")
        return []
    return errors


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="Fetched PR base SHA/ref; merge-base is used")
    parser.add_argument("--head", help="Committed target, e.g. HEAD; omit to include working/untracked files")
    args = parser.parse_args()
    try:
        failures = check(ROOT, args.base, args.head)
    except (ValueError, subprocess.CalledProcessError) as exc:
        sys.exit(f"Handoff check could not establish Git range: {exc}")
    for failure in failures:
        print(failure, file=sys.stderr)
    print(f"Handoff coverage: {'FAIL' if failures else 'PASS'}")
    sys.exit(bool(failures))
