import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {localDataDir, join} from '@tauri-apps/api/path';

const startupPage = document.querySelector<HTMLElement>('#startup-screen-page')!;
const saveSelectorPage = document.querySelector<HTMLElement>('#save-selector-page')!;
const characterStatsPage = document.querySelector<HTMLElement>('#char-stats-inventory-page')!;
const deckPage = document.querySelector<HTMLElement>('#deck-page')!;
const mapPage = document.querySelector<HTMLElement>('#map-page')!;

const startButton = document.querySelector('#btn-start')!;

const saveList = document.querySelector<HTMLDivElement>("#save-list")!;

interface SaveFile {
  steam_id: string;
  profile: string;
  path: string;
  ascension: number
  floor: number
  character: string
}

async function selectSave(save: SaveFile) {
  await invoke("load_save", {path: save.path});
}

async function loadSaveList() {
  startupPage.hidden = true;
  saveSelectorPage.hidden = false;

  const saves = await invoke<SaveFile[]>('find_current_runs');
  saveList.replaceChildren();

  for (const save of saves) {
    const card = document.createElement("div");
    card.classList.add("save-card");

    const title = document.createElement("h3");
    title.textContent = `Slot ${save.profile}: ${save.character}`;

    const info = document.createElement("p");
    info.textContent = `Floor ${save.floor} - Ascension ${save.ascension}`;

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("file-select");
    button.textContent = "Select";

    button.addEventListener("click", async () => {
      await selectSave(save);
    });

    card.append(title, info, button);
    saveList.appendChild(card);
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



