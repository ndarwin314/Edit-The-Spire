import {relics, RelicDefinition, RelicCharacter, RelicRarity, RelicAncient} from "./relic-list.ts";
import {getElement} from "../../utils/dom.ts";
import {renderRelicElement, renderRelicLazy} from "./relic-utils.ts";
import {Filter, FilterState} from "../../utils/filter.ts";

export interface RelicFilterState extends FilterState{
    rarities: Set<RelicRarity>
    characters: RelicCharacter
    ancients: RelicAncient
    selectedRelic?: string
    query: string
    matches: Set<String>
}

class RelicFilters extends Filter<RelicDefinition>{
    private readonly rarityFilterContainer = getElement<HTMLElement>("#rarity-filters");
    protected readonly ancientFilters: NodeListOf<HTMLButtonElement>;
    protected state: RelicFilterState;
    selectedRelic?: string;


    constructor(
        private readonly callback: (relicID: string) => void,
        library: HTMLElement
        ) {
        super(
            library,
            getElement("#relic-search"),
            relics,
        )

        this.ancientFilters = library
            .querySelector("#ancient-filters")!
            .querySelectorAll<HTMLButtonElement>(".filter-chip");
        this.setupFilters(this.ancientFilters, button => this.ancientClick(button));
        this.state = {
            rarities: new Set(),
            characters: "any",
            ancients: "none",
            query: "",
            matches: new Set()
        }
    }


    protected createElement(relic: RelicDefinition): HTMLElement {
        const image = renderRelicLazy(relic.id);

        const element = renderRelicElement(relic.id, image);

        element.hidden = true;
        element.addEventListener("click", () => {
            this.selectedRelic = relic.id;
            this.library.classList.remove("active");
            this.callback(relic.id);
        });
        return element;
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

    protected matchesFilters(relic: RelicDefinition) {
        return this.matchesAncient(relic) &&
            this.matchesCharacter(relic) &&
            this.matchesRarity(relic) &&
            this.matchesSearch(relic);
    }

    protected rarityClick(button: HTMLButtonElement) {
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
    }


    protected characterClick(button: HTMLButtonElement) {
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
    }

    protected ancientClick(button: HTMLButtonElement) {
        const value = button.dataset.value as RelicAncient;

        this.toggle(button);
        const ancientRarity = this.getRarityButton("ancient")!;

        if (button.classList.contains("active")) {
            this.disableOtherElements(this.ancientFilters, value);
            this.state.ancients = value;
            this.selectAnyCharacter();
            this.disableAllRarity()
            this.forceOn(ancientRarity);
            this.state.rarities.add("ancient")

        } else {
            this.state.ancients = "none";
            this.forceOff(ancientRarity);
            this.state.rarities.delete("ancient")
        }
        this.onChange();
    }


    reset() {
        this.allFilters.forEach(button => {
            this.forceOff(button);
        });
        this.state = {
            rarities: new Set(),
            characters: "any",
            ancients: "none",
            query: "",
            matches: new Set()
        }
        this.searchBar.textContent = this.state.query;
        this.onChange();
    }

    protected disableAllAncients() {
        this.ancientFilters.forEach(button => {
            this.forceOff(button);
        });
        this.state.ancients = "none";
        this.state.rarities.delete("ancient");
    }
}

export default RelicFilters