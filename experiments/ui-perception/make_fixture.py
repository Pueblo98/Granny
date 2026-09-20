"""Render a fictional screen, independently of the parser, with installed ImageMagick."""
import argparse
import json
from pathlib import Path
import subprocess

PACKAGE = "org.pueblo98.granny.perceptionlab"
SVG = '''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="640">
<rect width="800" height="640" fill="#f6f8fb"/>
<g font-family="DejaVu Sans" fill="#16293c">
<text x="48" y="60" font-size="30">Display settings</text>
<rect x="40" y="100" width="720" height="110" rx="12" fill="white" stroke="#8999aa"/>
<text x="70" y="164" font-size="28">Screen zoom</text>
<rect x="40" y="230" width="720" height="110" rx="12" fill="white" stroke="#8999aa"/>
<text x="70" y="294" font-size="28">Text size</text>
<rect x="40" y="360" width="720" height="110" rx="12" fill="white" stroke="#8999aa"/>
<text x="70" y="424" font-size="28">Dark theme</text>
<text x="48" y="550" font-size="26">Canvas note: larger words</text>
<text x="48" y="605" font-size="18">Synthetic fixture - no settings changed</text>
</g></svg>'''
TREE = f'''<hierarchy rotation="0">
<node package="{PACKAGE}" class="android.widget.TextView" text="Display settings" bounds="[40,20][760,80]" visible-to-user="true" enabled="true"/>
<node package="{PACKAGE}" class="android.widget.Button" text="Screen zoom" resource-id="fixture:zoom" bounds="[40,100][760,210]" visible-to-user="true" enabled="true" clickable="true"/>
<node package="{PACKAGE}" class="android.widget.Button" text="Text size" resource-id="fixture:text" bounds="[40,230][760,340]" visible-to-user="true" enabled="true" clickable="true"/>
<node package="{PACKAGE}" class="android.widget.Switch" text="Dark theme" resource-id="fixture:dark" bounds="[40,360][760,470]" visible-to-user="true" enabled="true" clickable="true"/>
</hierarchy>'''


def create_fixture(destination):
    destination = Path(destination)
    destination.mkdir(parents=True, exist_ok=False)
    (destination / "screen.svg").write_text(SVG)
    subprocess.run(["magick", "-background", "white", str(destination / "screen.svg"),
                    "-strip", str(destination / "screen.png")], check=True, timeout=15, capture_output=True)
    (destination / "tree.xml").write_text(TREE)
    context = {"scope": "synthetic-fixture", "package": PACKAGE, "windowId": 1, "epoch": 1,
               "capturedAtMs": 1000, "viewport": [0, 0, 800, 640], "protected": False}
    (destination / "context.json").write_text(json.dumps(context, indent=2) + "\n")
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path, help="New directory for synthetic artifacts")
    create_fixture(parser.parse_args().output)
