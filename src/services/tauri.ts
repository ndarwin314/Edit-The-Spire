import { invoke } from "@tauri-apps/api/core";
import type { Potion, Relic, SaveInfo } from "../app/types";

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
        await invoke("set_gold", { gold });
    },

    async getEnergy(): Promise<number> {
        return invoke("get_energy");
    },

    async setEnergy(energy: number): Promise<void> {
        await invoke("set_energy", { energy });
    },

    async getPotions(): Promise<[number, Potion[]]> {
        return invoke("get_potions");
    },

    async getRelics(): Promise<Relic[]> {
        return invoke("get_relics");
    },
};