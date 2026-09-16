def clean_name(name: str):
    name = name.lower()
    if name.startswith("the") and ("merchant" in name or "cheese" in name):
        name = name.replace("the", "")
        name = name.strip()
    if name.endswith("?"):
        name = "FAKE_" + name.replace("?", "").replace("'", "")
    if name.endswith("extract"):
        name = "clarity"
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
    return {
        "id": make_potion_id(name),
        "name": name,
        "character": card.get("Color", "any").lower(),
        "description": card.get("Description"),
        "rarity": card.get("Rarity").lower(),
        "cost": card.get("Cost"),
        "star_cost": card.get("StarCost", -1),
        "type": card.get("Type").lower(),
        "tags": card.get("Tags")
    }