import type {Potion, Relic, SaveInfo} from "../../app/types";
import { player } from "../../services/tauri";

import { RelicView } from "../relics/relic-view";
import { PotionView } from "../potions/potion-view";

import {CharacterInputs} from "./character-inputs.ts";
import {getElement} from "../../utils/dom.ts";
import {cleanCharName} from "../../utils/sanitization.ts";

export interface CharacterState {
    health: [number, number];
    gold: number;
    energy: number;
    maxPotions: number;
    potions: Potion[];
    relics: Relic[];
    save_info: SaveInfo;
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
    // @ts-ignore
    private readonly inputs: CharacterInputs

    private state!: CharacterState;

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


    async load(save: SaveInfo) {
        this.state = await this.loadState(save);

        this.inputs.load(
            this.state.health[0],
            this.state.health[1],
            this.state.gold,
            this.state.energy
        );
        await this.potionView.load(
            this.state.potions,
            this.state.maxPotions,
        );
        await this.relicView.load(
            this.state.relics,
            save.character
        );

    }


    async render() {
        await this.relicView.render();
        await this.potionView.render();
        this.renderCharacter();

        this.inputs.render()
    }

    async save() {
        this.inputs.save(this.state);
        this.relicView.save(this.state);
        this.potionView.save(this.state);
        await Promise.all([
            player.setHealth(this.state.health[0], this.state.health[1]),
            player.setGold(this.state.gold),
            player.setEnergy(this.state.energy),
            player.setRelics(this.state.relics),
            player.setPotions(this.state.potions, this.state.maxPotions),
        ])

    }

    private async loadState(save: SaveInfo): Promise<CharacterState> {
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
            save_info: save
        };
    }

    private renderCharacter() {
        if (this.state==undefined) return;
        const save = this.state.save_info;
        this.charName.setAttribute("char-name", cleanCharName(save.character));

        this.ascension.setAttribute(
            "ascension-value",
            String(save.ascension),
        );
    }

}