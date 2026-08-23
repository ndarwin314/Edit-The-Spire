import { player } from "../../services/tauri.ts";
import { input_sanitizer } from "../../utils/utils.ts";

export class CharacterInputs {
    constructor(
        private readonly currentHP: HTMLElement,
        private readonly maxHP: HTMLElement,
        private readonly gold: HTMLElement,
        private readonly energy: HTMLElement,
    ) {
    }

    init() {
        this.setupHealth();
        this.setupGold();
        this.setupEnergy();
    }

    private setupHealth() {
        this.setupNumberInput(this.currentHP, async () => {
            await player.setHealth(
                Number(this.currentHP.textContent),
                Number(this.maxHP.textContent),
            );
        });

        this.setupNumberInput(this.maxHP, async () => {
            await player.setHealth(
                Number(this.currentHP.textContent),
                Number(this.maxHP.textContent),
            );
        });
    }

    private setupGold() {
        this.setupNumberInput(this.gold, async () => {
            await player.setGold(
                Number(this.gold.textContent),
            );
        });
    }

    private setupEnergy() {
        this.setupNumberInput(this.energy, async () => {
            await player.setEnergy(
                Number(this.energy.textContent),
            );
        });
    }

    private setupNumberInput(
        element: HTMLElement,
        save: () => Promise<void>,
    ) {
        element.addEventListener(
            "beforeinput",
            event => input_sanitizer(event),
        );

        element.addEventListener(
            "blur",
            () => void save(),
        );
    }
}