import subprocess
import tempfile
import unittest
from pathlib import Path
import check_handoff as handoff
import check_vault as vault

SESSION = handoff.SESSIONS + "example.md"


def record(paths):
    return {"record_type": "session", "record_basis": "contemporaneous",
            "session_state": "review", "changed_paths": paths, "next_action": "Review changes"}


class CoverageTests(unittest.TestCase):
    def test_complete_coverage(self):
        self.assertEqual(handoff.coverage_errors({SESSION, "scripts/x.py", handoff.SNAPSHOT},
                         {SESSION: record(["scripts/x.py"])}), [])

    def test_unchanged_record_cannot_cover_change(self):
        self.assertTrue(handoff.coverage_errors({"scripts/x.py"}, {SESSION: record(["scripts/x.py"])}))

    def test_missing_path_fails(self):
        self.assertTrue(handoff.coverage_errors({SESSION, "a", "b"}, {SESSION: record(["a"])}))

    def test_historical_or_active_record_fails(self):
        for field, value in (("record_basis", "reconstructed"), ("session_state", "active")):
            meta = record(["a"])
            meta[field] = value
            self.assertTrue(handoff.coverage_errors({SESSION, "a"}, {SESSION: meta}))

    def test_wildcard_and_escape_fail(self):
        for path in ("*", "/tmp/x", "../x"):
            self.assertTrue(handoff.coverage_errors({SESSION, "a"}, {SESSION: record([path])}))

    def test_explicit_small_readme_exemption(self):
        self.assertTrue(handoff.trivial_exemption({"README.md"}, "1\t1\tREADME.md",
                        "Fix typo\n\nHandoff-Exempt: Correct spelling only"))

    def test_exemption_does_not_cover_code_or_missing_reason(self):
        self.assertFalse(handoff.trivial_exemption({"scripts/a.py"}, "1\t1\tscripts/a.py",
                         "Handoff-Exempt: Correct spelling only"))
        self.assertFalse(handoff.trivial_exemption({"README.md"}, "1\t1\tREADME.md", "Fix typo"))

    def test_large_or_binary_exemption_fails(self):
        for stat in ("11\t10\tREADME.md", "-\t-\tREADME.md"):
            self.assertFalse(handoff.trivial_exemption({"README.md"}, stat,
                             "Handoff-Exempt: Correct spelling only"))


class GitFixtureTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git("init", "-b", "main")
        self.git("config", "user.name", "Synthetic Test")
        self.git("config", "user.email", "test@example.invalid")
        self.git("remote", "add", "origin", "https://github.com/Pueblo98/Granny.git")
        for name in vault.REQUIRED:
            self.write(name, "synthetic fixture\n")
        self.commit()
        self.base = self.git("rev-parse", "HEAD").strip()
        self.git("update-ref", "refs/remotes/origin/main", self.base)

    def git(self, *args):
        return subprocess.check_output(["git", *args], cwd=self.root, stderr=subprocess.DEVNULL).decode()

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def commit(self, message="Synthetic fixture"):
        self.git("add", ".")
        self.git("commit", "-m", message)

    def test_vault_passes_without_writes(self):
        before = self.git("status", "--porcelain")
        self.assertEqual(vault.check(self.root, self.base)[0], [])
        self.assertEqual(self.git("status", "--porcelain"), before)

    def test_dirty_other_file_is_preserved(self):
        self.write("unrelated.txt", "user text")
        self.assertEqual(vault.check(self.root, self.base)[0], [])
        self.assertEqual((self.root / "unrelated.txt").read_text(), "user text")

    def test_dirty_canvas_is_reported_not_rewritten(self):
        self.write("docs/Development.canvas", "user layout")
        self.assertTrue(vault.check(self.root, self.base)[0])
        self.assertEqual((self.root / "docs/Development.canvas").read_text(), "user layout")

    def test_wrong_branch_and_missing_artifact_fail(self):
        self.git("switch", "-c", "topic")
        self.assertTrue(vault.check(self.root, self.base)[0])
        self.git("switch", "main")
        (self.root / "docs/Cockpit.md").unlink()
        self.assertTrue(vault.check(self.root, self.base)[0])

    def test_stale_local_main_and_absent_expected_merge_fail(self):
        self.write("new.txt", "new")
        self.commit()
        newer = self.git("rev-parse", "HEAD").strip()
        self.git("update-ref", "refs/remotes/origin/main", newer)
        self.git("switch", "-c", "fixture-older", self.base)
        self.assertTrue(vault.check(self.root, newer)[0])

    def test_private_and_escape_paths_rejected(self):
        for path in ("docs/.obsidian/workspace.json", "../private", "/tmp/private"):
            self.assertTrue(vault.check(self.root, self.base, [path])[0])

    def test_untracked_change_needs_handoff(self):
        self.write("scripts/new.py", "synthetic")
        self.assertTrue(handoff.check(self.root, self.base))

    def test_committed_record_covers_deleted_file(self):
        (self.root / "docs/Cockpit.md").unlink()
        self.write(SESSION, "---\nrecord_type: session\nrecord_basis: contemporaneous\n"
                   "session_state: review\nnext_action: Review deletion\n"
                   "changed_paths: [docs/Cockpit.md]\n---\nSynthetic test only\n")
        self.commit()
        self.assertEqual(handoff.check(self.root, self.base, "HEAD"), [])

    def test_deleted_record_needs_another_handoff(self):
        self.write(SESSION, "old record")
        self.commit()
        before = self.git("rev-parse", "HEAD").strip()
        (self.root / SESSION).unlink()
        replacement = handoff.SESSIONS + "replacement.md"
        self.write(replacement, "---\nrecord_type: session\nrecord_basis: contemporaneous\n"
                   "session_state: review\nnext_action: Review migration\n"
                   f"changed_paths: [{SESSION}]\n---\nSynthetic migration only\n")
        self.commit()
        self.assertEqual(handoff.check(self.root, before, "HEAD"), [])

    def test_bad_ref_fails_closed(self):
        with self.assertRaises(subprocess.CalledProcessError):
            handoff.check(self.root, "--help")

    def test_committed_trivial_exemption(self):
        self.write("README.md", "typo fix\n")
        self.commit("Fix spelling\n\nHandoff-Exempt: Correct a spelling error only")
        self.assertEqual(handoff.check(self.root, self.base, "HEAD"), [])


if __name__ == "__main__":
    unittest.main()
