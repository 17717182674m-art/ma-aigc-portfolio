"""Build content-led WebP posters from representative frames in every portfolio video."""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
FFMPEG = Path(
    r"C:\Users\PC\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
    r"\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe"
)
FFPROBE = FFMPEG.with_name("ffprobe.exe")

# The selected positions were reviewed from twelve-frame contact sheets for each video.
# They avoid title cards and favor a clear protagonist, product, or defining environment.
POSTERS = {
    "short-drama": {
        "01": ("01.mp4", 0.67),
        "02": ("02.mp4", 0.64),
        "03": ("03.mp4", 0.47),
        "04": ("04.mp4", 0.54),
        "05": ("05.mp4", 0.43),
        "06": ("06.mp4", 0.25),
        "07": ("07.mp4", 0.62),
        "08": ("08.mp4", 0.18),
        "09": ("09.mp4", 0.46),
        "10": ("10.mp4", 0.42),
        "11": ("11.mp4", 0.57),
        "12": ("12.mp4", 0.49),
        "13": ("13.mp4", 0.50),
        "14": ("14.mp4", 0.48),
        "15": ("15.mp4", 0.53),
        "16": ("16.mp4", 0.55),
        "17": ("17.mp4", 0.49),
        "18": ("18.mp4", 0.42),
    },
    "tvc": {
        "01": ("01.mp4", 0.43),
        "02": ("02.mp4", 0.31),
        "03": ("03.mp4", 0.69),
        "04": ("04.mp4", 0.54),
        "05": ("05.mp4", 0.61),
        "06": ("06.mp4", 0.42),
        "07": ("07.mp4", 0.72),
        "08": ("08.mp4", 0.50),
    },
    "ai-short-video": {
        "01": ("01.mp4", 0.82),
        "02": ("02.mp4", 0.53),
        # The multipart film uses its middle chapter for a more representative world frame.
        "03": ("03-01.mp4", 0.46),
        "04": ("04.mp4", 0.44),
        "05": ("05.mp4", 0.57),
        "06": ("06.mp4", 0.68),
        "07": ("07.mp4", 0.62),
        "08": ("08.mp4", 0.24),
    },
}


def duration(path: Path) -> float:
    result = subprocess.run(
        [
            str(FFPROBE),
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def make_poster(video: Path, output: Path, position: float) -> None:
    timestamp = max(0.0, duration(video) * position)
    with tempfile.TemporaryDirectory(prefix="portfolio-poster-") as temp_dir:
        still = Path(temp_dir) / "frame.png"
        subprocess.run(
            [
                str(FFMPEG),
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-ss",
                f"{timestamp:.3f}",
                "-i",
                str(video),
                "-frames:v",
                "1",
                "-vf",
                "scale='min(1600,iw)':-2:flags=lanczos",
                str(still),
            ],
            check=True,
        )

        with Image.open(still) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            image = ImageEnhance.Contrast(image).enhance(1.045)
            image = ImageEnhance.Color(image).enhance(1.035)
            image = ImageEnhance.Sharpness(image).enhance(1.12)
            image = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=3))
            output.parent.mkdir(parents=True, exist_ok=True)
            staged = output.with_name(f".{output.stem}.poster-next.webp")
            image.save(staged, "WEBP", quality=90, method=6)
            staged.replace(output)


def main() -> None:
    if not FFMPEG.exists() or not FFPROBE.exists():
        raise SystemExit("ffmpeg/ffprobe runtime not found")

    generated = 0
    for category, entries in POSTERS.items():
        directory = ROOT / "public" / "ai-series" / "video" / category
        for poster_name, (video_name, position) in entries.items():
            video = directory / video_name
            output = directory / f"{poster_name}.webp"
            if not video.exists():
                raise FileNotFoundError(video)
            make_poster(video, output, position)
            generated += 1
            print(f"{category}/{poster_name}.webp <- {video_name} @ {position:.0%}")

    print(f"Generated {generated} reviewed video posters.")


if __name__ == "__main__":
    main()
