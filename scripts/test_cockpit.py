"""Regression tests for read-only parsers and cockpit source validation."""
import unittest
import cockpit

class CockpitTests(unittest.TestCase):
    def test_task_status_is_not_inferred_from_title(self):
        rows = cockpit.task_rows("## T-999 — Complete-looking title\n- **Status:** planned; nothing built\n")
        self.assertEqual(rows, [("T-999", "Complete-looking title", "planned")])

    def test_missing_status_fails(self):
        with self.assertRaises(ValueError):
            cockpit.task_rows("## T-999 — Example\nNo status\n")

    def test_duplicate_tasks_fail(self):
        with self.assertRaises(ValueError):
            cockpit.task_rows(("## T-999 — Example\n- **Status:** planned\n") * 2)

    def test_conditional_gate_preserved(self):
        text = "| GATE-06 Safety | evidence | Ready with proposed assumptions for fake replay only | bounded |\n"
        self.assertEqual(cockpit.gate_rows(text)[0][1], "Ready with proposed assumptions for fake replay only")

    def test_bad_gate_shape_fails(self):
        with self.assertRaises(ValueError):
            cockpit.gate_rows("| GATE-06 Safety | wrong |\n")

    def test_cell_escapes_pipe(self):
        self.assertEqual(cockpit.cell("a|b\nc"), "a\\|b c")

    def test_render_deterministic_and_records_valid(self):
        self.assertEqual(cockpit.render(), cockpit.render())
        self.assertGreaterEqual(len(cockpit.records()), 7)

    def test_assets_and_embeds_exist(self):
        nodes, edges, views = cockpit.assets()
        self.assertEqual(views, 3)
        self.assertGreaterEqual(nodes, 9)
        self.assertGreaterEqual(edges, 1)

if __name__ == "__main__":
    unittest.main()
