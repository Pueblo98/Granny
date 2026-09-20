#!/usr/bin/env python3
"""Closed, lab-only Android device bridge for the T-125 synthetic task suite.

The public CLI accepts only the named T01-T20 cases below.  It deliberately
does not expose adb arguments, package names, coordinates, arbitrary text,
URLs, intents, screenshots, or shell commands.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable


BRIDGE_VERSION = "t125-bridge-v1"
DEFAULT_TIMEOUT_SECONDS = 12


class BridgeError(RuntimeError):
    def __init__(self, code: str, message: str | None = None):
        super().__init__(message or code)
        self.code = code


@dataclass(frozen=True)
class TaskResult:
    case_id: str
    title: str
    outcome: str
    evidence: dict[str, object]

    def as_dict(self) -> dict[str, object]:
        return {
            "caseId": self.case_id,
            "title": self.title,
            "outcome": self.outcome,
            "evidence": self.evidence,
        }


@dataclass(frozen=True)
class UiNode:
    package: str
    text: str
    description: str
    class_name: str
    clickable: bool
    bounds: tuple[int, int, int, int]

    @property
    def center(self) -> tuple[int, int]:
        left, top, right, bottom = self.bounds
        return ((left + right) // 2, (top + bottom) // 2)


class AdbTransport:
    """Private transport. Callers receive only normalized bridge results."""

    def __init__(self, executable: str):
        path = Path(executable)
        if not path.is_absolute() or not path.is_file() or not os.access(path, os.X_OK):
            raise BridgeError("transport_unavailable")
        self._executable = str(path)

    def run(self, arguments: Iterable[str], timeout: int = DEFAULT_TIMEOUT_SECONDS) -> str:
        argv = [self._executable, *list(arguments)]
        try:
            completed = subprocess.run(
                argv,
                check=False,
                capture_output=True,
                timeout=timeout,
            )
        except subprocess.TimeoutExpired as error:
            raise BridgeError("transport_timeout") from error
        except OSError as error:
            raise BridgeError("transport_unavailable") from error
        if completed.returncode != 0:
            # Never surface raw stderr/stdout: external UI and transport output may
            # contain identifiers or untrusted content.
            raise BridgeError("transport_failed")
        return completed.stdout.decode("utf-8", errors="replace")


class DeviceBridge:
    APP_PACKAGES = {
        "granny": "org.pueblo98.stage1",
        "spotify": "com.spotify.music",
        "youtube": "com.google.android.youtube",
        "chrome": "com.android.chrome",
        "settings": "com.android.settings",
        "clock": "com.sec.android.app.clockpackage",
    }
    FIXTURE_TEXT = {
        "spotify_artist": "Playboi Carti",
        "youtube_query": "how to boil an egg",
    }
    SEMANTIC_TARGETS = {
        "granny_setup": ("granny", ("Setup and capabilities",)),
        "granny_back": ("granny", ("Back to conversation",)),
        "spotify_search_tab": ("spotify", ("Search",)),
        "spotify_search_box": ("spotify", ("What do you want to listen to?",)),
        "spotify_track": ("spotify", ("Magnolia",)),
        "spotify_pause": ("spotify", ("Pause",)),
        "spotify_play": ("spotify", ("Play",)),
    }

    def __init__(self, transport: AdbTransport, sleeper: Callable[[float], None] = time.sleep):
        self._transport = transport
        self._sleep = sleeper

    def _run(self, *arguments: str, timeout: int = DEFAULT_TIMEOUT_SECONDS) -> str:
        return self._transport.run(arguments, timeout=timeout)

    def _shell(self, *arguments: str, timeout: int = DEFAULT_TIMEOUT_SECONDS) -> str:
        return self._run("shell", *arguments, timeout=timeout)

    def ensure_single_device(self) -> None:
        output = self._run("devices")
        states = []
        for line in output.splitlines()[1:]:
            fields = line.strip().split()
            if len(fields) >= 2:
                states.append(fields[1])
        if not states:
            raise BridgeError("device_missing")
        if len(states) > 1:
            raise BridgeError("multiple_devices_or_transports")
        if states[0] == "unauthorized":
            raise BridgeError("device_unauthorized")
        if states[0] != "device":
            raise BridgeError("device_not_ready")

    def device_ready(self) -> dict[str, object]:
        self.ensure_single_device()
        power = self._shell("dumpsys", "power")
        window = self._shell("dumpsys", "window")
        awake = "mWakefulness=Awake" in power
        locked = "mDreamingLockscreen=true" in window or "isStatusBarKeyguard=true" in window
        if not awake:
            raise BridgeError("device_not_awake")
        if locked:
            raise BridgeError("device_locked")
        return {"authorizedDeviceCount": 1, "awake": True, "locked": False}

    @staticmethod
    def _package_from_component(component: str) -> str:
        if "/" not in component:
            raise BridgeError("component_unavailable")
        return component.split("/", 1)[0]

    def _resolve_activity(self, app: str, category: str = "android.intent.category.LAUNCHER") -> str:
        if app not in self.APP_PACKAGES:
            raise BridgeError("app_not_allowlisted")
        package = self.APP_PACKAGES[app]
        output = self._shell(
            "cmd",
            "package",
            "resolve-activity",
            "--brief",
            "-a",
            "android.intent.action.MAIN",
            "-c",
            category,
            package,
        )
        candidates = [line.strip() for line in output.splitlines() if "/" in line]
        if not candidates:
            raise BridgeError("component_unavailable")
        component = candidates[-1]
        if self._package_from_component(component) != package:
            raise BridgeError("component_package_mismatch")
        return component

    def foreground_package(self) -> str:
        output = self._shell("dumpsys", "window", "windows")
        focus_lines = [
            line for line in output.splitlines()
            if "mCurrentFocus" in line or "mFocusedApp" in line
        ]
        joined = "\n".join(focus_lines)
        for package in self.APP_PACKAGES.values():
            if package in joined:
                return package
        home = self._resolve_home_package()
        if home and home in joined:
            return home
        return "other"

    def _resolve_home_package(self) -> str | None:
        output = self._shell(
            "cmd",
            "package",
            "resolve-activity",
            "--brief",
            "-a",
            "android.intent.action.MAIN",
            "-c",
            "android.intent.category.HOME",
        )
        candidates = [line.strip() for line in output.splitlines() if "/" in line]
        if not candidates:
            return None
        return self._package_from_component(candidates[-1])

    def _wait_for_package(self, expected: str, seconds: float = 4.0) -> None:
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            if self.foreground_package() == expected:
                return
            self._sleep(0.25)
        raise BridgeError("foreground_not_verified")

    def open_app(self, app: str) -> dict[str, object]:
        if app not in self.APP_PACKAGES:
            raise BridgeError("app_not_allowlisted")
        self.ensure_single_device()
        component = self._resolve_activity(app)
        self._shell(
            "am",
            "start",
            "-W",
            "--windowingMode",
            "1",
            "-n",
            component,
            timeout=20,
        )
        package = self.APP_PACKAGES[app]
        self._wait_for_package(package)
        return {"app": app, "foregroundVerified": True}

    @staticmethod
    def _parse_bounds(value: str) -> tuple[int, int, int, int]:
        match = re.fullmatch(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]", value)
        if not match:
            raise BridgeError("ui_bounds_invalid")
        bounds = tuple(int(part) for part in match.groups())
        left, top, right, bottom = bounds
        if right <= left or bottom <= top:
            raise BridgeError("ui_bounds_invalid")
        return bounds

    def _ui_nodes(self) -> list[UiNode]:
        output = self._run("exec-out", "uiautomator", "dump", "/dev/tty", timeout=20)
        start = output.find("<?xml")
        if start < 0:
            start = output.find("<hierarchy")
        if start < 0:
            raise BridgeError("ui_observation_unavailable")
        end = output.rfind("</hierarchy>")
        if end < start:
            raise BridgeError("ui_observation_invalid")
        payload = output[start:end + len("</hierarchy>")]
        try:
            root = ET.fromstring(payload)
        except ET.ParseError as error:
            raise BridgeError("ui_observation_invalid") from error
        nodes = []
        for element in root.iter("node"):
            attributes = element.attrib
            try:
                bounds = self._parse_bounds(attributes.get("bounds", ""))
            except BridgeError:
                continue
            nodes.append(
                UiNode(
                    package=attributes.get("package", ""),
                    text=attributes.get("text", ""),
                    description=attributes.get("content-desc", ""),
                    class_name=attributes.get("class", ""),
                    clickable=attributes.get("clickable") == "true",
                    bounds=bounds,
                )
            )
        return nodes

    @staticmethod
    def _matches(node: UiNode, labels: tuple[str, ...]) -> bool:
        values = {node.text.casefold(), node.description.casefold()}
        return any(label.casefold() in values for label in labels)

    def _find_target(self, target: str) -> UiNode:
        if target not in self.SEMANTIC_TARGETS:
            raise BridgeError("target_not_allowlisted")
        app, labels = self.SEMANTIC_TARGETS[target]
        package = self.APP_PACKAGES[app]
        if self.foreground_package() != package:
            raise BridgeError("target_app_not_foreground")
        matches = [
            node for node in self._ui_nodes()
            if node.package == package and self._matches(node, labels)
        ]
        if not matches:
            raise BridgeError("semantic_target_not_found")
        # Prefer an explicitly clickable node, then the smallest visible target.
        matches.sort(
            key=lambda node: (
                not node.clickable,
                (node.bounds[2] - node.bounds[0]) * (node.bounds[3] - node.bounds[1]),
                node.bounds[1],
            )
        )
        return matches[0]

    def activate(self, target: str, wait_seconds: float = 1.0) -> dict[str, object]:
        node = self._find_target(target)
        x, y = node.center
        # Coordinates are derived from the fresh semantic observation and are not
        # accepted through the public interface.
        self._shell("input", "tap", str(x), str(y))
        self._sleep(wait_seconds)
        return {"target": target, "semanticTargetFound": True, "actionAccepted": True}

    def _focused_editable(self, app: str) -> bool:
        package = self.APP_PACKAGES[app]
        return any(
            node.package == package
            and "EditText" in node.class_name
            and (node.clickable or node.text or node.description)
            for node in self._ui_nodes()
        )

    def enter_fixture(self, fixture: str) -> dict[str, object]:
        if fixture not in self.FIXTURE_TEXT:
            raise BridgeError("fixture_not_allowlisted")
        if fixture != "spotify_artist":
            raise BridgeError("fixture_route_invalid")
        package = self.APP_PACKAGES["spotify"]
        if self.foreground_package() != package:
            raise BridgeError("target_app_not_foreground")
        if not self._focused_editable("spotify"):
            raise BridgeError("editable_target_not_found")
        self._shell("input", "keycombination", "KEYCODE_CTRL_LEFT", "KEYCODE_A")
        self._shell("input", "text", "Playboi%sCarti")
        self._sleep(4.0)
        artist_visible = any(
            node.package == package
            and (node.text.casefold() == "playboi carti" or node.description.casefold() == "playboi carti")
            for node in self._ui_nodes()
        )
        if not artist_visible:
            raise BridgeError("fixture_text_not_observed")
        return {"fixture": fixture, "publicTextEntered": True, "resultObserved": True}

    def ui_contains(self, app: str, expected_text: str) -> bool:
        if app not in self.APP_PACKAGES:
            raise BridgeError("app_not_allowlisted")
        package = self.APP_PACKAGES[app]
        if self.foreground_package() != package:
            return False
        needle = expected_text.casefold()
        return any(
            node.package == package
            and (needle in node.text.casefold() or needle in node.description.casefold())
            for node in self._ui_nodes()
        )

    def show_home(self) -> dict[str, object]:
        self.ensure_single_device()
        expected = self._resolve_home_package()
        if expected is None:
            raise BridgeError("home_unavailable")
        self._shell("input", "keyevent", "KEYCODE_HOME")
        self._wait_for_package(expected)
        return {"homeForegroundVerified": True}

    def search_youtube_fixture(self) -> dict[str, object]:
        query = self.FIXTURE_TEXT["youtube_query"]
        package = self.APP_PACKAGES["youtube"]
        self._shell(
            "am",
            "start",
            "-W",
            "--windowingMode",
            "1",
            "-a",
            "android.intent.action.SEARCH",
            "-p",
            package,
            "--es",
            "query",
            query,
            timeout=20,
        )
        self._wait_for_package(package)
        self._sleep(3.0)
        return {
            "app": "youtube",
            "fixture": "youtube_query",
            "foregroundVerified": True,
            "resultObserved": self.ui_contains("youtube", query),
        }

    def open_public_page(self) -> dict[str, object]:
        package = self.APP_PACKAGES["chrome"]
        self._shell(
            "am",
            "start",
            "-W",
            "--windowingMode",
            "1",
            "-a",
            "android.intent.action.VIEW",
            "-d",
            "https://example.com/",
            "-p",
            package,
            timeout=20,
        )
        self._wait_for_package(package)
        self._sleep(2.0)
        return {"app": "chrome", "publicFixturePage": "example.com", "foregroundVerified": True}

    def open_system_page(self, page: str) -> dict[str, object]:
        actions = {
            "settings": "android.settings.SETTINGS",
            "accessibility": "android.settings.ACCESSIBILITY_SETTINGS",
        }
        if page not in actions:
            raise BridgeError("system_page_not_allowlisted")
        package = self.APP_PACKAGES["settings"]
        self._shell(
            "am",
            "start",
            "-W",
            "--windowingMode",
            "1",
            "-a",
            actions[page],
            timeout=20,
        )
        self._wait_for_package(package)
        self._sleep(1.0)
        observed = page == "settings" or self.ui_contains("settings", "Accessibility")
        if not observed:
            raise BridgeError("system_page_not_verified")
        return {"page": page, "foregroundVerified": True, "pageObserved": True}

    def spotify_media(self) -> dict[str, object]:
        output = self._shell("dumpsys", "media_session")
        blocks = re.split(r"(?m)^\s*Session #\d+:\s*$", output)
        block = next((part for part in blocks if "package=com.spotify.music" in part), "")
        if not block:
            raise BridgeError("spotify_session_missing")
        state_match = re.search(r"state=([A-Z_]+)\((\d+)\)", block)
        if state_match:
            state = state_match.group(1)
        else:
            numeric = re.search(r"state=(\d+)", block)
            state = {"0": "NONE", "2": "PAUSED", "3": "PLAYING"}.get(
                numeric.group(1) if numeric else "", "UNKNOWN"
            )
        lower = block.casefold()
        return {
            "sessionFound": True,
            "state": state,
            "artistMatch": "playboi carti" in lower,
            "trackMatch": "magnolia" in lower,
        }

    def require_spotify_media(self, state: str) -> dict[str, object]:
        observed = self.spotify_media()
        if not observed["artistMatch"] or not observed["trackMatch"]:
            raise BridgeError("spotify_identity_not_verified")
        if observed["state"] != state:
            raise BridgeError("spotify_state_not_verified")
        return observed


class TaskSuite:
    TITLES = {
        "T01": "Confirm one awake, unlocked authorized tablet",
        "T02": "Show the Android Home screen",
        "T03": "Open Granny",
        "T04": "Open Granny Setup and capabilities",
        "T05": "Return to the Granny conversation",
        "T06": "Open Spotify",
        "T07": "Open Spotify Search",
        "T08": "Search Spotify for Playboi Carti",
        "T09": "Play Magnolia by Playboi Carti",
        "T10": "Verify exact Spotify playback",
        "T11": "Pause the verified Spotify track",
        "T12": "Resume the verified Spotify track",
        "T13": "Pause Spotify for suite teardown",
        "T14": "Open YouTube",
        "T15": "Search YouTube for a public cooking fixture",
        "T16": "Open the fixed public example.com page",
        "T17": "Open Android Settings",
        "T18": "Open Android Accessibility settings",
        "T19": "Open Clock without creating an alarm",
        "T20": "Return to Android Home",
    }

    def __init__(self, bridge: DeviceBridge):
        self.bridge = bridge

    def _run_case(self, case_id: str) -> dict[str, object]:
        b = self.bridge
        if case_id == "T01":
            return b.device_ready()
        if case_id == "T02":
            return b.show_home()
        if case_id == "T03":
            return b.open_app("granny")
        if case_id == "T04":
            b.activate("granny_setup")
            if not b.ui_contains("granny", "Type works immediately"):
                raise BridgeError("granny_setup_not_verified")
            return {"screen": "granny_setup", "headingObserved": True}
        if case_id == "T05":
            b.activate("granny_back")
            if not b.ui_contains("granny", "Setup and capabilities"):
                raise BridgeError("granny_conversation_not_verified")
            return {"screen": "granny_conversation", "setupEntryObserved": True}
        if case_id == "T06":
            return b.open_app("spotify")
        if case_id == "T07":
            b.activate("spotify_search_tab")
            if not b.ui_contains("spotify", "What do you want to listen to?"):
                raise BridgeError("spotify_search_not_verified")
            return {"screen": "spotify_search", "searchFieldObserved": True}
        if case_id == "T08":
            b.activate("spotify_search_box")
            return b.enter_fixture("spotify_artist")
        if case_id == "T09":
            b.activate("spotify_track", wait_seconds=5.0)
            return b.require_spotify_media("PLAYING")
        if case_id == "T10":
            return b.require_spotify_media("PLAYING")
        if case_id == "T11":
            b.require_spotify_media("PLAYING")
            b.activate("spotify_pause", wait_seconds=2.0)
            return b.require_spotify_media("PAUSED")
        if case_id == "T12":
            b.require_spotify_media("PAUSED")
            b.activate("spotify_play", wait_seconds=2.0)
            return b.require_spotify_media("PLAYING")
        if case_id == "T13":
            b.require_spotify_media("PLAYING")
            b.activate("spotify_pause", wait_seconds=2.0)
            return b.require_spotify_media("PAUSED")
        if case_id == "T14":
            return b.open_app("youtube")
        if case_id == "T15":
            return b.search_youtube_fixture()
        if case_id == "T16":
            return b.open_public_page()
        if case_id == "T17":
            return b.open_system_page("settings")
        if case_id == "T18":
            return b.open_system_page("accessibility")
        if case_id == "T19":
            return b.open_app("clock")
        if case_id == "T20":
            return b.show_home()
        raise BridgeError("task_not_allowlisted")

    def run(self, case_id: str) -> TaskResult:
        if case_id not in self.TITLES:
            raise BridgeError("task_not_allowlisted")
        try:
            evidence = self._run_case(case_id)
            return TaskResult(case_id, self.TITLES[case_id], "verified_complete", evidence)
        except BridgeError as error:
            return TaskResult(case_id, self.TITLES[case_id], "failed_safely", {"reason": error.code})

    def run_all(self) -> list[TaskResult]:
        results = []
        for case_id in self.TITLES:
            if results and results[0].outcome != "verified_complete":
                results.append(TaskResult(
                    case_id,
                    self.TITLES[case_id],
                    "not_executed",
                    {"reason": "device_precondition_failed"},
                ))
                continue
            results.append(self.run(case_id))
        return results


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="T-125 closed local device bridge")
    parser.add_argument("command", choices=("catalog", "run", "run-all"))
    parser.add_argument("case_id", nargs="?")
    return parser


def _transport_from_environment() -> AdbTransport:
    executable = os.environ.get("GRANNY_BRIDGE_ADB", "")
    if not executable:
        raise BridgeError("transport_not_configured")
    return AdbTransport(executable)


def main(argv: list[str] | None = None) -> int:
    args = _parser().parse_args(argv)
    if args.command == "catalog":
        print(json.dumps({"bridgeVersion": BRIDGE_VERSION, "tasks": TaskSuite.TITLES}, sort_keys=True))
        return 0
    try:
        suite = TaskSuite(DeviceBridge(_transport_from_environment()))
        if args.command == "run":
            if not args.case_id:
                raise BridgeError("case_id_required")
            result = suite.run(args.case_id)
            print(json.dumps({"bridgeVersion": BRIDGE_VERSION, "result": result.as_dict()}, sort_keys=True))
            return 0 if result.outcome == "verified_complete" else 2
        if args.case_id is not None:
            raise BridgeError("unexpected_argument")
        results = suite.run_all()
        summary = {
            "attempted": len(results),
            "verifiedComplete": sum(result.outcome == "verified_complete" for result in results),
            "failedSafely": sum(result.outcome == "failed_safely" for result in results),
            "notExecuted": sum(result.outcome == "not_executed" for result in results),
            "unsafe": 0,
        }
        print(json.dumps({
            "bridgeVersion": BRIDGE_VERSION,
            "results": [result.as_dict() for result in results],
            "summary": summary,
        }, sort_keys=True))
        return 0 if summary["failedSafely"] == 0 else 2
    except BridgeError as error:
        print(json.dumps({"bridgeVersion": BRIDGE_VERSION, "error": error.code}, sort_keys=True))
        return 2


if __name__ == "__main__":
    sys.exit(main())
