import json
import os
import stat
import tempfile
import unittest
from pathlib import Path

from bridge import AdbTransport, BridgeError, DeviceBridge, TaskSuite, UiNode


class FakeTransport:
    def __init__(self, responses=None):
        self.responses = responses or {}
        self.calls = []

    def run(self, arguments, timeout=12):
        key = tuple(arguments)
        self.calls.append((key, timeout))
        response = self.responses.get(key, "")
        if isinstance(response, Exception):
            raise response
        return response


class BridgeContractTest(unittest.TestCase):
    def test_catalog_has_exactly_twenty_stable_cases(self):
        self.assertEqual(list(TaskSuite.TITLES), [f"T{index:02d}" for index in range(1, 21)])
        self.assertEqual(len(TaskSuite.TITLES), 20)

    def test_unknown_task_is_denied_without_transport_call(self):
        transport = FakeTransport()
        suite = TaskSuite(DeviceBridge(transport, sleeper=lambda _: None))
        with self.assertRaisesRegex(BridgeError, "task_not_allowlisted"):
            suite.run("T21")
        self.assertEqual(transport.calls, [])

    def test_unknown_app_is_denied_without_transport_call(self):
        transport = FakeTransport()
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "app_not_allowlisted"):
            bridge.open_app("arbitrary.package")
        self.assertEqual(transport.calls, [])

    def test_cold_app_launch_is_package_bound_and_fixed(self):
        class LaunchBridge(DeviceBridge):
            def ensure_single_device(self):
                return None

            def _wait_for_package(self, expected, seconds=4.0):
                self.waited_for = expected

        transport = FakeTransport()
        bridge = LaunchBridge(transport, sleeper=lambda _: None)
        result = bridge.open_app("spotify", cold_start=True)
        self.assertEqual(result, {
            "app": "spotify", "foregroundVerified": True, "coldStart": True,
        })
        self.assertEqual(bridge.waited_for, "com.spotify.music")
        self.assertEqual(transport.calls[0][0], (
            "shell", "am", "force-stop", "com.spotify.music",
        ))
        self.assertEqual(transport.calls[1][0], (
            "shell", "am", "start", "-W", "--windowingMode", "1",
            "-a", "android.intent.action.MAIN", "-c",
            "android.intent.category.LAUNCHER", "-p", "com.spotify.music",
        ))

    def test_unknown_semantic_target_is_denied_without_transport_call(self):
        transport = FakeTransport()
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "target_not_allowlisted"):
            bridge.activate("tap_100_200")
        self.assertEqual(transport.calls, [])

    def test_unknown_fixture_text_is_denied_without_transport_call(self):
        transport = FakeTransport()
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "fixture_not_allowlisted"):
            bridge.enter_fixture("send_private_message")
        self.assertEqual(transport.calls, [])

    def test_unknown_system_page_is_denied_without_transport_call(self):
        transport = FakeTransport()
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "system_page_not_allowlisted"):
            bridge.open_system_page("developer_options")
        self.assertEqual(transport.calls, [])

    def test_multiple_devices_fail_closed(self):
        transport = FakeTransport({
            ("devices",): "List of devices attached\na\tdevice\nb\tdevice\n"
        })
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "multiple_devices_or_transports"):
            bridge.ensure_single_device()

    def test_unauthorized_device_fails_closed(self):
        transport = FakeTransport({
            ("devices",): "List of devices attached\na\tunauthorized\n"
        })
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "device_unauthorized"):
            bridge.ensure_single_device()

    def test_missing_device_is_distinguished(self):
        transport = FakeTransport({
            ("devices",): "List of devices attached\n\n"
        })
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "device_missing"):
            bridge.ensure_single_device()

    def test_resolved_component_must_match_allowlisted_package(self):
        key = (
            "shell", "cmd", "package", "resolve-activity", "--brief",
            "-a", "android.intent.action.MAIN", "-c", "android.intent.category.LAUNCHER",
            "com.spotify.music",
        )
        transport = FakeTransport({key: "com.example.bad/.Main\n"})
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "component_package_mismatch"):
            bridge._resolve_activity("spotify")

    def test_foreground_accepts_top_resumed_marker_on_large_screen(self):
        observed = DeviceBridge._foreground_from_outputs(
            "mCurrentFocus=null\n",
            "topResumedActivity=ActivityRecord{1 com.spotify.music/.SpotifyMainActivity}\n",
            "com.sec.android.app.launcher",
        )
        self.assertEqual(observed, "com.spotify.music")

    def test_foreground_ignores_background_package_mentions(self):
        observed = DeviceBridge._foreground_from_outputs(
            "Window #3 com.spotify.music background\n",
            "Hist #0: ActivityRecord{1 org.pueblo98.stage1/.MainActivity}\n",
            "com.sec.android.app.launcher",
        )
        self.assertEqual(observed, "other")

    def test_foreground_recognizes_resumed_home(self):
        observed = DeviceBridge._foreground_from_outputs(
            "mCurrentFocus=Window{1 com.sec.android.app.launcher/.Launcher}\n",
            "",
            "com.sec.android.app.launcher",
        )
        self.assertEqual(observed, "com.sec.android.app.launcher")

    def test_semantic_match_is_exact_not_substring(self):
        node = UiNode(
            package="com.spotify.music",
            text="Search private messages",
            description="",
            class_name="android.widget.TextView",
            clickable=True,
            bounds=(0, 0, 100, 100),
        )
        self.assertFalse(DeviceBridge._matches(node, ("Search",)))

    def test_invalid_bounds_are_rejected(self):
        with self.assertRaisesRegex(BridgeError, "ui_bounds_invalid"):
            DeviceBridge._parse_bounds("[10,10][5,5]")
        with self.assertRaisesRegex(BridgeError, "ui_bounds_invalid"):
            DeviceBridge._parse_bounds("10,10,20,20")

    def test_ui_observation_ignores_transport_prefix_and_suffix(self):
        xml = (
            "UI hierarchy dumped\n"
            "<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>"
            "<hierarchy rotation='0'>"
            "<node text='Search' content-desc='' class='android.widget.TextView' "
            "package='com.spotify.music' clickable='true' bounds='[1,2][11,22]' />"
            "</hierarchy>\ntransport footer"
        )
        transport = FakeTransport({
            ("exec-out", "uiautomator", "dump", "/dev/tty"): xml,
        })
        nodes = DeviceBridge(transport, sleeper=lambda _: None)._ui_nodes()
        self.assertEqual(len(nodes), 1)
        self.assertEqual(nodes[0].text, "Search")
        self.assertEqual(nodes[0].center, (6, 12))

    def test_media_observation_is_sanitized_and_exact(self):
        media = """
Sessions Stack - have 1 sessions:
  Session #0:
    package=com.spotify.music
    state=PlaybackState {state=PLAYING(3), position=123}
    metadata: title=Magnolia, artist=Playboi Carti
"""
        transport = FakeTransport({("shell", "dumpsys", "media_session"): media})
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        self.assertEqual(
            bridge.spotify_media(),
            {"sessionFound": True, "state": "PLAYING", "artistMatch": True, "trackMatch": True},
        )

    def test_wrong_media_identity_fails_closed(self):
        media = """
  Session #0:
    package=com.spotify.music
    state=PlaybackState {state=PLAYING(3), position=123}
    metadata: title=Different Song, artist=Different Artist
"""
        transport = FakeTransport({("shell", "dumpsys", "media_session"): media})
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "spotify_identity_not_verified"):
            bridge.require_spotify_media("PLAYING")

    def test_wrong_media_state_fails_closed(self):
        media = """
  Session #0:
    package=com.spotify.music
    state=PlaybackState {state=PAUSED(2), position=123}
    metadata: title=Magnolia, artist=Playboi Carti
"""
        transport = FakeTransport({("shell", "dumpsys", "media_session"): media})
        bridge = DeviceBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "spotify_state_not_verified"):
            bridge.require_spotify_media("PLAYING")

    def test_false_youtube_query_oracle_fails_closed(self):
        class YouTubeBridge(DeviceBridge):
            def _wait_for_package(self, expected, seconds=4.0):
                return None

            def ui_contains(self, app, expected_text):
                return False

        transport = FakeTransport()
        bridge = YouTubeBridge(transport, sleeper=lambda _: None)
        with self.assertRaisesRegex(BridgeError, "youtube_query_not_verified"):
            bridge.search_youtube_fixture()

    def test_transport_requires_absolute_executable(self):
        with self.assertRaisesRegex(BridgeError, "transport_unavailable"):
            AdbTransport("adb")

    def test_transport_failure_does_not_include_raw_output(self):
        with tempfile.TemporaryDirectory() as directory:
            executable = Path(directory) / "fake-adb"
            executable.write_text("#!/bin/sh\necho PRIVATE-DATA >&2\nexit 1\n", encoding="utf-8")
            executable.chmod(executable.stat().st_mode | stat.S_IXUSR)
            transport = AdbTransport(str(executable))
            with self.assertRaises(BridgeError) as caught:
                transport.run(("devices",))
            self.assertEqual(caught.exception.code, "transport_failed")
            self.assertNotIn("PRIVATE-DATA", str(caught.exception))

    def test_task_failure_has_only_normalized_reason(self):
        transport = FakeTransport({("devices",): BridgeError("transport_failed", "private raw output")})
        result = TaskSuite(DeviceBridge(transport, sleeper=lambda _: None)).run("T01")
        self.assertEqual(result.outcome, "failed_safely")
        self.assertEqual(result.evidence, {"reason": "transport_failed"})
        self.assertNotIn("private", json.dumps(result.as_dict()))

    def test_run_all_marks_dependent_cases_not_executed_after_device_failure(self):
        transport = FakeTransport({("devices",): "List of devices attached\n\n"})
        results = TaskSuite(DeviceBridge(transport, sleeper=lambda _: None)).run_all()
        self.assertEqual(results[0].outcome, "failed_safely")
        self.assertEqual(results[0].evidence, {"reason": "device_missing"})
        self.assertTrue(all(result.outcome == "not_executed" for result in results[1:]))
        self.assertEqual(len(transport.calls), 1)

    def test_no_public_method_accepts_shell_or_coordinates(self):
        forbidden = {"shell", "command", "arguments", "x", "y", "package", "url"}
        public = {
            name for name in dir(DeviceBridge)
            if not name.startswith("_") and callable(getattr(DeviceBridge, name))
        }
        for method_name in public:
            parameters = set(__import__("inspect").signature(getattr(DeviceBridge, method_name)).parameters)
            self.assertFalse(parameters & forbidden, f"{method_name} exposes {parameters & forbidden}")


if __name__ == "__main__":
    unittest.main()
