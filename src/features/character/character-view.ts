import type {Potion, Relic, SaveInfo} from "../../app/types";
import { player } from "../../services/tauri";
import { getElement, cleanCharName} from "../../utils/utils";

import { RelicView } from "../relics/relic-view";
import { PotionView } from "../potions/potion-view";

import {CharacterInputs} from "./character-inputs.ts";

interface CharacterState {
    health: [number, number];
    gold: number;
    energy: number;
    maxPotions: number;
    potions: Potion[];
    relics: Relic[];
}

export class CharacterView {
    //private readonly page: HTMLElement;

    private readonly charName: HTMLElement;
    private readonly ascension: HTMLElement;
    private readonly currentHP: HTMLElement;
    private readonly maxHP: HTMLElement;
    private readonly gold: HTMLElement;
    private readonly energy: HTMLElement;

    private readonly relicView: RelicView;
    private readonly potionView: PotionView;
    private readonly inputs: CharacterInputs

    constructor() {
        const potionLibrary = getElement<HTMLElement>("#potion-library");
        const relicLibrary = getElement<HTMLElement>("#relic-library");
        const relic_box = getElement<HTMLElement>('#relics');
        const potion_box = getElement<HTMLElement>('#potions');
        //this.page = getElement("#char-stats-inventory-page");

        this.charName = getElement("#char-name");
        this.ascension = getElement("#ascension");
        this.currentHP = getElement("#current-hp");
        this.maxHP = getElement("#max-hp");
        this.gold = getElement("#gold");
        this.energy = getElement("#energy");

        this.inputs = new CharacterInputs(
            this.currentHP,
            this.maxHP,
            this.gold,
            this.energy)

        this.relicView = new RelicView(relic_box, relicLibrary);
        this.potionView = new PotionView(potion_box, potionLibrary);
    }

    init() {
        this.relicView.init();
        this.inputs.init()
    }

    async load(save: SaveInfo) {
        const state = await this.loadState();
        this.renderCharacter(save, state);
        this.relicView.render(state.relics);
        this.potionView.render(
            state.potions,
            state.maxPotions,
        );
        
        this.relicView.relicFilters.reset();

        this.relicView.relicFilters.setCharacter(
            save.character
                .replace("CHARACTER.", "")
                .toLowerCase()
        );
    }

    private async loadState(): Promise<CharacterState> {
        const [
            health,
            gold,
            energy,
            potionData,
            relics,
        ] = await Promise.all([
            player.getHealth(),
            player.getGold(),
            player.getEnergy(),
            player.getPotions(),
            player.getRelics(),
        ]);

        return {
            health,
            gold,
            energy,
            maxPotions: potionData[0],
            potions: potionData[1],
            relics,
        };
    }

    private renderCharacter(
        save: SaveInfo,
        state: CharacterState,
    ) {
        this.charName.setAttribute("char-name", cleanCharName(save.character));

        this.ascension.setAttribute(
            "ascension-value",
            String(save.ascension),
        );

        this.currentHP.textContent =
            String(state.health[0]);

        this.maxHP.textContent =
            String(state.health[1]);

        this.gold.textContent =
            String(state.gold);

        this.energy.textContent =
            String(state.energy);
    }

}