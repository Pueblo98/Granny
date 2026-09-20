"""Source/configuration checks, not Android runtime or permission evidence."""
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

MAIN = Path(__file__).parent / "android/app/src/main"
A = "{http://schemas.android.com/apk/res/android}"


class AndroidContractTests(unittest.TestCase):
    def test_manifest_has_no_network_or_extra_permission(self):
        root = ET.parse(MAIN / "AndroidManifest.xml").getroot()
        self.assertEqual(root.findall("uses-permission"), [])
        app = root.find("application")
        self.assertEqual(app.get(A + "allowBackup"), "false")
        service = app.find("service")
        self.assertEqual(service.get(A + "permission"), "android.permission.BIND_ACCESSIBILITY_SERVICE")

    def test_window_api_capability_and_fixture_filter_explicit(self):
        config = ET.parse(MAIN / "res/xml/perception_service.xml").getroot()
        self.assertEqual(config.get(A + "packageNames"), "org.pueblo98.granny.perceptionlab")
        self.assertEqual(config.get(A + "canPerformGestures"), "false")
        self.assertEqual(config.get(A + "canRetrieveWindowContent"), "true")
        self.assertEqual(config.get(A + "canTakeScreenshot"), "true")
        self.assertIn("flagRetrieveInteractiveWindows", config.get(A + "accessibilityFlags").split("|"))


if __name__ == "__main__":
    unittest.main()
