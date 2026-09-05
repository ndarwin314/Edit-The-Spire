import { invoke } from "@tauri-apps/api/core";
import type {Card, Potion, Relic, SaveInfo} from "../app/types";

export const saves = {
    async find(): Promise<SaveInfo[]> {
        return invoke("find_runs");
    },

    async load(path: string): Promise<void> {
        await invoke("load_save", {
            fileName: path,
        });
    },
};

export const player = {
    async getHealth(): Promise<[number, number]> {
        return invoke("get_health");
    },

    async setHealth(current: number, max: number): Promise<void> {
        await invoke("set_health", {
            health: [current, max],
        });
    },

    async getGold(): Promise<number> {
        return invoke("get_gold");
    },

    async setGold(gold: number): Promise<void> {
        await invoke("set_gold", { gold: gold });
    },

    async getEnergy(): Promise<number> {
        return invoke("get_energy");
    },

    async setEnergy(energy: number): Promise<void> {
        await invoke("set_energy", { energy: energy });
    },

    async getPotions(): Promise<[number, Potion[]]> {
        return invoke("get_potions");
    },

    async setPotions(potions: Potion[], max_potions: number) {
        await invoke("set_potions", {potions, max_potions});
    },

    async getRelics(): Promise<Relic[]> {
        return invoke("get_relics");
    },

    async setRelics(relics: Relic[]) {
        await invoke("set_relics", {relics: relics});
    },

    async getDeck(): Promise<Card[]> {
        return invoke("get_deck");
    },

    async setDeck(deck: Card[])  {
        return invoke("set_deck", {deck});
    },

    async save() {
        await invoke("save");
    }

};