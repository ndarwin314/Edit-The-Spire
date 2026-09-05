import { initNavigation, showPage } from "./navigation";
import { loadSaveList } from "../features/saves/save-list";
import { CharacterView } from "../features/character/character-view";


import {player, saves} from "../services/tauri";
import type { SaveInfo } from "./types";
import {DeckView} from "../features/deck/deck-view.ts";
import {getElement} from "../utils/utils.ts";
import {SaveManager} from "./save.ts";

export class App {
    private readonly characterView: CharacterView;
    private readonly deckView: DeckView;
    // @ts-ignore
    private readonly saveManager: SaveManager;

    constructor() {
        this.characterView = new CharacterView();
        this.deckView = new DeckView();
        this.saveManager = new SaveManager(
            async () => await this.save()
        );

        initNavigation();

        this.setupSaveSelection();

    }

    init() {
        showPage("startup");
    }

    private async save() {
        await this.characterView.save();
        await this.deckView.save();
        await player.save();
    }

    private setupSaveSelection() {
        const startButton = getElement<HTMLButtonElement>("#btn-start");

        startButton.addEventListener("click", async () => {
            await loadSaveList(save => this.openSave(save));
        });
    }


    private async openSave(save: SaveInfo) {
        await saves.load(save.path);

        await this.characterView.load(save);
        await this.deckView.load();

        await this.characterView.render();
        await this.deckView.render();
        showPage("character");
    }
}