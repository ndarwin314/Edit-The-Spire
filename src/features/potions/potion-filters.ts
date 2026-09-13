import {PotionCharacter, PotionRarity, PotionDefinition, potions} from "./potion-list.ts";
import {getElement} from "../../utils/dom.ts";
import {renderPotionElement, renderPotionLazy} from "./potion-utils.ts";

import {Filter, FilterState} from "../../utils/filter.ts";

export interface PotionFilterState extends FilterState{
    rarities: Set<PotionRarity>
    characters: PotionCharacter
    query: string
    matches: Set<String>
}

class PotionFilters extends Filter<PotionDefinition>{
    protected readonly rarityFilterContainer: HTMLElement;
    selectedPotion?: string

    constructor(
        private readonly callback: (potionID: string) => void,
        library: HTMLElement
    ) {
        super(
            library,
            getElement("#potion-search"),
            potions,
        );

        this.rarityFilterContainer = getElement<HTMLElement>("#rarity-filters-potion");
    }


    protected createElement(potion: PotionDefinition): HTMLElement {
        const image = renderPotionLazy(potion.id);

        const element = renderPotionElement(potion.id, image);

        element.hidden = true;
        element.addEventListener("click", () => {
            this.selectedPotion = potion.id;
            this.library.classList.remove("active");
            this.callback(potion.id);
        });
        return element;
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

    protected matchesFilters(potion: PotionDefinition) {
        return this.matchesCharacter(potion) && this.matchesRarity(potion) && this.matchesSearch(potion);
    }


    reset() {
        this.allFilters.forEach(button => {
            this.forceOff(button);
        });
        this.state = {
            rarities: new Set(),
            characters: "any",
            query: "",
            matches: new Set()
        }
        this.searchBar.textContent = this.state.query;
    }
}

export default PotionFilters