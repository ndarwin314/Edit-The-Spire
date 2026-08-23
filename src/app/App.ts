import { initNavigation, showPage } from "./navigation";
import { loadSaveList } from "../features/saves/save-list";
import { CharacterView } from "../features/character/character-view";


import { saves } from "../services/tauri";
import type { SaveInfo } from "./types";

export class App {
    private readonly characterView: CharacterView;

    constructor() {
        this.characterView = new CharacterView();
    }

    init() {
        initNavigation();
        this.characterView.init();

        this.setupSaveSelection();

        showPage("startup");
    }

    private setupSaveSelection() {
        const startButton =
            document.querySelector<HTMLButtonElement>("#btn-start");

        if (!startButton) {
            throw new Error("Missing #btn-start");
        }

        startButton.addEventListener("click", async () => {
            await loadSaveList(save => this.openSave(save));
        });
    }


    private async openSave(save: SaveInfo) {
        await saves.load(save.path);

        showPage("character");
        await this.characterView.load(save);
    }
}