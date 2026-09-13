"""Pure helpers for the repository's documentation checks; no writes or network."""
import datetime
import re
from urllib.parse import urlsplit

import yaml


def split_frontmatter(text):
    match = re.match(r"\A---\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|$)", text, re.S)
    if not match:
        raise ValueError("missing or unterminated frontmatter")
    try:
        meta = yaml.safe_load(match[1])
    except yaml.YAMLError as exc:
        raise ValueError(f"invalid YAML: {exc}") from exc
    if not isinstance(meta, dict):
        raise ValueError("frontmatter must be a map")
    return meta, text[match.end():]


def markdown_links(text):
    """Extract repo-used inline and reference links, including balanced parentheses.

    Caller removes fenced code. This is not a complete CommonMark renderer.
    Return destinations and unresolved explicit reference labels.
    """
    references = {}
    def key(value):
        return " ".join(value.lower().split())
    def destination(value):
        value = value.strip()
        if value.startswith("<"):
            return value[1:value.find(">")]
        return re.split(r"\s+", value, maxsplit=1)[0]
    for match in re.finditer(r"(?m)^ {0,3}\[([^\]\n]+)\]:[ \t]*(.+)$", text):
        references[key(match[1])] = destination(match[2])
    text = re.sub(r"(?m)^ {0,3}\[[^\]\n]+\]:[^\n]*$", "", text)
    text = re.sub(r"(`+)(?!`).*?\1", "", text)
    links, unresolved = [], []
    pattern = re.compile(r"!?\[([^\]\n]+)\]")
    offset = 0
    while (match := pattern.search(text, offset)):
        end = match.end()
        offset = end
        if text[end:end+1] == "(":
            cursor, depth, angle, quoted = end + 1, 1, False, None
            while cursor < len(text) and depth:
                char = text[cursor]
                if char == "\\":
                    cursor += 2
                    continue
                if quoted:
                    if char == quoted:
                        quoted = None
                elif char == "<":
                    angle = True
                elif char == ">":
                    angle = False
                elif not angle:
                    if char in "\"'" and cursor > end + 1 and text[cursor-1].isspace():
                        quoted = char
                    elif char == "(":
                        depth += 1
                    elif char == ")":
                        depth -= 1
                cursor += 1
            if not depth:
                links.append(destination(text[end+1:cursor-1]))
                offset = cursor
        elif text[end:end+1] == "[":
            ref = re.match(r"\[([^\]\n]*)\]", text[end:])
            if ref:
                label = key(ref[1] or match[1])
                if label in references:
                    links.append(references[label])
                else:
                    unresolved.append(label)
                offset = end + ref.end()
        elif key(match[1]) in references:
            links.append(references[key(match[1])])
    return links, unresolved


def skill_errors(meta, folder_name, ui, today=None):
    errors = []
    name, description = meta.get("name"), meta.get("description")
    if not isinstance(name, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) or len(name) > 64 or name != folder_name:
        errors.append("skill name must match its hyphen-case folder")
    if not isinstance(description, str) or not description.strip() or len(description) > 1024 or "[TODO:" in description:
        errors.append("skill needs a finished, nonempty description")
    if set(meta) - {"name", "description", "metadata", "license", "allowed-tools"}:
        errors.append("unsupported skill frontmatter key")
    maintenance = meta.get("metadata", {})
    if not isinstance(maintenance, dict):
        maintenance = {}
    if maintenance.get("owner") != "Simon" or maintenance.get("status") not in {"draft", "proposed", "review", "accepted", "deprecated"}:
        errors.append("missing skill maintenance owner/status")
    try:
        date = datetime.date.fromisoformat(str(maintenance.get("last_updated", "")))
        if date > (today or datetime.date.today()):
            errors.append("future skill maintenance date")
    except ValueError:
        errors.append("invalid skill maintenance date")
    interface = ui.get("interface", {}) if isinstance(ui, dict) else {}
    if not isinstance(interface, dict):
        interface = {}
    short = interface.get("short_description", "")
    if not isinstance(short, str) or not 25 <= len(short) <= 64:
        errors.append("skill UI short description must be 25–64 characters")
    prompt = interface.get("default_prompt", "")
    if not isinstance(prompt, str) or f"${name}" not in prompt:
        errors.append("skill default prompt must mention its invocation")
    if not isinstance(interface.get("display_name"), str) or not interface["display_name"].strip():
        errors.append("skill UI needs a display name")
    return errors


def trace_errors(prd, trace, definitions):
    """Check concrete reference IDs and duplicated release/status projections."""
    errors = []
    records = {}
    for line in prd.splitlines():
        if re.match(r"^\| PRD-", line):
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            fields = cells[1].split(" / ")
            if len(fields) == 3:
                records[cells[0]] = (fields[0], fields[2])
    groups = {"UC": "use_cases", "J": "journeys", "SCR": "screens", "CMP": "components", "T": "tasks", "EVAL": "evals", "RES": "research"}
    for line in trace.splitlines():
        if '<a id="prd-' not in line:
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) != 7:
            errors.append("trace row must have seven ownership columns")
            continue
        implementation, evidence = cells[5], cells[6]
        if not re.search(r"\b(not implemented|implemented|partial implementation|blocked)\b", implementation):
            errors.append("trace row lacks implementation status")
        elif "not implemented" not in implementation and "implemented" in implementation:
            destinations, _ = markdown_links(implementation)
            if not any(not urlsplit(target).scheme and "." in urlsplit(target).path.rsplit("/", 1)[-1] and not urlsplit(target).path.lower().endswith(".md") for target in destinations):
                errors.append("implemented trace row needs an actual source artifact link")
        if not re.search(r"\b(unrun|partial|passed|failed|inconclusive)\b", evidence):
            errors.append("trace row lacks execution result status")
        match = re.search(r'\[(PRD-[A-Z]+-\d{3})\]\([^)]*\) · ([^|]+)', line)
        if match:
            fields = tuple(part.strip() for part in match[2].split(" · "))
            if records.get(match[1]) != fields:
                errors.append(f"trace release/status differs from PRD: {match[1]}")
        else:
            errors.append("trace row lacks readable PRD/release/status projection")
        for prefix, label in groups.items():
            for identifier in re.findall(r"\b" + prefix + r"-\d+\b", line):
                if identifier not in definitions.get(label, set()):
                    errors.append(f"trace references undefined {identifier}")
    return errors
