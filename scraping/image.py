from io import BytesIO
from pathlib import Path
import requests
import time

from PIL import Image

from session import api_request, session
from parsing import clean_name


IMAGE_DIR = Path("../src/assets")

def get_image_url(filename):

    if not filename:
        return None
    url = f"https://slaythespire.wiki.gg/images/{filename}?f90dff&format=original"
    return url

def get_upgraded_card_image_url(filename):
    if not filename:
        return None
    filename = filename.replace(".png", "")
    url = f"https://slaythespire.wiki.gg/images/{filename}Plus.png?bf4f08&format=original"
    return url


def make_filename(filename):
    filename = filename.replace("\\", "_")
    filename = filename.replace("/", "_")
    filename = filename.replace(":", "_")


    return filename


def download_image(image_url, destination, dimensions=None):
    if destination.exists():
        return True

    print(f"    downloading: {destination}")

    try:
        response = session.get(
            image_url,
            timeout=60,
        )
        print(image_url)
        image = Image.open(BytesIO(response.content))

        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA")

        response.raise_for_status()

        destination.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        if dimensions is not None:
            image = image.resize(dimensions)
        image.save(
            destination,
            "WEBP",
            quality=90,
            method=6,
        )
        return True

    except requests.RequestException as exc:
        print(f"    FAILED: {exc}")
        return False


def download_images(table_name, rows):
    """
    Download all images associated with a dataset.
    """

    if table_name=="cards":
        directory = IMAGE_DIR / "card-renders"
    else:
        directory = IMAGE_DIR / table_name
    directory.mkdir(parents=True, exist_ok=True)

    for index, row in enumerate(rows, 1):
        image = row.get("Image")

        if not image:
            print(
                f"  [{index}/{len(rows)}] "
                f"{row.get('Name')} has no image."
            )
            continue

        print(
            f"  [{index}/{len(rows)}] "
            f"{row.get('Name')}"
        )


        try:
            image_url = get_image_url(image)

            if not image_url:
                print(f"    Could not find image: {image}")
                continue
            name = row["Name"]

            local_filename = clean_name(name) + ".webp"

            destination = directory / local_filename
            dimensions = (128,128) if table_name=="potions" else None
            download_image(image_url, destination, dimensions=dimensions)

        except Exception as exc:
            print(f"    FAILED: {exc}")
