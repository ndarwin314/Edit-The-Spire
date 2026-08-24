import {relics, RelicDefinition, RelicCharacter, RelicRarity, RelicAncient} from "./relic-list.ts";
import {getRelicImage, getElement} from "../../utils/utils.ts";

export interface RelicFilterState {
    rarities: Set<RelicRarity>
    characters: RelicCharacter
    ancients: RelicAncient
}

export class RelicFilters {
    private readonly allFilters: NodeListOf<HTMLButtonElement>;
    private readonly rarityFilters: NodeListOf<HTMLButtonElement>;
    private readonly characterFilters: NodeListOf<HTMLButtonElement>;
    private readonly ancientFilters: NodeListOf<HTMLButtonElement>;
    private readonly library: HTMLElement;
    private readonly relicGrid: HTMLDivElement;
    private readonly state: RelicFilterState;
    private readonly rarityFilterContainer =
        getElement<HTMLElement>("#rarity-filters");

    constructor(library: HTMLElement) {
        this.library = library;
        this.relicGrid = <HTMLDivElement>this.library.querySelector(".item-grid");

        this.state = {
            rarities: new Set(),
            characters: "any",
            ancients: "none"
        }

        this.allFilters = library.querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.rarityFilters = library
            .querySelector("#rarity-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.characterFilters = library
            .querySelector("#character-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");

        this.ancientFilters = library
            .querySelector("#ancient-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");
    }

    init() {
        this.setupRarityFilters();
        this.setupAncientFilters();
        this.setupCharacterFilters();
        this.initializeRelicList()
    }

    private initializeRelicList() {
        for (const relic of relics) {
            this.relicGrid.appendChild(this.createRelic(relic))
        }
    }

    private createRelic(relic: RelicDefinition): HTMLElement {
        const image = document.createElement("img");
        image.src = getRelicImage(relic.id);
        image.hidden = true;
        return image
    }

    private getRarityButton(rarity: RelicRarity) {
        return this.rarityFilterContainer.querySelector<HTMLButtonElement>(
            `[data-value="${rarity}"]`
        );
    }

    private matchesRarity(relic: RelicDefinition) {
        if (this.state.rarities.size === 0) {
            return true;
        }

        return this.state.rarities.has(relic.rarity);
    }

    private matchesCharacter(relic: RelicDefinition) {
        return this.state.characters==="any" || this.state.characters===relic.character;
    }

    private matchesAncient(relic: RelicDefinition) {
        return this.state.ancients==="none" || this.state.ancients===relic.ancient;
    }

    private matchesFilters(relic: RelicDefinition) {
        return this.matchesAncient(relic) && this.matchesCharacter(relic) && this.matchesRarity(relic);
    }

    private onChange() {
        let i = 0;
        for (const element of this.relicGrid.children) {
            let relic = relics[i];
            (<HTMLElement>element).hidden = !this.matchesFilters(relic);
            i++;
        }
    }

    private setupRarityFilters() {
        this.rarityFilters.forEach(button => {
            button.addEventListener("click", () => {
                const rarity = button.dataset.value as RelicRarity;

                if (rarity==="ancient" && this.state.ancients!=="none") {
                    this.forceOn(button);
                } else {
                    this.toggle(button);
                }


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
                const value = button.dataset.value as RelicCharacter;

                this.toggle(button);

                if (button.classList.contains("active")) {
                    this.disableOtherElements(this.characterFilters, value);
                    this.state.characters = value;
                    if (value !== "any") {
                        this.disableAllAncients();
                        this.forceOff(this.getRarityButton("ancient")!);
                    }
                } else {
                    this.selectAnyCharacter();
                    this.state.characters = "any";
                }
                this.onChange();
            });
        });
    }

    private setupAncientFilters() {
        this.ancientFilters.forEach(button => {
            button.addEventListener("click", () => {
                const value = button.dataset.value as RelicAncient;

                this.toggle(button);
                const ancientRarity = this.getRarityButton("ancient")!;

                if (button.classList.contains("active")) {
                    this.disableOtherElements(this.ancientFilters, value);
                    this.state.ancients = value;
                    this.selectAnyCharacter();
                    this.forceOn(ancientRarity);

                } else {
                    this.state.ancients = "none";
                    this.forceOff(ancientRarity);
                }
            this.onChange();
            });
        });
    }

    private disableAllAncients() {
        this.ancientFilters.forEach(button => {
            this.forceOff(button);
        });
        this.state.ancients = "none";
    }

    private selectAnyCharacter() {
        this.characterFilters.forEach(button => {
            const isAny = button.dataset.value === "any";

            button.classList.toggle("active", isAny);
            button.setAttribute("aria-pressed", String(isAny));
        });
        this.state.characters = "any";
    }

    private disableOtherElements(filter: NodeListOf<HTMLButtonElement>, name: RelicAncient | RelicCharacter | RelicRarity) {
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

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
        this.onChange();
    }

    reset() {
        this.allFilters.forEach(button => {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });
    }
}