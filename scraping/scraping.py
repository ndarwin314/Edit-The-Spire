import requests
from json import dump, load, dumps

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

card_null_attributes = {
            "is_x_cost": False,
            "star_cost": 0,
            "is_x_star_cost": False
        }

def get_helper(name):
    url = f"https://spire-codex.com/api/{name}"
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

def make_typescript(name):
    with open(f"{name}.txt", "r") as f:
        lines = f.readlines()
    lines = [line.replace("\n", "") for line in lines]

    with open(f"{name}.json", "r") as f:
        json = load(f)
    for item in json:
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

    with open(f"{name}-list.ts", "w") as f:
        f.write("\n".join(lines))



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    name = "card"
    save_cards()
    make_typescript(name)


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
