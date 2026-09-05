import { input_sanitizer } from "../../utils/utils.ts";
import {CharacterState} from "./character-view.ts";

interface CharacterInputState {
    currentHP: number,
    maxHP: number,
    gold: number,
    energy: number
}

export class CharacterInputs {
    private readonly state: CharacterInputState;
    constructor(
        private readonly currentHP: HTMLElement,
        private readonly maxHP: HTMLElement,
        private readonly gold: HTMLElement,
        private readonly energy: HTMLElement,
    ) {
        this.state = {
            currentHP: -1,
            maxHP: -1,
            gold: -1,
            energy: -1
        }
        this.setupHealth();
        this.setupGold();
        this.setupEnergy();
    }

    load(currentHP: number, maxHP: number, gold: number, energy: number) {
        this.state.currentHP = currentHP;
        this.state.maxHP = maxHP;
        this.state.gold = gold;
        this.state.energy = energy;
    }

    save(globalState: CharacterState) {
        globalState.health = [this.state.currentHP, this.state.maxHP];
        globalState.energy = this.state.energy;
        globalState.gold = this.state.gold;
        globalState.energy = this.state.energy;
    }

    render() {

        // initialize rendered values
        this.currentHP.textContent =
            String(this.state.currentHP);

        this.maxHP.textContent =
            String(this.state.maxHP);

        this.gold.textContent =
            String(this.state.gold);

        this.energy.textContent =
            String(this.state.energy);
    }


    private setupHealth() {
        this.setupNumberInput(this.currentHP, async () => {
            this.state.currentHP = Number(this.currentHP.textContent);
        });

        this.setupNumberInput(this.maxHP, async () => {
            this.state.maxHP = Number(this.maxHP.textContent);
        });
    }

    private setupGold() {
        this.setupNumberInput(this.gold, async () => {
            this.state.gold = Number(this.gold.textContent);
        });
    }

    private setupEnergy() {
        this.setupNumberInput(this.energy, async () => {
            this.state.energy = Number(this.energy.textContent);
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