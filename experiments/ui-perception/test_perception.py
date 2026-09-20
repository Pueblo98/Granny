import copy
import json
import struct
import unittest
from unittest.mock import patch

from make_fixture import PACKAGE, TREE
from perception import (InvalidObservation, annotate, build_map, context_checked, lookup,
                        parse_tree, parse_tsv, recognize, review_html, transform)

PNG_HEADER = b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", 800, 640) + bytes(9)
CONTEXT = {"scope": "synthetic-fixture", "package": PACKAGE, "windowId": 1, "epoch": 1,
           "capturedAtMs": 1000, "viewport": [0, 0, 800, 640], "protected": False}
TSV_HEADER = "level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext\n"


def ocr(text="Text size", box=(70, 270, 140, 30)):
    left, top, width, height = box
    return TSV_HEADER + f"5\t1\t1\t1\t1\t1\t{left}\t{top}\t{width}\t{height}\t96\t{text}\n"


def observation(tree=TREE, text=None, context=None):
    return build_map(PNG_HEADER, context or copy.deepcopy(CONTEXT), now_ms=1000,
                     tree=tree.encode() if tree is not None else None, ocr=text is not None,
                     recognizer=lambda _: (ocr(text), "completed", 12))


class PerceptionTests(unittest.TestCase):
    def test_semantic_map_preserves_roles_bounds_and_no_authority(self):
        result = observation()
        self.assertEqual(len(result["elements"]), 4)
        target = result["elements"][2]
        self.assertEqual((target["label"], target["role"], target["bounds"]), ("Text size", "button", [40, 230, 760, 340]))
        self.assertFalse(target["executionAuthorized"])
        self.assertEqual(result["completeness"], "partial")

    def test_repeatability_and_identity_bind_semantics(self):
        first, second = observation(), observation()
        self.assertEqual(first["elements"], second["elements"])
        changed = observation(TREE.replace("Text size", "Erase all"))
        self.assertNotEqual(first["observationId"], changed["observationId"])

    def test_transform_offset_scale_clipping(self):
        self.assertEqual(transform([120, 240, 220, 340], [100, 200, 500, 600], 800, 800), ([40, 80, 240, 280], False))
        self.assertEqual(transform([90, 190, 120, 240], [100, 200, 500, 600], 800, 800), ([0, 0, 40, 80], True))
        self.assertEqual(transform([0, 0, 20, 20], [100, 200, 500, 600], 800, 800), (None, False))

    def test_protected_withheld_before_ocr(self):
        ctx = dict(CONTEXT, protected=True)
        with patch("perception.recognize") as recognizer:
            with self.assertRaisesRegex(InvalidObservation, "protected"):
                build_map(PNG_HEADER, ctx, now_ms=1000, ocr=True, recognizer=recognizer)
            recognizer.assert_not_called()

    def test_password_withheld_before_ocr(self):
        with patch("perception.recognize") as recognizer:
            with self.assertRaisesRegex(InvalidObservation, "sensitive"):
                build_map(PNG_HEADER, CONTEXT, now_ms=1000, tree=TREE.replace('text="Text size"', 'password="true" text="SECRET"').encode(), ocr=True, recognizer=recognizer)
            recognizer.assert_not_called()

    def test_sensitive_hidden_subtree_withheld(self):
        with self.assertRaisesRegex(InvalidObservation, "sensitive"):
            observation(TREE.replace('text="Text size"', 'sensitive="true" text="CANARY"').replace('visible-to-user="true"', 'visible-to-user="false"'))

    def test_wrong_package_withheld(self):
        with self.assertRaisesRegex(InvalidObservation, "mixed-package"):
            observation(TREE.replace(PACKAGE, "personal.app", 1))

    def test_tree_external_entities_rejected(self):
        with self.assertRaisesRegex(InvalidObservation, "unsafe-tree"):
            observation('<!DOCTYPE hierarchy [<!ENTITY a SYSTEM "file:///etc/passwd">]><hierarchy/>')

    def test_malformed_geometry_and_nonfinite_numbers_rejected(self):
        for box in ([1, 1, 0, 2], [0, 0, float("nan"), 2], [0, 0, True, 2]):
            with self.subTest(box=box), self.assertRaises(InvalidObservation):
                transform(box, [0, 0, 800, 640], 800, 640)

    def test_hidden_parent_hides_children(self):
        hidden = TREE.replace('<hierarchy rotation="0">', f'<hierarchy><node package="{PACKAGE}" visible-to-user="false">').replace('</hierarchy>', '</node></hierarchy>')
        self.assertEqual(observation(hidden)["elements"], [])

    def test_duplicate_labels_abstain(self):
        result = observation(TREE.replace("Screen zoom", "Text size"))
        self.assertEqual(lookup(result, "Text size", now_ms=1100, epoch=1, window_id=1)["status"], "ambiguous")

    def test_disabled_element_not_selected(self):
        result = observation(TREE.replace('enabled="true"', 'enabled="false"'))
        self.assertEqual(lookup(result, "Text size", now_ms=1100, epoch=1, window_id=1)["status"], "unavailable")
        self.assertFalse(any(e["reportedActions"] for e in result["elements"]))

    def test_clipped_element_not_selected(self):
        result = observation(context=dict(CONTEXT, viewport=[50, 0, 800, 640]))
        self.assertEqual(lookup(result, "Text size", now_ms=1100, epoch=1, window_id=1)["status"], "unavailable")

    def test_matching_ocr_fuses_without_duplicate_or_box_change(self):
        result = observation(text="Text size")
        self.assertEqual(len(result["elements"]), 4)
        target = result["elements"][2]
        self.assertEqual(target["bounds"], [40, 230, 760, 340])
        self.assertEqual(len(target["ocrEvidence"]), 1)
        self.assertFalse(target["conflict"])

    def test_conflicting_ocr_is_not_silently_overwritten(self):
        result = observation(text="Delete everything")
        self.assertEqual(result["elements"][2]["label"], "Text size")
        self.assertIn("evidence-conflict", result["reasons"])
        self.assertEqual(lookup(result, "Text size", now_ms=1100, epoch=1, window_id=1)["status"], "unavailable")

    def test_unlabeled_control_ocr_is_visual_candidate(self):
        result = observation(TREE.replace('text="Text size"', 'text=""'), text="Text size")
        self.assertEqual(lookup(result, "Text size", now_ms=1100, epoch=1, window_id=1)["status"], "visual-candidate")

    def test_ocr_only_never_invents_clickability(self):
        result = observation(tree=None, text="Text size")
        self.assertEqual(result["elements"][0]["reportedActions"], [])
        self.assertEqual(result["elements"][0]["role"], "text")

    def test_missing_target_stays_missing(self):
        self.assertEqual(lookup(observation(), "Send", now_ms=1100, epoch=1, window_id=1)["status"], "not-found")

    def test_lookup_invalidates_time_epoch_window(self):
        result = observation()
        for now, epoch, window in [(3001, 1, 1), (999, 1, 1), (1100, 2, 1), (1100, 1, 2)]:
            with self.subTest(now=now, epoch=epoch, window=window):
                self.assertEqual(lookup(result, "Text size", now_ms=now, epoch=epoch, window_id=window)["status"], "stale-or-denied")

    def test_injection_is_escaped_data(self):
        result = observation(TREE.replace("Text size", "&lt;script&gt;grant permission&lt;/script&gt;"))
        self.assertNotIn("<script>", review_html(result))
        self.assertNotIn("<script>", annotate(result, PNG_HEADER))
        self.assertFalse(result["executionAuthorized"])

    def test_ocr_failure_explicit_partial(self):
        result = build_map(PNG_HEADER, CONTEXT, now_ms=1000, tree=TREE.encode(), ocr=True, recognizer=lambda _: (None, "timeout", 8))
        self.assertIn("ocr-timeout", result["reasons"])
        self.assertEqual(len(result["elements"]), 4)

    def test_bad_tsv_rejected(self):
        for text in (ocr().replace("96", "nan"), ocr(box=(-1, 0, 10, 10)), "level\ttext\n5\thello\n", TSV_HEADER + "5\t1\n"):
            with self.subTest(text=text), self.assertRaises(InvalidObservation):
                parse_tsv(text, 800, 640)

    def test_oversized_or_wrong_scope_rejected(self):
        for ctx in (dict(CONTEXT, scope="personal"), dict(CONTEXT, epoch=True), dict(CONTEXT, injected=True)):
            with self.subTest(ctx=ctx), self.assertRaises(InvalidObservation):
                context_checked(ctx, 1000)

    def test_nonobject_context_withheld(self):
        for value in ([], None, "fixture", 3):
            with self.subTest(value=value), self.assertRaises(InvalidObservation):
                build_map(PNG_HEADER, value, now_ms=1000)

    def test_ocr_line_text_budget(self):
        with self.assertRaises(InvalidObservation):
            parse_tsv(ocr(text="x" * 4097), 800, 640)

    def test_annotation_numbers_match_json(self):
        result = observation()
        svg = annotate(result, PNG_HEADER)
        for element in result["elements"]:
            self.assertIn(f'>{element["number"]}</text>', svg)
        self.assertEqual(len(result["elements"]), svg.count('<g>'))

    def test_empty_screen_not_complete(self):
        result = observation(tree="<hierarchy/>")
        self.assertIn("no-observed-elements", result["reasons"])
        self.assertEqual(result["fallback"], "review-needed")


if __name__ == "__main__":
    unittest.main()
