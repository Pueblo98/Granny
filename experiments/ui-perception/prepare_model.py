"""Explicit build-time dependency download, never part of the Android runtime."""
import hashlib
from pathlib import Path
import urllib.request

COMMIT = "65727574dfcd264acbb0c3e07860e4e9e9b22185"
SHA256 = "7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2"
DEST = Path(__file__).parent / "android/app/build/generated/ocrAssets"
WRAPPER = "https://raw.githubusercontent.com/adaptech-cz/Tesseract4Android/15c534717b1cb58261b58d4e4c1200c7f81f668c/"
NOTICES = {
    "LICENSE": "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4",
    "tesseract4android/src/main/cpp/tesseract/src/LICENSE": "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30",
    "tesseract4android/src/main/cpp/leptonica/src/leptonica-license.txt": "87829abb5bbb00b55a107365da89e9a33f86c4250169e5a1e5588505be7d5806",
    "tesseract4android/src/main/cpp/libjpeg/src/README": "7c25493a9f64fed34d01445467341bda77bc1cdbeccbe33558659ef173fb9ff2",
    "tesseract4android/src/main/cpp/libpng/src/LICENSE": "16d9daaafbf63a31a5bdc91d4600972548fef5aaa1244202393288dbd079c49a",
}


def prepare():
    for index, (path, checksum) in enumerate(NOTICES.items()):
        notice = DEST / f"ocr-notices/{index}.txt"
        if notice.exists() and hashlib.sha256(notice.read_bytes()).hexdigest() == checksum:
            continue
        with urllib.request.urlopen(WRAPPER + path, timeout=60) as response:
            data = response.read(100_001)
        if hashlib.sha256(data).hexdigest() != checksum:
            raise RuntimeError("OCR notice checksum mismatch")
        notice.parent.mkdir(parents=True, exist_ok=True)
        notice.write_bytes(data)
    target = DEST / "tessdata/eng.traineddata"
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == SHA256:
        print("Pinned English OCR model already verified")
        return
    with urllib.request.urlopen(f"https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/{COMMIT}/eng.traineddata", timeout=60) as response:
        data = response.read(5_000_001)
    if len(data) > 5_000_000 or hashlib.sha256(data).hexdigest() != SHA256:
        raise RuntimeError("English model checksum/size mismatch")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print(f"Verified bundled English model: {len(data)} bytes; {SHA256}")


if __name__ == "__main__":
    prepare()
