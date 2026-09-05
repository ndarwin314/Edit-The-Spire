
import {getElement, lazyLoadImage} from "../../utils/utils.ts";
import {PotionCharacter, PotionRarity, PotionDefinition, potions} from "./potion-list.ts";

export interface PotionFilterState {
    rarities: Set<PotionRarity>
    characters: PotionCharacter
    selectedPotion?: string
}

export class PotionFilters {
    private readonly allFilters: NodeListOf<HTMLButtonElement>;
    private readonly rarityFilters: NodeListOf<HTMLButtonElement>;
    private readonly characterFilters: NodeListOf<HTMLButtonElement>;
    private readonly potionGrid: HTMLDivElement;
    private state: PotionFilterState;
    private readonly rarityFilterContainer =
        getElement<HTMLElement>("#rarity-filters-potion");

    constructor(
        private readonly callback: (potionID: string) => void,
        private readonly library: HTMLElement
    ) {
        this.potionGrid = <HTMLDivElement>this.library.querySelector(".item-grid");

        this.state = {
            rarities: new Set(),
            characters: "any",
        }

        this.allFilters = library.querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.rarityFilters = library
            .querySelector("#rarity-filters-potion")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.characterFilters = library
            .querySelector("#character-filters-potion")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.setupRarityFilters();
        this.setupCharacterFilters();
        this.initializePotionList();
        this.onChange();
    }

    private initializePotionList() {
        for (const potion of potions) {
            this.potionGrid.appendChild(this.createPotion(potion))
        }
    }

    private createPotion(potion: PotionDefinition): HTMLElement {
        const element = document.createElement("div");

        element.classList.add("item-slot");

        const image = document.createElement("img");
        lazyLoadImage(image, `/src/assets/potions/${potion.id}.webp`);
        element.appendChild(image)
        element.hidden = true;
        element.addEventListener("click", () => {
            this.state.selectedPotion = potion.id;
            this.library.classList.remove("active");
            this.callback(potion.id);
        });
        return element;
    }

    // @ts-ignore
    private getRarityButton(rarity: PotionRarity) {
        return this.rarityFilterContainer.querySelector<HTMLButtonElement>(
            `[data-value="${rarity}"]`
        );
    }

    private matchesRarity(potion: PotionDefinition) {
        if (this.state.rarities.size === 0) {
            return true;
        }

        return this.state.rarities.has(potion.rarity);
    }

    private matchesCharacter(potion: PotionDefinition) {
        return this.state.characters==="any" || this.state.characters===potion.character;
    }

    private matchesFilters(potion: PotionDefinition) {
        return this.matchesCharacter(potion) && this.matchesRarity(potion);
    }

    private onChange() {
        let i = 0;
        for (const element of this.potionGrid.children) {
            let potion = potions[i];
            (<HTMLElement>element).hidden = !this.matchesFilters(potion);
            i++;
        }
    }

    private setupRarityFilters() {
        this.rarityFilters.forEach(button => {
            button.addEventListener("click", () => {
                const rarity = button.dataset.value as PotionRarity;

                this.toggle(button);

                if (button.classList.contains("active")) {
                    this.state.rarities.add(rarity);
                } else {
                    this.state.rarities.delete(rarity);
                }

                this.onChange();
            });
        });
    }

    private setupCharacterFilters() {
        this.characterFilters.forEach(button => {
            button.addEventListener("click", () => {
                const value = button.dataset.value as PotionCharacter;

                this.toggle(button);

                if (button.classList.contains("active")) {
                    this.disableOtherElements(this.characterFilters, value);
                    this.state.characters = value;
                } else {
                    this.selectAnyCharacter();
                    this.state.characters = "any";
                }
                this.onChange();
            });
        });
    }

    private selectAnyCharacter() {
        this.characterFilters.forEach(button => {
            const isAny = button.dataset.value === "any";

            button.classList.toggle("active", isAny);
            button.setAttribute("aria-pressed", String(isAny));
        });
        this.state.characters = "any";
    }

    // @ts-ignore
    private disableAllRarity() {
        this.rarityFilters.forEach(button => {this.forceOff(button);})
        this.state.rarities.clear();
    }
    private disableOtherElements(filter: NodeListOf<HTMLButtonElement>, name: PotionCharacter | PotionRarity) {
        filter.forEach(button => {
            const value = button.dataset.value;
            if (value !== name) {
                this.forceOff(button)
            }
        })
    }

    private toggle(button: HTMLButtonElement) {
        const active = button.classList.toggle("active");

        button.setAttribute(
            "aria-pressed",
            String(active)
        );
    }

    // @ts-ignore
    private forceOn(button: HTMLButtonElement) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", String(true));
    }

    private forceOff(button: HTMLButtonElement) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", String(false));
    }

    setCharacter(character: string) {
        this.characterFilters.forEach(button => {
            const active = button.dataset.value === character;

            if (active) {
                this.toggle(button);
                this.state.characters =  character as PotionCharacter;
            }
        });
        this.onChange();
    }

    reset() {
        this.allFilters.forEach(button => {
            this.forceOff(button);
        });
        this.state = {
            rarities: new Set(),
            characters: "any",
        }
    }
}