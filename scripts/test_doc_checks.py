"""Offline unit regressions for documentation tooling, not product evals."""
import datetime
import unittest

from doc_checks import is_design_system_package_doc, is_skill_markdown_resource, markdown_links, skill_errors, split_frontmatter, trace_errors


class FrontmatterTests(unittest.TestCase):
    def test_delimiter_in_title_does_not_end_metadata(self):
        meta, body = split_frontmatter('---\ntitle: "one --- two"\n---\nBody')
        self.assertEqual(meta["title"], "one --- two")
        self.assertEqual(body, "Body")

    def test_invalid_or_missing_metadata_is_reportable(self):
        for text in ["body", "---\ntitle: x", "---\n- list\n---\n", "---\na: [\n---\n"]:
            with self.subTest(text=text), self.assertRaises(ValueError):
                split_frontmatter(text)

    def test_crlf_and_date(self):
        meta, _ = split_frontmatter("---\r\nlast_updated: 2026-09-14\r\n---\r\n")
        self.assertEqual(meta["last_updated"], datetime.date(2026, 9, 14))


class LinkTests(unittest.TestCase):
    def test_balanced_and_angle_destinations(self):
        links, missing = markdown_links('[a](path/(nested).md#x) [b](<path with spaces.md> "label")')
        self.assertEqual(links, ["path/(nested).md#x", "path with spaces.md"])
        self.assertEqual(missing, [])

    def test_titles_and_external_links(self):
        self.assertEqual(markdown_links('[a](one.md "two (words)") [b](https://example.test/a)')[0], ["one.md", "https://example.test/a"])

    def test_reference_forms_and_case(self):
        text = '[Text][DEST] [dest][] [dest]\n\n[dest]: <a b.md> "title"'
        self.assertEqual(markdown_links(text), (["a b.md"] * 3, []))

    def test_unresolved_reference(self):
        self.assertEqual(markdown_links('[text][missing]'), ([], ["missing"]))

    def test_inline_code_is_not_a_link(self):
        self.assertEqual(markdown_links('`[fake](missing.md)` [real](exists.md)')[0], ["exists.md"])


class SkillTests(unittest.TestCase):
    def setUp(self):
        self.meta = {"name": "granny-test", "description": "Review a scoped contract.", "metadata": {"owner": "Simon", "status": "proposed", "last_updated": "2026-09-14"}}
        self.ui = {"interface": {"display_name": "Granny Test", "short_description": "Review a bounded contract safely", "default_prompt": "Use $granny-test to review."}}

    def test_valid_skill(self):
        self.assertEqual(skill_errors(self.meta, "granny-test", self.ui), [])

    def test_name_and_blank_description_rejected(self):
        self.meta.update(name="Other", description="")
        self.assertGreaterEqual(len(skill_errors(self.meta, "granny-test", self.ui)), 2)

    def test_ui_and_maintenance_errors(self):
        self.meta["metadata"]["last_updated"] = "bad"
        self.assertGreaterEqual(len(skill_errors(self.meta, "granny-test", {})), 3)

    def test_nested_wrong_types_do_not_crash(self):
        self.meta["metadata"] = []
        self.assertTrue(skill_errors(self.meta, "granny-test", {"interface": []}))

    def test_skill_reference_is_not_a_canonical_document(self):
        self.assertTrue(is_skill_markdown_resource(".agents/skills/adaptive/references/android.md"))
        self.assertFalse(is_skill_markdown_resource(".agents/skills/adaptive/SKILL.md"))
        self.assertFalse(is_skill_markdown_resource("docs/02-design/accessibility.md"))

    def test_design_system_package_docs_use_their_host_schema(self):
        self.assertTrue(is_design_system_package_doc("design-system/docs/Button.md"))
        self.assertTrue(is_design_system_package_doc("design-system/docs/guides/brand-guide.md"))
        self.assertTrue(is_design_system_package_doc(".design-sync/conventions.md"))
        self.assertTrue(is_design_system_package_doc(".design-sync/NOTES.md"))

    def test_design_system_exemption_does_not_widen_to_the_vault(self):
        # docs/ stays the knowledge base under canonical frontmatter, including
        # the documents that describe the design system.
        self.assertFalse(is_design_system_package_doc("docs/02-design/design-system.md"))
        self.assertFalse(is_design_system_package_doc("docs/02-design/accessibility.md"))
        self.assertFalse(is_design_system_package_doc("design-tokens/README.md"))
        self.assertFalse(is_design_system_package_doc("design-system/src/Icon.tsx"))


class TraceTests(unittest.TestCase):
    def setUp(self):
        self.prd = '| PRD-FR-001 | MVP / Must / proposed | Behavior |'
        self.trace = '| <a id="prd-fr-001"></a>[PRD-FR-001](prd.md) · MVP · proposed | [UC-001](use-cases.md) | design | contract | policy | task — not implemented | eval unrun |'
        self.definitions = {"use_cases": {"UC-001"}}

    def test_valid_projection(self):
        self.assertEqual(trace_errors(self.prd, self.trace, self.definitions), [])

    def test_status_drift_is_rejected(self):
        self.assertTrue(trace_errors(self.prd, self.trace.replace("proposed", "confirmed"), self.definitions))

    def test_unknown_id_is_rejected_even_with_valid_file_link(self):
        self.assertTrue(trace_errors(self.prd, self.trace.replace("UC-001", "UC-999"), self.definitions))

    def test_new_defined_id_is_valid_without_fixed_count_change(self):
        self.definitions["use_cases"].add("UC-026")
        self.assertEqual(trace_errors(self.prd, self.trace.replace("UC-001", "UC-026"), self.definitions), [])

    def test_implementation_can_progress_with_artifact_link(self):
        trace = self.trace.replace("not implemented", "implemented [source](../../android/Task.kt)").replace("unrun", "passed")
        self.assertEqual(trace_errors(self.prd, trace, self.definitions), [])

    def test_implemented_without_source_is_rejected(self):
        self.assertTrue(trace_errors(self.prd, self.trace.replace("not implemented", "implemented"), self.definitions))

    def test_missing_result_status_is_rejected(self):
        self.assertTrue(trace_errors(self.prd, self.trace.replace("unrun", "looks good"), self.definitions))


if __name__ == "__main__":
    unittest.main()
