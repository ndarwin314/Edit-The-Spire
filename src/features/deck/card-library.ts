import {CardColor, CardCost, CardDefinition, CardRarity, cards, CardType} from "./card-list.ts";
import {getElement} from "../../utils/dom.ts";
import {renderCardLazy} from "./card-utils.ts";
import {cleanCardName} from "../../utils/sanitization.ts";
import {Filter, selector} from "../../utils/filter.ts";
import {Card} from "../../app/types.ts";
import {showTab} from "../../app/navigation.ts";

export interface CardLibraryState {
    rarities: Set<CardRarity>
    characters: CardColor
    cost: CardCost
    type: CardType
    query: string
    matches: Set<String>
}

export class CardLibrary extends Filter<CardDefinition>{
    protected readonly costFilters: NodeListOf<HTMLButtonElement>;
    protected readonly typeFilters: NodeListOf<HTMLButtonElement>;
    protected state : CardLibraryState;
    constructor(
        private addCard: (card: Card) => Promise<void>
    ) {
        super(
            getElement("#card-library"),
            getElement("#card-library-search"),
            cards
        )
        this.state = {
            rarities: new Set(),
            characters: "any",
            type: "any",
            cost: -1,
            query: "",
            matches: new Set()
        }

        this.costFilters = this.library
            .querySelector("#card-cost-filters")!
            .querySelectorAll<HTMLButtonElement>(selector);

        this.setupFilters(this.costFilters, button => this.costClick(button));

        this.typeFilters = this.library
            .querySelector("#card-type-filters")!
            .querySelectorAll<HTMLButtonElement>(selector);

        this.setupFilters(this.typeFilters, button => this.typeClick(button));

        this.onChange();

    }

    protected createElement(card: CardDefinition) {
        const image = renderCardLazy(card.id);
        const element = document.createElement("div");

        element.classList.add("card-entry");

        element.setAttribute("card-name", cleanCardName(card.id));
        element.appendChild(image);
        element.addEventListener("click", () => this.cardClick(card));
        return element;
    }

    protected async cardClick(card: CardDefinition) {
        const prototype: Card = {
            id: card.id,
            floor_added_to_deck: -1,
            current_upgrade_level: 0,

        }
        await this.addCard(prototype);
        showTab("deck");

    }

    protected costClick(button: HTMLButtonElement) {
        const value = button.dataset.value as CardCost;

        this.toggle(button);

        if (button.classList.contains("active")) {
            this.disableOtherElements(this.costFilters, String(value));
            this.state.cost = value;
        } else {
            this.selectAnyCharacter();
            this.state.cost = -1;
        }
        this.onChange();
    }

    protected typeClick(button: HTMLButtonElement) {
        let value = button.dataset.value as CardType;

        this.toggle(button);

        if (button.classList.contains("active")) {
            this.disableOtherElements(this.typeFilters, String(value));
            this.state.type = value as CardType;
        } else {
            this.selectAnyCharacter();
            this.state.type = "any";
        }
        this.onChange();
    }

    private matchesRarity(card: CardDefinition) {
        if (this.state.rarities.size === 0) {
            return true;
        }

        return this.state.rarities.has(card.rarity.toLowerCase() as CardRarity);
    }

    private matchesType(card: CardDefinition) {
        if (this.state.type === "any") {
            return true;
        }
        return this.state.type == card.type.toLowerCase();
    }

    private matchesCharacter(card: CardDefinition) {
        return this.state.characters==="any" || this.state.characters===card.color;
    }

    private matchesCost(card: CardDefinition) {
        if (this.state.cost==="x") {
            return card.is_x_cost || card.is_x_star_cost;
        } else if (this.state.cost==="unplayable") {
           return card.unplayable;
        } else if (Number(this.state.cost) < 0) {
            return true;
        } else if (Number(this.state.cost) >= 3) {
            return Number(card.cost) >= 3;
        } else {
            return card.cost == this.state.cost;
        }
    }


    protected matchesFilters(card: CardDefinition) {
        return this.matchesCharacter(card) &&
            this.matchesRarity(card) &&
            this.matchesSearch(card) &&
            this.matchesCost(card) &&
            this.matchesType(card);
    }

    reset() {
        this.allFilters.forEach(button => {
            this.forceOff(button);
        });
        this.state = {
            rarities: new Set(),
            characters: "any",
            query: "",
            cost: -1,
            type: "any",
            matches: new Set()
        }
        this.searchBar.textContent = this.state.query;
        this.onChange();
    }
}