"""Local, read-only screen maps. No executor, provider, network or model authority."""
from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import html
import io
import json
import math
import os
from pathlib import Path
import re
import struct
import subprocess
import time
import xml.etree.ElementTree as ET

VERSION = "granny.perception.lab.v1"
MAX_NODES = 512
MAX_BYTES = 16 * 1024 * 1024
MAX_AGE_MS = 2000
ROLES = {"Button": "button", "ImageButton": "button", "EditText": "text_input",
         "CheckBox": "checkbox", "Switch": "switch", "SeekBar": "slider",
         "ImageView": "image", "TextView": "text"}


class InvalidObservation(ValueError):
    """Invalid/unsupported input; callers must withhold the map."""


def number(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise InvalidObservation("invalid-number")
    return value


def bounds(value):
    if not isinstance(value, list) or len(value) != 4:
        raise InvalidObservation("invalid-bounds")
    box = [number(v) for v in value]
    if box[2] <= box[0] or box[3] <= box[1]:
        raise InvalidObservation("empty-bounds")
    return box


def area(box):
    return (box[2] - box[0]) * (box[3] - box[1])


def intersection(a, b):
    return max(0, min(a[2], b[2]) - max(a[0], b[0])) * max(0, min(a[3], b[3]) - max(a[1], b[1]))


def normalized(text):
    return " ".join(text.casefold().split())


def limited_text(value):
    if not isinstance(value, str) or len(value) > 4096:
        raise InvalidObservation("invalid-text")
    return value


def png_size(data):
    if len(data) > MAX_BYTES or len(data) < 33 or data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise InvalidObservation("bounded-png-required")
    width, height = struct.unpack(">II", data[16:24])
    if not (1 <= width <= 4096 and 1 <= height <= 4096 and width * height <= 8_000_000):
        raise InvalidObservation("image-too-large")
    return width, height


def context_checked(context, now_ms):
    required = {"scope", "package", "windowId", "epoch", "capturedAtMs", "viewport", "protected"}
    if not isinstance(context, dict) or set(context) != required:
        raise InvalidObservation("invalid-context")
    if context["scope"] != "synthetic-fixture":
        raise InvalidObservation("synthetic-inputs-only")
    if context["package"] not in {"org.pueblo98.granny.perceptionlab", "org.pueblo98.granny.c2fixture"}:
        raise InvalidObservation("package-out-of-scope")
    for field in ("windowId", "epoch", "capturedAtMs"):
        if type(context[field]) is not int or context[field] < 0:
            raise InvalidObservation("invalid-context-number")
    if type(context["protected"]) is not bool:
        raise InvalidObservation("invalid-protection-state")
    bounds(context["viewport"])
    age = number(now_ms) - context["capturedAtMs"]
    if age < 0 or age > MAX_AGE_MS:
        raise InvalidObservation("stale-observation")
    if context["protected"]:
        raise InvalidObservation("protected-observation")


def transform(box, viewport, width, height):
    """Screen coordinates -> captured viewport pixels. Partial boxes stay partial."""
    box, viewport = bounds(box), bounds(viewport)
    clipped = [max(box[0], viewport[0]), max(box[1], viewport[1]),
               min(box[2], viewport[2]), min(box[3], viewport[3])]
    if clipped[0] >= clipped[2] or clipped[1] >= clipped[3]:
        return None, False
    sx, sy = width / (viewport[2] - viewport[0]), height / (viewport[3] - viewport[1])
    result = [round((clipped[0] - viewport[0]) * sx, 3),
              round((clipped[1] - viewport[1]) * sy, 3),
              round((clipped[2] - viewport[0]) * sx, 3),
              round((clipped[3] - viewport[1]) * sy, 3)]
    return result, clipped != box


def parse_tree(data, context, width, height):
    """UIAutomator-shaped replay input, not a claim of live Android observation."""
    if len(data) > 1_000_000 or b"<!DOCTYPE" in data.upper() or b"<!ENTITY" in data.upper():
        raise InvalidObservation("unsafe-tree")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as error:
        raise InvalidObservation("malformed-tree") from error
    if root.tag != "hierarchy":
        raise InvalidObservation("invalid-tree-root")
    # Reject sensitive content before OCR or rendering, including hidden fields.
    nodes = list(root.iter("node"))
    if len(nodes) > MAX_NODES:
        raise InvalidObservation("tree-too-large")
    if any(n.get("password") == "true" or n.get("sensitive") == "true" for n in nodes):
        raise InvalidObservation("sensitive-tree")
    output = []
    stack = [(child, True, 1) for child in reversed(list(root))]
    visited = 0
    while stack:
        node, ancestor_visible, depth = stack.pop()
        visited += 1
        if depth > 32 or visited > MAX_NODES or node.tag != "node":
            raise InvalidObservation("invalid-tree-structure")
        attrs = node.attrib
        if attrs.get("package") != context["package"]:
            raise InvalidObservation("mixed-package-tree")
        for field in ("visible-to-user", "enabled", "clickable", "scrollable", "password", "sensitive"):
            if attrs.get(field, "false") not in {"true", "false"}:
                raise InvalidObservation("invalid-node-state")
        visible = ancestor_visible and attrs.get("visible-to-user") == "true"
        stack.extend((child, visible, depth + 1) for child in reversed(list(node)))
        if not visible:
            continue
        match = re.fullmatch(r"\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]", attrs.get("bounds", ""))
        if not match:
            raise InvalidObservation("invalid-node-bounds")
        raw_box = list(map(int, match.groups()))
        # Empty layout containers are not visible evidence.
        if raw_box[0] == raw_box[2] or raw_box[1] == raw_box[3]:
            continue
        box, clipped = transform(raw_box, context["viewport"], width, height)
        if box is None:
            continue
        label = limited_text(attrs.get("content-desc", "")) or limited_text(attrs.get("text", ""))
        role = ROLES.get(attrs.get("class", "").rsplit(".", 1)[-1], "unknown")
        actions = []
        enabled = attrs.get("enabled") == "true"
        if enabled and not clipped:
            if attrs.get("clickable") == "true":
                actions.append("click")
            if attrs.get("scrollable") == "true":
                actions.append("scroll")
        if not label and role == "unknown" and not actions:
            continue
        output.append({"role": role, "label": label, "bounds": box,
                       "source": "semantic-replay", "labelSource": "semantic" if label else "unknown",
                       "resourceId": limited_text(attrs.get("resource-id", "")),
                       "enabled": enabled, "clipped": clipped, "reportedActions": actions,
                       "executionAuthorized": False, "ocrEvidence": [], "conflict": False})
    return output


def parse_tsv(tsv, width, height):
    if len(tsv) > 2_000_000:
        raise InvalidObservation("ocr-output-too-large")
    lines = {}
    try:
        reader = csv.DictReader(io.StringIO(tsv), delimiter="\t", quoting=csv.QUOTE_NONE)
        for count, row in enumerate(reader):
            if count > 10000:
                raise InvalidObservation("ocr-output-too-large")
            if row["level"] != "5" or not row["text"].strip():
                continue
            confidence = number(float(row["conf"]))
            if confidence < 0:
                continue
            if confidence > 100:
                raise InvalidObservation("invalid-ocr-confidence")
            left, top, w, h = (int(row[key]) for key in ("left", "top", "width", "height"))
            box = bounds([left, top, left + w, top + h])
            if left < 0 or top < 0 or box[2] > width or box[3] > height:
                raise InvalidObservation("ocr-bounds-outside-image")
            key = tuple(row[k] for k in ("page_num", "block_num", "par_num", "line_num"))
            lines.setdefault(key, []).append((box, limited_text(row["text"]), confidence / 100))
    except (KeyError, TypeError, ValueError, AttributeError, csv.Error) as error:
        raise InvalidObservation("malformed-ocr") from error
    output = []
    for words in lines.values():
        box = [min(w[0][0] for w in words), min(w[0][1] for w in words),
               max(w[0][2] for w in words), max(w[0][3] for w in words)]
        output.append({"text": limited_text(" ".join(w[1] for w in words)), "bounds": box,
                       "recognitionScore": min(w[2] for w in words)})
    if len(output) > MAX_NODES:
        raise InvalidObservation("ocr-too-many-lines")
    return output


def recognize(data):
    """Fixed local command, image bytes on stdin; never interpret observed text."""
    started = time.perf_counter()
    try:
        result = subprocess.run(["tesseract", "stdin", "stdout", "-l", "eng", "--psm", "11", "tsv"],
                                input=data, capture_output=True, timeout=8,
                                env={**os.environ, "OMP_THREAD_LIMIT": "1"}, check=False)
        if result.returncode:
            return None, "failed", (time.perf_counter() - started) * 1000
        return result.stdout.decode("utf-8"), "completed", (time.perf_counter() - started) * 1000
    except FileNotFoundError:
        return None, "unavailable", (time.perf_counter() - started) * 1000
    except subprocess.TimeoutExpired:
        return None, "timeout", (time.perf_counter() - started) * 1000


def fuse(semantic, ocr):
    elements = json.loads(json.dumps(semantic))
    for line in ocr:
        candidates = [e for e in elements if e["source"] == "semantic-replay"
                      and intersection(e["bounds"], line["bounds"]) / area(line["bounds"]) >= .8]
        candidates.sort(key=lambda e: area(e["bounds"]))
        if candidates and (len(candidates) == 1 or area(candidates[0]["bounds"]) < area(candidates[1]["bounds"])):
            target = candidates[0]
            target["ocrEvidence"].append(line)
            if not target["label"]:
                target["label"] = line["text"]
                target["labelSource"] = "ocr"
            elif normalized(line["text"]) not in normalized(target["label"]):
                target["conflict"] = True
        else:
            elements.append({"role": "text", "label": line["text"], "bounds": line["bounds"],
                             "source": "ocr", "labelSource": "ocr", "resourceId": "",
                             "enabled": None, "clipped": False, "reportedActions": [],
                             "executionAuthorized": False, "ocrEvidence": [line], "conflict": False})
    if len(elements) > MAX_NODES:
        raise InvalidObservation("map-too-large")
    return sorted(elements, key=lambda e: (e["bounds"][1], e["bounds"][0], e["role"], e["label"]))


def build_map(data, context, *, now_ms, tree=None, ocr=False, recognizer=recognize):
    started = time.perf_counter()
    context_checked(context, now_ms)
    width, height = png_size(data)
    semantic = parse_tree(tree, context, width, height) if tree is not None else []
    tsv, ocr_status, ocr_ms = recognizer(data) if ocr else (None, "not-requested", 0)
    lines = parse_tsv(tsv, width, height) if tsv is not None else []
    elements = fuse(semantic, lines)
    # Transient fixture identity binds both image and semantic state. Not a durable personal-data hash.
    digest = hashlib.sha256(data + (tree or b"") + json.dumps(context, sort_keys=True).encode()).hexdigest()[:16]
    obs_id = "obs-" + digest
    for index, element in enumerate(elements, 1):
        element.update(id=f"{obs_id}:e{index}", number=index)
    reasons = []
    if not semantic:
        reasons.append("no-semantic-elements")
    if any(e["conflict"] for e in elements):
        reasons.append("evidence-conflict")
    if any(e["reportedActions"] and not e["label"] for e in elements):
        reasons.append("unlabeled-control")
    if ocr_status in {"failed", "unavailable", "timeout"}:
        reasons.append("ocr-" + ocr_status)
    if not elements:
        reasons.append("no-observed-elements")
    return {"schemaVersion": VERSION, "observationId": obs_id, "context": context,
            "coordinateSpace": "captured-viewport-pixels", "imageSize": [width, height],
            "elements": elements, "completeness": "partial", "reasons": reasons,
            "fallback": "review-needed" if reasons else "structured-map-available",
            "executionAuthorized": False, "ocrStatus": ocr_status,
            "timingMs": {"ocr": round(ocr_ms, 3), "total": round((time.perf_counter() - started) * 1000, 3)}}


def lookup(observation, label, *, now_ms, epoch, window_id, role=None):
    """Reference lookup only. Even a unique native node cannot authorize execution."""
    context = observation["context"]
    try:
        context_checked(context, now_ms)
    except InvalidObservation:
        return {"status": "stale-or-denied", "elementId": None, "executionAuthorized": False}
    if epoch != context["epoch"] or window_id != context["windowId"]:
        return {"status": "stale-or-denied", "elementId": None, "executionAuthorized": False}
    matches = [e for e in observation["elements"] if normalized(e["label"]) == normalized(label)
               and (role is None or e["role"] == role)]
    result = {"status": "not-found", "elementId": None, "executionAuthorized": False}
    if len(matches) > 1:
        result["status"] = "ambiguous"
    elif matches:
        element = matches[0]
        if element["conflict"] or element["clipped"] or element["enabled"] is False:
            result["status"] = "unavailable"
        else:
            result.update(status="observed" if element["labelSource"] == "semantic" else "visual-candidate",
                          elementId=element["id"])
    return result


def annotate(observation, image):
    width, height = observation["imageSize"]
    encoded = base64.b64encode(image).decode("ascii")
    output = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
              '<title>Read-only synthetic screen map; numbered observations are not action permissions.</title>',
              f'<image width="{width}" height="{height}" href="data:image/png;base64,{encoded}"/>']
    for element in observation["elements"]:
        x, y, right, bottom = element["bounds"]
        color = "#a83d00" if element["source"] == "ocr" or element["conflict"] else "#005a9c"
        output.append(f'<g><title>{html.escape(element["label"])}</title><rect x="{x}" y="{y}" width="{right-x}" height="{bottom-y}" fill="none" stroke="{color}" stroke-width="2"/>')
        output.append(f'<rect x="{x}" y="{max(0,y-22)}" width="36" height="22" fill="{color}"/><text x="{x+3}" y="{max(0,y-22)+17}" fill="white" font-size="16">{element["number"]}</text></g>')
    return "\n".join(output + ["</svg>"])


def review_html(observation):
    rows = "".join(f'<tr><td>{e["number"]}</td><td>{html.escape(e["label"] or "Unlabeled")}</td>'
                   f'<td>{e["role"]}</td><td>{e["labelSource"]}</td><td>{e["bounds"]}</td>'
                   f'<td>{"conflict" if e["conflict"] else "observation only"}</td></tr>' for e in observation["elements"])
    return f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>Granny perception lab</title><style>body{{font:18px system-ui;margin:24px;max-width:1200px}}img{{max-width:100%;max-height:700px}}td,th{{text-align:left;padding:8px;border-bottom:1px solid #ccc}}pre{{white-space:pre-wrap}}.scroll{{overflow:auto}}</style>
<h1>Synthetic screen understanding</h1><p>Local evidence review. No app was controlled. Blue: semantic evidence. Orange: OCR-only or conflicting evidence. Coverage remains partial.</p>
<p>OCR: {observation["ocrStatus"]}. {html.escape(", ".join(observation["reasons"]) or "Structured map available; visual completeness is not proven.")}</p>
<img src="annotated.svg" alt="Numbered synthetic screen; equivalent descriptions appear in the table.">
<div class="scroll"><table><caption>Observed elements</caption><tr><th>Number</th><th>Label</th><th>Role</th><th>Label evidence</th><th>Bounds</th><th>Status</th></tr>{rows}</table></div>
<details><summary>Structured observation</summary><pre>{html.escape(json.dumps(observation, indent=2))}</pre></details></html>'''


def read_bounded(path, maximum=MAX_BYTES):
    with Path(path).open("rb") as source:
        data = source.read(maximum + 1)
    if len(data) > maximum:
        raise InvalidObservation("input-too-large")
    return data


def main():
    parser = argparse.ArgumentParser(description="Synthetic local screen understanding; no device or network access")
    parser.add_argument("--image", required=True, type=Path)
    parser.add_argument("--tree", type=Path)
    parser.add_argument("--context", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path, help="New artifact directory; never overwritten")
    parser.add_argument("--ocr", action="store_true", help="Run installed Tesseract locally")
    args = parser.parse_args()
    try:
        context = json.loads(read_bounded(args.context, 10000))
        data = read_bounded(args.image)
        tree = read_bounded(args.tree, 1_000_000) if args.tree else None
        # Offline replay uses the fixture clock explicitly, not a current device freshness claim.
        replay_time = context.get("capturedAtMs", 0) if isinstance(context, dict) else 0
        observation = build_map(data, context, now_ms=replay_time, tree=tree, ocr=args.ocr)
        args.output.mkdir(parents=True, exist_ok=False)
        (args.output / "observation.json").write_text(json.dumps(observation, indent=2) + "\n")
        (args.output / "annotated.svg").write_text(annotate(observation, data))
        (args.output / "review.html").write_text(review_html(observation))
        print(json.dumps({"elements": len(observation["elements"]), "ocr": observation["ocrStatus"],
                          "timingMs": observation["timingMs"], "artifacts": str(args.output)}))
    except (InvalidObservation, OSError, ValueError, KeyError) as error:
        # No raw screen content, external command stderr or paths in error output.
        print(json.dumps({"status": "withheld", "reason": str(error) if isinstance(error, InvalidObservation) else "invalid-input-or-output"}))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
