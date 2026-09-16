import time

from session import api_request

WIKI_API = "https://slaythespire.wiki.gg/api.php"
PAGE_SIZE = 500
REQUEST_DELAY = 0.2


TABLES = {
    "relics": {
        "table": "Relics",
        "fields": [
            "Name",
            "Image",
            "ExclusiveTo",
            "Rarity",
            "Description",
            "AncientSource",
            "EventSource",
            "Tags",
        ],
    },

    "potions": {
        "table": "Potions",
        "fields": [
            "Name",
            "Image",
            "Rarity",
            "ExclusiveTo",
            "Description",
        ],
    },

    "cards": {
        "table": "Cards",
        "fields": [
            "Name",
            "Image",
            "Color",
            "OverrideColor",
            "Type",
            "Rarity",
            "Cost",
            "CostPlus",
            "StarCost",
            "Description",
            "NoUpgrade",
            "MultiplayerOnly",
            "Tags",
        ],
    },
}


def cargo_query(table, fields):
    offset = 0
    results = []

    while True:
        params = {
            "action": "cargoquery",
            "format": "json",
            "tables": table,
            "fields": ",".join(fields),
            "limit": PAGE_SIZE,
            "offset": offset,
            "where": 'Game="2"',
        }

        print(
            f"  Cargo query: {table} "
            f"(offset={offset})"
        )

        data = api_request(params)

        rows = data.get("cargoquery", [])

        if not rows:
            break

        for row in rows:
            title = row.get("title", row)

            results.append(title)

        if len(rows) < PAGE_SIZE:
            break

        offset += PAGE_SIZE

        time.sleep(REQUEST_DELAY)

    return results


def scrape_table(name):
    definition = TABLES[name]

    table = definition["table"]
    fields = definition["fields"]

    rows = cargo_query(table, fields)

    print(f"Found {len(rows)} {name}.")

    return rows