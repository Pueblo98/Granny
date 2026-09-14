#!/usr/bin/env python3
"""Read-only check of primary checkout visibility after an authorized merge/fetch."""
import argparse
from pathlib import Path
import subprocess
import sys
from check_handoff import git, resolve

REQUIRED = ("docs/Cockpit.md", "docs/Development.canvas", "docs/10-execution/cockpit.base")
ORIGINS = {"https://github.com/Pueblo98/Granny.git", "git@github.com:Pueblo98/Granny.git"}


def check(root, expected, paths=()):
    errors, notes = [], []
    root = root.resolve()
    if Path(git(root, "rev-parse", "--show-toplevel").strip()).resolve() != root:
        return ["--checkout must name the repository root, not docs/"], notes
    if git(root, "remote", "get-url", "origin").strip() not in ORIGINS:
        errors.append("Unexpected origin; verify repository identity")
    head, remote, expected = (resolve(root, r) for r in ("HEAD", "origin/main", expected))
    if git(root, "branch", "--show-current").strip() != "main":
        errors.append("Primary checkout is not on main")
    if head != remote:
        errors.append("Primary HEAD differs from locally fetched origin/main")
    if subprocess.run(["git", "merge-base", "--is-ancestor", expected, head], cwd=root).returncode:
        errors.append("Expected merge commit is absent from primary HEAD")
    for path in set(REQUIRED) | set(paths):
        candidate = root / path
        if Path(path).is_absolute() or ".." in Path(path).parts or ".obsidian" in Path(path).parts:
            errors.append(f"Unsupported/private path: {path}")
            continue
        if not candidate.resolve().is_relative_to(root) or not candidate.is_file() or candidate.is_symlink():
            errors.append(f"Missing or symlinked vault artifact: {path}")
            continue
        tracked = git(root, "ls-files", "--", path).strip()
        if tracked != path:
            errors.append(f"Artifact is not tracked: {path}")
        elif git(root, "diff", "HEAD", "--", path):
            errors.append(f"Artifact has local changes; visibility is not verified: {path}")
    notes.append(f"HEAD {head}; expected {expected}; origin/main {remote}")
    notes.append("No fetch or write performed; remote freshness requires a separate fetch. Other dirty files are preserved.")
    return errors, notes


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checkout", required=True, type=Path)
    parser.add_argument("--expected-commit", required=True)
    parser.add_argument("--path", action="append", default=[], help="Additional delivered path to verify")
    args = parser.parse_args()
    try:
        errors, notes = check(args.checkout, args.expected_commit, args.path)
    except (OSError, subprocess.CalledProcessError) as exc:
        sys.exit(f"Vault check could not establish state: {exc}")
    print("\n".join(notes + errors))
    print(f"Vault visibility: {'NEEDS REVIEW' if errors else 'PASS (filesystem only)'}")
    sys.exit(bool(errors))
