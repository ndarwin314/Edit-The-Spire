import { invoke } from "@tauri-apps/api/core";

const startupPage = document.querySelector<HTMLElement>('#startup-screen-page')!;
const saveSelectorPage = document.querySelector<HTMLElement>('#save-selector-page')!;
const characterStatsPage = document.querySelector<HTMLElement>('#char-stats-inventory-page')!;
const inventoryPage = document.querySelector<HTMLElement>('#inventory-page')!;
const deckPage = document.querySelector<HTMLElement>('#deck-page')!;
const mapPage = document.querySelector<HTMLElement>('#map-page')!;
const charName = document.querySelector<HTMLElement>('#char-name')!;
const currentHP = document.querySelector<HTMLElement>('#current-hp')!;
const maxHP = document.querySelector<HTMLElement>('#max-hp')!;
const ascension = document.querySelector<HTMLElement>('#ascension')!;
const goldElement = document.querySelector<HTMLElement>('#gold')!;
const energyElement = document.querySelector<HTMLElement>('#energy')!;
const relic_box = characterStatsPage.querySelector<HTMLDivElement>('#relics')!;
const potion_box = characterStatsPage.querySelector<HTMLDivElement>('#potions')!;

const startButton = document.querySelector('#btn-start')!;
const backButtons = document.querySelectorAll<HTMLButtonElement>(".back-button");

const plusRelic = document.createElement("div");
plusRelic.classList.add("item-slot");
plusRelic.id = "plus-relic"
plusRelic.innerHTML = `<img src="src/assets/plus_icon.png">`;

const plusPotion = document.createElement("div");
plusPotion.classList.add("item-slot");
plusPotion.id = "plus-potion"
plusPotion.innerHTML = `<img src="src/assets/plus_icon.png">`;

const tabs = {
  stats: {
    button: document.querySelector<HTMLButtonElement>("#stat-tab")!,
    page: inventoryPage,
  },
  deck: {
    button: document.querySelector<HTMLButtonElement>("#deck-tab")!,
    page: deckPage,
  },
  map : {
    button: document.querySelector<HTMLButtonElement>('#map-tab')!,
    page: mapPage
  }
};



const saveGrid = document.querySelector<HTMLDivElement>("#save-grid")!;

interface SaveInfo {
  steam_id: string;
  profile: string;
  path: string;
  ascension: number
  floor: number
  character: string
  deck_size: number
}

interface Potion {
  id: string;
  slot_index: number;
}

interface Relic {
  id: string;
  floor_added_to_deck: number;
}


interface Player {
  base_orb_slot_count: number;
  character_id: string;
  current_hp: number;
  deck: [];
  gold: number;
  max_energy: number;
  max_hp: number;
  net_id: number;
  odds: object;
  relic_grab_bag: object;
  relics: [];
  potions: [];
  unlock_state: object;
  other: object;
}

interface SaveFile {
  players: Player[];
  ascension: number;
  map_point_history: object;
  other: object
}

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.closest("section")!;
    let prev;
    switch (section.id) {
      case "save-selector-page":
        prev = startupPage;
        break;
      default:
        prev = saveSelectorPage;
    }
    prev.hidden = false;
    section.hidden = true;
  });
});


function showTab(name: keyof typeof tabs) {
  for (const [tabName, tab] of Object.entries(tabs)) {
    const active = tabName === name;
    console.log(active)
    console.log(tabName)
    tab.page.hidden = !active;
    tab.button.classList.toggle("active", active);
  }
}

function input_sanitizer(event: InputEvent) {
  if (event.inputType.startsWith("insert")) {
    if (event.data && !/^\d+$/.test(event.data)) {
      event.preventDefault();
    }
  }
}

async function selectSave(save: SaveInfo) {
  await invoke("load_save", {fileName: save.path});
  saveSelectorPage.hidden = true;
  characterStatsPage.hidden = false;
  let hp: [number, number] = await invoke("get_health");
  let gold: number = await invoke("get_gold");
  let energy: number = await invoke("get_energy");
  let temp: [number, Potion[]] = await invoke("get_potions");
  let max_potions = temp[0];
  let potions = temp[1];
  let relics: Relic[] = await invoke("get_relics");

  charName.setAttribute("char-name", cleanCharName(save.character));
  ascension.setAttribute("ascension-value", String(save.ascension));
  currentHP.innerText = String(hp[0]);
  maxHP.innerText = String(hp[1]);
  goldElement.innerText = String(gold);
  energyElement.innerText = String(energy)

  relic_box.replaceChildren();
  for (const relic of relics) {
    const relic_html = document.createElement("div");
    relic_html.classList.add("item-slot");
    relic_html.innerHTML = `<img src="src/assets/relics/${cleanRelicName(relic.id)}.webp">`;
    relic_box.appendChild(relic_html);
  }
  relic_box.appendChild(plusRelic)

  potion_box.replaceChildren();
  const potionMap = new Map<number, String>();
  for (const potion of potions) {
    potionMap.set(potion.slot_index, cleanPotionName(potion.id));
  }
  for (let i = 0; i < max_potions; i++) {
    const potion_html = document.createElement("div");
    potion_html.classList.add("item-slot");
    let image;
    if (potionMap.has(i)) {
      image = potionMap.get(i);
    } else {
      image = "potion_placeholder";
    }
    potion_html.innerHTML = `<img src="src/assets/potions/${image}.webp">`;
    potion_box.appendChild(potion_html);
  }
  potion_box.appendChild(plusPotion);

  tabs.stats.button.addEventListener("click", () => showTab("stats"));
  tabs.deck.button.addEventListener("click", () => showTab("deck"));
  tabs.map.button.addEventListener("click", () => showTab("map"));

  maxHP.addEventListener("beforeinput", (event) => input_sanitizer(event));
  maxHP.addEventListener("blur", async () => {
    console.log(parseInt(currentHP.innerText), parseInt(maxHP.innerText));
    await invoke(
        "set_health",
        {health: [parseInt(currentHP.innerText), parseInt(maxHP.innerText)]})
  });
  currentHP.addEventListener("beforeinput", (event) => input_sanitizer(event));
  currentHP.addEventListener("blur", async () => {
    console.log(parseInt(currentHP.innerText), parseInt(maxHP.innerText));
    await invoke(
        "set_health",
        {health: [parseInt(currentHP.innerText), parseInt(maxHP.innerText)]})
  });
  goldElement.addEventListener("beforeinput", (event) => input_sanitizer(event));
  goldElement.addEventListener("blur", async () => {

    await invoke(
        "set_gold",
        {gold: parseInt(goldElement.innerText)})
  });
  energyElement.addEventListener("beforeinput", (event) => input_sanitizer(event));
  energyElement.addEventListener("blur", async () => {

    await invoke(
        "set_energy",
        {energy: parseInt(energyElement.innerText)})
  });


  const button =
      characterStatsPage.querySelector<HTMLButtonElement>('#editor-back')!;
  button.addEventListener("click", async () => {
    characterStatsPage.hidden = true;
    saveSelectorPage.hidden = false;
  });

}
function cleanCharName(char: string): string {
  char = char.replace("CHARACTER.", "").toLowerCase()
  char = char.charAt(0).toUpperCase() + char.slice(1);
  return "The " + char;
}

function cleanRelicName(relic: string): string {
  return relic.replace("RELIC.", "").toLowerCase()
}

function cleanPotionName(relic: string): string {
  return relic.replace("POTION.", "").toLowerCase()
}


function createSaveCard(sf: SaveInfo): HTMLDivElement {
  const card = document.createElement("div");
  card.classList.add("save-card")
  card.setAttribute("char-name", cleanCharName(sf.character));

  const inner =
      `<div class="save-file-image">
            <div class="charcension">
              <h3 class="save-card-character"></h3>
              <div class="ascension" ascension-value="${sf.ascension}"></div>
            </div>
          </div>
          <div class="save-card-bottom">
            <div class="floor-deck-stats">
              <div class="stat-item">
                <span class="stat-icon icon-floor"></span>
                <span class="floor-value" contenteditable="false" spellcheck="false">${sf.floor+1}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon icon-deck"></span>
                <span class="deck-value" contenteditable="false" spellcheck="false">${sf.deck_size}</span>
              </div>
            </div>
            <button type="button" class="file-select"></button>`;
  card.innerHTML = inner;
  const button =
      card.querySelector<HTMLButtonElement>(".file-select")!;
  button.addEventListener("click", async () => {
    await selectSave(sf);
  });

  return card;
}

async function loadSaveList() {
  startupPage.hidden = true;
  saveSelectorPage.hidden = false;

  const saves = await invoke<SaveInfo[]>('find_runs');
  console.log(saves);
  saveGrid.replaceChildren();

  for (const save of saves) {
    const card = createSaveCard(save);
    saveGrid.appendChild(card);
  }
}

startButton.addEventListener("click", loadSaveList)




