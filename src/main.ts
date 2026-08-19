import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {localDataDir, join} from '@tauri-apps/api/path';

const startupPage = document.querySelector<HTMLElement>('#startup-screen-page')!;
const saveSelectorPage = document.querySelector<HTMLElement>('#save-selector-page')!;
const characterStatsPage = document.querySelector<HTMLElement>('#char-stats-inventory-page')!;
const deckPage = document.querySelector<HTMLElement>('#deck-page')!;
const mapPage = document.querySelector<HTMLElement>('#map-page')!;

const startButton = document.querySelector('#btn-start')!;
const backButtons = document.querySelectorAll<HTMLButtonElement>(".back-button");


const saveGrid = document.querySelector<HTMLDivElement>("#save-grid")!;

interface SaveFile {
  steam_id: string;
  profile: string;
  path: string;
  ascension: number
  floor: number
  character: string
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


async function selectSave(save: SaveFile) {
  await invoke("load_save", {fileName: save.path});
  saveSelectorPage.hidden = true;
  characterStatsPage.hidden = false;
}
function cleanCharName(char: string): string {
  char = char.replace("CHARACTER.", "").toLowerCase()
  char = char.charAt(0).toUpperCase() + char.slice(1);
  return "The " + char;
}

function createSaveCard(sf: SaveFile): HTMLDivElement {
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
        <div class="stat-item">
          <span class="stat-icon icon-floor"></span>
          <span class="floor-value" contenteditable="false" spellcheck="false">1</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon icon-deck"></span>
          <span class="deck-value" contenteditable="false" spellcheck="false">10</span>
        </div>
        <button type="button" class="file-select">Select</button>`;
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

  const saves = await invoke<SaveFile[]>('find_runs');
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



