import requests

WIKI_API = "https://slaythespire.wiki.gg/api.php"


HEADERS = {
    "User-Agent": (
        "SlayTheSpireDataScraper/1.0 "
        "(personal project; https://slaythespire.wiki.gg/)"
    )
}

session = requests.Session()
session.headers.update(HEADERS)

def api_request(params):
    """Make a request to the wiki API."""
    response = session.get(
        WIKI_API,
        params=params,
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    if "error" in data:
        raise RuntimeError(f"Wiki API error: {data['error']}")

    return data
