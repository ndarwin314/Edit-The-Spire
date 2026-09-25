def clean_name(name: str):
    name = name.lower()
    if name.startswith("the") and ("merchant" in name or "cheese" in name):
        name = name.replace("the", "")
        name = name.strip()
    if name.endswith("?"):
        name = "FAKE_" + name.replace("?", "").replace("'", "")
    if name.endswith("extract"):
        name = "clarity"
    name.replace("(", "")
    name.replace(")", "")
    name = name.replace("'", "")
    name = name.replace("-", "_")
    name = name.replace(" ", "_")
    name = name.replace(".", "")
    name = name.replace("!", "")
    name = name.replace(",", "")
    return name

def make_relic_id(relic_name: str):
    relic_name = clean_name(relic_name)
    return "RELIC." + relic_name.upper()

def make_potion_id(potion_name: str):
    return "POTION." + clean_name(potion_name).upper()

def make_card_id(potion_name: str):
    card_name = clean_name(potion_name).upper()
    return "CARD." + card_name

def normalize_ancient(value: str | None) -> str | None:
    if not value or value == "-":
        return "none"

    return value.lower()

def make_relic(relic):
    name = relic.get("Name")
    return {
        "id": make_relic_id(name),
        "name": name,
        "character": relic.get("ExclusiveTo", "any").lower(),
        "description": relic.get("Description"),
        "rarity": relic.get("Rarity").lower(),
        "ancient": normalize_ancient(
            relic.get("AncientSource")
        ),
    }

def make_potion(potion):
    name = potion.get("Name")
    return {
        "id": make_potion_id(name),
        "name": name,
        "character": potion.get("ExclusiveTo", "any").lower(),
        "description": potion.get("Description"),
        "rarity": potion.get("Rarity").lower(),
    }



def make_card(card):
    name = card.get("Name")
    id_ = make_card_id(name)
    if name.startswith("Strike_"):
        name = "Strike"
    elif name.startswith("Defend_"):
        name = "Defend"


    cost = card.get("Cost").lower()
    try:
        cost = int(cost)
    except ValueError:
        pass
    star_cost = card.get("StarCost", -1).lower()
    try:
        star_cost = int(star_cost)
    except ValueError:
        pass
    return {
        "id":id_,
        "name": name,
        "color": card.get("Color", "any").lower(),
        "description": card.get("Description"),
        "rarity": card.get("Rarity").lower(),
        "cost": cost,
        "is_x_cost": cost==-1,
        "star_cost": star_cost,
        "is_x_star_cost": star_cost == -1,
        "type": card.get("Type").lower(),
        "tags": card.get("Tags"),
        "unplayable": cost==-2
    }