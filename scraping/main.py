from pathlib import Path

from cargo import scrape_table, TABLES
from image import download_images
from parsing import make_relic, make_potion, make_card
from ts import make_typescript

funcs = {
    "relics": make_relic,
    "potions": make_potion,
    "cards": make_card
}

def get_lines(path):
    with open(path, "r") as f:
        lines = f.readlines()
    return [line.replace("\n", "") for line in lines]


def potions():
    name = "potions"
    rows = scrape_table(name)
    fun = funcs[name]
    objects = [fun(_) for _ in rows]
    lines = get_lines(f"{name[:-1]}.txt")
    ts = make_typescript(lines, objects)
    with open(f"{name[:-1]}-list.ts", "w") as f:
        f.write(ts)
    download_images(name, rows)

def main():
    for name in TABLES:
        rows = scrape_table(name)
        fun = funcs[name]
        objects = [fun(_) for _ in rows]
        lines = get_lines(f"{name[:-1]}.txt")
        ts = make_typescript(lines, objects)
        with open(f"{name[:-1]}-list.ts", "w") as f:
            f.write(ts)

        download_images(name, rows)
# Press the green button in the gutter to run the script.
if __name__ == '__main__':
   potions()


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
