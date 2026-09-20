"""Real OCR smoke evaluation. Oracle never enters the perception call."""
import argparse
import json
from pathlib import Path
import statistics

from make_fixture import create_fixture
from perception import annotate, build_map, lookup, review_html

# Authored expectations, not computed from parser results or model answers.
TARGETS = {"Screen zoom", "Text size", "Dark theme"}
CANVAS_TEXT = "Canvas note: larger words"


def evaluate(output, repeats=3):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    fixture = create_fixture(output / "fixture")
    data, tree = (fixture / "screen.png").read_bytes(), (fixture / "tree.xml").read_bytes()
    context = json.loads((fixture / "context.json").read_text())
    report = {"evidence": "synthetic-host-ocr", "repeats": repeats, "arms": {},
              "deviceEvidence": "unrun", "externalActions": 0, "providerCalls": 0}
    for name, use_tree, use_ocr in [("semantics", True, False), ("ocr", False, True), ("fused", True, True)]:
        observations = [build_map(data, context, now_ms=1000, tree=tree if use_tree else None, ocr=use_ocr)
                        for _ in range(repeats)]
        result = observations[0]
        labels = {e["label"] for e in result["elements"]}
        matched = TARGETS & labels
        arm = output / name
        arm.mkdir()
        (arm / "observation.json").write_text(json.dumps(result, indent=2) + "\n")
        (arm / "annotated.svg").write_text(annotate(result, data))
        (arm / "review.html").write_text(review_html(result))
        latencies = sorted(x["timingMs"]["total"] for x in observations)
        report["arms"][name] = {"targetLabels": len(matched), "targetDenominator": len(TARGETS),
                               "canvasTextObserved": CANVAS_TEXT in labels,
                               "missingTarget": lookup(result, "Send", now_ms=1100, epoch=1, window_id=1)["status"],
                               "ocrStatus": result["ocrStatus"], "latenciesMs": latencies,
                               "medianMs": statistics.median(latencies),
                               "repeatableElements": all(x["elements"] == result["elements"] for x in observations),
                               "conflicts": sum(e["conflict"] for e in result["elements"])}
    # Prospective narrow smoke criteria, NOT a broad performance/accuracy gate.
    report["passed"] = all(a["targetLabels"] == 3 and a["missingTarget"] == "not-found"
                           and a["repeatableElements"] and not a["conflicts"] for a in report["arms"].values())
    report["passed"] &= (not report["arms"]["semantics"]["canvasTextObserved"]
                         and report["arms"]["ocr"]["canvasTextObserved"]
                         and report["arms"]["fused"]["canvasTextObserved"])
    (output / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    return report["passed"]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("--repeats", type=int, choices=range(1, 11), default=3)
    args = parser.parse_args()
    raise SystemExit(0 if evaluate(args.output, args.repeats) else 1)
