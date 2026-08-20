import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {localDataDir, join} from '@tauri-apps/api/path';

const startupPage = document.querySelector<HTMLElement>('#startup-screen-page')!;
const saveSelectorPage = document.querySelector<HTMLElement>('#save-selector-page')!;
const characterStatsPage = document.querySelector<HTMLElement>('#char-stats-inventory-page')!;
const deckPage = document.querySelector<HTMLElement>('#deck-page')!;
const mapPage = document.querySelector<HTMLElement>('#map-page')!;
const charName = document.querySelector<HTMLElement>('#char-name')!;
const currentHP = document.querySelector<HTMLElement>('#current-hp')!;
const maxHP = document.querySelector<HTMLElement>('#max-hp')!;
const ascension = document.querySelector<HTMLElement>('#ascension')!;
const goldElement = document.querySelector<HTMLElement>('#gold')!;
const energyElement = document.querySelector<HTMLElement>('#energy')!;
const relic_box = characterStatsPage.querySelector<HTMLDivElement>('#relics')!;

const startButton = document.querySelector('#btn-start')!;
const backButtons = document.querySelectorAll<HTMLButtonElement>(".back-button");


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


async function selectSave(save: SaveInfo) {
  await invoke("load_save", {fileName: save.path});
  saveSelectorPage.hidden = true;
  characterStatsPage.hidden = false;
  let hp: [number, number] = await invoke("get_health");
  let gold: number = await invoke("get_gold");
  let energy: number = await invoke("get_energy");
  let potions: Potion[] = await invoke("get_potions");
  let relics: Relic[] = await invoke("get_relics");

  charName.setAttribute("char-name", cleanCharName(save.character));
  ascension.setAttribute("ascension-value", String(save.ascension));
  currentHP.innerHTML = String(hp[0]);
  maxHP.innerHTML = String(hp[1]);
  goldElement.innerHTML = String(gold);
  energyElement.innerHTML = String(energy)

  relic_box.replaceChildren();
  for (const relic of relics) {
    const relic_html = document.createElement("div");
    relic_html.classList.add("item-slot");
    relic_html.innerHTML = `<img src="src/assets/relics/${cleanRelicName(relic.id)}.webp">`;
    relic_box.appendChild(relic_html);
  }

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

function createSaveCard(sf: SaveInfo): HTMLDivElement {
  const card = document.createElement("div");
  card.classList.add("save-card")
  card.setAttribute("char-name", cleanCharName(sf.character));

  const inner =
      `
      <div class="save-grid" id="save-grid">

        <div class="save-card" char-name="${cleanCharName(sf.character)}">
          <div class="save-file-image">
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
            <button type="button" class="file-select"></button>
          </div>`;
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

const tabs = {
  stats: {
    button: document.querySelector<HTMLButtonElement>("#stat-tab")!,
    page: characterStatsPage,
  },
  deck: {
    button: document.querySelector<HTMLButtonElement>("#deck-tab")!,
    page: deckPage,
  },
};

const local = await localDataDir();
const users = await join(local, "SlayTheSpire2", "steam");

function showTab(name: keyof typeof tabs) {
  for (const [tabName, tab] of Object.entries(tabs)) {
    const active = tabName === name;

    tab.page.hidden = !active;
    tab.button.classList.toggle("active", active);
  }
}

tabs.stats.button.addEventListener("click", () => showTab("stats"));
tabs.deck.button.addEventListener("click", () => showTab("deck"));


async function selectFile(){
  console.log('Button clicked');
  const file = await open({
    multiple: false,
    directory: false,
    defaultPath: users,
    filters: [
      {
        name: 'Save Files',
        extensions: ['save'],
      },
    ],
  });

  if (file) {
    await invoke('load_save', {fileName: file})

  }
}



