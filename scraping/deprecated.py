from pathlib import Path
from json import dump, load, dumps

import requests

assets_path = Path('../src/assets')
potions_path = assets_path / "potions"
relics_path = assets_path / "relics"

card_attributes = [
        "id",
        "name",
        "cost",
        "is_x_cost",
        "star_cost",
        "is_x_star_cost",
        "color",
        "rarity",
        "type",
        "tags",
        "keywords"
    ]

potion_attributes = [
    "id",
    "name",
    "rarity",
    "pool"
]

relic_attributes = [
    "id",
    "name",
    "rarity_key",
    "character"
]

card_null_attributes = {
            "is_x_cost": False,
            "star_cost": 0,
            "is_x_star_cost": False
        }

def get_helper(endpoint):
    url = f"https://spire-codex.com/api/{endpoint}"
    json = requests.get(url).json()
    return json


def save_cards():
    cards = get_helper("cards")
    filtered = [get_attributes(card, card_attributes) for card in cards]
    filtered = [null_promotion(card, card_null_attributes) for card in filtered]

    # fix values
    for card in filtered:
        color = card["color"]
        card["color"] = color if color not in ["event", "curse", "token", "status", "quest"] else "colorless"

        rarity = card["rarity"]

    with open("card.json", "w") as f:
        dump(filtered, f)


def get_attributes(item, attributes):
    return {k: v for k,v in item.items() if k in attributes}

def null_promotion(item, attribute_dict):
    return {k: null_resolver(k, v, attribute_dict) for k, v in item.items()}

def null_resolver(k, v, attribute_dict):
    return v if (k not in attribute_dict or v is not None) else attribute_dict[k]

def relic_json(relic):
    return get_attributes(relic, ["id", "name", "rarity", "ancient", "character"])



def ts_string(value: str) -> str:
    return dumps(value, ensure_ascii=False)

def get_lines(path):
    with open(path, "r") as f:
        lines = f.readlines()
    return [line.replace("\n", "") for line in lines]

def make_typescript(lines, json_object):
    for item in json_object:
        lines.append("    {")

        for key, value in item.items():
            if value is None:
                lines.append(
                    f'        {key}: null,'
                )
            if value is not None:
                lines.append(
                    f'        {key}: {ts_string(value)},'
                )

        lines.append("    },")

    lines.append("];")
    return "\n".join(lines)


def make_potion_list():
    lines = get_lines("potion.txt")

    potions = get_helper("potions")
    for i in range(len(potions)):
        potion = potions[i]
        path = potions_path / f"{potion['id'].lower()}.webp"
        print(path, path.exists())
        if not path.exists():
            url = potion["image_url"]
            image = requests.get("url")
        potion = get_attributes(potion, potion_attributes)
        character = potion["pool"]
        del potion["pool"]
        character = character if character!="shared" else "any"
        potion["character"] = character
        potions[i] = potion

    content = make_typescript(lines, potions)
    with open("potion-list.ts", "w") as f:
        f.write(content)

def make_relic_list():
    lines = get_lines("relic.txt")

    relics = get_helper("relics")
    for i in range(len(relics)):
        relic = relics[i]
        relic = get_attributes(relic, relic_attributes)
        rarity = relic["rarity_key"].lower()
        del relic["rarity_key"]
        relic["rarity"] = rarity
        if "character" not in relic:
            relic["character"] = "any"
        relics[i] = relic

    content = make_typescript(lines, relics)
    with open("relic-list.ts", "w") as f:
        f.write(content)

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    make_potion_list()


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
